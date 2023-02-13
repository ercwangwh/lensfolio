import React from 'react';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@components/UI/Button';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import clsx from 'clsx';
import type { ReferenceModuleType } from 'utils';

export const ReferenceSettingDetail = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const setShowReferenceModuleModal = useGlobalModalStateStore((state) => state.setShowReferenceModuleModal);
  const setReferenceType = (data: ReferenceModuleType) => {
    setUploadedWorks({
      referenceModule: { ...uploadedWorks.collectModule, ...data }
    });
  };

  const onSelectReferenceDegree = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setReferenceType({
      followerOnlyReferenceModule: false,
      degreesOfSeparationReferenceModule: {
        commentsRestricted: true,
        mirrorsRestricted: true,
        degreesOfSeparation: Number(event.target.value)
      }
    });
  };
  return (
    <div className="p-5 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary rounded-2xl">
      <div className="mt-2 space-y-4">
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: false,
                degreesOfSeparationReferenceModule: null
              })
            }
            className={clsx(
              'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  !uploadedWorks.referenceModule?.followerOnlyReferenceModule &&
                  !uploadedWorks?.referenceModule?.degreesOfSeparationReferenceModule?.degreesOfSeparation
              }
            )}
          >
            <span>Anyone</span>
            {!uploadedWorks?.referenceModule?.followerOnlyReferenceModule &&
              !uploadedWorks?.referenceModule?.degreesOfSeparationReferenceModule?.degreesOfSeparation && (
                <CheckIcon className="w-3 h-3" />
              )}
          </button>
          <button
            type="button"
            onClick={() =>
              setReferenceType({
                followerOnlyReferenceModule: true,
                degreesOfSeparationReferenceModule: null
              })
            }
            className={clsx(
              'flex items-center text-left justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
              {
                '!border-indigo-500':
                  uploadedWorks.referenceModule?.followerOnlyReferenceModule &&
                  !uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule
              }
            )}
          >
            <span>Only my followers</span>
            {uploadedWorks.referenceModule?.followerOnlyReferenceModule &&
              !uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule && (
                <CheckIcon className="w-3 h-3 flex-none" />
              )}
          </button>
        </div>
        {/* <button
          type="button"
          onClick={() =>
            setReferenceType({
              followerOnlyReferenceModule: false,
              degreesOfSeparationReferenceModule: {
                commentsRestricted: true,
                mirrorsRestricted: true,
                degreesOfSeparation:
                  uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule?.degreesOfSeparation ?? 3
              }
            })
          }
          className={clsx(
            'flex items-center text-left justify-between w-full px-4 py-2 text-sm border border-gray-200 hover:!border-indigo-500 focus:outline-none dark:border-gray-800 rounded-xl',
            {
              '!border-indigo-500': uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule !== null
            }
          )}
        >
          <span className="max-w-[95%]">
            Only channels that I subscribed and their subscriptions, so on upto
            <select
              onChange={onSelectReferenceDegree}
              onClick={(e) => e.preventDefault()}
              value={
                uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule?.degreesOfSeparation ?? '3'
              }
              className="px-0.5 text-sm mx-1 border rounded dark:border-gray-800 focus:outline-none"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
            </select>
            degrees away from my network
          </span>
          {uploadedWorks.referenceModule?.degreesOfSeparationReferenceModule !== null && (
            <CheckIcon className="w-3 h-3 flex-none" />
          )}
        </button> */}
        <div className="flex justify-end">
          <Button type="button" onClick={() => setShowReferenceModuleModal(false)}>
            Set Preference
          </Button>
        </div>
      </div>
    </div>
  );
};
