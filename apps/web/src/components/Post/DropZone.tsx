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
import { uploadFileToIPFS, uploadWorkCoverImgToIPFS } from '@lib/uploadToIPFS';

import { Input } from '@components/UI/Input';
import ProgressBar from '@components/UI/ProgressBar';
// interface Props {
//   attachments: LensfolioAttachment[];
//   setAttachments: Dispatch<LensfolioAttachment[]>;
// }

// const DropZone: FC<Props> = ({ attachments, setAttachments }) => {
const DropZone: FC = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  // setUploadedWorks()
  const [file, setFile] = useState<File | null>(null);
  const [upload, setUpload] = useState(false);
  const [percent, setPercent] = useState(0);
  const { dragOver, setDragOver, onDragOver, onDragLeave, fileDropError, setFileDropError } =
    useDragAndDrop();

  // useEffect(() => {
  //   console.log(uploadedWorks.percent);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [uploadedWorks.percent]);

  const percentCompleted = (percentNumber: number) => {
    setPercent(percentNumber);
    // setUploadedWorks({ percent: percentNumber });
    // console.log(percentNumber);
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
    // for (const file of files) {
    //   if (!ALLOWED_IMAGE_TYPES.includes(file?.type)) {
    //     const errorMessage = 'Image format not supported!';
    //     toast.error(errorMessage);
    //     return setFileDropError(errorMessage);
    //   }
    // }
    if (!ALLOWED_IMAGE_TYPES.includes(file?.type)) {
      const errorMessage = 'Image format not supported!';
      toast.error(errorMessage);
      return setFileDropError(errorMessage);
    }
    uploadImage(file);
  };

  return (
    <div>
      {/* <MetaTags title="Select Work" /> */}

      <div className="relative flex flex-col items-center justify-center flex-1 my-10 aspect-w-16 aspect-h-9">
        {file ? (
          <div>
            <img
              src={URL.createObjectURL(file)}
              draggable={false}
              className="object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full object-cover"
              alt="placeholder"
            />
            <ProgressBar completed={percent} />
          </div>
        ) : (
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

            <span className="space-y-10 md:space-y-14">
              <div className="text-2xl font-semibold md:text-4xl">
                <span>Drag and drop an image as thumbnail</span>
              </div>
              <div>
                <label
                  htmlFor="chooseImage"
                  className="px-8 py-4 text-lg text-white bg-blue-500 cursor-pointer rounded-full"
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
        )}

        {/* <button onClick={upload}></button> */}
        {/* <Input prefix={'Description'}></Input> */}
      </div>
    </div>
  );
};
export default DropZone;
