import { CheckIcon } from '@heroicons/react/24/outline';

import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';

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
    <div className="p-5 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary">
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">Collect Type</div>
      </div>
      <button
        type="button"
        onClick={() => setShowCollectModuleModal(true)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-300 focus:outline-none dark:border-gray-700 rounded-xl"
      >
        <span>{getSelectedCollectType()}</span>
        <CheckIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default CollectModule;
