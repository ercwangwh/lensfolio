import React, { FC } from 'react';
import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { useProfileQuery } from 'lens';
// import { useUserProfilesQuery } from 'lens';
// import useuser
import { useAppStore } from 'src/store/app';
import getAvatar from '@lib/getAvatar';
import type { Publication } from 'lens';
import { LensfolioPublication } from 'utils';
import { Button } from '@components/UI/Button';
import Like from './Actions/Like';
import CollectWork from './Actions/Collect';
import dayjs from 'dayjs';
import { shortenAddress } from '@lib/shortenAddress';

interface Props {
  work: LensfolioPublication;
}

const WorkHeader: FC<Props> = ({ work }) => {
  // const selectedProfile = useAppStore((state) => state.selectedProfile);
  const currentProfile = useAppStore((state) => state.currentProfile);
  // useProfileQuery({variables:{request:{}}})
  console.log('Work', work);

  return (
    <div className="">
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between ">
          <div className="flex items-center p-2 space-x-4">
            {/* <img
              className="w-12 h-12 rounded-sm"
              src={getAvatar(work.profile, false)}
              alt={work.profile?.handle}
              draggable={false}
            /> */}
            <div className="flex flex-row space-x-3 items-center">
              <img
                className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
                src={getAvatar(currentProfile, false)}
                alt="avatar picture"
                draggable={false}
              />
              <span className=" font-semibold">{currentProfile?.handle}</span>
              <span className=" bg-gray-200 p-1 rounded-full text-xs">
                {shortenAddress(currentProfile?.ownedBy)}
              </span>
              <div>{`${dayjs(work.createdAt).locale('en').format('MMM DD, YYYY')}`}</div>
            </div>
          </div>
          <div className="flex-1 py-5 space-y-4">
            <div className="grid grid-rows-2 gap-2"></div>
          </div>
          <div className=" flex flex-row my-auto">
            <Like work={work} isFullPublication={true}></Like>
            {work.collectModule.__typename !== 'RevertCollectModuleSettings' ? (
              <CollectWork work={work} isFullPublication={true}></CollectWork>
            ) : null}
          </div>
        </div>
        <div className="mt-4 md:mt-6"></div>
      </div>
    </div>
  );
};

export default WorkHeader;
