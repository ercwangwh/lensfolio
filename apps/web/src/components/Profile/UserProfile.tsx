// import { BadgeCheckIcon } from '@heroicons/react/solid';
// import getAttribute from '@lib/getAttribute';
import getAvatar from '@lib/getAvatar';
// import isVerified from '@lib/isVerified';
import clsx from 'clsx';
import type { Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import Badges from './Badges';

// import Follow from "./Follow";
// import Markup from "./Markup";
// import Slug from "./Slug";
// import SuperFollow from "./SuperFollow";
// import UserPreview from "./UserPreview";

interface Props {
  profile: Profile;
  showBio?: boolean;
  showFollow?: boolean;
  followStatusLoading?: boolean;
  isFollowing?: boolean;
  isBig?: boolean;
  linkToProfile?: boolean;
  showStatus?: boolean;
}

const UserProfile: FC<Props> = ({
  profile,
  showBio = false,
  showFollow = false,
  followStatusLoading = false,
  isFollowing = false,
  isBig = false,
  linkToProfile = true,
  showStatus = false
}) => {
  const [following, setFollowing] = useState(isFollowing);

  //   const statusEmoji = getAttribute(profile?.attributes, 'statusEmoji');
  //   const statusMessage = getAttribute(profile?.attributes, 'statusMessage');
  //   const hasStatus = statusEmoji && statusMessage;

  const UserAvatar = () => (
    <div className="flex-none z-[1] mr-4 md:mr-6">
      <img
        src={getAvatar(profile, false)}
        loading="lazy"
        className="object-cover w-24 h-24 bg-white border-4 border-white dark:border-black rounded-xl dark:bg-gray-900 md:-mt-10 md:w-32 md:h-32"
        draggable={false}
        alt={profile?.handle}
      />
    </div>
  );

  const UserInfo = () => (
    <div className="flex flex-col items-start mr-3">
      <div className="flex items-center max-w-sm truncate">
        <h1 className="flex items-center space-x-1.5 font-semibold md:text-2xl">
          <span>{profile?.handle}</span>
        </h1>
      </div>
      <div className="flex items-center max-w-sm truncate">
        <span className="px-2 py-0.5 text-xs dark:bg-gray-700 bg-gray-200 rounded-full">
          {profile?.stats?.totalFollowing} Following
        </span>
        <span className="px-2 py-0.5 text-xs dark:bg-gray-700 bg-gray-200 rounded-full">
          {profile?.stats?.totalFollowers} Followers
        </span>
      </div>
      <Badges profile={profile} />
    </div>
  );

  return (
    <div className="flex justify-start items-center pt-2 md:pt-0 md:pl-4">
      <UserAvatar />
      <UserInfo />
    </div>
  );
};

export default UserProfile;
