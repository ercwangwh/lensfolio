import React, { useEffect, useState } from 'react';
import { Button } from '@components/UI/Button';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { toast } from 'react-hot-toast';
import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { POLYGON_CHAIN_ID } from 'utils';
import UserMenu from './UserMenu';

interface LoginProps {
  handleSign: () => void;
  signing?: boolean;
}

const LoginButton = ({ handleSign, signing }: LoginProps) => {
  // const [loading, setLoading] = useState(false);

  const { connector, isConnected } = useAccount();
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();

  const { openConnectModal } = useConnectModal();
  // const { signMessageAsync } = useSignMessage({
  //   onError
  // });
  return connector?.id && isConnected ? (
    chain?.id === POLYGON_CHAIN_ID ? (
      false ? (
        <div>False</div>
      ) : (
        <Button loading={signing} onClick={() => handleSign()} disabled={signing}>
          Sign In
          <span className="hidden ml-1 md:inline-block">with Lens</span>
        </Button>
      )
    ) : (
      <Button onClick={() => switchNetwork && switchNetwork(POLYGON_CHAIN_ID)} variant="danger">
        <span className="text-white">Switch network</span>
      </Button>
    )
  ) : (
    <Button onClick={openConnectModal}>
      Connect
      <span className="hidden ml-1 md:inline-block">Wallet</span>
    </Button>
  );
};

export default LoginButton;
