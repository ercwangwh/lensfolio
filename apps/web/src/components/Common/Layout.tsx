// import React, { ReactNode } from 'react';

import Header from './Header';
import { FC, ReactNode, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { getToastOptions } from 'utils/functions/getToastOptions';
import { useTheme } from 'next-themes';
import GlobalModals from './GlobalModals';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { Profile, useUserProfilesQuery } from 'lens';
import getIsAuthTokensAvailable from '@lib/getIsAuthTokensAvailable';
import resetAuthData from '@lib/resetAuthData';
import useIsMounted from 'utils/hooks/useIsMounted';
import Loading from './Loading';
interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();

  const setProfiles = useAppStore((state) => state.setProfiles);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);

  const profileId = useAppPersistStore((state) => state.profileId);
  const setProfileId = useAppPersistStore((state) => state.setProfileId);
  // const setSelectedReferenceModule = useReferenceModuleStore((state) => state.setSelectedReferenceModule);

  const { mounted } = useIsMounted();
  const { address } = useAccount();
  // const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  // const disconnectXmtp = useDisconnectXmtp();

  const resetAuthState = () => {
    setProfileId(null);
    setCurrentProfile(null);
  };

  // Fetch current profiles and sig nonce owned by the wallet address
  const { loading } = useUserProfilesQuery({
    variables: { ownedBy: address },
    skip: !profileId,
    onCompleted: (data) => {
      const profiles = data?.profiles?.items
        ?.slice()
        ?.sort((a, b) => Number(a.id) - Number(b.id))
        ?.sort((a, b) => (a.isDefault === b.isDefault ? 0 : a.isDefault ? -1 : 1));

      if (!profiles.length) {
        return resetAuthState();
      }

      const selectedUser = profiles.find((profile) => profile.id === profileId);
      // const totalFollowing = selectedUser?.stats?.totalFollowing || 0;
      // setSelectedReferenceModule(
      //   totalFollowing > 20
      //     ? ReferenceModules.DegreesOfSeparationReferenceModule
      //     : ReferenceModules.FollowerOnlyReferenceModule
      // );
      setProfiles(profiles as Profile[]);
      setCurrentProfile(selectedUser as Profile);
      setProfileId(selectedUser?.id);
      setUserSigNonce(data?.userSigNonces?.lensHubOnChainSigNonce);
    },
    onError: () => {
      setProfileId(null);
    }
  });

  const validateAuthentication = () => {
    const currentProfileAddress = currentProfile?.ownedBy;
    const isSwitchedAccount = currentProfileAddress !== undefined && currentProfileAddress !== address;
    // const isWrongNetworkChain = chain?.id !== CHAIN_ID;
    const shouldLogout = !getIsAuthTokensAvailable() || isSwitchedAccount;

    // If there are no auth data, clear and logout
    if (shouldLogout && profileId) {
      // disconnectXmtp();
      resetAuthState();
      resetAuthData();
      disconnect?.();
    }
  };

  useEffect(() => {
    validateAuthentication();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, disconnect, profileId]);

  if (loading || !mounted) {
    return <Loading />;
  }

  return (
    <div className="">
      <Header />
      <GlobalModals />
      <div className="2xl:py-6 py-4 ultrawide:max-w-[110rem] mx-auto md:px-3 ultrawide:px-0">
        <Toaster position="bottom-right" toastOptions={getToastOptions(resolvedTheme)} />

        {children}
      </div>
    </div>
  );
};

export default Layout;
