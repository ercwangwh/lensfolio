import React, { FC } from 'react';
import UserProfileShimmer from '@components/Common/Shimmer/UserProfileShimmer';
import UserPageShimmer from '@components/Common/Shimmer/UserPageShimmer';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { useUserProfilesQuery } from 'lens';
import { useAppStore } from 'src/store/app';
import getAvatar from '@lib/getAvatar';
import type { Publication } from 'lens';
import { Button } from '@components/UI/Button';
import getIPFSLink from '@lib/getIPFSLink';
import { IPFS_GATEWAY } from 'utils';

interface Props {
  work: Publication;
}

const WorkDetail: FC<Props> = ({ work }) => {
  //   const selectedProfile = useAppStore((state) => state.selectedProfile);
  // const thumbnailUrl = getIPFSLink(work.metadata.media[0].original.url);
  // const thumbnailUrl = getIPFSLink(work.metadata.image);
  const thumbnailUrl =
    work.metadata.media.length > 0
      ? getIPFSLink(work.metadata.media[0].original.url)
      : getIPFSLink(work.metadata.image);
  // const url: string = work.metadata.media[0].original.url;
  // const url: string = work.metadata.image;

  async function downloadImage(imageSrc: string) {
    const image = await fetch(imageSrc);
    const imageBlog = await image.blob();
    const imageURL = URL.createObjectURL(imageBlog);

    const link = document.createElement('a');
    link.href = imageURL;
    link.download = 'File';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="">
      <div className="flex flex-col">
        <div className=" aspect-w-16 aspect-h-9 ">
          <img
            src={thumbnailUrl}
            draggable={false}
            className="object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full object-cover"
            alt="thumbnail"
          ></img>
        </div>
        <div className="flex-1 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <a
              // download={'File.'}
              // download={'Fkna.zip'}
              // href={'https://lensfolio-media.4everland.store/FknFkFJXoAEa7da.zip'}
              href={getIPFSLink(work.metadata.media[1].original.url)}
            >
              {getIPFSLink(work.metadata.media[1].original.url)}
            </a>
            {/* <button
              onClick={() => {
                downloadImage(getIPFSLink(work.metadata.media[1].original.url));
              }}
            >
              Download from fetch
            </button> */}
            {/* <p>{work.metadata.description}</p>


            {/* <form
              method="get"
              action={getIPFSLink('ipfs://bafybeicpqlqdlcace2ti2uf2wa7arisxvngkzixg7coogcuouvd5l7kxju')}
            >
              <button type="submit">Download!</button>
            </form> */}
            {/* <div>{url}</div> */}
          </div>
        </div>
      </div>
      <div className="mt-4 md:mt-6"></div>
    </div>
  );
};

export default WorkDetail;
