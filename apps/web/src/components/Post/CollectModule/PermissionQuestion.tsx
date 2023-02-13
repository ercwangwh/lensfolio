import { CheckIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import type { FC } from 'react';
import React from 'react';
import type { CollectModuleType, LensfolioWorks } from 'utils';

interface Props {
  uploadedWork: LensfolioWorks;
  setCollectType: (data: CollectModuleType) => void;
}

const PermissionQuestion: FC<Props> = ({ uploadedWork, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Who can collect this video?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFreeCollect: true,
              isRevertCollect: false,
              isFeeCollect: false,
              followerOnlyCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-blue-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-blue-500':
                !uploadedWork.collectModule.followerOnlyCollect && !uploadedWork.collectModule.isRevertCollect
            }
          )}
        >
          <span>Anyone</span>
          {!uploadedWork.collectModule.followerOnlyCollect && !uploadedWork.collectModule.isRevertCollect && (
            <CheckIcon className="w-3 h-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              followerOnlyCollect: true,
              isRevertCollect: false,
              isFreeCollect: true,
              isFeeCollect: false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-300 hover:!border-blue-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-blue-500':
                uploadedWork.collectModule.followerOnlyCollect && !uploadedWork.collectModule.isRevertCollect
            }
          )}
        >
          <span>Followers</span>
          {uploadedWork.collectModule.followerOnlyCollect && !uploadedWork.collectModule.isRevertCollect && (
            <CheckIcon className="w-3 h-3" />
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isRevertCollect: true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-1 text-sm border border-gray-300 hover:!border-blue-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-blue-500': uploadedWork.collectModule.isRevertCollect
            }
          )}
        >
          <span>None</span>
          {uploadedWork.collectModule.isRevertCollect && <CheckIcon className="w-3 h-3" />}
        </button>
      </div>
    </div>
  );
};

export default PermissionQuestion;
