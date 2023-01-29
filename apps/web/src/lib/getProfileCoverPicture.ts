import type { Profile } from 'lens';

import { STATIC_ASSETS } from 'utils';
const getProfileCoverPicture = (profile: Profile): string => {
  return profile.coverPicture && profile.coverPicture.__typename === 'MediaSet'
    ? profile?.coverPicture?.original?.url
    : `${STATIC_ASSETS}/images/coverGradient.jpeg`;
};

export default getProfileCoverPicture;
