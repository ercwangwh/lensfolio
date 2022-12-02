import React, { FC } from 'react';
import { useProfileQuery } from 'lens';
import Details from './Details';
import UserTab from './UserTab';
const ViewProfile: FC = () => {
  const { data, loading, error } = useProfileQuery({
    variables: { request: { handle: 'ercwang.lens' } }
  });
  const profile = data?.profile;
  console.log(profile);
  return (
    <div>
      <Details profile={profile as any}></Details>
      <UserTab />
    </div>
  );
};

export default ViewProfile;
