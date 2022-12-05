import React from 'react';
import Login from '../Auth/Login';
import Search from './Search';
import type { FC } from 'react';
import NavItems from './NavItems';

const Header: FC = () => {
  return (
    <div className="sticky top-0 z-10 w-full bg-white border-b dark:bg-gray-900 dark:border-b-gray-700/80">
      <div className="flex relative justify-between items-center h-14 sm:h-16">
        <div className="flex justify-start items-center">
          <Search />
          <NavItems />
        </div>
        <Login />
      </div>
    </div>
  );
};

export default Header;
