import { useApolloClient } from '@apollo/client';
// import InterweaveContent from '@components/Common/InterweaveContent';
// import IsVerified from '@components/Common/IsVerified';
// import Tooltip from '@components/UIElements/Tooltip';
import Tooltip from '@components/UI/Tooltip';
import { useAppPersistStore, useAppStore } from 'src/store/app';
import { usePublicationStore } from 'src/store/publication';
import {
  PublicationDetailsDocument,
  useHasTxHashBeenIndexedQuery,
  usePublicationDetailsLazyQuery
  // useTxIdToTxHashLazyQuery
} from 'lens';
import { PublicationMetadataStatusType } from 'lens';
import Link from 'next/link';
import { FC, useEffect } from 'react';
import React from 'react';
import type { LensfolioPublication, QueuedCommentType } from 'utils';
// import getProfilePicture from 'utils/functions/getProfilePicture';
import getAvatar from '@lib/getAvatar';
import { useTransactionPersistStore } from 'src/store/transaction';
import usePendingTxn from 'utils/hooks/usePendingTxn';
import { toast } from 'react-hot-toast';

interface Props {
  queuedComment: QueuedCommentType;
}

const QueuedComment: FC<Props> = ({ queuedComment }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const queuedComments = usePublicationStore((state) => state.queuedComments);
  // const setQueuedComments = usePublicationStore((state) => state.setQueuedComments);
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const setTxnQueue = useTransactionPersistStore((state) => state.setTxnQueue);
  const txHash = queuedComment?.txHash;
  const txId = queuedComment?.txId;

  const { cache } = useApolloClient();
  // const [getTxnHash] = useTxIdToTxHashLazyQuery();
  console.log('cache', cache);

  const removeTxn = () => {
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
  console.log('txhash,txid,', txHash, txId);
  // const { data, indexed } = usePendingTxn({ txHash, txId });

  // useEffect(() => {
  //   console.log('Indexed Usehook:', indexed);
  //   if (indexed && data) {
  //     toast.success(`Indexed txId ${txId}`);

  //     if (data.hasTxHashBeenIndexed.__typename === 'TransactionError') {
  //       return removeTxn();
  //     }

  //     if (data.hasTxHashBeenIndexed.__typename === 'TransactionIndexedResult') {
  //       const status = data.hasTxHashBeenIndexed.metadataStatus?.status;

  //       if (
  //         status === PublicationMetadataStatusType.MetadataValidationFailed ||
  //         status === PublicationMetadataStatusType.NotFound
  //       ) {
  //         return removeTxn();
  //       }

  //       if (data.hasTxHashBeenIndexed.indexed) {
  //         console.log('Indexed');
  //         getPublication({
  //           variables: {
  //             request: { txHash: data.hasTxHashBeenIndexed.txHash },
  //             reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
  //             profileId: currentProfile?.id ?? null
  //           }
  //         });
  //       }
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [indexed]);

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

  if ((!queuedComment?.txId && !queuedComment?.txHash) || !currentProfile) return null;

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start justify-between">
        <Link href={`/user/${currentProfile?.handle}`} className="flex-none mr-3 mt-0.5">
          <img
            src={getAvatar(currentProfile, false)}
            className="rounded-full w-7 h-7"
            draggable={false}
            alt={currentProfile?.handle}
          />
        </Link>
        <div className="flex flex-col items-start mr-2">
          <span className="flex items-center mb-1 space-x-1">
            <Link
              href={`/user/${currentProfile.handle}`}
              className="flex items-center space-x-1 text-sm font-medium"
            >
              <span>{currentProfile?.handle}</span>
              {/* <IsVerified id={selectedChannel.id} /> */}
            </Link>
          </span>
          <div className="text-sm opacity-80">
            {/* <InterweaveContent content={queuedComment.comment} /> */}
            {queuedComment.comment}
          </div>
        </div>
      </div>
      <div>
        <div className="p-2">
          <Tooltip content="Indexing" placement="top">
            <span className="flex h-2 w-2 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default QueuedComment;
