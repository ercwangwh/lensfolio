import React, { memo, useEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { EDITOR_TOOLS, DEFAULT_BLOCKS } from './EditorTools';
//props
type Props = {
  data?: OutputData;
  onChange(val: OutputData): void;
  holder: string;
};
const Editor = ({ data, onChange, holder }: Props) => {
  //add a reference to editor
  const ref = useRef<EditorJS>();
  //initialize editorjs
  useEffect(() => {
    //initialize editor if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: holder,
        tools: EDITOR_TOOLS,
        data: { blocks: DEFAULT_BLOCKS },
        async onChange(api, event) {
          const data = await api.saver.save();
          onChange(data);
        },
        autofocus: true
      });
      ref.current = editor;
    }
    //add a return function handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <div className=" prose max-w-full " id={holder} />;
};

export default memo(Editor);
