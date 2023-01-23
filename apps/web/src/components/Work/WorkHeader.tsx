import React, { FC } from 'react';
import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { useUserProfilesQuery } from 'lens';
import { useAppStore } from 'src/store/app';
import getAvatar from '@lib/getAvatar';
import type { Publication } from 'lens';

interface Props {
  work: Publication;
}

const WorkHeader: FC<Props> = ({ work }) => {
  const selectedProfile = useAppStore((state) => state.selectedProfile);

  return (
    <div className="w-2/3 mx-auto">
      <div className="w-full rounded-md">
        <div className="flex flex-col md:space-x-4">
          <div className="flex items-center p-2 space-x-4">
            <img
              className="w-10 h-10 rounded-sm"
              src={getAvatar(selectedProfile)}
              alt={selectedProfile?.handle}
              draggable={false}
            />
            <div className="flex-1 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700">
                  {work.metadata.name}
                </div>
                <span className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700">
                  {selectedProfile?.bio}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-6"></div>
      </div>
      {/* <WorkDetailShimmer /> */}
    </div>
  );
};

export default WorkHeader;
