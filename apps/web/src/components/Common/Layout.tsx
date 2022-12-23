// import React, { ReactNode } from 'react';

import Header from './Header';
import type { FC, ReactNode } from 'react';
interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;
