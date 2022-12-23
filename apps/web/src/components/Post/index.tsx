import React, { FC, useState } from 'react';
import DropZone from './DropZone';
import { Modal } from '@components/UI/Modal';
import { Button } from '@components/UI/Button';
import { BeakerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useAppStore } from 'src/store/app';
import UploadToLens from './UploadToLens';
import EditArea from './EditArea';
const Post: FC = () => {
  // const [showUploadModal, setUploadModal] = useState(false);
  // const useRouter()
  // const router = useRouter();
  // router.push('/post');
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  return (
    // <div>
    //   Post
    //   <button onClick={}></button>
    //   <DropZone />
    // </div>
    // <>
    //   <Modal
    //     title="Upload"
    //     icon={<BeakerIcon className="w-5 h-5 text-brand" />}
    //     show={showUploadModal}
    //     onClose={() => setUploadModal(false)}
    //   >
    //     {/* <DropZone attachments={attachments} setAttachments={setAttachments}/> */}
    //   </Modal>
    //   <Button
    //     icon={<img className="mr-0.5 w-4 h-4" height={16} width={16} />}
    //     onClick={() => {
    //       setUploadModal(!showUploadModal);
    //       // Leafwatch.track(USER.LOGIN);
    //     }}
    //   >
    //     Upload
    //   </Button>
    // </>
    // <NewPost></NewPost>
    uploadedWorks ? <UploadToLens /> : <EditArea uploadedWorks={uploadedWorks} />
  );
};

export default Post;
