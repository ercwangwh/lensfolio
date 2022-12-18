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

interface Props {
  attachments: LensfolioAttachment[];
  setAttachments: Dispatch<LensfolioAttachment[]>;
}
// import logger from 'utils/logger';
const DropZone: FC<Props> = ({ attachments, setAttachments }) => {
  //   const setUploadedVideo = useAppStore((state) => state.setUploadedVideo);
  const [files, setFiles] = useState<File[]>([]);
  const { dragOver, setDragOver, onDragOver, onDragLeave, fileDropError, setFileDropError } =
    useDragAndDrop();

  //   useEffect(() => {
  //     Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.UPLOAD.DROPZONE });
  //   }, []);

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
    for (const result of results) {
      console.log(result.item, result.type, result.altTag);
    }
    setAttachments(results);
    // }
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    validateFile(e?.dataTransfer?.files);
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

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateFile(e?.target?.files);
    // const files=e?.target?.files
    // if (e.target.files?.length) setFiles([...files]);
  };

  return (
    <div>
      {/* <MetaTags title="Select Video" /> */}

      <div className="relative flex flex-col items-center justify-center flex-1 my-20">
        <div>
          <span>Title</span>
          <input id="title"></input>
        </div>
        <div>
          <span>Description</span>
          <input id="description"></input>
        </div>

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
            'w-full p-10 md:p-20 md:w-2/3 focus:outline-none border-gray-500 grid place-items-center text-center border border-dashed rounded-3xl',
            { '!border-green-500': dragOver }
          )}
          htmlFor="dropVideo"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            type="file"
            className="hidden"
            onChange={onChooseFile}
            id="dropVideo"
            accept={ALLOWED_IMAGE_TYPES.join(',')}
          />
          <span className="flex justify-center mb-6 opacity-80">
            {/* <UploadOutline className="w-14 h-14" /> */}
          </span>
          <span className="space-y-10 md:space-y-14">
            <div className="text-2xl font-semibold md:text-4xl">
              <span>
                Drag and drop <br /> images to upload
              </span>
            </div>
            <div>
              <label
                htmlFor="chooseVideo"
                className="px-8 py-4 text-lg text-white bg-indigo-500 cursor-pointer rounded-full"
              >
                or choose images
                <input
                  id="chooseVideo"
                  onChange={onChooseFile}
                  type="file"
                  className="hidden"
                  accept={ALLOWED_IMAGE_TYPES.join(',')}
                  multiple
                />
              </label>
            </div>
            {fileDropError && <div className="font-medium text-red-500">{fileDropError}</div>}
          </span>
        </label>
        {/* <button onClick={upload}></button> */}
      </div>
    </div>
  );
};
export default DropZone;
