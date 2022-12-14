import { FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useCreatePostTypedDataMutation } from 'lens';
import type { PublicationMetadataV2Input } from 'lens';
import { useContractWrite, useProvider, useSigner, useSignTypedData } from 'wagmi';
import { LENSHUB_PROXY_ADDRESS, LensHubProxy,SIGN_IN_REQUIRED_MESSAGE } from 'utils';
import { utils } from 'ethers';
import onError from '@lib/onError';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from 'uuid';

const NewPost: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  //State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');

  const { data: signer } = useSigner();
  const { signTypedDataAsync } = useSignTypedData({ onError });
  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared'
    // onSuccess: ({ hash }) => {
    //   onCompleted();
    //   setTxnQueue([generateOptimisticPublication({ txHash: hash }), ...txnQueue]);
    // },
    // onError
  });

  const typedDataGenerator = async (generatedData: any) => {
    const { id, typedData } = generatedData;
    const {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      deadline
    } = typedData.value;
    const signature = await signTypedDataAsync({typedData.domain, typedData.types, typedData.value});
    const { v, r, s } = utils.splitSignature(signature);
    const sig = { v, r, s, deadline };
    const inputStruct = {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      // ...(isComment && {
      //   profileIdPointed: typedData.value.profileIdPointed,
      //   pubIdPointed: typedData.value.pubIdPointed
      // }),
      sig
    };
  };
  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: ({ createPostTypedData }) => typedDataGenerator(createPostTypedData),
    onError
  });

  const createPublication = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    }

    try {
      setIsSubmitting(true);

      // if (publicationContent.length === 0 && attachments.length === 0) {
      //   return setPublicationContentError(`${isComment ? 'Comment' : 'Post'} should not be empty!`);
      // }

      setPublicationContentError('');
      let textNftImageUrl = null;
      if (!attachments.length && selectedCollectModule !== CollectModules.RevertCollectModule) {
        textNftImageUrl = await getTextNftUrl(
          publicationContent,
          currentProfile.handle,
          new Date().toLocaleString()
        );
      }

      const attributes: MetadataAttributeInput[] = [
        {
          traitType: 'type',
          displayType: PublicationMetadataDisplayTypes.String,
          value: getMainContentFocus()?.toLowerCase()
        }
      ];

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuid(),
        description: trimify(publicationContent),
        content: trimify(publicationContent),
        external_url: `https://lenster.xyz/u/${currentProfile?.handle}`,
        image: attachments.length > 0 ? getAttachmentImage() : textNftImageUrl,
        imageMimeType: attachments.length > 0 ? getAttachmentImageMimeType() : 'image/svg+xml',
        name: isAudioPublication
          ? audioPublication.title
          : `${isComment ? 'Comment' : 'Post'} by @${currentProfile?.handle}`,
        tags: getTags(publicationContent),
        animation_url: getAnimationUrl(),
        mainContentFocus: getMainContentFocus(),
        contentWarning: null,
        attributes,
        media: attachments,
        locale: getUserLocale(),
        appId: APP_NAME
      };

      let arweaveId = null;
      if (restricted) {
        arweaveId = await createTokenGatedMetadata(metadata);
      } else {
        arweaveId = await createMetadata(metadata);
      }

      const request = {
        profileId: currentProfile?.id,
        contentURI: `https://arweave.net/${arweaveId}`,
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };

    //   if (currentProfile?.dispatcher?.canUseRelay) {
    //     await createViaDispatcher(request);
    //   } else {
    //     if (isComment) {
    //       await createCommentTypedData({
    //         variables: {
    //           options: { overrideSigNonce: userSigNonce },
    //           request: request as CreatePublicCommentRequest
    //         }
    //       });
    //     } else {
    //       await createPostTypedData({
    //         variables: { options: { overrideSigNonce: userSigNonce }, request }
    //       });
    //     }
    //   }
    // } catch {
    // } finally {
    //   setIsSubmitting(false);
    // }
  }catch {
  } finally {
    setIsSubmitting(false);
  }
  }
  return <div><button onClick={}></button></div>;
};

export default NewPost;
