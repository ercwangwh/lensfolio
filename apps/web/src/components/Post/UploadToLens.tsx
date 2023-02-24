import { FC, useState } from 'react';
import { useAppStore, UPLOADED_WORKS_DEAFULT } from 'src/store/app';
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
  RELAYER_ENABLED,
  CustomErrorWithData,
  ERROR_MESSAGE
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
import DropZone from './TitleArea';
import uploadToIPFS, { uploadMetadataToIPFS } from '@lib/uploadToIPFS';
import getSignature from '@lib/getSignature';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import { url } from 'inspector';
import getIPFSLink from '@lib/getIPFSLink';
import { getCollectModule } from '@lib/getCollectModule';
import { useRouter } from 'next/router';

import { Loader } from '@components/UI/Loader';
import getTags from '@lib/getTags';
// const router = useRouter();
// interface Props {
//   publication: LensfolioPublication;
// }

const UploadToLens: FC = () => {
  // App store
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  // Transaction persist store
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);

  //State
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  // const [publicationContentError, setPublicationContentError] = useState('');
  // const [attachments, setAttachments] = useState<LensfolioAttachment[]>([]);
  // const [showUploadModal, setUploadModal] = useState(false);
  // const [inputData, setInputData] = useState<Object>({});
  // const isComment = false;

  // const { data: signer } = useSigner();

  const generateQueuedWorks = (txn: { txId?: string; txHash?: string }) => {
    return {
      id: uuid(),
      type: 'NEW_POST',
      txHash: txn.txHash,
      txId: txn.txId,
      attachment: uploadedWorks.attachment,
      title: uploadedWorks.title,
      cover: uploadedWorks.coverImg
    };
  };

  const resetToDefaults = () => {
    setUploadedWorks(UPLOADED_WORKS_DEAFULT);
  };

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setUploadedWorks({
      statusText: 'Post Error',
      loading: false
    });
  };
  console.log('txnQueue', txnQueue);
  const onCompleted = (data: any) => {
    if (data?.broadcast?.reason === 'NOT_ALLOWED' || data.createPostViaDispatcher?.reason) {
      return toast.error(`${data}[Error Post Dispatcher]`);
    }
    const txId = data?.createPostViaDispatcher?.txId ?? data?.broadcast?.txId;
    console.log('txid', txId);
    setTxnQueue([generateQueuedWorks({ txId }), ...txnQueue]);
    setUploadedWorks({
      statusText: 'Post',
      loading: false
    });
  };

  const { signTypedDataAsync } = useSignTypedData({ onError });
  const [validateMetadata, { error: validateError }] = useValidatePublicationMetadataLazyQuery();

  const { error, write } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'postWithSig',
    mode: 'recklesslyUnprepared',
    onSuccess: (data) => {
      setUploadedWorks({
        statusText: 'Broadcast',
        loading: false
      });
      setTxnQueue([generateQueuedWorks({ txHash: data.hash }), ...txnQueue]);
    },
    onError
  });

  const { broadcast } = useBroadcast({
    onCompleted: (data) => {
      console.log('Broadcast:', broadcast);
      if (data.broadcast.__typename === 'RelayerResult') {
        setTxnQueue([generateQueuedWorks({ txId: data.broadcast.txId }), ...txnQueue]);
      }
    }
  });

  const [createPostViaDispatcher] = useCreatePostViaDispatcherMutation({
    onCompleted,
    onError
  });

  const createViaDispatcher = async (request: any) => {
    const variables = {
      options: { overrideSigNonce: userSigNonce },
      request
    };

    const { data } = await createPostViaDispatcher({
      variables: { request }
    });
    if (data?.createPostViaDispatcher?.__typename === 'RelayError') {
      createPostTypedData({ variables });
    }
  };

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
    try {
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

      console.log('inputstruct ', inputStruct);

      setUserSigNonce(userSigNonce + 1);
      if (!RELAYER_ENABLED) {
        return write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }

      // console.log(broadcast);
      console.log('id ', id, 'signature ', signature);
      const {
        data: { broadcast: result }
      } = await broadcast({ request: { id, signature } });

      console.log('Broadcast result:', result);
      if ('reason' in result) {
        write?.({ recklesslySetUnpreparedArgs: [inputStruct] });
      }
    } catch {}
  };

  const [createPostTypedData] = useCreatePostTypedDataMutation({
    onCompleted: ({ createPostTypedData }) => {
      console.log('CreatePostTypedData');
      typedDataGenerator(createPostTypedData);
    },
    onError
  });

  const createMetadata = async (metadata: PublicationMetadataV2Input) => {
    return await uploadMetadataToIPFS(metadata);
  };

  const createPublication = async () => {
    if (!currentProfile) {
      return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    }

    try {
      setIsSubmitting(true);
      setUploadedWorks({
        buttonText: 'Storing metadata...',
        loading: true
      });
      console.log('uploadedWorks', uploadedWorks);
      if (!uploadedWorks.title || !uploadedWorks.coverImg || !uploadedWorks.content) {
        setUploadedWorks({
          loading: false
        });
        return toast.error('Title, Content & Cover Image should not be empty!');
      }
      console.log('UploadedWorks: ', uploadedWorks);

      // setPublicationContentError('');
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
      // const mediaInput = (): LensfolioAttachment[] => {
      //   if (!uploadedWorks.attachment.item) return [uploadedWorks.coverImg];
      //   else return [uploadedWorks.coverImg, uploadedWorks.attachment];
      // };
      const mediaInput = (): LensfolioAttachment[] => {
        return !uploadedWorks.attachment.item
          ? [uploadedWorks.coverImg]
          : [uploadedWorks.coverImg, uploadedWorks.attachment];
      };

      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuid(),
        description: trimify(uploadedWorks.title),
        content: trimify(JSON.stringify(uploadedWorks.content)),
        locale: 'en-US',
        tags: [...getTags(JSON.stringify(uploadedWorks.content))],
        mainContentFocus: PublicationMainFocus.Article,
        external_url: null,
        name: trimify(uploadedWorks.title),
        attributes: [],
        image: uploadedWorks.coverImg.item,
        imageMimeType: uploadedWorks.coverImg.type,
        media: mediaInput(),
        animation_url: null,
        contentWarning: null,
        appId: LENSFOLIO_APP_ID
      };

      const { data: postData } = await validateMetadata({
        variables: { request: { metadatav2: metadata } }
      });
      console.log('validate result:', postData);

      const ipfsFile = await createMetadata(metadata);
      setUploadedWorks({
        buttonText: 'Posting ...',
        loading: true
      });
      console.log('IPFS url:', ipfsFile);

      const isRestricted = Boolean(
        uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule?.degreesOfSeparation
      );
      const referenceModuleDegrees = {
        commentsRestricted: isRestricted,
        mirrorsRestricted: isRestricted,
        degreesOfSeparation: uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule
          ?.degreesOfSeparation as number
      };

      const request = {
        profileId: currentProfile?.id,
        contentURI: ipfsFile ? ipfsFile.item : null,
        collectModule: getCollectModule(uploadedWorks.collectModule),
        referenceModule: {
          followerOnlyReferenceModule: uploadedWorks.referenceModule?.followerOnlyReferenceModule,
          degreesOfSeparationReferenceModule: uploadedWorks.referenceModule
            ?.degreesOfSeparationReferenceModule
            ? referenceModuleDegrees
            : null
        }
      };
      console.log('Request:', request);
      if (currentProfile?.dispatcher?.canUseRelay) {
        await createViaDispatcher(request);
      } else {
        const typedData = await createPostTypedData({
          variables: { options: { overrideSigNonce: userSigNonce }, request }
        });
        console.log('Typed Data:', typedData);
      }
      router.push('/');
    } catch (error) {
      toast.error(`[Error Store & Post Work]${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row justify-center">
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
      {/* <Button disabled={uploadedWorks.loading} onClick={resetToDefaults}>
        Cancle
      </Button> */}
      <Button
        disabled={uploadedWorks.loading}
        icon={isSubmitting ? <Loader /> : null}
        onClick={createPublication}
      >
        Upload to lens
      </Button>
      {/* <Button onClick={createPublication}>upload to ipfs</Button> */}
    </div>
  );
};

export default UploadToLens;
