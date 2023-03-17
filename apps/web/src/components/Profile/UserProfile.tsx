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
import FollowActions from '@components/Common/FollowAction';
import { useAppStore } from 'src/store/app';
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
  const currentProfile = useAppStore((state) => state.currentProfile);
  console.log('Current Profile:', currentProfile);
  const UserAvatar = () => (
    <div className="flex-none z-[1] ">
      <img
        src={getAvatar(profile, false)}
        loading="lazy"
        className="object-cover w-24 h-24 bg-white border-4 border-white dark:border-black rounded-xl dark:bg-gray-900 md:-mt-10 md:w-44 md:h-44"
        draggable={false}
        alt={profile?.handle}
      />
    </div>
  );

  const UserInfo = () => (
    <div className="flex flex-col items-center space-y-2">
      {/* <div className="flex items-center "> */}
      <h1 className="max-w-sm truncate font-semibold md:text-3xl">{profile?.handle}</h1>
      {/* </div> */}
      <p className="max-w-sm text-gray-600 md:text-base">{profile.bio}</p>
      <div className="flex items-center max-w-sm truncate">
        <span className="px-2 py-0.5 text-sm">{profile?.stats?.totalFollowing} Following</span>
        <span className="px-2 py-0.5 text-sm">{profile?.stats?.totalFollowers} Followers</span>
      </div>
      {/* <Badges profile={profile} /> */}
    </div>
  );

  return (
    <div className="flex flex-col space-y-3 justify-center items-center pt-2 md:pt-0">
      <UserAvatar />
      <UserInfo />
      {/* <FollowActions profile={profile}></FollowActions> */}
    </div>
  );
};

export default UserProfile;
