import { LensfolioAttachment, LensfolioPublication, LensHubProxy } from 'utils';
import { Button } from '@components/UI/Button';
// import { Button } from '@components/UIElements/Button'
import { useAppStore, useAppPersistStore } from 'src/store/app';
import { zodResolver } from '@hookform/resolvers/zod';
import { utils } from 'ethers';
import type { CreateCommentBroadcastItemResult, CreatePublicCommentRequest, Publication } from 'lens';
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useBroadcastMutation,
  useCreateCommentTypedDataMutation,
  useCreateCommentViaDispatcherMutation
} from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import type { CustomErrorWithData } from 'utils';
import { PublicationMetadataV2Input } from 'lens';
import {
  // Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  LENSFOLIO_APP_ID,
  LENSFOLIO_WEBSITE_URL,
  RELAYER_ENABLED
  // TRACK
} from 'utils';
import getAvatar from '@lib/getAvatar';
import InputMentions from '@components/UI/InputMentions';
// import getProfilePicture from 'utils/functions/getProfilePicture';
// import getTextNftUrl from 'utils/functions/getTextNftUrl';
// import getUserLocale from 'utils/functions/getUserLocale';
import omit from '@lib/omit';
// import omitKey from 'utils/functions/omitKey';
import trimify from '@lib/trimify';
// import trimify from 'utils/functions/trimify';
import uploadToIPFS from '@lib/uploadToIPFS';
// import uploadToAr from 'utils/functions/uploadToAr';
// import logger from 'utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { useContractWrite, useSignTypedData } from 'wagmi';
import { z } from 'zod';
import getUserLocale from '@lib/getUserLocale';
import getTextNftUrl from '@lib/getTextNftUrl';
import { uploadMetadataToIPFS } from '@lib/uploadToIPFS';
import { Input } from '@components/UI/Input';
import { useTransactionPersistStore } from 'src/store/transaction';

interface Props {
  work: LensfolioPublication;
}

const formSchema = z.object({
  comment: z
    .string({ required_error: 'Enter valid comment' })
    .trim()
    .min(1, { message: 'Enter valid comment' })
    .max(5000, { message: 'Comment should not exceed 5000 characters' })
});
type FormData = z.infer<typeof formSchema>;

