// import { FOLLOW_NFT_ABI } from '@abis/FollowNFT'
import { FOLLOW_NFT_ABI } from 'utils';
import { Button } from '@components/UI/Button';
// import { Button } from '@components/UIElements/Button'
// import usePersistStore from '@lib/store/persist'
import { useAppStore } from 'src/store/app';
import type { Signer } from 'ethers';
import { ethers, utils } from 'ethers';
import type { CreateBurnEip712TypedData, CreateUnfollowBroadcastItemResult, Profile } from 'lens';
import { useBroadcastMutation, useCreateUnfollowTypedDataMutation } from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { CustomErrorWithData } from 'utils';
import {
  // Analytics,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
  // TRACK
} from 'utils';
// import omitKey from 'utils/functions/omitKey'
import omit from '@lib/omit';
import { useSigner, useSignTypedData } from 'wagmi';

interface Props {
  profile: Profile;
  onUnFollow: () => void;
}

const UnFollow: FC<Props> = ({ profile, onUnFollow }) => {
  const [loading, setLoading] = useState(false);
  // useAppStore
  const currentProfile = useAppStore((state) => state.currentProfile);

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message);
    setLoading(false);
  };
  const onCompleted = () => {
    toast.success(`Unfollowed ${profile.handle}`);
    onUnFollow();
    setLoading(false);
    // Analytics.track(TRACK.UNSUBSCRIBE_CHANNEL);
  };

  const { data: signer } = useSigner({ onError });

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const [broadcast] = useBroadcastMutation({
    onCompleted: (data) => {
      if (data?.broadcast?.__typename === 'RelayerResult') {
        onCompleted();
      }
    },
    onError
  });

  const burnWithSig = async (signature: string, typedData: CreateBurnEip712TypedData) => {
    const { v, r, s } = utils.splitSignature(signature);
    const sig = {
      v,
      r,
      s,
      deadline: typedData.value.deadline
    };
    const followNftContract = new ethers.Contract(
      typedData.domain.verifyingContract,
      FOLLOW_NFT_ABI,
      signer as Signer
    );
    const txn = await followNftContract.burnWithSig(typedData?.value.tokenId, sig);
    if (txn.hash) onCompleted();
  };

  const [createUnFollowTypedData] = useCreateUnfollowTypedDataMutation({
    onCompleted: async ({ createUnfollowTypedData }) => {
      const { typedData, id } = createUnfollowTypedData as CreateUnfollowBroadcastItemResult;
      try {
        const signature: string = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        if (!RELAYER_ENABLED) {
          return await burnWithSig(signature, typedData);
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError') await burnWithSig(signature, typedData);
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const unFollow = () => {
    if (!currentProfile) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    setLoading(true);
    createUnFollowTypedData({
      variables: {
        request: { profile: profile?.id }
      }
    });
  };

  return (
    <Button disabled={loading} loading={loading} onClick={() => unFollow()}>
      UnFollow
    </Button>
  );
};

export default UnFollow;
