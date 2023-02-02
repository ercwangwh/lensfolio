// import Alert from '@components/Common/Alert'
// import CommentOutline from '@components/Common/Icons/CommentOutline'
// import CommentsShimmer from '@components/Shimmers/CommentsShimmer'
import CommentsShimmer from '@components/Common/Shimmer/CommentsShimmer';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
// import { Loader } from '@components/UIElements/Loader'
// import { NoDataFound } from '@components/UIElements/NoDataFound'
import { NoDataFound } from '@components/UI/NoDataFound';
import { useAppStore, useAppPersistStore } from 'src/store/app';
import { PublicationMainFocus, useProfileCommentsQuery } from 'lens';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';
// import { useInView } from 'react-cool-inview';
import { LensfolioPublication, LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils';

import NewComment from './NewComment';
// import QueuedComment from './QueuedComment';
import { Button } from '@components/UI/Button';

// const Comment = dynamic(() => import('./Comment'));

interface Props {
  work: LensfolioPublication;
}

const Comments: FC<Props> = ({ work }) => {
  const {
    query: { id }
  } = useRouter();
  const profileId = useAppPersistStore((state) => state.profileId);
  //   const queuedComments = usePersistStore((state) => state.queuedComments);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const isFollowerOnlyReferenceModule =
    work?.referenceModule?.__typename === 'FollowOnlyReferenceModuleSettings';

  const request = {
    limit: 30,
    customFilters: LENS_CUSTOM_FILTERS,
    commentsOf: id,
    metadata: {
      mainContentFocus: [
        PublicationMainFocus.Video,
        PublicationMainFocus.Article,
        PublicationMainFocus.Embed,
        PublicationMainFocus.Link,
        PublicationMainFocus.TextOnly
      ]
    }
  };
  const variables = {
    request,
    reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
    channelId: currentProfile?.id ?? null
  };

  const { data, loading, error, fetchMore } = useProfileCommentsQuery({
    variables,
    skip: !id
  });

  const comments = data?.publications?.items as LensfolioPublication[];
  const pageInfo = data?.publications?.pageInfo;

  //   const { observe } = useInView({
  //     rootMargin: SCROLL_ROOT_MARGIN,
  //     onEnter: async () => {
  //       await fetchMore({
  //         variables: {
  //           ...variables,
  //           request: {
  //             ...request,
  //             cursor: pageInfo?.next
  //           }
  //         }
  //       });
  //     }
  //   });

  if (loading) return <CommentsShimmer />;

  return (
    <div className="pb-4">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center my-4 space-x-2 text-lg">
          <ChatBubbleBottomCenterIcon className="w-4 h-4" />
          <span className="font-semibold">Comments</span>
          {data?.publications?.pageInfo.totalCount ? (
            <span className="text-sm">( {data?.publications?.pageInfo.totalCount} )</span>
          ) : null}
        </h1>
        {!profileId && <span className="text-xs">(Sign in required to comment)</span>}
      </div>
      {data?.publications?.items.length === 0 && <NoDataFound text="Be the first to comment." />}
      {work?.canComment.result ? (
        <NewComment work={work} />
      ) : profileId ? (
        <Button variant="warning">
          <span className="text-sm">
            {isFollowerOnlyReferenceModule
              ? 'Only subscribers can comment on this publication'
              : `Only subscribers within ${work.profile.handle}'s preferred network can comment`}
          </span>
        </Button>
      ) : null}
      {/* {!error && !loading && (
        <>
          <div className="pt-5 space-y-4">
            {queuedComments?.map(
              (queuedComment) =>
                queuedComment?.pubId === video?.id && (
                  <QueuedComment key={queuedComment?.pubId} queuedComment={queuedComment} />
                )
            )}
            {comments?.map((comment: Publication) => (
              <Comment key={`${comment?.id}_${comment.createdAt}`} comment={comment} />
            ))}
          </div>
          {pageInfo?.next && comments.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )} */}
    </div>
  );
};

export default Comments;
