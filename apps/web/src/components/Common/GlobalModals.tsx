import { Modal } from '@components/UI/Modal';
// import { ArrowCircleRightIcon, EmojiHappyIcon, ShieldCheckIcon } from '@heroicons/react/outline';
import type { FC } from 'react';
// import { useAuthStore } from 'src/store/auth';
import { useGlobalModalStateStore } from 'src/store/modals';

import SwitchProfile from './Auth/SwitchProfile';
import Work from '@components/Work';

import { CollectSettingDetail } from '@components/Post/CollectModule/CollectSettingDetail';
import { ReferenceSettingDetail } from '@components/Post/ReferenceModule/ReferenceSettingDetail';

const GlobalModals: FC = () => {
  // Report modal state

  const showProfileSwitchModal = useGlobalModalStateStore((state) => state.showProfileSwitchModal);
  const setShowProfileSwitchModal = useGlobalModalStateStore((state) => state.setShowProfileSwitchModal);
  const showWorkDetailModal = useGlobalModalStateStore((state) => state.showWorkDetailModal);
  const setShowWorkDetailModal = useGlobalModalStateStore((state) => state.setShowWorkDetailModal);
  const showCollectModuleModal = useGlobalModalStateStore((state) => state.showCollectModuleModal);
  const setShowCollectModuleModal = useGlobalModalStateStore((state) => state.setShowCollectModuleModal);
  const showReferenceModuleModal = useGlobalModalStateStore((state) => state.showReferenceModuleModal);
  const setShowReferenceModuleModal = useGlobalModalStateStore((state) => state.setShowReferenceModuleModal);

  return (
    <>
      <Modal
        title={`Change Profile`}
        show={showProfileSwitchModal}
        onClose={() => setShowProfileSwitchModal(false)}
        size="lg"
      >
        <SwitchProfile />
      </Modal>
      <Modal
        title={`Work Detail`}
        show={showWorkDetailModal}
        onClose={() => setShowWorkDetailModal(false)}
        size="full"
      >
        <Work />
      </Modal>
      <Modal
        title={`Collect Setting`}
        show={showCollectModuleModal}
        onClose={() => setShowCollectModuleModal(false)}
        size="lg"
      >
        <CollectSettingDetail />
      </Modal>
      <Modal
        title={`Reference Setting`}
        show={showReferenceModuleModal}
        onClose={() => setShowReferenceModuleModal(false)}
        size="lg"
      >
        <ReferenceSettingDetail />
      </Modal>
    </>
  );
};

export default GlobalModals;
