import { Profile } from 'lens';
import React, { FC } from 'react';
import Badges from './Badges';
import Cover from './Cover';
import UserProfile from './UserProfile';
// import { STATIC_IMAGES_URL } from 'utils';
import getProfileCoverPicture from '@lib/getProfileCoverPicture';
import getIPFSLink from '@lib/getIPFSLink';

interface Props {
  profile: Profile;
}

const Details: FC<Props> = ({ profile }) => {
  return (
    <div className="flex">
      <div className="relative w-full">
        <Cover cover={getIPFSLink(getProfileCoverPicture(profile))} />
        <UserProfile profile={profile} showBio={true} isBig={true}></UserProfile>
      </div>
    </div>
  );
};

export default Details;
