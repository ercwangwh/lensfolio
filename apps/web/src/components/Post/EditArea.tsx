import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { TextArea } from '@components/UI/TextArea';
import { ChangeEvent, FC, ReactNode, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { LensfolioWorks } from 'utils';
import DropZone from './DropZone';
import PostSetting from './PostSetting';

// interface Props {
//   // onUpload: (data: VideoFormData) => void;
//   // onCancel: () => void;
//   uploadedWorks: LensfolioWorks | null;
// }

const EditArea: FC = () => {
  const [title, setTitle] = useState('');
  // uploadedWorks?.title;
  // setUploadedWorks()
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

  return (
    <div className="m-auto py-6">
      <div className="flex justify-between">
        <Button>Cancle</Button>
        <PostSetting></PostSetting>
      </div>
      <div>
        <h1 className="text-center font-bold my-6 text-2xl">What are you working on?</h1>
        <p className="text-center my-2 text-lg">
          Upload your work. This will also be used as the thumbnail in feeds
        </p>
        <div className="md:w-1/2 mx-auto mt-8">
          <TextArea
            prefix={'Description'}
            onChange={(evt) => {
              const data = evt.target.value;
              setTitle(data);
              setUploadedWorks({ description: data });
            }}
            placeholder="Your title"
            rows={1}
          ></TextArea>
          {/* <div> {title}</div> */}
          <DropZone></DropZone>
          <TextArea
            prefix={'Content'}
            onChange={(evt) => {
              const data = evt.target.value;
              setUploadedWorks({ content: data });
              console.log(uploadedWorks);
            }}
            placeholder="Your description of your design works"
            rows={5}
          ></TextArea>
        </div>
      </div>
    </div>
  );
};

export default EditArea;
