import { LENS_PERIPHERY_ABI } from 'utils';
// import CopyOutline from '@components/Common/Icons/CopyOutline';
// import IsVerified from '@components/Common/IsVerified';
import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { Loader } from '@components/UI/Loader';
import { TextArea } from '@components/UI/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppStore } from 'src/store/app';
import { utils } from 'ethers';
import type { CreatePublicSetProfileMetadataUriRequest, MediaSet, Profile } from 'lens';
import {
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateSetProfileMetadataTypedDataMutation,
  useCreateSetProfileMetadataViaDispatcherMutation
} from 'lens';
import Link from 'next/link';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { CustomErrorWithData, IPFSUploadResult } from 'utils';
import {
  ERROR_MESSAGE,
  IS_MAINNET,
  LENS_PERIPHERY_ADDRESS,
  LENSFOLIO_APP_ID,
  LENSFOLIO_WEBSITE_URL,
  RELAYER_ENABLED
} from 'utils';
// import { VERIFIED_CHANNELS } from 'utils/data/verified';
// import getChannelCoverPicture from 'utils/functions/getChannelCoverPicture';
import { getValueFromKeyInAttributes } from '@lib/getFromAttributes';
import omit from '@lib/omit';
import getProfileCoverPicture from '@lib/getProfileCoverPicture';
import imageProxy from '@lib/imageProxy';
import getIPFSLink from '@lib/getIPFSLink';
// import sanitizeIpfsUrl from 'utils/functions/sanitizeIpfsUrl';
// import trimify from 'utils/functions/trimify';
// import uploadToAr from 'utils/functions/uploadToAr';
// import uploadToIPFS from 'utils/functions/uploadToIPFS';
import useCopyToClipboard from 'utils/hooks/useCopyToClipboard';
import { v4 as uuidv4 } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { z } from 'zod';
import { ForwardIcon } from '@heroicons/react/24/outline';
import trimify from '@lib/trimify';
import uploadToIPFS from '@lib/uploadToIPFS';

interface Props {
  profile: Profile;
}
const formSchema = z.object({
  displayName: z.union([
    z
      .string()
      .min(4, { message: 'Name should be atleast 5 characters' })
      .max(30, { message: 'Name should not exceed 30 characters' }),
    z.string().max(0)
  ]),
  description: z.union([
    z
      .string()
      .min(5, { message: 'Description should be atleast 5 characters' })
      .max(1000, { message: 'Description should not exceed 1000 characters' }),
    z.string().max(0)
  ]),
  twitter: z.string(),
  location: z.string(),
  website: z.union([
    z.string().url({ message: 'Enter valid website URL (eg. https://lenstube.xyz)' }),
    z.string().max(0)
  ])
});
type FormData = z.infer<typeof formSchema> & { coverImage?: string };

