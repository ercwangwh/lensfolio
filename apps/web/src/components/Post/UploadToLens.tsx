import { FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import {
  useCreatePostTypedDataMutation,
  PublicationMainFocus,
  useValidatePublicationMetadataLazyQuery,
  useCreatePostViaDispatcherMutation
} from 'lens';
import type {
  PublicationMetadataV2Input,
  MetadataAttributeInput,
  ValidatePublicationMetadataRequest
} from 'lens';
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
  LensfolioAttachment,
  RELAYER_ENABLED
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
import { url } from 'inspector';
import getIPFSLink from '@lib/getIPFSLink';
// interface Props {
//   publication: LensfolioPublication;
// }

const UploadToLens: FC = () => {
  // App store
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
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
  const [validateMetadata, { error: validateError }] = useValidatePublicationMetadataLazyQuery();
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

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onCompleted: (data) => {
      console.log(data);
      // onCompleted();
      // if (data.createPostViaDispatcher.__typename === 'RelayerResult') {
      //   setTxnQueue([
      //     generateOptimisticPublication({ txId: data.createPostViaDispatcher.txId }),
      //     ...txnQueue
      //   ]);
      // }
    },
    onError
  });

  const createViaDispatcher = async (request: any) => {
    const variables = {
      options: { overrideSigNonce: userSigNonce },
      request
    };

    const { data } = await createPostViaDispatcher({
      variables: { request }
      // context: {
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      //   }
      // }
    });
    if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
      createPostTypedData({ variables });
    }
  };

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    overrides: { gasLimit: ethers.utils.parseEther('0.0000000001') }
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
    if (!RELAYER_ENABLED) {
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
    if ('reason' in result) {
      write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
    }
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
      // console.log('UploadedWorks: ', uploadedWorks);

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
        description: trimify(uploadedWorks.title),
        content: trimify(uploadedWorks.content),
        locale: 'en-US',
        tags: ['lenfolio_example'],
        mainContentFocus: PublicationMainFocus.Article,
        external_url: null,
        name: trimify(uploadedWorks.title),
        attributes: [],
        image: uploadedWorks.coverImg,
        imageMimeType: uploadedWorks.coverImg.type,
        media: [uploadedWorks.coverImg, uploadedWorks.attachment],
        animation_url: null,
        contentWarning: null,
        appId: LENSFOLIO_APP_ID
      };

      // const metadata: PublicationMetadataV2Input = {
      //   version: '2.0.0',
      //   mainContentFocus: PublicationMainFocus.TextOnly,
      //   metadata_id: '6162716327186732',
      //   description: 'Description',
      //   locale: 'en-US',
      //   content: 'Content',
      //   external_url: null,
      //   image: null,
      //   imageMimeType: null,
      //   name: 'Name',
      //   attributes: [],
      //   tags: ['using_api_examples'],
      //   appId: LENSFOLIO_APP_ID
      // };
      // console.log(metadata);

      const { data: postData } = await validateMetadata({
        variables: { request: { metadatav2: metadata } }
      });
      console.log('validate result:', postData);
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
      if (currentProfile?.dispatcher?.canUseRelay) {
        await createViaDispatcher(request);
      } else {
        const typedData = await createPostTypedData({
          variables: { options: { overrideSigNonce: userSigNonce }, request }
          // context: {
          //   headers: {
          //     Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          //   }
          // }
        });
        console.log(typedData);
      }

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
      {/* <Modal
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
      </Button> */}
      <Button onClick={createPublication}>upload to lens</Button>
      {/* <Button onClick={createPublication}>upload to ipfs</Button> */}
    </>
  );
};

export default UploadToLens;
