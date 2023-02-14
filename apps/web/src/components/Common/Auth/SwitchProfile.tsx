import React, { FC } from 'react';
import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { Profile, useUserProfilesQuery } from 'lens';
import { useAppStore } from 'src/store/app';
import getAvatar from '@lib/getAvatar';
import type { Publication } from 'lens';
import { Button } from '@components/UI/Button';
import getIPFSLink from '@lib/getIPFSLink';
import { useProfilesLazyQuery, useProfilesQuery } from 'lens';
import { Modal } from '@components/UI/Modal';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useGlobalModalStateStore } from 'src/store/modals';

const SwitchProfile: FC = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  // const { data } = useProfilesQuery({ variables: { request: { profileIds: currentProfile?.id } } });
  // console.log(data);
  //   const showProfileSwitchModal = useGlobalModalStateStore((state) => state.showProfileSwitchModal);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);
  return (
    <>
      {/* <div>Wathis</div> */}
      {profiles.map((profile: Profile, index) => {
        return (
          <button
            key={profile?.id}
            type="button"
            className="flex justify-between items-center text-gray-700 cursor-pointer dark:text-gray-200 py-3 pl-3 pr-4 space-x-2 w-full rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => {
              const selectedProfile = profiles[index];
              setCurrentProfile(selectedProfile);
              //   setProfileId(selectedProfile.id);
              setShowProfileSwitchModal(false);
              //   Analytics.track(PROFILE.SWITCH_PROFILE);
            }}
          >
            <span className="flex items-center space-x-2">
              <img
                className="w-6 h-6 rounded-full border dark:border-gray-700"
                height={20}
                width={20}
                onError={({ currentTarget }) => {
                  currentTarget.src = getAvatar(profile, false);
                }}
                src={getAvatar(profile, false)}
                alt={profile?.handle}
              />
              <div className="truncate">{profile?.handle}</div>
            </span>
            {currentProfile?.id === profile?.id && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
          </button>
        );
      })}
    </>
  );
};

export default SwitchProfile;
