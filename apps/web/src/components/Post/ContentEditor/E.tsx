import { useRef, useEffect } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';
import { ImageConfig } from '@editorjs/image';
import { ToolbarInline } from '@editorjs/editorjs';

const EDITOR_JS_IMAGE_TOOL = 'image';
const EDITOR_JS_HEADER_TOOL = 'header';

const defaultBlocks = [
  {
    type: EDITOR_JS_IMAGE_TOOL,
    data: {
      url: 'https://picsum.photos/800/400',
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

const initEditor = (editorRef) => {
  const editor = new EditorJS({
    holder: editorRef.current,
    autofocus: true,
    tools: {
      header: {
        class: Header,
        config: {
          placeholder: 'Enter a header',
          levels: [1, 2, 3, 4],
          defaultLevel: 2
        }
      },
      image: {
        class: ImageTool,
        config: {
          endpoints: {
            byFile: 'http://localhost:8008/uploadFile', // 文件上传接口地址
            byUrl: 'http://localhost:8008/fetchUrl' // 网络图片拉取接口地址
          },
          field: 'image',
          additionalRequestData: {
            headers: {
              Authorization: 'Bearer your_token_here'
            }
          }
        } as ImageConfig // 强制类型转换
      }
    },
    inlineToolbar: {
      tools: {
        [EDITOR_JS_IMAGE_TOOL]: {
          class: ToolbarInline,
          config: {
            deleteButton: false
          }
        },
        [EDITOR_JS_HEADER_TOOL]: {
          class: ToolbarInline,
          config: {
            deleteButton: false
          }
        }
      }
    },
    initialBlock: defaultBlocks
  });

  return editor;
};

const Editor = () => {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = initEditor(editorRef);

    return () => {
      editor.isReady.then(() => {
        editor.destroy();
      });
    };
  }, []);

  return <div ref={editorRef} />;
};
