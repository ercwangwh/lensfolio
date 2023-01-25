import type { ApolloCache } from '@apollo/client';

import onError from '@lib/onError';
import { motion } from 'framer-motion';
import { ReactionTypes, useAddReactionMutation, useRemoveReactionMutation } from 'lens';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

import { SIGN_IN_REQUIRED_MESSAGE } from 'utils';
import type { LensfolioPublication } from 'utils';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import nFormatter from '@lib/nFormatter';

interface Props {
  work: LensfolioPublication;
  isFullPublication: boolean;
}

const Like: FC<Props> = ({ work, isFullPublication }) => {
  const { pathname } = useRouter();
  const isMirror = work.__typename === 'Mirror';
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [liked, setLiked] = useState((isMirror ? work?.mirrorOf?.reaction : work?.reaction) === 'UPVOTE');
  const [count, setCount] = useState(
    isMirror ? work?.mirrorOf?.stats?.totalUpvotes : work?.stats?.totalUpvotes
  );

  // const updateCache = (cache: ApolloCache<any>, type: ReactionTypes.Upvote | ReactionTypes.Downvote) => {
  //   if (pathname === '/works/[id]') {
  //     cache.modify({
  //       id: publicationKeyFields(isMirror ? work?.mirrorOf : work),
  //       fields: {
  //         stats: (stats) => ({
  //           ...stats,
  //           totalUpvotes: type === ReactionTypes.Upvote ? stats.totalUpvotes + 1 : stats.totalUpvotes - 1
  //         })
  //       }
  //     });
  //   }
  // };

  const [addReaction] = useAddReactionMutation({
    onCompleted: () => {
      // Leafwatch.track(PUBLICATION.LIKE);
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count - 1);
      onError(error);
    }
    // update: (cache) => updateCache(cache, ReactionTypes.Upvote)
  });

  const [removeReaction] = useRemoveReactionMutation({
    onCompleted: () => {
      // Leafwatch.track(PUBLICATION.DISLIKE);
    },
    onError: (error) => {
      setLiked(!liked);
      setCount(count + 1);
      onError(error);
    }
    // update: (cache) => updateCache(cache, ReactionTypes.Downvote)
  });

  const createLike = () => {
    if (!currentProfile) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    }

    const variable = {
      variables: {
        request: {
          profileId: currentProfile?.id,
          reaction: ReactionTypes.Upvote,
          publicationId: work.__typename === 'Mirror' ? work?.mirrorOf?.id : work?.id
        }
      }
    };

    if (liked) {
      setLiked(false);
      setCount(count - 1);
      removeReaction(variable);
    } else {
      setLiked(true);
      setCount(count + 1);
      addReaction(variable);
    }
  };

  const iconClassName = isFullPublication ? 'w-[17px] sm:w-[20px]' : 'w-[15px] sm:w-[18px]';

  return (
    <motion.button whileTap={{ scale: 0.9 }} onClick={createLike} aria-label="Like">
      <span className="flex items-center space-x-1 text-pink-500">
        <span className="p-1.5 rounded-full hover:bg-pink-300 hover:bg-opacity-20">
          {/* <Tooltip placement="top" content={liked ? 'Unlike' : 'Like'} withDelay> */}
          {liked ? <HeartIconSolid className={iconClassName} /> : <HeartIcon className={iconClassName} />}
          {/* </Tooltip> */}
        </span>
        {count > 0 && !isFullPublication && (
          <span className="text-[11px] sm:text-xs">{nFormatter(count)}</span>
        )}
      </span>
    </motion.button>
  );
};

export default Like;
