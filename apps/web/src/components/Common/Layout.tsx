// import React, { ReactNode } from 'react';

import Header from './Header';
import type { FC, ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { getToastOptions } from 'utils/functions/getToastOptions';
import { useTheme } from 'next-themes';
interface Props {
  children: ReactNode;
}

const Layout: FC<Props> = ({ children }) => {
  const { resolvedTheme } = useTheme();
  return (
    <div>
      <Header />
      <Toaster position="bottom-right" toastOptions={getToastOptions(resolvedTheme)} />
      {children}
    </div>
  );
};

export default Layout;
