import axios from 'axios';
import getIPFSLink from './getIPFSLink';
import edjsHTML from 'editorjs-html';

const getContent = async (hash: string): Promise<string[]> => {
  try {
    const contentURL = getIPFSLink(hash);
    const response = await axios.get(contentURL);
    const edjsParser = edjsHTML();
    const html = edjsParser.parse(response.data);
    // console.log('html', html);
    return html;
  } catch {
    // console.log('error');
    return [''];
  }
};

export default getContent;
