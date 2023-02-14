// import { LENSHUB_PROXY_ABI } from '@abis/LensHubProxy'
import { motion } from 'framer-motion';
import { LensHubProxy } from 'utils';
import { InboxIcon } from '@heroicons/react/24/outline';
import { InboxIcon as InboxIconSolid } from '@heroicons/react/24/solid';
// import CollectOutline from '@components/Common/Icons/CollectOutline';
import { Button } from '@components/UI/Button';
import { Loader } from '@components/UI/Loader';
import Tooltip from '@components/UI/Tooltip';

import { useAppStore } from 'src/store/app';
import { useAppPersistStore } from 'src/store/app';
// import usePersistStore from '@lib/store/persist';
import { utils } from 'ethers';
import type {
  CreateCollectBroadcastItemResult,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  Publication
} from 'lens';
import {
  useBroadcastMutation,
  useCreateCollectTypedDataMutation,
  useProxyActionMutation,
  usePublicationCollectModuleQuery
} from 'lens';
import type { FC } from 'react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import type { CustomErrorWithData, LensfolioCollectModule, LensfolioPublication } from 'utils';
import {
  // Analytics,
  ERROR_MESSAGE,
  LENSHUB_PROXY_ADDRESS,
  RELAYER_ENABLED,
  SIGN_IN_REQUIRED_MESSAGE
  // TRACK
} from 'utils';
import omit from '@lib/omit';
// import omitKey from 'utils/functions/omitKey';
import { useAccount, useContractWrite, useSignTypedData } from 'wagmi';

import CollectModal from './CollectModal';

interface Props {
  work: LensfolioPublication;
  // variant?: 'primary' | 'secondary' | 'success';
  isFullPublication: boolean;
}

const CollectWork: FC<Props> = ({ work, isFullPublication }) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [alreadyCollected, setAlreadyCollected] = useState(work.hasCollectedByMe);
  const profileId = useAppPersistStore((state) => state.profileId);
  const userSigNonce = useAppStore((state) => state.userSigNonce);
  const setUserSigNonce = useAppStore((state) => state.setUserSigNonce);

  const onError = (error: CustomErrorWithData) => {
    toast.error(error?.data?.message ?? error?.message ?? ERROR_MESSAGE);
    setLoading(false);
  };

  const onCompleted = () => {
    setLoading(false);
    setAlreadyCollected(true);
    toast.success('Collected as NFT');
  };

  const { signTypedDataAsync } = useSignTypedData({
    onError
  });

  const { data, loading: fetchingCollectModule } = usePublicationCollectModuleQuery({
    variables: { request: { publicationId: work?.id } }
  });

  const collectModule =
    data?.publication?.__typename === 'Post'
      ? (data?.publication?.collectModule as LensfolioCollectModule)
      : null;

  console.log(
    'collectModule:',
    data,
    collectModule?.amount,
    collectModule?.followerOnly,
    // collectModule?.collectLimit,
    collectModule?.type
    // collectModule?.endTimestamp
  );
  const { write: writeCollectWithSig } = useContractWrite({
    address: LENSHUB_PROXY_ADDRESS,
    abi: LensHubProxy,
    functionName: 'collectWithSig',
    mode: 'recklesslyUnprepared',
    onError,
    onSuccess: onCompleted
  });

  const [broadcast] = useBroadcastMutation({
    onError,
    onCompleted
  });

  const [createProxyActionFreeCollect] = useProxyActionMutation({
    onError,
    onCompleted
  });

  const [createCollectTypedData] = useCreateCollectTypedDataMutation({
    onCompleted: async ({ createCollectTypedData }) => {
      const { typedData, id } = createCollectTypedData as CreateCollectBroadcastItemResult;
      try {
        const signature = await signTypedDataAsync({
          domain: omit(typedData?.domain, '__typename'),
          types: omit(typedData?.types, '__typename'),
          value: omit(typedData?.value, '__typename')
        });
        const { v, r, s } = utils.splitSignature(signature);
        const args = {
          collector: address,
          profileId: typedData?.value.profileId,
          pubId: typedData?.value.pubId,
          data: typedData.value.data,
          sig: { v, r, s, deadline: typedData.value.deadline }
        };
        setUserSigNonce(userSigNonce + 1);
        if (!RELAYER_ENABLED) {
          return writeCollectWithSig?.({ recklesslySetUnpreparedArgs: [args] });
        }
        const { data } = await broadcast({
          variables: { request: { id, signature } }
        });
        if (data?.broadcast?.__typename === 'RelayError') {
          writeCollectWithSig?.({ recklesslySetUnpreparedArgs: [args] });
        }
      } catch {
        setLoading(false);
      }
    },
    onError
  });

  const isFreeCollect = work.collectModule.__typename === 'FreeCollectModuleSettings';
  // console.log('Work collectModule:', work.collectModule);
  const collectNow = () => {
    setShowCollectModal(false);
    setLoading(true);
    if (!isFreeCollect) {
      // Analytics.track(TRACK.COLLECT.FEE);
      return createCollectTypedData({
        variables: {
          options: { overrideSigNonce: userSigNonce },
          request: { publicationId: work?.id }
        }
      });
    }
    // Analytics.track(TRACK.COLLECT.FREE);
    // Using proxyAction to free collect without signing
    createProxyActionFreeCollect({
      variables: {
        request: {
          collect: { freeCollect: { publicationId: work?.id } }
        }
      }
    });
  };

  const onClickCollect = () => {
    if (!profileId) return toast.error(SIGN_IN_REQUIRED_MESSAGE);
    return setShowCollectModal(true);
  };

  const collectTooltipText = isFreeCollect ? (
    'Collect as NFT'
  ) : (
    <span>
      Collect as NFT for
      <b className="ml-1 space-x-1">
        <span>{collectModule?.amount?.value}</span>
        <span>{collectModule?.amount?.asset.symbol}</span>
      </b>
    </span>
  );
  const iconClassName = isFullPublication ? 'w-5 sm:w-5' : 'w-4 sm:w-4';
  return (
    <>
      {showCollectModal && collectModule && (
        <CollectModal
          work={work}
          showModal={showCollectModal}
          setShowModal={setShowCollectModal}
          collectNow={collectNow}
          collecting={loading}
          collectModule={collectModule}
          fetchingCollectModule={fetchingCollectModule}
        />
      )}

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={onClickCollect}
        disabled={fetchingCollectModule || alreadyCollected}
        aria-label="Collect"
      >
        <span className="flex items-center space-x-1 text-blue-500">
          <span className="p-1.5 rounded-full hover:bg-blue-300 hover:bg-opacity-20 cursor-pointer">
            <Tooltip
              content={
                fetchingCollectModule
                  ? 'Collecting'
                  : alreadyCollected
                  ? 'Already Collected'
                  : collectTooltipText
              }
              placement="top"
            >
              {alreadyCollected || fetchingCollectModule ? (
                <InboxIconSolid className={iconClassName} />
              ) : (
                <InboxIcon className={iconClassName} />
              )}
            </Tooltip>
          </span>
        </span>
      </motion.button>
    </>
  );
};

export default CollectWork;
