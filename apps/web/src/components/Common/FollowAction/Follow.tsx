// import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { LensHubProxy } from 'utils';
import { Button } from '@components/UI/Button';
// import { Button } from '@components/UIElements/Button'
// import useAppStore from '@lib/store'
import { useAppStore, useAppPersistStore } from 'src/store/app';
// import usePersistStore from '@lib/store/persist';
import { utils } from 'ethers';
import type { CreateFollowBroadcastItemResult, Profile } from 'lens';
import { useBroadcastMutation, useCreateFollowTypedDataMutation, useProxyActionMutation } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { CustomErrorWithData } from 'utils';
import {
  // Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
  // TRACK
} from 'utils';
// import omit from 'utils/functions/omitKey';
import omit from '@lib/omit';
import { useContractWrite, useSigner, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile;
  onFollow: () => void;
}

const Follow: FC<Props> = ({ profile, onFollow }) => {
  const [loading, setLoading] = useState(false);
  // const selectedProfileId = useAppPersistStore((state) => state.selectedProfileId);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onCompleted = () => {
    onFollow();
    toast.success(`Follow ${profile.handle}`);
    setLoading(false);
    // Analytics.track(TRACK.SUBSCRIBE_CHANNEL);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });
  const { data: signer } = useSigner({ onError });

  const { write: writeFollow } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'followWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: onCompleted,
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted(data) {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted();
      }
    },
    onError
  });

  const [createProxyActionFreeFollow] = useProxyActionMutation({
    onError,
    onCompleted
  });

  const [createFollowTypedData] = useCreateFollowTypedDataMutation({
    onCompleted: async ({ createFollowTypedData }) => {
      const { typedData, id } = createFollowTypedData as CreateFollowBroadcastItemResult;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { v, r, s } = utils.splitSignature(signature);
        const { profileIds, datas } = typedData?.value;
        const args = {
          follower: signer?.getAddress(),
          profileIds,
          datas,
          sig: {
            v,
            r,
            s,
            deadline: typedData.value.deadline
          }
        };
        if (!RELAYER_ENABLED) {
          return writeFollow?.({
            recklesslySetUnpreparedArgs: [args]
          });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError')
          writeFollow?.({ recklesslySetUnpreparedArgs: [args] });
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const follow = () => {
    if (!currentProfile) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    setLoading(true);
    if (profile.followModule) {
      if (profile?.followModule?.__typename === 'ProfileFollowModuleSettings') {
        toast('Requesting signature...');
      }
      return createFollowTypedData({
        variables: {
          request: {
            follow: [
              {
                profile: profile.id,
                followModule:
                  profile?.followModule?.__typename === 'ProfileFollowModuleSettings'
                    ? {
                        profileFollowModule: { profileId: currentProfile?.id }
                      }
                    : null
              }
            ]
          }
        }
      });
    }
    createProxyActionFreeFollow({
      variables: {
        request: {
          follow: {
            freeFollow: {
              profileId: profile?.id
            }
          }
        }
      }
    });
  };

  return (
    <Button onClick={() => follow()} loading={loading} disabled={loading}>
      Follow
    </Button>
  );
};

export default Follow;
