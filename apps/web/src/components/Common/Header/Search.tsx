import React from 'react';
import { Button } from '@components/UI/Button';
import { Input } from '@components/UI/Input';
import type { FC } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Search: FC = () => {
  return (
    <div className="relative">
      <div className="relative w-full overflow-hidden border border-gray-200 cursor-default dark:border-gray-700 rounded-full sm:text-sm">
        <input
          className="w-full py-2 pl-4 pr-10 text-sm bg-transparent focus:outline-none"
          // onChange={(event) => setKeyword(event.target.value)}
          placeholder="Search by profile / hashtag"
          // value={keyword}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default Search;
