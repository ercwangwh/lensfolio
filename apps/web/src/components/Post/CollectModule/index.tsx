// import { CheckIcon } from '@heroicons/react/24/outline';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import Tooltip from '@components/UI/Tooltip';
import { ReceiptRefundIcon, RectangleStackIcon } from '@heroicons/react/24/outline';
import React from 'react';

const CollectModule = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setShowCollectModuleModal = useGlobalModalStateStore((state) => state.setShowCollectModuleModal);

  const getSelectedCollectType = () => {
    const followerOnlyCollect = uploadedWorks.collectModule.followerOnlyCollect;
    const isTimedFeeCollect = uploadedWorks.collectModule.isTimedFeeCollect;
    const isLimitedFeeCollect = uploadedWorks.collectModule.isLimitedFeeCollect;
    const collectLimit = uploadedWorks.collectModule.collectLimit;
    if (uploadedWorks.collectModule.isRevertCollect) {
      return 'No one can collect this publication';
    }
    if (uploadedWorks.collectModule.isFreeCollect) {
      return `${followerOnlyCollect ? 'Only Followers' : 'Anyone'} can collect for free ${
        isTimedFeeCollect ? 'within 24hrs' : ''
      }`;
    }
    if (!uploadedWorks.collectModule.isFreeCollect) {
      return `${followerOnlyCollect ? 'Only Followers' : 'Anyone'} can collect ${
        isLimitedFeeCollect ? `maximum of ${collectLimit}` : ''
      } for given fees ${isTimedFeeCollect ? 'within 24hrs' : ''}`;
    }
  };

  return (
    <>
      {/* <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">Collect Type</div>
      </div> */}
      <Tooltip content={getSelectedCollectType()} placement="top">
        <button
          type="button"
          onClick={() => setShowCollectModuleModal(true)}
          // className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-300 focus:outline-none dark:border-gray-700 rounded-xl"
        >
          {/* <span>{getSelectedCollectType()}</span> */}
          {uploadedWorks.collectModule.isRevertCollect ? (
            <ReceiptRefundIcon className=" h-5 w-5 text-blue-500" />
          ) : (
            <RectangleStackIcon className=" h-5 w-5 text-blue-500" />
          )}
        </button>
      </Tooltip>
    </>
  );
};

export default CollectModule;
