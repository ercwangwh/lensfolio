import React, { FC, useState } from 'react';
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
import { Loader } from '@components/UI/Loader';
import { IPFS_GATEWAY, LensfolioPublication } from 'utils';
import WorkHeader from './WorkHeader';
import dynamic from 'next/dynamic';
import edjsHTML from 'editorjs-html';
import parse from 'html-react-parser';
import getContent from '@lib/getContent';

// const EditorBlock = dynamic(() => import('@components/Post/ContentEditor/Editor'), {
//   ssr: false
// });

interface Props {
  work: LensfolioPublication;
}

const WorkDetail: FC<Props> = ({ work }) => {
  const [content, setContent] = useState<string[]>([]);
  //   const selectedProfile = useAppStore((state) => state.selectedProfile);
  // const thumbnailUrl = getIPFSLink(work.metadata.media[0].original.url);
  // const thumbnailUrl = getIPFSLink(work.metadata.image);

  // const edjsParser = edjsHTML();
  // const html = edjsParser.parse(JSON.parse(work.metadata.content));
  // console.log('content', html);

  const [downloading, setDownloading] = useState(false);
  const thumbnailUrl =
    work.metadata.media.length > 0
      ? getIPFSLink(work.metadata.media[0].original.url)
      : getIPFSLink(work.metadata.image);

  const fileAttachmentlUrl =
    work.metadata.media.length > 1 ? getIPFSLink(work.metadata.media[1].original.url) : null;

  // getContent(work.metadata?.content).then((data) => {
  //   setContent(data);
  // });
  const contentDetail = work.metadata.attributes.find((item) => item.traitType === 'content_html');
  async function downloadFile(url: string) {
    setDownloading(true);
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const file = await fetch(url);
    const fileBlob = await file.blob();
    const fileUrl = URL.createObjectURL(fileBlob);

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloading(false);
  }

  return (
    <div className="mx-auto">
      <div className="flex flex-col ">
        <div className="aspect-w-2 aspect-h-1">
          {/* <img
            src={thumbnailUrl}
            draggable={false}
            className="object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full object-cover"
            alt="thumbnail"
          ></img> */}
          {work.metadata.image ? (
            <>
              <img
                src={thumbnailUrl}
                draggable={false}
                className="object-center bg-gray-100 dark:bg-gray-900 rounded-t-xl w-full h-full lg:w-full lg:h-full object-cover"
                alt="thumbnail"
                // onClick={handleClick}
              />
              <div>{work.metadata?.name}</div>
            </>
          ) : (
            <div className="w-full flex flex-col justify-center">
              <span className=" text-blue-500 w-full px-2 text-5xl text-center">{work.metadata?.name}</span>
            </div>
          )}
        </div>
        <div className="flex-1 py-5 space-y-4">
          <WorkHeader work={work} />
          {/* <div>{work.metadata?.content}</div> */}
          {/* <EditorBlock onChange={onEditorDataChange} holder="editorjs-container" /> */}
          <div className="prose max-w-full">{contentDetail?.value ? parse(contentDetail?.value) : null}</div>

          {fileAttachmentlUrl ? (
            <Button
              onClick={() => {
                downloadFile(fileAttachmentlUrl);
              }}
              size="lg"
              disabled={!work.hasCollectedByMe}
              icon={downloading ? <Loader /> : null}
            >
              {work.hasCollectedByMe ? 'Download Attachment' : 'Collect To Download Attachment'}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-4 md:mt-6"></div>
    </div>
  );
};

export default WorkDetail;
