import clsx from 'clsx';
import type { FC } from 'react';

// interface Props {
//   showFollow?: boolean;
//   isBig?: boolean;
// }

const WorkDetailShimmer: FC = () => {
  return (
    <div className="w-full rounded-md ">
      <div className="flex flex-col animate-pulse">
        <div className=" bg-gray-300 aspect-w-16 aspect-h-9 dark:border-gray-900 dark:bg-gray-700" />
        <div className="flex-1 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="h-3 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-3 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="h-3 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6"></div>
    </div>
  );
};

export default WorkDetailShimmer;
