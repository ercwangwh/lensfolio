import React, { FC } from 'react';
import { useAppStore } from 'src/store/app';
import { useCreateSetDispatcherTypedDataMutation } from 'lens';
import { Button } from '@components/UI/Button';
import toast from 'react-hot-toast';
import { useContractWrite, useSignTypedData } from 'wagmi';
import onError from '@lib/onError';
import { LensHubProxy, LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from 'utils';
import { ethers, utils } from 'ethers';
// import useBroadcast from '@utils/hooks/useBroadcast';
import getSignature from '@lib/getSignature';

const ToggleDispatcher: FC = () => {
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const canUseRelay = currentProfile?.dispatcher?.canUseRelay;

  const onCompleted = () => {
    toast.success('Dispatcher set successfully!');
  };

  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({ onError });

  const {
    data: writeData,
    isLoading: writeLoading,
    write
  } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'setDispatcherWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  //   const { broadcast, data: broadcastData, loading: broadcastLoading } = useBroadcast({ onCompleted });

  const [createSetProfileMetadataTypedData, { data, loading: typedDataLoading }] =
    useCreateSetDispatcherTypedDataMutation({
      onCompleted: async ({ createSetDispatcherTypedData }) => {
        try {
          const { id, typedData } = createSetDispatcherTypedData;
          const { profileId, dispatcher, deadline } = typedData.value;
          const signature = await signTypedDataAsync(getSignature(typedData));
          const { v, r, s } = utils.splitSignature(signature);
          const sig = { v, r, s, deadline };
          const inputStruct = {
            profileId,
            dispatcher,
            sig
          };

          setUserSigNonce(userSigNonce + 1);
          if (!RELAYER_ENABLED) {
            return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          }

          //   const {
          //     data: { broadcast: result }
          //   } = await broadcast({ request: { id, signature } });

          //   if ('reason' in result) {
          //     write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
          //   }
        } catch {}
      },
      onError
    });

  //   const isLoading = signLoading || writeLoading || broadcastLoading || typedDataLoading;

  return (
    <Button
      onClick={() => {
        createSetProfileMetadataTypedData({
          variables: {
            request: {
              profileId: currentProfile?.id,
              enable: canUseRelay ? false : true
            }
          },
          context: {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          }
        });
      }}
    >
      {canUseRelay ? 'Disable' : 'Enable'} Dispatcher {data?.createSetDispatcherTypedData.expiresAt}
    </Button>
  );
};

export default ToggleDispatcher;
