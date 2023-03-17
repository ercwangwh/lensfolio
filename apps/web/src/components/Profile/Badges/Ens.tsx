// import { Tooltip } from "@components/UI/Tooltip";
import Tooltip from '@components/UI/Tooltip';
import { STATIC_IMAGES_URL } from 'utils';
import type { Profile } from 'lens';
import type { FC } from 'react';
import getIPFSLink from '@lib/getIPFSLink';

interface Props {
  profile: Profile;
}

const Ens: FC<Props> = ({ profile }) => {
  if (!profile?.onChainIdentity?.ens?.name) {
    return null;
  }

  return (
    <Tooltip content={profile?.onChainIdentity?.ens?.name} placement="top">
      <img className="drop-shadow-xl" height={32} width={32} src={`/ENS.svg`} alt="ENS Badge" />
    </Tooltip>
  );
};

export default Ens;
