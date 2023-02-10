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
    setFile(file);
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
      <input
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_input_help"
        id="file_input"
        type="file"
        onChange={onChooseFile}
      />
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">
        ZIP or RAR (MAX. ~100MB).
      </p>
      <ProgressBar completed={percent} />
    </div>
  );
};
