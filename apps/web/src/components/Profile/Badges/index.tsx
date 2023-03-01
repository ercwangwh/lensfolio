import type { Profile } from 'lens';
import type { FC } from 'react';

import Ens from './Ens';

interface Props {
  profile: Profile;
}

const Badges: FC<Props> = ({ profile }) => {
  const hasOnChainIdentity =
    profile?.onChainIdentity?.proofOfHumanity ||
    profile?.onChainIdentity?.sybilDotOrg?.verified ||
    profile?.onChainIdentity?.ens?.name ||
    profile?.onChainIdentity?.worldcoin?.isHuman;

  if (!hasOnChainIdentity) {
    return null;
  }

  return (
    <>
      {/* <div className="w-full divider" /> */}
      <div className="flex flex-wrap gap-3">
        <Ens profile={profile} />
      </div>
    </>
  );
};

export default Badges;
