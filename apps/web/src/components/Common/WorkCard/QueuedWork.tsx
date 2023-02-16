import { useApolloClient } from '@apollo/client';
// import InterweaveContent from '@components/Common/InterweaveContent';
// import IsVerified from '@components/Common/IsVerified';
// import Tooltip from '@components/UIElements/Tooltip';
import Tooltip from '@components/UI/Tooltip';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import {
  Profile,
  Publication,
  PublicationDetailsDocument,
  PublicationMainFocus,
  PublicationTypes,
  useHasTxHashBeenIndexedQuery,
  useProfilePostsQuery,
  usePublicationDetailsLazyQuery
  // useTxIdToTxHashLazyQuery
} from 'lens';
import { PublicationMetadataStatusType } from 'lens';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import React from 'react';
// import type { QueuedCommentType } from 'utils';
// import getProfilePicture from 'utils/functions/getProfilePicture';
import getAvatar from '@lib/getAvatar';
import { useTransactionPersistStore } from 'src/store/transaction';
import usePendingTxn from 'utils/hooks/usePendingTxn';
import { toast } from 'react-hot-toast';
import { LensfolioPublication, LENSFOLIO_APP_ID, LENS_CUSTOM_FILTERS, QueuedWorkType } from 'utils';
// import imageProxy from '@lib/imageProxy';
import getIPFSLink from '@lib/getIPFSLink';
import { UPLOADED_WORKS_DEAFULT } from 'src/store/app';
import { clsx } from 'clsx';

interface Props {
  queuedWork: QueuedWorkType;
}

const QueuedWork: FC<Props> = ({ queuedWork }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  // const queuedComments = usePublicationStore((state) => state.queuedComments);
  // const setQueuedComments = usePublicationStore((state) => state.setQueuedComments);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);
  const txHash = queuedWork?.txHash;
  const txId = queuedWork?.txId;

  // console.log('title', queuedWork.title);
  const { cache } = useApolloClient();
  // const [getTxnHash] = useTxIdToTxHashLazyQuery();

  const thumbnailUrl = getIPFSLink(uploadedWorks.coverImg.item);

  const removeTxn = () => {
    setUploadedWorks(UPLOADED_WORKS_DEAFULT);
    if (txHash) {
      setTxnQueue(txnQueue.filter((o) => o.txHash !== txHash));
    } else {
      setTxnQueue(txnQueue.filter((o) => o.txId !== txId));
    }
  };

  // const removeFromQueue = () => {
  //   if (!queuedComment.txHash) {
  //     return setQueuedComments(queuedComments.filter((q) => q.txHash !== queuedComment.txHash));
  //   }
  //   setQueuedComments(queuedComments.filter((q) => q.txId !== queuedComment.txId));
  // };

  const [getPublication] = usePublicationDetailsLazyQuery({
    onCompleted: (data) => {
      if (data.publication) {
        cache.modify({
          fields: {
            publications() {
              cache.writeQuery({
                data: data?.publication as LensfolioPublication,
                query: PublicationDetailsDocument
              });
            }
          }
        });
        removeTxn();
      }
    }
  });

  const { startPolling, stopPolling } = useHasTxHashBeenIndexedQuery({
    variables: { request: { txHash, txId } },
    // pollInterval: 1000,
    onCompleted: (data) => {
      console.log('Why not completed', data);
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
        return removeTxn();
      }
      if (data.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult') {
        const status = data.hasTxHashBeenIndexed.metadataStatus?.status;
        console.log('111');
        if (
          status === PublicationMetadataStatusType.MetadataValidationFailed ||
          status === PublicationMetadataStatusType.NotFound
        ) {
          return removeTxn();
        }
        console.log('data.hasTxHashBeenIndexed.indexed', data.hasTxHashBeenIndexed.indexed);
        if (data.hasTxHashBeenIndexed.indexed) {
          console.log('333');
          console.log('Indexed');
          stopPolling();
          getPublication({
            variables: {
              request: { txHash: data.hasTxHashBeenIndexed.txHash },
              reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
              profileId: currentProfile?.id ?? null
            }
          });
        }
      }
    }
  });
  // The following useEffect is added
  useEffect(() => {
    startPolling(1000);
  }, [startPolling]);

  // const getCommentByTxnId = async () => {
  //   const { data } = await getTxnHash({
  //     variables: {
  //       txId: queuedComment?.txnId
  //     }
  //   });
  //   if (data?.txIdToTxHash) {
  //     getPublication({
  //       variables: { request: { txHash: data?.txIdToTxHash } }
  //     });
  //   }
  // };

  // const { stopPolling } = useHasTxHashBeenIndexedQuery({
  //   variables: {
  //     request: { txId: queuedComment?.txnId, txHash: queuedComment?.txnHash }
  //   },
  //   skip: !queuedComment?.txnId?.length && !queuedComment?.txnHash?.length,
  //   pollInterval: 1000,
  //   onCompleted: async (data) => {
  //     if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
  //       return removeFromQueue();
  //     }
  //     if (
  //       data?.hasTxHashBeenIndexed?.__typename === 'TransactionIndexedResult' &&
  //       data?.hasTxHashBeenIndexed?.indexed
  //     ) {
  //       stopPolling();
  //       if (queuedComment.txnHash) {
  //         return getPublication({
  //           variables: { request: { txHash: queuedComment?.txnHash } }
  //         });
  //       }
  //       await getCommentByTxnId();
  //     }
  //   }
  // });

  if ((!queuedWork?.txId && !queuedWork?.txHash) || !currentProfile) return null;

  return (
    <div className="cursor-wait ">
      {/* <div>afjklhjaklhjlkjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhjhj</div> */}
      <Tooltip content="Indexing, please wait..." placement="top">
        <div className="aspect-w-16 aspect-h-9 relative overflow-hidden">
          <img
            src={thumbnailUrl}
            className="bg-gray-100 object-center w-full h-full dark:bg-gray-900 md:rounded-xl object-cover"
            // style={{
            //   backgroundColor: backgroundColor && `${backgroundColor}95`
            // }}
            alt="thumbnail"
            draggable={false}
          />
        </div>
      </Tooltip>
      <div className="py-2">
        <div className="flex items-start space-x-2.5">
          <img
            className="h-8 w-8 rounded-full"
            src={getAvatar(currentProfile, false)}
            alt={currentProfile?.handle}
            draggable={false}
          />
          <div className="grid flex-1">
            <div className="flex w-full min-w-0 items-start justify-between space-x-1.5 pb-1">
              <span
                className="line-clamp-2 ultrawide:line-clamp-1 ultrawide:break-all break-words text-sm font-semibold"
                title={queuedWork.title}
              >
                {queuedWork.title}
              </span>
              <div className="p-1">
                <Tooltip content="Indexing" placement="top">
                  <span className="flex h-2 w-2 items-center justify-center">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-blue-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-blue-500" />
                  </span>
                </Tooltip>
              </div>
            </div>
            {/* <span className="flex w-fit items-center space-x-0.5 text-[13px] opacity-70">
              <span>{currentProfile?.handle}</span>
              <IsVerified id={selectedChannel?.id} size="xs" />
            </span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueuedWork;
