import { LensHubProxy } from 'utils';
import { Button } from '@components/UI/Button';
import usePendingTxn from 'utils/hooks/usePendingTxn';
import { useAppStore } from 'src/store/app';
import { utils } from 'ethers';
import type { CreateSetDispatcherBroadcastItemResult, Profile } from 'lens';
import { useBroadcastMutation, useCreateSetDispatcherTypedDataMutation, useProfileLazyQuery } from 'lens';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import type { CustomErrorWithData } from 'utils';
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from 'utils';
import omit from '@lib/omit';
import { useContractWrite, useSignTypedData } from 'wagmi';

const Toggle = () => {
  const [loading, setLoading] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;
  console.log('can use relay:', canUseRelay);
  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { write: writeDispatch, data: writeData } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onError
  });

  const [broadcast, { data: broadcastData }] = useBroadcastMutation({
    onError
  });

  const { indexed } = usePendingTxn({
    txHash: writeData?.hash,
    txId: broadcastData?.broadcast.__typename === 'RelayerResult' ? broadcastData?.broadcast?.txId : undefined
  });

  const [refetchProfile] = useProfileLazyQuery({
    onCompleted: (data) => {
      const profile = data?.profile as Profile;
      setCurrentProfile(profile);
    }
  });

  useEffect(() => {
    if (indexed) {
      toast.success(`Dispatcher ${canUseRelay ? 'disabled' : 'enabled'}`);
      // Analytics.track(TRACK.DISPATCHER_ENABLED);
      refetchProfile({
        variables: {
          request: { handle: currentProfile?.handle }
        },
        fetchPolicy: 'no-cache'
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexed]);

  const [createDispatcherTypedData] = useCreateSetDispatcherTypedDataMutation({
    onCompleted: async ({ createSetDispatcherTypedData }) => {
      const { id, typedData } = createSetDispatcherTypedData;
      const { deadline } = typedData?.value;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { profileId, dispatcher } = typedData?.value;
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          profileId,
          dispatcher,
          sig: { v, r, s, deadline }
        };
        setUserSigNonce(userSigNonce + 1);
        if (!RELAYER_ENABLED) {
          return writeDispatch?.({ recklesslySetUnpreparedArgs: [args] });
        }
        console.log(id, signature);
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        console.log('broadcast data:', data);
        console.log('relay type:', data?.broadcast.__typename);
        if (data?.broadcast?.__typename === 'RelayError') {
          writeDispatch?.({ recklesslySetUnpreparedArgs: [args] });
        }
      } catch {
        setLoading(false);
      }
    },
    onError
  });
  const onClick = () => {
    setLoading(true);
    createDispatcherTypedData({
      variables: {
        // options: { overrideSigNonce: userSigNonce },
        request: {
          profileId: currentProfile?.id,
          enable: !canUseRelay
        }
      }
    });
  };

  return (
    <Button
      variant={canUseRelay ? 'danger' : 'primary'}
      onClick={onClick}
      disabled={loading}
      loading={loading}
    >
      {canUseRelay ? 'Disable' : 'Enable'} dispatcher
    </Button>
  );
};

export default Toggle;
