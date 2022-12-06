import DropMenu from '@components/UI/DropMenu';
import { useAppStore, useAppPersistStore } from 'src/store/app';
import React, { FC } from 'react';
import { Button } from '@components/UI/Button';
import getAvatar from '@lib/getAvatar';
import { useAccount, useDisconnect } from 'wagmi';
import type { Profile } from 'lens';
import type { CustomErrorWithData } from 'utils';
import clearLocalStorage from '@lib/clearLocalStorage';
import { toast } from 'react-hot-toast';

// interface props {
//   profile: Profile;
// }

const UserMenu = () => {
  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);

  const { disconnect } = useDisconnect({
    onError(error: CustomErrorWithData) {
      toast.error(error?.data?.message || error?.message);
    }
  });

  const logout = () => {
    setProfiles([]);
    setCurrentProfile(null);
    setProfileId(null);
    clearLocalStorage();
    disconnect?.();
  };
  return (
    <DropMenu
      trigger={
        <Button className="!p-0 flex-none">
          <img
            className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
            src={getAvatar(currentProfile)}
            alt="channel picture"
            draggable={false}
          />
        </Button>
      }
    >
      <button
        type="button"
        className="flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => logout()}
      >
        {/* <HandWaveOutline className="w-4 h-4" /> */}
        <span className="truncate whitespace-nowrap">Disconnect</span>
      </button>
    </DropMenu>
  );
};

export default UserMenu;
