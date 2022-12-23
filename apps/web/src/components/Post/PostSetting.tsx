import React, { useState } from 'react';
import { Modal } from '@components/UI/Modal';
import { Button } from '@components/UI/Button';
import UploadToLens from './UploadToLens';
function PostSetting() {
  const [showUploadModal, setUploadModal] = useState(false);
  return (
    <>
      <Modal
        title="Upload"
        // icon={<BeakerIcon className="w-5 h-5 text-brand" />}
        show={showUploadModal}
        onClose={() => setUploadModal(false)}
      >
        {/* <DropZone attachments={attachments} setAttachments={setAttachments} />
         */}
        <div>Collect Moduel</div>
        <div>Reference Moduel</div>
        <UploadToLens></UploadToLens>
        {/* <Button onClick={createPublication}>upload to ipfs</Button> */}
      </Modal>
    </>
  );
}

export default PostSetting;
