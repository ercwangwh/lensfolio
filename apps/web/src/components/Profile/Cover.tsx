import imageProxy from '@lib/imageProxy';
import { COVER, STATIC_IMAGES_URL } from 'utils';
import type { FC } from 'react';

interface Props {
  cover: string;
}

const Cover: FC<Props> = ({ cover }) => {
  return (
    <div
      className="h-52 sm:h-80 rounded-lg"
      style={{
        backgroundImage: `url(${cover})`,
        // backgroundColor: '#3b82f6',
        // backgroundColor: '#3b82f6',
        backgroundSize: cover ? 'cover' : '30%',
        backgroundPosition: 'center center',
        backgroundRepeat: cover ? 'no-repeat' : 'repeat'
      }}
    />
  );
};

export default Cover;
