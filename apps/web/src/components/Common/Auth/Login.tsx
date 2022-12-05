import React, { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import {
  useChallengeLazyQuery,
  useAuthenticateMutation,
  useUserProfilesLazyQuery,
  useProfilesLazyQuery
} from 'lens';
import { useAccount, useSignMessage } from 'wagmi';
import { ERROR_MESSAGE } from 'utils';
import LoginButton from './LoginButton';
import { profile } from 'console';
import UserMenu from './UserMenu';

const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [challengequery, { error: errorChallenge }] = useChallengeLazyQuery({ fetchPolicy: 'no-cache' });
  const [authenticate, { error: errorAuthenticate }] = useAuthenticateMutation();
  const [getProfiles, { error: errorProfiles }] = useUserProfilesLazyQuery();

  const onError = () => {
    setLoading(false);
  };

  const { signMessageAsync } = useSignMessage({
    onError
  });

  useEffect(() => {
    if (errorChallenge?.message || errorAuthenticate?.message || errorProfiles?.message)
      toast.error(
        errorChallenge?.message || errorAuthenticate?.message || errorProfiles?.message || ERROR_MESSAGE
      );
  }, [errorAuthenticate, errorChallenge, errorProfiles]);

  const handleSign = async () => {
    try {
      setLoading(true);
      //Get challenge
      const challenge = await challengequery({ variables: { request: { address } } });
      if (!challenge.data?.challenge.text) return toast.error(ERROR_MESSAGE);

      //Get signature
      const signature = await signMessageAsync({ message: challenge?.data?.challenge?.text });

      // Auth user and set cookies
      const result = await authenticate({
        variables: { request: { address, signature } }
      });
      localStorage.setItem('accessToken', result.data?.authenticate.accessToken);
      localStorage.setItem('refreshToken', result.data?.authenticate.refreshToken);

      // Get authed profiles
      const { data: profilesData } = await getProfiles({
        variables: { ownedBy: address }
      });
      //   console.log(address);
      setLoading(false);
      console.log('items', profilesData?.profiles.items);
      //   profilesData?.profiles?.items?.handle;
      console.log(profilesData);
    } catch (error) {
      setLoading(false);
      toast.error('Sign in failed');
    }
  };
  return <LoginButton handleSign={() => handleSign()} signing={loading}></LoginButton>;
};

export default Login;
