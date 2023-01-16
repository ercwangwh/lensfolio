import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
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
    <div>
      <Input
        prefix={'Description'}
        onChange={(evt) => {
          const data = evt.target.value;
          setTitle(data);
          setUploadedWorks({ description: data });
        }}
      ></Input>
      <div> {title}</div>
      <DropZone></DropZone>
      <Input
        prefix={'Content'}
        onChange={(evt) => {
          const data = evt.target.value;
          setUploadedWorks({ content: data });
          console.log(uploadedWorks);
        }}
      ></Input>
      <PostSetting></PostSetting>
    </div>
  );
};

export default EditArea;
