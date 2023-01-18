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
      <div className="2xl:py-6 py-4 ultrawide:max-w-[110rem] mx-auto md:px-3 ultrawide:px-0">
        <Toaster position="bottom-right" toastOptions={getToastOptions(resolvedTheme)} />
        {children}
      </div>
    </div>
  );
};

export default Layout;
