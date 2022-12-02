import { Profile } from 'lens';
import React, { FC } from 'react';
import Badges from './Badges';
import Cover from './Cover';
import UserProfile from './UserProfile';
import { STATIC_IMAGES_URL } from 'utils';
interface Props {
  profile: Profile;
}

const Details: FC<Props> = ({ profile }) => {
  return (
    <div>
      <Cover
        cover={
          profile?.coverPicture?.__typename === 'MediaSet'
            ? profile?.coverPicture?.original?.url
            : `${STATIC_IMAGES_URL}/patterns/2.svg`
        }
      />
      <Badges profile={profile} />
      <UserProfile profile={profile} showBio={true} isBig={true}></UserProfile>
    </div>
  );
};

export default Details;
