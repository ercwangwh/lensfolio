import { FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { useCreatePostTypedDataMutation, PublicationMainFocus } from 'lens';
import type { PublicationMetadataV2Input, MetadataAttributeInput } from 'lens';
import {
  useContractWrite,
  useProvider,
  useSigner,
  useSignTypedData,
  usePrepareContractWrite,
  useContract
} from 'wagmi';
import {
  LENSHUB_PROXY_ADDRESS,
  LensHubProxy,
  SIGN_IN_REQUIRED_MESSAGE,
  LENSFOLIO_APP_ID,
  LensfolioAttachment
} from 'utils';
import { ethers, utils } from 'ethers';
import onError from '@lib/onError';
import { toast } from 'react-hot-toast';
import { v4 as uuid } from 'uuid';
import trimify from '@lib/trimify';
import { useTransactionPersistStore } from 'src/store/transaction';
import type { LensfolioPublication } from 'utils';
import useBroadcast from '@utils/hooks/useBroadcast';
import { Modal } from '@components/UI/Modal';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { Button } from '@components/UI/Button';
import DropZone from './DropZone';
import uploadToIPFS, { uploadMetadataToIPFS } from '@lib/uploadToIPFS';
import getSignature from '@lib/getSignature';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
// interface Props {
//   publication: LensfolioPublication;
// }

const NewPost: FC = () => {
  // App store
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  //State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [publicationContentError, setPublicationContentError] = useState('');
  const [attachments, setAttachments] = useState<LensfolioAttachment[]>([]);
  const [showUploadModal, setUploadModal] = useState(false);
  // const [inputData, setInputData] = useState<Object>({});
  const isComment = false;

  const { data: signer } = useSigner();

  const { signTypedDataAsync } = useSignTypedData({ onError });

  // const { config } = usePrepareContractWrite({
  //   address: LENSHUB_PROXY_ADDRESS,
  //   abi: LensHubProxy,
  //   functionName: 'postWithSig',
  //   // mode: 'recklesslyUnprepared',
  //   // onSuccess: ({ hash }) => {
  //   //   // onCompleted();
  //   //   // setTxnQueue([generateOptimisticPublication({ txHash: hash }), ...txnQueue]);
  //   // },
  //   args: [inputData]
  // });
  // const { error, write } = useContractWrite(config);
  // write?.()
  // const contract = useContract({
  //   address: LENSHUB_PROXY_ADDRESS,
  //   abi: LensHubProxy,
  //   signerOrProvider: signer
  // });
  // console.log(contract);

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared'
    // onSuccess: ({ hash }) => {
    //   // onCompleted();
    //   // setTxnQueue([generateOptimisticPublication({ txHash: hash }), ...txnQueue]);
    // }
    // onError
  });

  const { broadcast } = useBroadcast({
    onCompleted: (data) => {
      console.log(broadcast);
      // onCompleted();
      // setTxnQueue([generateOptimisticPublication({ txId: data?.broadcast?.txId }), ...txnQueue]);
    }
  });

  if (error) {
    console.log('what contract error:???? ', error);
  }
  // const generateOptimisticPublication = ({ txHash, txId }: { txHash?: string; txId?: string }) => {
  //   return {
  //     id: uuid(),
  //     // ...(isComment && { parent: publication.id }),
  //     type: isComment ? 'NEW_COMMENT' : 'NEW_POST',
  //     txHash,
  //     txId,
  //     content: publicationContent,
  //     attachments,
  //     title: audioPublication.title,
  //     cover: audioPublication.cover,
  //     author: audioPublication.author
  //   };
  // };

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
    const signature = await signTypedDataAsync(getSignature(typedData));
    const { v, r, s } = utils.splitSignature(signature);
    const sig = { v, r, s, deadline };
    const inputStruct = {
      profileId,
      contentURI,
      collectModule,
      collectModuleInitData,
      referenceModule,
      referenceModuleInitData,
      sig
    };

    // const inputStructPoster = {
    //   profileId: 1,
    //   contentURI: 'https://ipfs.io/ipfs/Qmby8QocUU2sPZL46rZeMctAuF5nrCc7eR1PPkooCztWPz',
    //   collectModule: freeCollectModuleAddr,
    //   collectModuleInitData: defaultAbiCoder.encode(['bool'], [true]),
    //   referenceModule: ZERO_ADDRESS,
    //   referenceModuleInitData: [],
    // };
    console.log('inputstruct ', inputStruct);
    // setInputData(inputStruct);
    setUserSigNonce(userSigNonce + 1);
    if (!false) {
      return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      // return write?.({ args: inputStruct });
    }
    // ethers.Contract()
    console.log(broadcast);
    console.log('id ', id, 'signature ', signature);
    const {
      data: { broadcast: result }
    } = await broadcast({ request: { id, signature } });

    console.log(result);
    // if ('reason' in result) {
    // write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
    // }
  };

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: ({ createPostTypedData }) => {
      console.log('sadf');
      typedDataGenerator(createPostTypedData);
    },
    onError
  });

  // const getMainContentFocus = () => {
  //   if (attachments.length > 0) {
  //     if (isAudioPublication) {
  //       return PublicationMainFocus.Audio;
  //     } else if (ALLOWED_IMAGE_TYPES.includes(attachments[0]?.type)) {
  //       return PublicationMainFocus.Image;
  //     } else if (ALLOWED_VIDEO_TYPES.includes(attachments[0]?.type)) {
  //       return PublicationMainFocus.Video;
  //     } else {
  //       return PublicationMainFocus.TextOnly;
  //     }
  //   } else {
  //     return PublicationMainFocus.TextOnly;
  //   }
  // };
  const createMetadata = async (metadata: PublicationMetadataV2Input) => {
    return await uploadMetadataToIPFS(metadata);
  };

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
      // let textNftImageUrl = null;
      // if (!attachments.length && selectedCollectModule !== CollectModules.RevertCollectModule) {
      //   textNftImageUrl = await getTextNftUrl(
      //     publicationContent,
      //     currentProfile.handle,
      //     new Date().toLocaleString()
      //   );
      // }

      // const attributes: MetadataAttributeInput[] = [
      //   {
      //     traitType: 'type',
      //     displayType: PublicationMetadataDisplayTypes.String,
      //     value: getMainContentFocus()?.toLowerCase()
      //   }
      // ];

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuid(),
        description: 'description trimify(publicationContent)',
        content: 'content trimify(publicationContent)',
        external_url: null,
        image: attachments.length > 0 ? attachments[0].item : null,
        imageMimeType: attachments.length > 0 ? attachments[0].type : 'image/svg+xml',
        name: `${isComment ? 'Comment' : 'Post'} by @${currentProfile?.handle}`,
        tags: ['using_api_example'],
        animation_url: null,
        mainContentFocus: PublicationMainFocus.Image,
        contentWarning: null,
        attributes: [],
        media: attachments,
        locale: 'en-US',
        appId: LENSFOLIO_APP_ID
      };

      // let arweaveId = null;
      // if (restricted) {
      //   arweaveId = await createTokenGatedMetadata(metadata);
      // } else {
      //   arweaveId = await createMetadata(metadata);
      // }

      const ipfsFile = await createMetadata(metadata);
      console.log(ipfsFile);
      const request = {
        profileId: currentProfile?.id,
        contentURI: ipfsFile ? ipfsFile.item : null,
        collectModule: {
          revertCollectModule: true
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };
      const typedData = await createPostTypedData({
        variables: { options: { overrideSigNonce: userSigNonce }, request },
        context: {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      });

      console.log(typedData);
      //     await createPostTypedData({
      //       variables: { options: { overrideSigNonce: userSigNonce }, request }
      //     });
      // if (currentProfile?.dispatcher?.canUseRelay) {
      //   await createViaDispatcher(request);
      // } else {
      //   if (isComment) {
      //     await createCommentTypedData({
      //       variables: {
      //         options: { overrideSigNonce: userSigNonce },
      //         request: request as CreatePublicCommentRequest
      //       }
      //     });
      //   } else {
      //     await createPostTypedData({
      //       variables: { options: { overrideSigNonce: userSigNonce }, request }
      //     });
      //   }
      // }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Modal
        title="Upload"
        icon={<BeakerIcon className="w-5 h-5 text-brand" />}
        show={showUploadModal}
        onClose={() => setUploadModal(false)}
      >
        <DropZone attachments={attachments} setAttachments={setAttachments} />
        <Button onClick={createPublication}>upload to ipfs</Button>
      </Modal>
      <Button
        icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} />}
        onClick={() => {
          setUploadModal(!showUploadModal);
          // createPublication;
          // Leafwatch.track(USER.LOGIN);
        }}
      >
        Upload
      </Button>
      {/* <Button onClick={createPublication}>upload to ipfs</Button> */}
    </>
  );
};

export default NewPost;
