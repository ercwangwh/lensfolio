import clsx from 'clsx';
import type { FC } from 'react';

// interface Props {
//   showFollow?: boolean;
//   isBig?: boolean;
// }

const UserHeaderShimmer: FC = () => {
  return (
    <div className="w-full rounded-md">
      <div className="flex flex-col md:space-x-4 animate-pulse">
        <div className="flex items-center p-2 space-x-4">
          <div className="w-10 h-10 bg-gray-300 border-4 dark:border-gray-900 rounded-xl md:w-16 md:h-16 dark:bg-gray-700" />
          <div className="flex-1 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="h-3.5 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
              <div className="h-3 col-span-2 bg-gray-300 rounded dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6"></div>
    </div>
  );
};

export default UserHeaderShimmer;
