// import { ethers } from 'ethers';
// import { apolloClient } from '../apollo-client';
// import { login } from '../authentication/login';
// import { LENS_FOLLOW_NFT_ABI } from '../config';
// import { getAddressFromSigner, getSigner, signedTypeData, splitSignature } from '../ethers.service';
// import { CreateUnfollowTypedDataDocument, UnfollowRequest } from '../graphql/generated';
import { Button } from '@components/UI/Button';
import { Contract, utils } from 'ethers';
import { useAccount, useSignTypedData, useSigner } from 'wagmi';
import type { Signer } from 'ethers';
import type { CreateBurnEip712TypedData, Profile } from 'lens';
import { useCreateUnfollowTypedDataMutation } from 'lens';
import { useAppStore } from 'src/store/app';
import React, { FC } from 'react';
import { toast } from 'react-hot-toast';
import { SIGN_IN_REQUIRED_MESSAGE, FOLLOW_NFT_ABI } from 'utils';

interface Props {
  profile: Profile;
}

const UnFollow: FC<Props> = ({ profile }) => {
  //   const { address } = useAccount();
  const { data: signer } = useSigner();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData();

  //burn nft
  const burnWithSig = async (signature: string, typedData: CreateBurnEip712TypedData) => {
    const { tokenId, deadline } = typedData.value;
    const { v, r, s } = utils.splitSignature(signature);
    const sig = { v, r, s, deadline };

    const followNftContract = new Contract(
      typedData.domain.verifyingContract,
      FOLLOW_NFT_ABI,
      signer as Signer
    );

    const tx = await followNftContract.burnWithSig(tokenId, sig);
    if (tx) {
      console.log('unfollow');
    }
  };

  const [createUnfollowTypedData, { data, loading, error }] = useCreateUnfollowTypedDataMutation();

  const unfollow = () => {
    if (!currentProfile?.id) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    createUnfollowTypedData({
      variables: { request: { profile: currentProfile?.id } }
    });
  };

  return (
    <Button
      className="text-sm !px-3 !py-1.5"
      outline
      onClick={unfollow}
      disabled={signLoading}
      variant="danger"
      aria-label="Unfollow"
    >
      {'Unfollow'}
    </Button>
  );
};

export default UnFollow;
