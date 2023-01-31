// import JoinChannel from '@components/Channel/BasicInfo/JoinChannel'
import Follow from './Follow';
import UnFollow from './UnFollow';
// import Subscribe from '@components/Channel/BasicInfo/Subscribe';
// import UnSubscribe from '@components/Channel/BasicInfo/UnSubscribe';
import type { Profile } from 'lens';
import type { FC } from 'react';
import React, { useEffect, useState } from 'react';

interface Props {
  profile: Profile;
  // subscribeType: string | undefined;
}

const FollowActions: FC<Props> = ({ profile }) => {
  const isFollowedByMe = profile?.isFollowedByMe;
  const [follow, setFollow] = useState(isFollowedByMe);

  useEffect(() => {
    setFollow(isFollowedByMe);
  }, [isFollowedByMe]);

  return follow ? (
    <UnFollow profile={profile} onUnFollow={() => setFollow(false)} />
  ) : (
    <Follow profile={profile} onFollow={() => setFollow(true)} />
  );
  // (
  //   <JoinChannel channel={channel} onJoin={() => setFollow(true)} />
  // ) : (
  //   <Subscribe channel={channel} onSubscribe={() => setSubscriber(true)} />
  // );
};

export default FollowActions;
