// import { Tooltip } from "@components/UI/Tooltip";
import { STATIC_IMAGES_URL } from "utils";
import type { Profile } from "lens";
import type { FC } from "react";

interface Props {
  profile: Profile;
}

const Ens: FC<Props> = ({ profile }) => {
  if (!profile?.onChainIdentity?.ens?.name) {
    return null;
  }

  return (
    <img
      className="drop-shadow-xl"
      height={75}
      width={75}
      src={`${STATIC_IMAGES_URL}/badges/ens.png`}
      alt="ENS Badge"
    />
  );
};

export default Ens;
