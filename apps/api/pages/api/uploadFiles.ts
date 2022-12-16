import { ThirdwebStorage } from '@thirdweb-dev/storage';
import { ERROR_MESSAGE } from 'utils';

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

// type Data = {
//   name: string;
// };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Invalid method!' });
  }

  if (!req.body) {
    return res.status(400).json({ success: false, message: 'Bad request!' });
  }

  const payload = JSON.stringify(req.body);
  console.log(req.body);
  try {
    // Create a default storage class without any configuration
    const storage = new ThirdwebStorage();
    // Upload any file or JSON object
    const uri = await storage.upload(payload);
    return res.status(200).json({ success: true, uri: uri });
  } catch (error) {
    return res.status(500).json({ success: false, message: ERROR_MESSAGE });
  }

  // const result = await storage.download(uri);
}
