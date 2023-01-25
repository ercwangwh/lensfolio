import React, { FC } from 'react';
import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { useUserProfilesQuery } from 'lens';
import { useAppStore } from 'src/store/app';
import getAvatar from '@lib/getAvatar';
import type { Publication } from 'lens';
import { Button } from '@components/UI/Button';
import getIPFSLink from '@lib/getIPFSLink';

interface Props {
  work: Publication;
}

const WorkDetail: FC<Props> = ({ work }) => {
  //   const selectedProfile = useAppStore((state) => state.selectedProfile);
  const thumbnailUrl = getIPFSLink(work.metadata.media[0].original.url);
  return (
    <div className="">
      <div className="flex flex-col">
        <div className=" aspect-w-16 aspect-h-9 ">
          <img
            src={thumbnailUrl}
            draggable={false}
            className="object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full object-cover"
            alt="thumbnail"
          ></img>
        </div>
        <div className="flex-1 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <p>{work.metadata.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6"></div>
    </div>
  );
};

export default WorkDetail;
