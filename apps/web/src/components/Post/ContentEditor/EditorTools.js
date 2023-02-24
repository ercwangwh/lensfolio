//./components/EditorTools.js
// import Code from '@editorjs/code';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import Paragraph from '@editorjs/paragraph';
import AttachesTool from '@editorjs/attaches';
import { ALLOWED_ATTACHMENTS_TYPES, ALLOWED_IMAGE_TYPES } from 'utils';

// import uploadToIPFS from '@lib/uploadToIPFS';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';

import getIPFSLink from '@lib/getIPFSLink';

const EDITOR_JS_IMAGE_TOOL = 'image';
const EDITOR_JS_HEADER_TOOL = 'header';

export const EDITOR_TOOLS = {
  image: {
    class: ImageTool,
    config: {
      types: ALLOWED_IMAGE_TYPES.toString(),
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file) {
          // your own uploading logic here
          return uploadFileToIPFS(file).then((result) => {
            return {
              success: 1,
              file: {
                url: getIPFSLink(result.item)
                // any other image data you want to store, such as width, height, color, extension, etc
              }
            };
          });
        }
      }
    }
  },
  header: Header,
  paragraph: Paragraph,
  attaches: {
    class: AttachesTool,
    config: {
      /**
       * Custom uploader
       */
      types: ALLOWED_ATTACHMENTS_TYPES.toString(),
      uploader: {
        /**
         * Upload file to the server and return an uploaded image data
         * @param {File} file - file selected from the device or pasted by drag-n-drop
         * @return {Promise.<{success, file: {url}}>}
         */
        uploadByFile(file) {
          // your own uploading logic here
          return uploadFileToIPFS(file).then((result) => {
            return {
              success: 1,
              file: {
                url: getIPFSLink(result.item)
                // name: result.item,
                // extension: result.type
                // any data you want
                // for example: name, size, title
              }
            };
          });
        }
      }
    }
  }
};

export const DEFAULT_BLOCKS = [
  {
    type: EDITOR_JS_IMAGE_TOOL,
    data: {
      url: '',
      withBorder: false,
      withBackground: false,
      stretched: true
    }
  },
  {
    type: EDITOR_JS_HEADER_TOOL,
    data: {
      text: 'Header',
      level: 1
    }
  }
];

// export const INLINE_TOOLBAR_CONFIG=[EDITOR_JS_IMAGE_TOOL]: {
//   class: ToolbarInline,
//   config: {
//     deleteButton: false,
//   },
// },
// [EDITOR_JS_HEADER_TOOL]: {
//   class: ToolbarInline,
//   config: {
//     deleteButton: false,
//   },
// },
// },