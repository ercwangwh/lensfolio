// import UploadOutline from '@components/Common/Icons/UploadOutline'
// import MetaTags from '@components/Common/MetaTags'
// const FormData = require('form-data')
import { useAppStore } from 'src/store/app';
import clsx from 'clsx';
// import fileReaderStream from 'filereader-stream'
import React, { useEffect, useState, Dispatch, FC } from 'react';
import toast from 'react-hot-toast';
import { ALLOWED_IMAGE_TYPES, LensfolioAttachment } from 'utils';
import useDragAndDrop from 'utils/hooks/useDragAndDrop';
import uploadToIPFS from '@lib/uploadToIPFS';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';

import { Input } from '@components/UI/Input';

// interface Props {
//   attachments: LensfolioAttachment[];
//   setAttachments: Dispatch<LensfolioAttachment[]>;
// }

// const DropZone: FC<Props> = ({ attachments, setAttachments }) => {
const DropZone: FC = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  // setUploadedWorks()
  const [files, setFiles] = useState<File[]>([]);
  const [percent, setPercent] = useState(0);
  const { dragOver, setDragOver, onDragOver, onDragLeave, fileDropError, setFileDropError } =
    useDragAndDrop();

  useEffect(() => {
    console.log(uploadedWorks.percent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedWorks.percent]);

  const percentCompleted = (percentNumber: number) => {
    setUploadedWorks({ percent: percentNumber });
    // console.log(percentNumber);
  };
  const uploadImage = async (files: any) => {
    // try {
    //   if (file) {
    //     const preview = URL.createObjectURL(file);
    //     setUploadedVideo({
    //       stream: fileReaderStream(file),
    //       preview,
    //       videoType: file?.type || 'video/mp4',
    //       file
    //     });
    //   }
    // } catch (error) {
    //   toast.error('Error uploading file');
    //   logger.error('[Error Upload Video]', error);

    setFiles(files);
    const results = await uploadToIPFS(files);
    const fileresult = await uploadFileToIPFS(files[0], percentCompleted);
    console.log('File result', fileresult);
    for (const result of results) {
      setUploadedWorks({ attachment: result });
      console.log(result.item, result.type, result.altTag);
    }
    // setAttachments(results);
    // }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    validateFile(e?.dataTransfer?.files);
  };

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateFile(e?.target?.files);
    // const files=e?.target?.files
    // if (e.target.files?.length) setFiles([...files]);
  };

  const validateFile = (files: any) => {
    for (const file of files) {
      if (!ALLOWED_IMAGE_TYPES.includes(file?.type)) {
        const errorMessage = 'Image format not supported!';
        toast.error(errorMessage);
        return setFileDropError(errorMessage);
      }
    }
    uploadImage(files);
  };

  return (
    <div>
      {/* <MetaTags title="Select Video" /> */}

      <div className="relative flex flex-col items-center justify-center flex-1 my-10">
        {/* <Input prefix={'Title'}></Input> */}
        {Array.from(files).map((file, index) => {
          return (
            // <input type="file">
            //   input
            <img key={index} src={URL.createObjectURL(file)} alt="placeholder" />
            // </input>
          );
        })}

        <label
          className={clsx(
            'w-full p-10 md:p-20 focus:outline-none border-gray-500 grid place-items-center text-center border border-dashed rounded-3xl',
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
          <span className="flex justify-center mb-6 opacity-80">
            {/* <UploadOutline className="w-14 h-14" /> */}
            {uploadedWorks.percent}
          </span>
          <span className="space-y-10 md:space-y-14">
            <div className="text-2xl font-semibold md:text-4xl">
              <span>Drag and drop an image to upload</span>
            </div>
            <div>
              <label
                htmlFor="chooseImage"
                className="px-8 py-4 text-lg text-white bg-indigo-500 cursor-pointer rounded-full"
              >
                or choose an image
                <input
                  id="chooseImage"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                />
              </label>
            </div>
            {fileDropError && <div className="font-medium text-red-500">{fileDropError}</div>}
          </span>
        </label>
        {/* <button onClick={upload}></button> */}
        {/* <Input prefix={'Description'}></Input> */}
      </div>
    </div>
  );
};
export default DropZone;