const BasicInfo = ({ profile }: Props) => {
  const [copy] = useCopyToClipboard();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [coverImage, setCoverImage] = useState(getProfileCoverPicture(profile));
  const currentProfile = useAppStore((state) => state.currentProfile);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayName: profile.name || '',
      description: profile.bio || '',
      location: getValueFromKeyInAttributes(profile?.attributes, 'location'),
      twitter: getValueFromKeyInAttributes(profile?.attributes, 'twitter'),
      website: getValueFromKeyInAttributes(profile?.attributes, 'website')
    }
  });

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onCompleted = () => {
    toast.success('Profile details submitted');
    // Analytics.track(TRACK.UPDATED_CHANNEL_INFO);
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { write: writeMetaData } = useContractWrite({
    address: LENS_PERIPHERY_ADDRESS,
    abi: LENS_PERIPHERY_ABI,
    functionName: 'setProfileMetadataURIWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  });

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  });

  const [createSetProfileMetadataViaDispatcher] = useCreateSetProfileMetadataViaDispatcherMutation({
    onError,
    onCompleted
  });

  const [createSetProfileMetadataTypedData] = useCreateSetProfileMetadataTypedDataMutation({
    onCompleted: async (data) => {
      const { typedData, id } = data.createSetProfileMetadataTypedData;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { profileId, metadata } = typedData?.value;
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          user: profile?.ownedBy,
          profileId,
          metadata,
          sig: { v, r, s, deadline: typedData.value.deadline }
        };
        if (!RELAYER_ENABLED) {
          return writeMetaData?.({ recklesslySetUnpreparedArgs: [args] });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError')
          writeMetaData?.({ recklesslySetUnpreparedArgs: [args] });
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const onCopyProfileUrl = async (value: string) => {
    await copy(value);
    toast.success('Copied to clipboard');
  };

  const signTypedData = (request: CreatePublicSetProfileMetadataUriRequest) => {
    createSetProfileMetadataTypedData({
      variables: { request }
    });
  };

  const createViaDispatcher = async (request: CreatePublicSetProfileMetadataUriRequest) => {
    const { data } = await createSetProfileMetadataViaDispatcher({
      variables: { request }
    });
    if (data?.createSetProfileMetadataViaDispatcher.__typename === 'RelayError') {
      signTypedData(request);
    }
  };

  const otherAttributes =
    profile?.attributes
      ?.filter((attr) => !['website', 'location', 'twitter', 'app'].includes(attr.key))
      .map(({ traitType, key, value }) => ({ traitType, key, value })) ?? [];

  // const onSaveBasicInfo = async (data: FormData) => {
  //   // Analytics.track(TRACK.UPDATE_CHANNEL_INFO);
  //   setLoading(true);
  //   try {
  //     const { url } = await uploadToAr({
  //       version: '1.0.0',
  //       name: data.displayName || null,
  //       bio: trimify(data.description),
  //       cover_picture: data.coverImage ?? coverImage,
  //       attributes: [
  //         ...otherAttributes,
  //         {
  //           displayType: PublicationMetadataDisplayTypes.String,
  //           traitType: 'website',
  //           key: 'website',
  //           value: data.website
  //         },
  //         {
  //           displayType: PublicationMetadataDisplayTypes.String,
  //           traitType: 'location',
  //           key: 'location',
  //           value: data.location
  //         },
  //         {
  //           displayType: PublicationMetadataDisplayTypes.String,
  //           traitType: 'twitter',
  //           key: 'twitter',
  //           value: data.twitter
  //         },
  //         {
  //           displayType: PublicationMetadataDisplayTypes.String,
  //           traitType: 'app',
  //           key: 'app',
  //           value: LENSFOLIO_APP_ID
  //         }
  //       ],
  //       metadata_id: uuidv4()
  //     });
  //     const request = {
  //       profileId: profile?.id,
  //       metadata: url
  //     };
  //     const canUseDispatcher = selectedProfile?.dispatcher?.canUseRelay;
  //     if (!canUseDispatcher) {
  //       return signTypedData(request);
  //     }
  //     createViaDispatcher(request);
  //   } catch {
  //     setLoading(false);
  //   }
  // };

  // const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.length) {
  //     setUploading(true);
  //     const result: IPFSUploadResult = await uploadToIPFS(e.target.files[0]);
  //     setCoverImage(result.url);
  //     setUploading(false);
  //     onSaveBasicInfo({ ...getValues(), coverImage: result.url });
  //   }
  // };

  return (
    // <form onSubmit={handleSubmit(onSaveBasicInfo)} className="p-4 bg-white rounded-xl dark:bg-theme">
    <form className="p-4 bg-white rounded-xl dark:bg-theme">
      <div className="relative flex-none w-full">
        {uploading && (
          <div className="absolute rounded-xl bg-black w-full h-full flex items-center justify-center z-10 opacity-40">
            <Loader />
          </div>
        )}
        <div
          className="object-cover object-center w-full h-48 bg-white rounded-xl md:h-56 dark:bg-gray-900"
          draggable={false}
          // alt={`${profile.handle}'s cover`}
          style={{
            backgroundImage: 'url(/banner.png)',
            backgroundColor: '#3b82f6',
            backgroundSize: 'cover',
            backgroundPosition: 'center center'
          }}
        />
        <label
          htmlFor="chooseCover"
          className="absolute p-1 px-3 text-sm bg-white rounded-lg cursor-pointer dark:bg-theme bottom-2 left-2"
        >
          Change
          <input
            id="chooseCover"
            // onClick={() => Analytics.track(TRACK.CHANGE_CHANNEL_COVER)}
            type="file"
            accept=".png, .jpg, .jpeg, .svg"
            className="hidden w-full"
            // onChange={handleUpload}
          />
        </label>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="text-[11px] font-semibold uppercase opacity-60">Profile</div>
        </div>
        <div className="flex items-center space-x-3">
          <h6 className="flex items-center space-x-1">
            <span>{profile?.handle}</span>
            {/* <IsVerified id={channel?.id} size="xs" /> */}
          </h6>
          {/* {IS_MAINNET && !VERIFIED_CHANNELS.includes(channel?.id) && channel.stats.totalFollowers > 500 && (
            <Link
              href={}
              onClick={() => Analytics.track(TRACK.GET_VERIFIED)}
              target="_blank"
              rel="noreferer noreferrer"
              className="text-sm text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-indigo-600"
            >
              ( Get Verified )
            </Link>
          )} */}
        </div>
      </div>
      <div className="mt-4">
        <div className="flex items-center mb-1">
          <div className="text-[11px] font-semibold uppercase opacity-60">Profile URL</div>
        </div>
        <div className="flex items-center space-x-2">
          <span>
            {LENSFOLIO_WEBSITE_URL}/{profile.handle}
          </span>
          <button
            className="hover:opacity-60 focus:outline-none"
            onClick={() => onCopyProfileUrl(`${LENSFOLIO_WEBSITE_URL}/${profile.handle}`)}
            type="button"
          >
            <ForwardIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mt-6">
        <Input
          label="Display Name"
          type="text"
          placeholder="T Series"
          {...register('displayName')}
          validationError={errors.displayName?.message}
        />
      </div>
      <div className="mt-4">
        <TextArea
          label="Profile Description"
          placeholder="More about your profile"
          rows={4}
          validationError={errors.description?.message}
          {...register('description')}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Twitter"
          placeholder="johndoe"
          {...register('twitter')}
          validationError={errors.twitter?.message}
          prefix="https://twitter.com/"
        />
      </div>
      <div className="mt-4">
        <Input
          label="Website"
          placeholder="https://johndoe.xyz"
          {...register('website')}
          validationError={errors.website?.message}
        />
      </div>
      <div className="mt-4">
        <Input
          label="Location"
          placeholder="Metaverse"
          {...register('location')}
          validationError={errors.location?.message}
        />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading} loading={loading}>
          Save
        </Button>
      </div>
    </form>
  );
};

export default BasicInfo;
