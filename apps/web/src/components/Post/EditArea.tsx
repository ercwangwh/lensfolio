import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { TextArea } from '@components/UI/TextArea';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { LensfolioWorks } from 'utils';
import TitleArea from './TitleArea';
import dynamic from 'next/dynamic';
import { Attachments } from './Attachments';
import CollectModule from './CollectModule';
import ReferenceModule from './ReferenceModule';
import UploadToLens from './UploadToLens';
import Category from './Category';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import PostSetting from './PostSetting';
import getAvatar from '@lib/getAvatar';
import clsx from 'clsx';
import { shortenAddress } from '@lib/shortenAddress';
import { OutputData } from '@editorjs/editorjs';
import { UserInfo } from './UserInfo';
import TextareaAutosize from 'react-textarea-autosize';
// import uploadToIPFS from '@lib/uploadToIPFS';
// interface Props {
//   // onUpload: (data: VideoFormData) => void;
//   // onCancel: () => void;
//   uploadedWorks: LensfolioWorks | null;
// }
// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(() => import('./ContentEditor/Editor'), {
  ssr: false
});

const EditArea: FC = () => {
  const [data, setData] = useState<OutputData>();
  // uploadedWorks?.title;
  // setUploadedWorks()
  const currentProfile = useAppStore((state) => state.currentProfile);
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  // setUploadedWorks({title:})
  // setUploadedWorks()
  //   const {
  //     handleSubmit,
  //     getValues,
  //     formState: { errors },
  //     setValue,
  //     watch,
  //     clearErrors
  //   } = useForm<VideoFormData>({
  //     resolver: zodResolver(formSchema),
  //     defaultValues: {
  //       isSensitiveContent: uploadedVideo.isSensitiveContent ?? false,
  //       title: uploadedVideo.title,
  //       description: uploadedVideo.description
  //     }
  //   });

  //   const onSubmitForm = (data: VideoFormData) => {
  //     onUpload(data);
  //   };
  // setUploadedWorks()
  // setUploadedWorks({ title: 'ddsf' });
  // setUploadedWorks({ description: title });
  // const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
  //   const data = evt.target.value;
  //   setTitle(data);
  //   // setUploadedWorks({ ...uploadedWorks });
  // };

  const onEditorDataChange = (data: OutputData) => {
    // onUpload(data);JSON.stringify()
    setUploadedWorks({ content: data });
  };

  return (
    <div className="m-auto">
      {/* <div className="flex justify-between">
        <Button>Cancle</Button>
        <PostSetting></PostSetting>
      </div> */}
      <div>
        <div className="flex flex-col space-y-6 md:w-1/2 mx-auto">
          <TitleArea />
          <UserInfo />
          <EditorBlock onChange={onEditorDataChange} holder="editorjs-container" />
          <UploadToLens />
        </div>
      </div>
    </div>
  );
};

export default EditArea;
