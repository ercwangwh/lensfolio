import DropMenu from '@components/UI/DropMenu';
import { useAppStore, useAppPersistStore } from 'src/store/app';
import React, { FC, useState } from 'react';
import { Button } from '@components/UI/Button';
import getAvatar from '@lib/getAvatar';
import { useAccount, useDisconnect } from 'wagmi';
import type { Profile } from 'lens';
import { CreateProfileMutation } from 'lens';
import type { CustomErrorWithData } from 'utils';
import clearLocalStorage from '@lib/clearLocalStorage';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu } from '@headlessui/react';
import {
  BanknotesIcon,
  Cog8ToothIcon,
  ArrowPathRoundedSquareIcon,
  ArrowLeftOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';
import { NextLink } from '@components/UI/DropMenu';
import { useGlobalModalStateStore } from 'src/store/modals';
// interface props {
//   profile: Profile;
// }

const UserMenu = () => {
  const { theme, setTheme } = useTheme();
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const profiles = useAppStore((state) => state.profiles);
  const currentProfile = useAppStore((state) => state.currentProfile as Profile);
  const setProfiles = useAppStore((state) => state.setProfiles);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);

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

  // const createProfile = () => {};
  return (
    <DropMenu
      trigger={
        <Button light={true} className="!p-0 flex-none">
          <img
            className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
            src={getAvatar(currentProfile, false)}
            alt="avatar picture"
            draggable={false}
          />
        </Button>
      }
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-100 rounded-xl dark:border-gray-800 bg-secondary">
        <div className="flex flex-col space-y-1 text-sm transition duration-150 ease-in-out rounded-lg">
          <div className="inline-flex items-center p-2 py-3 space-x-2 rounded-lg">
            <img
              className="object-cover rounded-full w-9 h-9"
              src={getAvatar(currentProfile, false)}
              alt={currentProfile.handle}
              draggable={false}
            />
            <div className="grid">
              <span className="text-xs opacity-70">Connected as</span>
              <Link href={`/user/${currentProfile?.handle}`}>
                <h6 title={currentProfile?.handle} className="text-base truncate leading-4">
                  {currentProfile?.handle}
                </h6>
              </Link>
            </div>
          </div>
        </div>
        {currentProfile && (
          <>
            <Menu.Item
              as={NextLink}
              href={`/user/${currentProfile?.handle}`}
              className="inline-flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <BanknotesIcon className="w-4 h-4" />
              <span className="truncate whitespace-nowrap">Your Profile</span>
            </Menu.Item>
            <button
              type="button"
              className="inline-flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                setShowProfileSwitchModal(true);
                // onSelectSwitchChannel();
                // Analytics.track(TRACK.CLICK_SWITCH_CHANNEL);
              }}
            >
              <ArrowPathRoundedSquareIcon className="w-4 h-4" />
              <span className="truncate whitespace-nowrap">Switch Profile</span>
            </button>
          </>
        )}
        <Link
          href="/setting"
          className="flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Cog8ToothIcon className="w-4 h-4" />
          <span className="truncate whitespace-nowrap">Setting</span>
        </Link>
        {/* <button
          type="button"
          className="flex items-center w-full p-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => {
            setTheme(theme === 'dark' ? 'light' : 'dark');
          }}
        >
          {theme === 'dark' ? <SunIcon className="w-4 h-4" /> : <MoonIcon className="w-4 h-4" />}
          <span className="truncate whitespace-nowrap">
            {theme === 'light' ? 'Switch to Dark' : 'Switch to Light'}
          </span>
        </button> */}
        <button
          type="button"
          className="flex items-center w-full px-2.5 py-2 space-x-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => logout()}
        >
          <ArrowLeftOnRectangleIcon className="w-4 h-4" />
          <span className="truncate whitespace-nowrap">Log Out</span>
        </button>
      </div>
    </DropMenu>
  );
};

export default UserMenu;
