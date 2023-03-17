import { Button } from '@components/UI/Button';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import MetaTags from '@components/Common/MetaTags';
import { LENSFOLIO_APP_NAME, STATIC_ASSETS } from 'utils';

export default function Custom404() {
  return (
    <>
      <MetaTags title={`404 • ${LENSFOLIO_APP_NAME}`} />
      <div className="flex flex-col items-center justify-start h-full mt-10 md:mt-20">
        {/* <img src="/logo.svg" alt={LENSFOLIO_APP_NAME} draggable={false} height={50} width={50} /> */}
        <div className="py-10 text-center">
          <h1 className="mb-4 text-3xl font-bold">404</h1>
          <div className="mb-6">This page could not be found.</div>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    </>
  );
}
