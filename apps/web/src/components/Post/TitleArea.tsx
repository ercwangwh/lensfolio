// import UploadOutline from '@components/Common/Icons/UploadOutline'
// import MetaTags from '@components/Common/MetaTags'
// const FormData = require('form-data')
import { CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { useAppStore } from 'src/store/app';
import clsx from 'clsx';
// import fileReaderStream from 'filereader-stream'
import React, { useEffect, useState, Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { ALLOWED_IMAGE_TYPES, LensfolioAttachment } from 'utils';
import useDragAndDrop from 'utils/hooks/useDragAndDrop';
import uploadToIPFS from '@lib/uploadToIPFS';
import { uploadFileToIPFS, uploadWorkCoverImgToIPFS } from '@lib/uploadToIPFS';

import { Input } from '@components/UI/Input';
import ProgressBar from '@components/UI/ProgressBar';
import { Button } from '@components/UI/Button';
import { LENSFOLIO_WORK_COVER_IMG_DEFAULT } from 'src/store/app';
import { Loader } from '@components/UI/Loader';
import TextareaAutosize from 'react-textarea-autosize';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, { message: 'Title should be atleast 5 characters' })
    .max(100, { message: 'Title should not exceed 100 characters' }),
  content: z.string().trim().max(5000, { message: 'Content should not exceed 5000 characters' }),
  isSensitiveContent: z.boolean()
});

export type WorkFormData = z.infer<typeof formSchema>;

// const DropZone: FC<Props> = ({ attachments, setAttachments }) => {
const TitleArea: FC = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);

  // setUploadedWorks()
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);
  const [percent, setPercent] = useState(0);
  const { dragOver, setDragOver, onDragOver, onDragLeave, fileDropError, setFileDropError } =
    useDragAndDrop();

  const {
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    watch,
    clearErrors
  } = useForm<WorkFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: uploadedWorks.title
    }
  });
  // useEffect(() => {
  //   console.log(uploadedWorks.percent);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [uploadedWorks.percent]);

  const percentCompleted = (percentNumber: number) => {
    setPercent(percentNumber);
  };

  const uploadImage = async (file: File) => {
    // try {

    setUpload(true);
    setFile(file);
    // const results = await uploadToIPFS(files);
    const result = await uploadWorkCoverImgToIPFS(file, percentCompleted);
    console.log('Image Cover result', result);
    setUpload(false);
    // for (const result of results) {
    //   setUploadedWorks({ attachment: result });
    //   console.log(result.item, result.type, result.altTag);
    // }
    setUploadedWorks({ coverImg: result });
    // setUploadedWorks( {coverImg});
    console.log(result.item, result.type, result.altTag);
    // setAttachments(results);
    // }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    // validateFile(e?.dataTransfer?.files);
    if (e?.dataTransfer?.files?.length === 1) validateFile(e?.dataTransfer?.files[0]);
    else toast.error('Only 1 image as cover image');
  };

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length === 1) validateFile(e?.target?.files[0]);
    else toast.error('Only 1 image as cover image');
    // const files=e?.target?.files
    // if (e.target.files?.length) setFiles([...files]);
  };

  const validateFile = (file: File) => {
    if (!ALLOWED_IMAGE_TYPES.includes(file?.type)) {
      const errorMessage = 'Image format not supported!';
      toast.error(errorMessage);
      return setFileDropError(errorMessage);
    }
    uploadImage(file);
  };

  const handleDelete = () => {
    setFile(null);
    setPercent(0);
    setUploadedWorks({ coverImg: LENSFOLIO_WORK_COVER_IMG_DEFAULT });
  };

  return (
    <>
      {/* <MetaTags title="Select Work" /> */}

      <div className="relative flex flex-col items-center justify-center flex-1 ">
        {file ? (
          <div className="w-full">
            <div className="aspect-w-2 aspect-h-1">
              <img
                src={URL.createObjectURL(file)}
                draggable={false}
                className="object-cover bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full"
                alt="placeholder"
              />
            </div>
            <Button
              light={true}
              className="text-black text-xl"
              style={{ position: 'absolute', top: 5, right: 5 }}
              disabled={upload}
              onClick={handleDelete}
            >
              {upload ? <Loader /> : 'X'}
            </Button>
            {percent ? <ProgressBar completed={percent} /> : null}
          </div>
        ) : (
          <label
            className={clsx(
              'focus:outline-none border-gray-500 bg-gray-100 grid place-items-center text-center rounded-xl cursor-pointer',
              { '!border-green-500': dragOver }
            )}
            htmlFor="dropImage"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          >
            <input
              type="file"
              className="hidden"
              onChange={onChooseFile}
              id="dropImage"
              accept={ALLOWED_IMAGE_TYPES.join(',')}
            />

            <span className="space-y-10 md:space-y-14">
              <div className="flex flex-row space-x-3 p-3 text-sm items-center font-semibold md:text-lg text-gray-500">
                <CloudArrowUpIcon className="w-8 h8 text-gray-500" />
                <span>Choose or drag and drop a cover image</span>
              </div>
              {fileDropError && <div className="font-medium text-red-500">{fileDropError}</div>}
            </span>
          </label>
        )}
      </div>
      <div className={clsx(!file ? 'aspect-2' : null, 'w-full flex flex-col items-center justify-center')}>
        <TextareaAutosize
          className={clsx(
            watch('title')?.length > 100 ? 'text-red-500' : 'text-blue-500',
            'box-border text-blue-500 w-full px-2 text-5xl text-center font-medium no-scrollbar placeholder-gray-500 focus:outline-none resize-none'
          )}
          placeholder="Give it a title"
          onChange={(evt) => {
            const value = evt.target.value;
            console.log(value);
            setValue('title', value);
            setUploadedWorks({ title: value });
            clearErrors('title');
          }}
          value={watch('title')}
        ></TextareaAutosize>

        <div className="mt-1 px-3 flex flex-row self-end items-center ">
          <span
            className={clsx('text-[10px] opacity-50', {
              'text-red-500 !opacity-100': watch('title')?.length > 100
            })}
          >
            {watch('title')?.length}/100
          </span>
        </div>
      </div>
    </>
  );
};
export default TitleArea;
