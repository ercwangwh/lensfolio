import React, { FC } from 'react';
import clsx from 'clsx';

interface Props {
  completed: number;
  // bgColor?: string;
}

const ProgressBar: FC<Props> = ({ completed }) => {
  // const { bgcolor, completed } = props;
  return (
    <div className="w-full bg-gray-200 ">
      <div
        className={'bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none '}
        style={{ width: `${completed}%` }}
      >
        <span>{`${completed}%`}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
