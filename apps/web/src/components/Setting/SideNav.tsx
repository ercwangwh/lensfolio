// import InterestsOutline from '@components/Common/Icons/InterestsOutline';
// import KeyOutline from '@components/Common/Icons/KeyOutline';
// import SubscribeOutline from '@components/Common/Icons/SubscribeOutline';
// import UserOutline from '@components/Common/Icons/UserOutline';
// import WarningOutline from '@components/Common/Icons/WarningOutline';
import { UserIcon } from '@heroicons/react/24/outline';
import { KeyIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon } from '@heroicons/react/24/outline';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { SparklesIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';
import React from 'react';

import ProfilePicture from './ProfilePicture';

interface Props {
  profile: any;
}

export const SETTING_MEMBERSHIP = '/setting/membership';
export const SETTING_INTERESTS = '/setting/interests';
export const SETTING_PERMISSIONS = '/setting/permissions';
export const SETTING_DANGER_ZONE = '/setting/danger';
export const SETTING = '/setting';

const SideNav: FC<Props> = ({ profile }) => {
  const router = useRouter();

  const isActivePath = (path: string) => router.pathname === path;

  return (
    <div className="p-2 bg-white rounded-xl dark:bg-theme">
      <div className="flex flex-col items-center py-4 space-y-2">
        <ProfilePicture profile={profile} />
      </div>
      <div className="flex flex-col m-1 space-y-1 text-sm">
        <Link
          href={SETTING}
          className={clsx(
            'flex items-center p-3 space-x-2 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            { 'bg-gray-100 dark:bg-gray-800': isActivePath(SETTING) }
          )}
        >
          <UserIcon className="w-4 h-4" /> <span>Basic Info</span>
        </Link>
        <Link
          href={SETTING_MEMBERSHIP}
          className={clsx(
            'flex items-center p-3 space-x-2 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            {
              'bg-gray-100 dark:bg-gray-800': isActivePath(SETTING_MEMBERSHIP)
            }
          )}
        >
          <UserGroupIcon className="w-4 h-4" /> <span>Membership</span>
        </Link>
        <Link
          href={SETTING_PERMISSIONS}
          className={clsx(
            'flex items-center p-3 space-x-2 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            {
              'bg-gray-100 dark:bg-gray-800': isActivePath(SETTING_PERMISSIONS)
            }
          )}
        >
          <KeyIcon className="w-4 h-4" /> <span>Permissions</span>
        </Link>
        <Link
          href={SETTING_INTERESTS}
          className={clsx(
            'flex items-center p-3 space-x-2 rounded-xl hover:bg-gray-100 hover:dark:bg-gray-800',
            {
              'bg-gray-100 dark:bg-gray-800': isActivePath(SETTING_INTERESTS)
            }
          )}
        >
          <SparklesIcon className="w-4 h-4" /> <span>Interests</span>
        </Link>
        <Link
          href={SETTING_DANGER_ZONE}
          className={clsx(
            'flex items-center p-3 space-x-2 rounded-xl hover:bg-red-100 text-red-500 hover:dark:bg-red-900/60',
            {
              'bg-red-100 dark:bg-red-900/60': isActivePath(SETTING_DANGER_ZONE)
            }
          )}
        >
          <ShieldExclamationIcon className="w-4 h-4" /> <span>Danger Zone</span>
        </Link>
      </div>
    </div>
  );
};

export default SideNav;
