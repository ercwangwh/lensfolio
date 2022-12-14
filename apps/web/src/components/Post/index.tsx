import React, { FC, useState } from 'react';
import DropZone from './DropZone';
import { Modal } from '@components/UI/Modal';
import { Button } from '@components/UI/Button';
import { BeakerIcon } from '@heroicons/react/24/outline';
const Post: FC = () => {
  const [showUploadModal, setUploadModal] = useState(false);
  return (
    // <div>
    //   Post
    //   <button onClick={}></button>
    //   <DropZone />
    // </div>
    <>
      <Modal
        title="Upload"
        icon={<BeakerIcon className="w-5 h-5 text-brand" />}
        show={showUploadModal}
        onClose={() => setUploadModal(false)}
      >
        <DropZone />
      </Modal>
      <Button
        icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} />}
        onClick={() => {
          setUploadModal(!showUploadModal);
          // Leafwatch.track(USER.LOGIN);
        }}
      >
        Upload
      </Button>
    </>
  );
};

export default Post;
