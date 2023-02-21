// import CheckOutline from '@components/Common/Icons/CheckOutline'
import { CheckIcon } from '@heroicons/react/24/outline';
import { Listbox, Transition } from '@headlessui/react';
import { useAppStore } from 'src/store/app';
import React, { Fragment } from 'react';
import { CREATOR_WORK_CATEGORIES } from 'utils/categories';

const Category = () => {
  const uploadedWorks = useAppStore((state) => state.uploadedWorks);
  const setUploadedWorks = useAppStore((state) => state.setUploadedWorks);

  return (
    <>
      <div className="mb-1 flex items-center space-x-1.5">
        <div className="text-[11px] font-semibold uppercase opacity-70">Category</div>
      </div>
      <Listbox
        value={uploadedWorks.workCategory}
        onChange={(category) => setUploadedWorks({ workCategory: category })}
      >
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full rounded-xl border border-gray-300 py-2.5 pl-4 pr-10 text-left focus:outline-none dark:border-gray-700 sm:text-sm">
            <span className="block truncate">{uploadedWorks.workCategory.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
              <CheckIcon className="h-3 w-3" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-[1] mt-1 max-h-52 w-full overflow-auto rounded-xl bg-white py-1 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-900 sm:text-sm">
              {CREATOR_WORK_CATEGORIES.map((category, categoryIdx) => (
                <Listbox.Option
                  key={categoryIdx}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-gray-100 dark:bg-gray-800' : ''
                    }`
                  }
                  value={category}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {category.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                          <CheckIcon className="h-3 w-3" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </>
  );
};

export default Category;
