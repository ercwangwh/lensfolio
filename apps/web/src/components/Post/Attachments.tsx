import React, { FC, useState } from 'react';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import { ALLOWED_ATTACHMENTS_TYPES } from 'utils';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import ProgressBar from '@components/UI/ProgressBar';

export const Attachments: FC = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const [file, setFile] = useState<File>();
  const [upload, setUpload] = useState(false);
  const [percent, setPercent] = useState(0);

  const onChooseFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) validateFile(e?.target?.files);
    // const files=e?.target?.files
    // if (e.target.files?.length) setFiles([...files]);
  };
  const validateFile = (file: any) => {
    // for (const file of files) {
    if (!ALLOWED_ATTACHMENTS_TYPES.includes(file[0].type)) {
      const errorMessage = `${file[0]?.type}Attachments format not supported!`;
      toast.error(errorMessage);
      // return setFileDropError(errorMessage);
    } else {
      uploadImage(file);
    }
    // }
  };

  const uploadImage = async (file: any) => {
    // try {

    setUpload(true);
    setFile(file[0]);
    // const results = await uploadToIPFS(files);
    const result = await uploadFileToIPFS(file[0], percentCompleted);
    console.log('File result', result);
    setUpload(false);
    // for (const result of results) {
    //   setUploadedWorks({ attachment: result });
    //   console.log(result.item, result.type, result.altTag);
    // }
    setUploadedWorks({ attachment: result });
    // setUploadedWorks( {coverImg});
    console.log(result.item, result.type, result.altTag);
    // setAttachments(results);
    // }
  };

  const percentCompleted = (percentNumber: number) => {
    setPercent(percentNumber);
    // setUploadedWorks({ percent: percentNumber });
    // console.log(percentNumber);
  };
  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">
        Upload Attachment
      </label>
      {/* <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={onChooseFile}
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
        ZIP or RAR (MAX. ~100MB).
      </p> */}

      <div className="flex w-full items-center justify-center bg-grey-lighter">
        <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-500 hover:text-white">
          <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">
            {`${uploadedWorks.attachment.item.length === 0 ? 'Select a file (ZIP OR RAR)' : file?.name}`}
          </span>
          <input id="file_input" type="file" className="hidden" onChange={onChooseFile} />
        </label>
      </div>

      <ProgressBar completed={percent} />
    </div>
  );
};
