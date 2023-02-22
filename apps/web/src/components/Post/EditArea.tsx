import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { TextArea } from '@components/UI/TextArea';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { LensfolioWorks } from 'utils';
import DropZone from './DropZone';
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
// import uploadToIPFS from '@lib/uploadToIPFS';
// interface Props {
//   // onUpload: (data: VideoFormData) => void;
//   // onCancel: () => void;
//   uploadedWorks: LensfolioWorks | null;
// }
// important that we use dynamic loading here
// editorjs should only be rendered on the client side.
const EditorBlock = dynamic(() => import('./Editor/Editor'), {
  ssr: false
});

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  content: z.string().trim().max(5000, { message: 'Content should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean()
});

export type VideoFormData = z.infer<typeof formSchema>;

const EditArea: FC = () => {
  const [title, setTitle] = useState('');
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

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<VideoFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: uploadedWorks.title,
      content: uploadedWorks.content
    }
  });

  // const onSubmitForm = (data: VideoFormData) => {
  //   onUpload(data);
  // };

  return (
    <div className="m-auto">
      {/* <div className="flex justify-between">
        <Button>Cancle</Button>
        <PostSetting></PostSetting>
      </div> */}
      <div>
        {/* <h1 className="text-center font-bold my-6 text-2xl">What are you working on?</h1>
        <p className="text-center my-2 text-lg">Talk is cheap, show your works.</p> */}
        <div className="flex flex-col space-y-2 md:w-1/2 mx-auto">
          <DropZone />
          <div className="flex flex-row space-x-3 items-center">
            <img
              className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
              src={getAvatar(currentProfile, false)}
              alt="avatar picture"
              draggable={false}
            />
            <span className=" font-semibold">{currentProfile?.handle}</span>
            <span className=" bg-gray-200 p-1 rounded-full text-xs">
              {shortenAddress(currentProfile?.ownedBy)}
            </span>
          </div>
          <div className="relative">
            <TextArea
              // prefix={'Title'}
              className="border-none text-5xl resize-none"
              onChange={(evt) => {
                const value = evt.target.value;
                setValue('title', value);
                setUploadedWorks({ title: value });
                clearErrors('title');
              }}
              placeholder="Your title"
              value={watch('title')}
              rows={1}
            />
            <div className="absolute bottom-0 right-1 mt-1 flex items-center justify-end">
              <span
                className={clsx('text-[10px] opacity-50', {
                  'text-red-500 !opacity-100': watch('title')?.length > 100
                })}
              >
                {watch('title')?.length}/100
              </span>
            </div>
          </div>

          <TextArea
            // prefix={'Content'}
            onChange={(evt) => {
              const data = evt.target.value;
              setUploadedWorks({ content: data });
              // console.log(uploadedWorks);
            }}
            placeholder="Your content of your design works"
            rows={5}
          ></TextArea>
          <Attachments />
          <CollectModule />
          <ReferenceModule />
          <Category />
          <EditorBlock onChange={setData} holder="editorjs-container" />
          <UploadToLens />
        </div>
      </div>
    </div>
  );
};

export default EditArea;
