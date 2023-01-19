// import InterweaveContent from '@components/Common/InterweaveContent';
// import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink';
// import Tooltip from '@components/UIElements/Tooltip';
import type { Attribute, Profile } from 'lens';
import Link from 'next/link';
import type { FC } from 'react';
import React from 'react';
// import { AiOutlineNumber } from 'react-icons/ai';
// import { HiOutlineGlobe, HiOutlineLocationMarker } from 'react-icons/hi';
// import { RiShieldKeyholeLine, RiTwitterLine } from 'react-icons/ri';
// import { LENSTER_WEBSITE_URL, STATIC_ASSETS } from 'utils';
// import { getValueFromKeyInAttributes } from 'utils/functions/getFromAttributes';
// import { shortenAddress } from 'utils/functions/shortenAddress';

interface Props {
  profile: Profile;
}

const About: FC<Props> = ({ profile }) => {
  const attributes = profile?.attributes as Attribute[];
  const hasOnChainId =
    profile.onChainIdentity?.ens?.name ||
    profile.onChainIdentity?.proofOfHumanity ||
    profile.onChainIdentity?.worldcoin.isHuman ||
    profile.onChainIdentity?.sybilDotOrg.verified;

  return (
    <div className="space-y-4 md:pr-4 md:space-y-6">
      {profile?.bio && (
        <div className="flex flex-col space-y-3">
          <h6 className="text-xs font-semibold uppercase opacity-70">Description</h6>
          <p>{profile?.bio}</p>
        </div>
      )}
    </div>
  );
};

export default About;
