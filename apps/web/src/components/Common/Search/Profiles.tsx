import type { Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
import { UsersIcon } from '@heroicons/react/24/outline';
// import { BiUser } from 'react-icons/bi';
import nFormatter from '@lib/nFormatter';
// import { formatNumber } from 'utils/functions/formatNumber';
import getAvatar from '@lib/getAvatar';
// import getProfilePicture from 'utils/functions/getProfilePicture';

// import IsVerified from '../IsVerified';

interface Props {
  results: Profile[];
  loading: boolean;
  clearSearch: () => void;
}

const Profiles: FC<Props> = ({ results, loading, clearSearch }) => {
  return (
    <>
      {results?.map((profile: Profile) => (
        <div
          onClick={() => clearSearch()}
          key={profile.id}
          className="relative cursor-default select-none pl-3 pr-4 hover:bg-gray-100 dark:hover:bg-gray-900"
          role="button"
          data-testid={`search-user-${profile.handle}`}
        >
          <Link
            href={`/user/${profile?.handle}`}
            key={profile?.handle}
            className="flex flex-col justify-center space-y-1 rounded-xl py-2"
          >
            <span className="flex items-center justify-between">
              <div className="inline-flex w-3/4 items-center space-x-2">
                <img
                  className="h-5 w-5 rounded-md"
                  src={getAvatar(profile, false)}
                  draggable={false}
                  alt="pfp"
                />
                <div className="flex items-center space-x-1">
                  <p className="line-clamp-1 truncate text-base">
                    <span>{profile?.handle}</span>
                  </p>
                  {/* <IsVerified id={profile?.id} size="xs" /> */}
                </div>
              </div>
              <span className="inline-flex items-center space-x-1 whitespace-nowrap text-xs opacity-60">
                <UsersIcon className="h-3 w-3" />
                <span>{nFormatter(profile.stats.totalFollowers)}</span>
              </span>
            </span>
            {profile.bio && <p className="truncate text-sm opacity-60">{profile.bio}</p>}
          </Link>
        </div>
      ))}
      {!results?.length && !loading && (
        <div className="relative cursor-default select-none p-5 text-center">No results found.</div>
      )}
    </>
  );
};

export default Profiles;
