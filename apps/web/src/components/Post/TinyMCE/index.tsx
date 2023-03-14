import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { uploadFileToIPFS } from '@lib/uploadToIPFS';
import getIPFSLink from '@lib/getIPFSLink';

import { useAppStore } from 'src/store/app';
import { Loader } from '@components/UI/Loader';

// import type UploadHandler from
// type MyUploadHandler = (blobInfo: any, progress: (v: number) => void) => void;

// type UploadHandler = (blobInfo: BlobInfo, progress: ProgressFn) => Promise<string>;
const apiKey = process.env.TINYMCE_API_KEY as string;

export default function App() {
  // const editorRef = useRef<Editor | null>(null);
  const [loading, setLoading] = useState(true);
  // const [editor, setEditor] = useState(null);
  // const [content, setContent] = useState('');
  // App store
  // const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);
  const handleEditorChange = (content: string, editor: any) => {
    setUploadedWorks({ content: content });
  };
  // const { mounted } = useIsMounted();
  // BlobInfo 转 File
  function blobInfoToFile(blobInfo: any): File {
    const blob = blobInfo.blob();
    return new File([blob], blobInfo.filename(), { type: blob.type });
  }

  console.log(apiKey);
  return (
    <>
      {loading && <Loader />}
      <Editor
        apiKey={apiKey}
        // initialValue="<p>This is the initial content of the editor.</p>"
        onInit={(evt, editor) => {
          // setEditor(editor);
          setLoading(false);
        }}
        init={{
          // auto_focus: true,
          plugins: ['quickbars', 'autolink', 'link', 'lists', 'emoticons', 'code', 'image'],
          placeholder: 'This is the initial content of the editor. Please type in your own content.',
          toolbar: false,
          menubar: false,
          inline: true,
          content_css: '/tinymce.css',
          quickbars_insert_toolbar: 'h2 h3 image',
          file_picker_types: 'image',
          quickbars_selection_toolbar:
            'bold italic underline | emoticons h2 h3 | blockquote quicklink |alignleft aligncenter alignright alignjustify code',
          images_reuse_filename: true,
          image_caption: true,
          images_upload_handler: (blobInfo, progress) =>
            new Promise<string>(async (resolve, reject) => {
              const file = blobInfoToFile(blobInfo);
              if (file.size / 1024 / 1024 > 2) {
                reject('Image max size is 2MB');
              }
              const result = await uploadFileToIPFS(file);
              if (!result.item) {
                reject('Upload failed');
              }
              resolve(getIPFSLink(result.item));
            })
        }}
        onEditorChange={handleEditorChange}
      />
    </>
  );
}