const NewComment: FC<Props> = ({ work }) => {
  const [loading, setLoading] = useState(false);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const profileId = useAppPersistStore((state) => state.profileId);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);
  // const queuedComments = useAppPersistStore((state) => state.);
  // const setQueuedComments = usePersistStore((state) => state.setQueuedComments);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const {
    clearErrors,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm<FormData>({
    defaultValues: {
      comment: ''
    },
    resolver: zodResolver(formSchema)
  });

  const setToQueue = (txn: { txId?: string; txHash?: string }) => {
    setTxnQueue([
      {
        comment: getValues('comment'),
        txId: txn.txId,
        txHash: txn.txHash,
        pubId: work.id
      },
      ...txnQueue
    ]);
    reset();
    // console.log('Reset Success');
    setLoading(false);
    // toast.success('Comment Success');
  };

  const onCompleted = (data: any) => {
    if (data?.broadcast?.reason === 'NOT_ALLOWED' || data.createCommentViaDispatcher?.reason) {
      return toast.error('[Error Data Comment Dispatcher]');
    }
    // console.log('Comment Success');
    // Analytics.track(TRACK.NEW_COMMENT);
    const txId = data?.createCommentViaDispatcher?.txId ?? data?.broadcast?.txId;
    // console.log('Txid:', txId);
    setToQueue({ txId });
  };

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { write: writeComment } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'commentWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: (data) => {
      if (data.hash) {
        setToQueue({ txHash: data.hash });
      }
    }
  });

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  });

  const [createCommentViaDispatcher] = useCreateCommentViaDispatcherMutation({
    onError,
    // onCompleted: (data) => {
    //   console.log(data);
    // }
    onCompleted
  });

  const [createCommentTypedData] = useCreateCommentTypedDataMutation({
    onCompleted: async ({ createCommentTypedData }) => {
      const { typedData, id } = createCommentTypedData as CreateCommentBroadcastItemResult;
      const {
        profileId,
        profileIdPointed,
        pubIdPointed,
        contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleData,
        referenceModuleInitData
      } = typedData?.value;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          profileId,
          profileIdPointed,
          pubIdPointed,
          contentURI,
          collectModule,
          collectModuleInitData,
          referenceModule,
          referenceModuleData,
          referenceModuleInitData,
          sig: { v, r, s, deadline: typedData.value.deadline }
        };
        setUserSigNonce(userSigNonce + 1);
        if (!RELAYER_ENABLED) {
          return writeComment?.({ recklesslySetUnpreparedArgs: [args] });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError')
          writeComment?.({ recklesslySetUnpreparedArgs: [args] });
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const signTypedData = (request: CreatePublicCommentRequest) => {
    createCommentTypedData({
      variables: { options: { overrideSigNonce: userSigNonce }, request }
    });
  };

  const createViaDispatcher = async (request: CreatePublicCommentRequest) => {
    const { data } = await createCommentViaDispatcher({
      variables: { request }
    });
    if (data?.createCommentViaDispatcher.__typename === 'RelayError') {
      signTypedData(request);
    }
  };

  const submitComment = async (data: FormData) => {
    try {
      setLoading(true);

      // const textNftImageUrl = await getTextNftUrl(
      //   trimify(data.comment),
      //   currentProfile?.handle,
      //   new Date().toLocaleString()
      // );

      // console.log('Test Nft Url', textNftImageUrl);
      const metadata: PublicationMetadataV2Input = {
        version: '2.0.0',
        metadata_id: uuidv4(),
        description: trimify(data.comment),
        content: trimify(data.comment),
        locale: getUserLocale(),
        mainContentFocus: PublicationMainFocus.TextOnly,
        external_url: `${LENSFOLIO_WEBSITE_URL}/works/${work?.id}`,
        image: getAvatar(currentProfile, false),
        // image:textNftImageUrl,
        imageMimeType: 'image/svg+xml',
        name: `${currentProfile?.handle}'s comment on work ${work.metadata.name}`,
        attributes: [
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'publication',
            value: 'comment'
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: 'app',
            value: LENSFOLIO_APP_ID
          }
        ],
        media: [],
        appId: LENSFOLIO_APP_ID
      };
      const result = await uploadMetadataToIPFS(metadata);
      console.log(result);
      const request = {
        profileId: currentProfile?.id,
        publicationId: work?.id,
        contentURI: result.item,
        collectModule: {
          freeCollectModule: {
            followerOnly: false
          }
        },
        referenceModule: {
          followerOnlyReferenceModule: false
        }
      };
      const canUseDispatcher = currentProfile?.dispatcher?.canUseRelay;
      if (!canUseDispatcher) {
        return signTypedData(request);
      }
      await createViaDispatcher(request);
    } catch (error) {
      toast.error(`[Error Store & Post Comment]${error}`);
    }
  };

  if (!currentProfile || !profileId) return null;

  return (
    <div className="my-1">
      <form onSubmit={handleSubmit(submitComment)} className="flex items-start mb-2 space-x-1 md:space-x-3">
        <div className="flex-none">
          <img
            src={getAvatar(currentProfile, false)}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full"
            draggable={false}
            alt={currentProfile?.handle}
          />
        </div>
        <Input
          placeholder="How you fell about this work?"
          autoComplete="off"
          validationError={errors.comment?.message}
          onChange={(e) => {
            setValue('comment', e.target.value);
            clearErrors('comment');
          }}
          value={watch('comment')}
          // onContentChange={(value) => {
          //   setValue('comment', value);
          //   clearErrors('comment');
          // }}
          // mentionsSelector="input-mentions-single"
        />
        <Button disabled={loading} loading={loading}>
          Comment
        </Button>
      </form>
    </div>
  );
};

export default NewComment;
