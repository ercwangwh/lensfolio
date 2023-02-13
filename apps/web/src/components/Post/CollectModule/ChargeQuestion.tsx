import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import { CollectModuleType, LensfolioWorks } from 'utils';

interface Props {
  uploadedWork: LensfolioWorks;
  setCollectType: (data: CollectModuleType) => void;
}

const ChargeQuestion: FC<Props> = ({ uploadedWork, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to set collect price for this video?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: true,
              isFeeCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-blue-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-blue-500': uploadedWork.collectModule.isFreeCollect
            }
          )}
        >
          <span>Collect for Free</span>
          {uploadedWork.collectModule.isFreeCollect && <CheckIcon className="w-3 h-3" />}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: false,
              isFeeCollect: true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-blue-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-blue-500': uploadedWork.collectModule.isFeeCollect
            }
          )}
        >
          <span>Yes, Some Price</span>
          {uploadedWork.collectModule.isFeeCollect && <CheckIcon className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

export default ChargeQuestion;
