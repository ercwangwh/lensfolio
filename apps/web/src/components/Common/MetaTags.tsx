import { LENSFOLIO_APP_NAME, LENSFOLIO_APP_DESCRIPTION, LENSFOLIO_OG_IMAGE } from 'utils';
import Head from 'next/head';
import type { FC } from 'react';

interface Props {
  title?: string;
  description?: string;
}

const MetaTags: FC<Props> = ({ title = LENSFOLIO_APP_NAME, description = LENSFOLIO_APP_DESCRIPTION }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
      />

      <meta property="og:url" content="https://lenster.xyz" />
      <meta property="og:site_name" content={LENSFOLIO_APP_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={LENSFOLIO_OG_IMAGE} />
      <meta property="og:image:width" content="400" />
      <meta property="og:image:height" content="400" />

      <meta property="twitter:card" content="summary" />
      <meta property="twitter:site" content={LENSFOLIO_APP_NAME} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image:src" content={LENSFOLIO_OG_IMAGE} />
      <meta property="twitter:image:width" content="400" />
      <meta property="twitter:image:height" content="400" />
      <meta property="twitter:creator" content="ercwangwh" />
    </Head>
  );
};

export default MetaTags;
