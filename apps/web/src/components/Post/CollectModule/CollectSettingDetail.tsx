import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@components/UI/Button';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import { useEnabledModuleCurrrenciesQuery } from 'lens';
import React from 'react';
import type { CollectModuleType } from 'utils';

import ChargeQuestion from './ChargeQuestion';
import FeeCollectForm from './FeeCollectForm';
import LimitDurationQuestion from './LimitDurationQuestion';
import LimitQuestion from './LimitQuestion';
import PermissionQuestion from './PermissionQuestion';

export const CollectSettingDetail = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const currentProfile = useAppStore((state) => state.currentProfile);

  const setShowCollectModuleModal = useGlobalModalStateStore((state) => state.setShowCollectModuleModal);

  const setCollectType = (data: CollectModuleType) => {
    setUploadedWorks({
      collectModule: { ...uploadedWorks.collectModule, ...data }
    });
  };

  const { data: enabledCurrencies } = useEnabledModuleCurrrenciesQuery({
    variables: { request: { profileIds: currentProfile?.id } },
    skip: !currentProfile?.id
  });

  return (
    <div className="p-5 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary rounded-2xl">
      <div className="mt-2 space-y-4">
        <PermissionQuestion setCollectType={setCollectType} uploadedWork={uploadedWorks} />
        {!uploadedWorks.collectModule.isRevertCollect && (
          <LimitDurationQuestion setCollectType={setCollectType} uploadedWork={uploadedWorks} />
        )}
        {!uploadedWorks.collectModule.isRevertCollect && (
          <LimitQuestion setCollectType={setCollectType} uploadedWork={uploadedWorks} />
        )}
        {!uploadedWorks.collectModule.isRevertCollect &&
          !uploadedWorks.collectModule.isTimedFeeCollect &&
          !uploadedWorks.collectModule.isLimitedFeeCollect && (
            <ChargeQuestion setCollectType={setCollectType} uploadedWork={uploadedWorks} />
          )}
        {!uploadedWorks.collectModule.isFreeCollect &&
        !uploadedWorks.collectModule.isRevertCollect &&
        enabledCurrencies ? (
          <FeeCollectForm
            setCollectType={setCollectType}
            uploadedWork={uploadedWorks}
            enabledCurrencies={enabledCurrencies}
          />
        ) : (
          <div className="flex justify-end">
            <Button type="button" onClick={() => setShowCollectModuleModal(false)}>
              Set Collect Type
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
