import { useAppStore, useAppPersistStore } from 'src/store/app';
import React, { FC } from 'react';
import { useProfileQuery } from 'lens';
import Details from './Details';
import UserTab from './UserTab';
// import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import { useRouter } from 'next/router';

const ViewProfile: FC = () => {
  const {
    query: { username }
  } = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);

  const { data, loading, error } = useProfileQuery({
    variables: { request: { profileId: currentProfile?.id } }
  });

  if (loading || !data) {
    return <UserPageShimmer />;
  }

  const profile = data?.profile;
  console.log(username);
  return (
    <div>
      <Details profile={profile as any}></Details>
      <UserTab />
    </div>
  );
};

export default ViewProfile;
