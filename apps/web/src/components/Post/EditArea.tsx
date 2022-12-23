import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import { FC, ReactNode, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { LensfolioWorks } from 'utils';
import DropZone from './DropZone';

interface Props {
  // onUpload: (data: VideoFormData) => void;
  // onCancel: () => void;
  uploadedWorks: LensfolioWorks | null;
}

const EditArea: FC<Props> = ({ uploadedWorks }) => {
  // const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  // const [title, setTitle] = useState<string>();
  uploadedWorks?.title;
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
  return (
    <div>
      <Input
        prefix={'Title'}
        onChange={(title) => {
          // setUploadedWorks({title:title as string});
        }}
      >
        {uploadedWorks?.title}
      </Input>
      <DropZone></DropZone>
      <Input prefix={'Description'}>{uploadedWorks?.description}</Input>
      <Button>Continue</Button>
    </div>
  );
};

export default EditArea;
