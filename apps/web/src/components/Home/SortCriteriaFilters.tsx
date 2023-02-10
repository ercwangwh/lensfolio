import React, { FC, useState } from 'react';
import DropMenu from '@components/UI/DropMenu';
import { Button } from '@components/UI/Button';
import { Menu } from '@headlessui/react';
import { PublicationSortCriteria } from 'lens';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export const SortCriteriaFilters: FC = () => {
  const [sort, setSort] = useState(PublicationSortCriteria.Latest);

  return (
    <DropMenu
      trigger={
        <Button
          className="flex-none"
          icon={<ChevronDownIcon className=" h-4 w-4" />}
          outline={true}
          size="lg"
        >
          {sort}
        </Button>
      }
      position="left"
    >
      <div className="px-1 mt-1.5 w-48 divide-y shadow max-h-96 divide-gray-200 dark:divide-gray-800 overflow-hidden border border-gray-100 dark:border-gray-800 bg-secondary">
        <div className="flex flex-col space-y-4 items-start p-2 transition duration-150 ease-in-out rounded-lg">
          {/* <div className="inline-flex items-center p-2 py-3 space-x-2 rounded-lg"> */}
          <div>Latest</div>
          <div>Top Comments</div>
          <div>Top Collects</div>
          {/* </div> */}
        </div>
      </div>
    </DropMenu>
  );
};
