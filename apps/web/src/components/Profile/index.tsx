import MetaTags from '@components/Common/MetaTags';
import { useAppStore, useAppPersistStore } from 'src/store/app';
import React, { FC } from 'react';
import { useProfileQuery } from 'lens';
import Details from './Details';
// import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import ProfileShimmer from '@components/Common/Shimmer/ProfileShimmer';
import { useRouter } from 'next/router';
import { LENSFOLIO_APP_NAME } from 'utils';
import Activities from './Activities';
import type { Profile } from 'lens';
const ViewProfile: FC = () => {
  const {
    query: { username }
  } = useRouter();
  // const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useProfileQuery({
    variables: { request: { handle: username } }
  });

  if (loading || !data) {
    return <ProfileShimmer />;
  }

  const profile = data?.profile as Profile;
  console.log(username);
  return (
    <>
      {profile?.name ? (
        <MetaTags title={`${profile?.name} (@${profile?.handle}) • ${LENSFOLIO_APP_NAME}`} />
      ) : (
        <MetaTags title={`@${profile?.handle} • ${LENSFOLIO_APP_NAME}`} />
      )}
      {!loading && !error && profile ? (
        <div>
          <Details profile={profile} />
          <Activities profile={profile} />
        </div>
      ) : null}
    </>
  );
};

export default ViewProfile;
