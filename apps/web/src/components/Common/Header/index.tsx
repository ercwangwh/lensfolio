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
      <div className="flex relative justify-between items-center h-14 sm:h-16">
        <div className="flex justify-start items-center">
          <Search />
          <NavItems />
        </div>
        <Button onClick={() => router.push('/post')}>Upload</Button>
        <ToggleDispatcher></ToggleDispatcher>
        <Login />
      </div>
    </div>
  );
};

export default Header;
