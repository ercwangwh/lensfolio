import clsx from 'clsx';
import { ComponentProps, useState } from 'react';
import React, { forwardRef, useId, ForwardRefRenderFunction } from 'react';
// import TextareaAutosize from 'react-textarea-autosize';

interface Props extends ComponentProps<'textarea'> {
  label?: string;
  type?: string;
  className?: string;
  validationError?: string;
}

// interface TextareaTitleProps extends ComponentProps<'textarea'> {
//   maxRows?: number;
//   placeholder?: string;
//   onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
//   validationError?: string;
// }

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(function TextArea(
  { label, validationError, className = '', ...props },
  ref
) {
  const id = useId();

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">{label}</div>
        </div>
      )}
      <div className="flex">
        <textarea
          id={id}
          className={clsx(
            validationError?.length ? '!border-red-500' : 'without-focus-ring',
            'bg-white text-sm no-scrollbar px-2.5 py-2 rounded-xl dark:bg-gray-900 border border-gray-300 dark:border-gray-700 outline-none disabled:opacity-60 disabled:bg-gray-500 disabled:bg-opacity-20 w-full',
            className
          )}
          ref={ref}
          {...props}
        />
      </div>
      {validationError && <div className="mx-1 mt-1 text-xs font-medium text-red-500">{validationError}</div>}
    </label>
  );
});

// export const TextareaTitle = forwardRef<HTMLTextAreaElement, TextareaTitleProps>(
//   ({ maxRows, placeholder = 'Give it a title', onChange, validationError }, ref) => {
//     const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
//       const textarea = event.target as HTMLTextAreaElement;
//       const length = textarea.value.length;
//       console.log(length);
//       if (length >= 100) {
//         event.preventDefault();
//       }
//     };

//     return (
//       <div>
//         <TextareaAutosize
//           maxRows={maxRows}
//           className={clsx(
//             validationError?.length ? '!border-red-500' : 'without-focus-ring',
//             'block w-full text-blue-500 text-5xl font-medium no-scrollbar placeholder-gray-500 focus:outline-none resize-none'
//           )}
//           placeholder={placeholder}
//           onChange={onChange}
//           // onKeyDown={handleKeyDown}
//           ref={ref}
//         />
//         {validationError && (
//           <div className="mx-1 mt-1 text-xs font-medium text-red-500">{validationError}</div>
//         )}
//       </div>
//     );
//   }
// );
