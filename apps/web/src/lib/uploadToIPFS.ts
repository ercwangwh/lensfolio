import axios from 'axios';
import FormData from 'form-data';
import { ERROR_MESSAGE, SERVERLESS_URL } from 'utils';
import toast from 'react-hot-toast';

/**
 *
 * @param data - Data to upload to ipfs
 * @returns ipfs transaction id
 */
const uploadToIPFS = async (data: any): Promise<string> => {
  try {
    const formData = new FormData();
    const files = Array.from(data);
    formData.append('files', files);

    // const uris = Promise.all(
    //   files.map(async (file: any, index: number) => {
    //     const uri = await uploadToIPFS(file);
    //     // return uri;
    //   })
    // );
    // console.log(uris);
    console.log(formData);
    // console.log(formData.getHeaders());
    const upload = await axios(`${SERVERLESS_URL}/api/uploadFiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    });
    const { uri } = upload.data;
    // const  = upload.data;
    return uri;
  } catch {
    toast.error(ERROR_MESSAGE);
    throw new Error(ERROR_MESSAGE);
  }
};

export default uploadToIPFS;
