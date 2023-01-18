import React from 'react';
import Login from '../Auth/Login';
import Search from './Search';
import type { FC } from 'react';
import NavItems from './NavItems';
import Post from '@components/Post';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Button } from '@components/UI/Button';
import ToggleDispatcher from './ToggleDispatcher';

const Header: FC = () => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80">
      <div className="container mx-auto">
        <div className="flex relative justify-between items-center h-14 sm:h-16">
          <div className="flex justify-between w-full gap-4 items-center">
            <NavItems />
            <div className="md:w-96">
              <Search />
            </div>
            <div className="flex justify-end md:w-96">
              <Login />
            </div>
          </div>
          {/* <Button onClick={() => router.push('/post')}>Upload</Button> */}
          {/* <ToggleDispatcher></ToggleDispatcher> */}
        </div>
        {/* <CategoryFilters /> */}
      </div>
    </div>
  );
};

export default Header;
