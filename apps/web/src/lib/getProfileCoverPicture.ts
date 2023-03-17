import type { Profile } from 'lens';

import { STATIC_ASSETS } from 'utils';
const getProfileCoverPicture = (profile: Profile): string => {
  return profile.coverPicture && profile.coverPicture.__typename === 'MediaSet'
    ? profile?.coverPicture?.original?.url
    : `/banner.png`;
};

export default getProfileCoverPicture;
