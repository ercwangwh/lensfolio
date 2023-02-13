import { CheckIcon } from '@heroicons/react/24/outline';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import React from 'react';
import type { ReferenceModuleType } from 'utils';

const ReferenceModule = () => {
  // const [showModal, setShowModal] = useState(false);
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const setShowReferenceModuleModal = useGlobalModalStateStore((state) => state.setShowReferenceModuleModal);

  const getSelectedReferenceType = () => {
    const followerOnlyReferenceModule = uploadedWorks?.referenceModule?.followerOnlyReferenceModule;
    const degreesOfSeparationReferenceModule =
      uploadedWorks?.referenceModule?.degreesOfSeparationReferenceModule;
    if (!followerOnlyReferenceModule && !degreesOfSeparationReferenceModule) {
      return 'Anyone can comment and mirror';
    } else if (followerOnlyReferenceModule) {
      return 'Only my subscribers can comment and mirror';
    } else if (
      degreesOfSeparationReferenceModule &&
      degreesOfSeparationReferenceModule.degreesOfSeparation < 5
    ) {
      return `Channels subscribed upto ${degreesOfSeparationReferenceModule.degreesOfSeparation} degrees away from my network`;
    }
  };

  return (
    <div className="p-5 py-5 overflow-x-hidden text-left align-middle transition-all transform shadow-xl bg-secondary ">
      <div className="flex items-center mb-1 space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">Comments and Mirrors</div>
      </div>
      <button
        type="button"
        onClick={() => setShowReferenceModuleModal(true)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-left border border-gray-300 focus:outline-none dark:border-gray-700 rounded-xl"
      >
        <span>{getSelectedReferenceType()}</span>
        <CheckIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

export default ReferenceModule;
