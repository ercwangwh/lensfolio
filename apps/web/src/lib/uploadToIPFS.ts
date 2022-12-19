import { S3 } from '@aws-sdk/client-s3';
import type { LensfolioAttachment } from 'utils';
import axios from 'axios';
import { EVER_API, S3_BUCKET, SERVERLESS_URL } from 'utils';
import { v4 as uuid } from 'uuid';
import type { PublicationMetadataV2Input } from 'lens';
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
    maxAttempts: 3
  });

  return client;
};

/**
 *
 * @param data - Data to upload to IPFS
 * @returns attachment array
 */
const uploadToIPFS = async (data: any): Promise<LensfolioAttachment[]> => {
  try {
    const client = await getS3Client();
    const files = Array.from(data);
    const attachments = await Promise.all(
      files.map(async (_: any, i: number) => {
        const file = data.item(i);
        const params = {
          Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
          Key: uuid()
        };
        await client.putObject({ ...params, Body: file, ContentType: file.type });
        const result = await client.headObject(params);
        const metadata = result.Metadata;

        return {
          item: `ipfs://${metadata?.['ipfs-hash']}`,
          type: file.type || 'image/jpeg',
          altTag: ''
        };
      })
    );

    return attachments;
  } catch {
    return [];
  }
};

/**
 *
 * @param metadata - PublicationMetadataV2Input
 * @returns attachment or null
 */
export const uploadMetadataToIPFS = async (
  metadata: PublicationMetadataV2Input
): Promise<LensfolioAttachment | null> => {
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
    return null;
  }
};

// /**
//  *
//  * @param file - File object
//  * @returns attachment or null
//  */
// export const uploadMetadataToIPFS = async (
//   file: PublicationMetadataV2Input
// ): Promise<LensfolioAttachment | null> => {
//   try {
//     const client = await getS3Client();
//     const params = {
//       Bucket: S3_BUCKET.LENSFOLIO_MEDIA,
//       Key: uuid()
//     };
//     await client.putObject({ ...params, Body: file, ContentType: file.type });
//     const result = await client.headObject(params);
//     const metadata = result.Metadata;

//     return {
//       item: `ipfs://${metadata?.['ipfs-hash']}`,
//       type: file.type || 'image/jpeg',
//       altTag: ''
//     };
//   } catch {
//     return null;
//   }
// };

export default uploadToIPFS;
