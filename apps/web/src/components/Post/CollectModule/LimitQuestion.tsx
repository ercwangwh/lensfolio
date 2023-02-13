import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import type { CollectModuleType, LensfolioWorks } from 'utils';

interface Props {
  uploadedWork: LensfolioWorks;
  setCollectType: (data: CollectModuleType) => void;
}

const LimitQuestion: FC<Props> = ({ uploadedWork, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to limit the collectables?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isLimitedFeeCollect: false,
              isLimitedTimeFeeCollect: false,
              isFeeCollect: false,
              isFreeCollect: uploadedWork.collectModule.isTimedFeeCollect ? false : true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-blue-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-blue-500': !uploadedWork.collectModule.isLimitedFeeCollect
            }
          )}
        >
          <span>Unlimited collects</span>
          {!uploadedWork.collectModule.isLimitedFeeCollect && <CheckIcon className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFeeCollect: true,
              isFreeCollect: false,
              isLimitedFeeCollect: true,
              isLimitedTimeFeeCollect: uploadedWork.collectModule.isTimedFeeCollect ? true : false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-blue-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-blue-500': uploadedWork.collectModule.isLimitedFeeCollect
            }
          )}
        >
          <span>Limited collect</span>
          {uploadedWork.collectModule.isLimitedFeeCollect && <CheckIcon className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

export default LimitQuestion;
