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
interface Props {
  work: LensfolioPublication;
}

const WorkHeader: FC<Props> = ({ work }) => {
  // const selectedProfile = useAppStore((state) => state.selectedProfile);

  // useProfileQuery({variables:{request:{}}})

  return (
    <div className="">
      <div className="w-full rounded-md">
        <div className="flex flex-row justify-between ">
          <div className="flex items-center p-2 space-x-4">
            <img
              className="w-12 h-12 rounded-sm"
              src={getAvatar(work.profile, false)}
              alt={work.profile?.handle}
              draggable={false}
            />
            <div className="flex-1 py-5 space-y-4">
              <div className="grid grid-rows-2 gap-2">
                <div>{work.metadata.name}</div>
                <div>{`${work.profile.handle} on ${work.createdAt}`}</div>
              </div>
            </div>
          </div>
          <div className=" my-auto">
            <Like work={work} isFullPublication={true}></Like>
          </div>
        </div>
        <div className="mt-4 md:mt-6"></div>
      </div>
      {/* <WorkDetailShimmer /> */}
    </div>
  );
};

export default WorkHeader;
