import { ALLOWED_IMAGE_TYPES, LensfolioAttachment, LensHubProxy } from 'utils';
import { Loader } from '@components/UI/Loader';
import { useAppStore } from 'src/store/app';
import clsx from 'clsx';
import { utils } from 'ethers';
import type { CreateSetProfileImageUriBroadcastItemResult, Profile, UpdateProfileImageRequest } from 'lens';
import {
  useBroadcastMutation,
  useCreateSetProfileImageUriTypedDataMutation,
  useCreateSetProfileImageUriViaDispatcherMutation
} from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { PhotoIcon } from '@heroicons/react/24/outline';
import type { CustomErrorWithData } from 'utils';
import { ERROR_MESSAGE, LENSHUB_PROXY_ADDRESS, RELAYER_ENABLED } from 'utils';
import omit from '@lib/omit';
import { useContractWrite, useSignTypedData } from 'wagmi';
import getAvatar from '@lib/getAvatar';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import getIPFSLink from '@lib/getIPFSLink';

interface Props {
  profile: Profile;
}

const ProfilePicture: FC<Props> = ({ profile }) => {
  const [selectedPfp, setSelectedPfp] = useState('');
  const [loading, setLoading] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setCurrentProfile = useAppStore((state) => state.setCurrentProfile);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
    setSelectedPfp(getAvatar(profile));
  };

  const onCompleted = () => {
    setLoading(false);
    if (currentProfile && selectedPfp)
      setCurrentProfile({
        ...currentProfile,
        picture: { original: { url: selectedPfp } }
      });
    toast.success('Profile image updated');
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { data: pfpData, write: writePfpUri } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'setProfileImageURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  });

  const [createSetProfileImageViaDispatcher] = useCreateSetProfileImageUriViaDispatcherMutation({
    onError,
    onCompleted
  });

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  });

  const [createSetProfileImageURITypedData] = useCreateSetProfileImageUriTypedDataMutation({
    onCompleted: async ({ createSetProfileImageURITypedData }) => {
      const { typedData, id } =
        createSetProfileImageURITypedData as CreateSetProfileImageUriBroadcastItemResult;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { profileId, imageURI } = typedData?.value;
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          profileId,
          imageURI,
          sig: { v, r, s, deadline: typedData.value.deadline }
        };
        setUserSigNonce(userSigNonce + 1);
        if (!RELAYER_ENABLED) {
          return writePfpUri?.({ recklesslySetUnpreparedArgs: [args] });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError')
          writePfpUri?.({ recklesslySetUnpreparedArgs: [args] });
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const signTypedData = (request: UpdateProfileImageRequest) => {
    createSetProfileImageURITypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    });
  };

  const createViaDispatcher = async (request: UpdateProfileImageRequest) => {
    const { data } = await createSetProfileImageViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileImageURIViaDispatcher.__typename === 'RelayError') {
      signTypedData(request);
    }
  };
  // const uploadImage = async (files: any) => {
  //   const results = await uploadToIPFS(files);
  //   return results;
  // };

  const onPfpUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      try {
        setLoading(true);
        console.log('upload file:', e.target.files[0]);

        const result: LensfolioAttachment = await uploadFileToIPFS(e.target.files[0]);
        // const result = await uploadImage(e.target.files);
        console.log('upload result', result);
        // for (const r of result) {
        //   // setUploadedWorks({ attachment: result });
        //   console.log(r.item, r.type, r.altTag);
        // }
        const request = {
          profileId: currentProfile?.id,
          url: result.item
        };
        setSelectedPfp(result.item);
        console.log('selected pfp', selectedPfp);
        const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay;
        console.log('can use dispatcher: ', canUseDispatcher);
        if (!canUseDispatcher) {
          return signTypedData(request);
        }
        await createViaDispatcher(request);
      } catch (error) {
        onError(error as CustomErrorWithData);
      }
    }
  };

  return (
    <div className="relative flex-none overflow-hidden rounded-full group">
      <img
        src={selectedPfp ? getIPFSLink(selectedPfp) : getAvatar(profile, false)}
        className="object-cover w-32 h-32 border-2 rounded-full"
        draggable={false}
        alt={selectedPfp ? currentProfile?.handle : profile.handle}
      />
      <label
        htmlFor="choosePfp"
        className={clsx(
          'absolute top-0 grid w-32 h-32 bg-white rounded-full cursor-pointer bg-opacity-70 place-items-center backdrop-blur-lg invisible group-hover:visible dark:bg-theme',
          { '!visible': loading && !pfpData?.hash }
        )}
      >
        {loading && !pfpData?.hash ? <Loader /> : <PhotoIcon className="h-8 w-8 text-xl" />}
        <input
          id="choosePfp"
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          className="hidden w-full"
          onChange={onPfpUpload}
        />
      </label>
    </div>
  );
};

export default ProfilePicture;
