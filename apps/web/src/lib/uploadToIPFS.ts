import { S3 } from '@aws-sdk/client-s3';
import type { LensfolioAttachment, LensfolioPublication, LensfolioWorkCoverImg } from 'utils';
import axios from 'axios';
import { EVER_API, S3_BUCKET, SERVERLESS_URL } from 'utils';
import { v4 as uuid } from 'uuid';
import type { PublicationMetadataV2Input } from 'lens';
// import { Upload } from '@aws-sdk/lib-storage';
import { XhrHttpHandler } from '@aws-sdk/xhr-http-handler';
import { Upload } from '@aws-sdk/lib-storage';
// import { Policies } from '@apollo/client/cache';

const getS3Client = async () => {
  const token = await axios.get(`${SERVERLESS_URL}/sts/token`);
  const client = new S3({
    endpoint: EVER_API,
    credentials: {
      accessKeyId: token.data?.accessKeyId,
      secretAccessKey: token.data?.secretAccessKey,
      sessionToken: token.data?.sessionToken
    },
    region: 'us-west-2',
    maxAttempts: 3,
    requestHandler: new XhrHttpHandler({})
  });

  return client;
};

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadContentToIPFS = async (data: any): Promise<LensfolioAttachment> => {
  try {
    const client = await getS3Client();
    const params = {
      Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
      Key: uuid()
    };
    const payload = JSON.stringify(data);
    console.log(payload);
    await client.putObject({ ...params, Body: payload, ContentType: 'application/json' });
    const result = await client.headObject(params);
    const meta = result.Metadata;

    return {
      item: `ipfs://${meta?.['ipfs-hash']}`,
      type: 'application/json',
      altTag: ''
    };
  } catch {
    return { item: '', type: '', altTag: '' };
  }
};

/**
 *
 * @param metadata - PublicationMetadataV2Input
 * @returns attachment or null
 */
export const uploadMetadataToIPFS = async (
  metadata: PublicationMetadataV2Input
): Promise<LensfolioAttachment> => {
  try {
    const client = await getS3Client();
    const params = {
      Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
      Key: uuid()
    };
    const payload = JSON.stringify(metadata);
    console.log(payload);
    await client.putObject({ ...params, Body: payload, ContentType: 'application/json' });
    const result = await client.headObject(params);
    const meta = result.Metadata;

    return {
      item: `ipfs://${meta?.['ipfs-hash']}`,
      type: 'application/json',
      altTag: ''
    };
  } catch {
    return { item: '', type: '', altTag: '' };
  }
};

/**
 *
 * @param file - Attachment
 * @param onProgress - percentage completed func
 * @returns attachment or null
 */
export const uploadFileToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<LensfolioAttachment> => {
  // const { url, type } = await everland(file, onProgress)
  try {
    const client = await getS3Client();
    // const fileKey = uuid();
    const params = {
      Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
      Key: uuid(),
      Body: file,
      ContentType: file.type
    };
    const task = new Upload({
      client,
      queueSize: 3,
      params
    });
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded ?? 0;
      const total = e.total ?? 0;
      const progress = (loaded / total) * 100;
      console.log(Math.round(progress));
      onProgress?.(Math.round(progress));
    });
    await task.done();
    const result = await client.headObject(params);
    const metadata = result.Metadata;
    return {
      item: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type,
      altTag: ''
    };
  } catch (error) {
    // logger.error('[Error IPFS3 Media Upload]', error);
    return {
      item: '',
      type: file.type,
      altTag: ''
    };
  }
};

/**
 *
 * @param file - Attachment
 * @param onProgress - percentage completed func
 * @returns attachment or null
 */
export const uploadWorkCoverImgToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<LensfolioWorkCoverImg> => {
  // const { url, type } = await everland(file, onProgress)
  try {
    const client = await getS3Client();
    // const fileKey = uuid();
    const params = {
      Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
      Key: uuid(),
      Body: file,
      ContentType: file.type
    };
    const task = new Upload({
      client,
      queueSize: 3,
      params
    });
    task.on('httpUploadProgress', (e) => {
      const loaded = e.loaded ?? 0;
      const total = e.total ?? 0;
      const progress = (loaded / total) * 100;
      console.log(Math.round(progress));
      onProgress?.(Math.round(progress));
    });
    await task.done();
    const result = await client.headObject(params);
    const metadata = result.Metadata;
    return {
      item: `ipfs://${metadata?.['ipfs-hash']}`,
      type: file.type,
      altTag: ''
    };
  } catch (error) {
    // logger.error('[Error IPFS3 Media Upload]', error);
    return {
      item: '',
      type: file.type,
      altTag: ''
    };
  }
};

export default uploadContentToIPFS;
