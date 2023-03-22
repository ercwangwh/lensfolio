import clsx from 'clsx';
import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { LensfolioPublication } from 'utils';
// import { Analytics, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils';
// import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent';
import { ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import getAvatar from '@lib/getAvatar';
// import getThumbnailUrl from 'utils/functions/getThumbnailUrl';
// import imageCdn from 'utils/functions/imageCdn';

// import IsVerified from '../IsVerified';
// import ReportModal from './ReportModal';
// import ShareModal from './ShareModal';
// import ThumbnailOverlays from './ThumbnailOverlays';
// import VideoOptions from './VideoOptions';

import getIPFSLink from '@lib/getIPFSLink';
import { usePublicationStore } from 'src/store/publication';
import { useAppStore } from 'src/store/app';
import { useGlobalModalStateStore } from 'src/store/modals';
import Like from '@components/Work/Actions/Like';
import nFormatter from '@lib/nFormatter';
import { getRelativeTime } from '@lib/formatTime';
import { shortenAddress } from '@lib/shortenAddress';

import parse from 'html-react-parser';
import { join } from 'path';
// dayjs.extend(relativeTime);

interface Props {
  work: LensfolioPublication;
}

const WorkCard: FC<Props> = ({ work }) => {
  // const [content, setContent] = useState<string[]>([]);
  //   const [showReport, setShowReport] = useState(false);
  //   const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id);
  //   const isByte = video.appId === LENSTUBE_BYTES_APP_ID;
  //   const thumbnailUrl = imageCdn(
  //     isSensitiveContent ? `${STATIC_ASSETS}/images/sensor-blur.png` : getThumbnailUrl(video),
  //     isByte ? 'thumbnail_v' : 'thumbnail'
  //   );
  // const setProfileId = useAppPersistStore((state) => state.setProfileId);
  // const setSelectedWorkId = usePublicationStore((state) => state.setSelectedWorkId);
  // const setSelectedProfile = useAppStore((state) => state);
  const setShowWorkDetailModal = useGlobalModalStateStore((state) => state.setShowWorkDetailModal);
  // const thumbnailUrl =
  //   work.metadata.media !== undefined
  //     ? getIPFSLink(work.metadata.media[0].original.url)
  //     : getIPFSLink(work.metadata.image);
  // if()
  // const workContent = async () => {
  //   return await getContent(work.metadata?.content);
  // };

  // getContent(work.metadata?.content).then((data) => {
  //   setContent(data);
  // });
  const content = work.metadata.content as string;
  const thumbnailUrl =
    work.metadata.media.length > 0
      ? getIPFSLink(work.metadata.media[0].original.url)
      : getIPFSLink(work.metadata.image);
  const createTime = work.createdAt;

  const handleClick = () => {
    // setShowWorkDetailModal(true);
  };

  return (
    // <div onClick={() => Analytics.track(TRACK.CLICK_VIDEO)} className="group" role="button">
    <div className=" bg-white rounded-xl border">
      {work.hidden ? (
        <div className="grid h-full place-items-center">
          <span className="text-xs">Hidden by User</span>
        </div>
      ) : (
        <>
          {/* <ShareModal video={work} show={showShare} setShowShare={setShowShare} />
          <ReportModal video={work} show={showReport} setShowReport={setShowReport} /> */}
          {/* <Link href={`/?id=${work.id}`} as={`/works/${work.id}`} scroll={false} onClick={handleClick}> */}
          <Link href={`/works/${work.id}`} scroll={false} onClick={handleClick}>
            <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
              {work.metadata.image ? (
                <img
                  src={thumbnailUrl}
                  draggable={false}
                  className="object-center bg-gray-100 dark:bg-gray-900 rounded-t-xl w-full h-full lg:w-full lg:h-full object-cover"
                  alt="thumbnail"
                  onClick={handleClick}
                />
              ) : (
                <div className="w-full flex flex-col justify-center">
                  <span className=" text-blue-500 w-full px-2 text-xl text-center">
                    {work.metadata?.name}
                  </span>
                </div>
              )}
            </div>
            <div className="py-2 border-t">
              <div className="flex flex-col items-start space-y-3 px-4">
                <div className="flex pb-1 w-full items-start justify-between space-x-1.5 min-w-0 overflow-ellipsis overflow-hidden whitespace-nowrap">
                  <span className=" font-semibold line-clamp-2 break-words">{work.metadata?.name}</span>
                  {/* </Link> */}
                </div>
                <span className=" bg-gray-200 text-[13px] px-1 hover:opacity-100 opacity-70 rounded-md">
                  {dayjs(createTime).locale('en').format('MMM DD, YYYY')}
                </span>
                <div className="line-clamp-5 overflow-hidden text-sm text-gray-500">{parse(content)}</div>
                <div className="flex flex-row justify-start space-x-2">
                  {/* <Link href={`/?id=${work.id}`} as={`/works/${work.id}`} className="flex-none mt-0.5"> */}
                  <img
                    className="w-5 h-5 rounded-full"
                    src={getAvatar(work.profile, false)}
                    alt={work.profile?.handle}
                    draggable={false}
                    onClick={handleClick}
                  />
                  {/* </Link> */}
                  <span className="text-[13px] px-1 hover:opacity-100 opacity-70 rounded-md self-center">
                    {work.profile.handle}
                  </span>
                  <span className="bg-gray-200 text-[13px] px-1 hover:opacity-100 opacity-70 rounded-md self-center">
                    {shortenAddress(work.profile.ownedBy)}
                  </span>
                </div>
                <div className="grid flex-1">
                  {/* <Link
                    href={`/user/${work.profile?.handle}`}
                    className="flex w-fit items-center space-x-0.5 text-[13px] hover:opacity-100 opacity-70"
                  > */}
                  {/* <span>{`${work.profile?.handle} ${getRelativeTime(work.createdAt)}`}</span> */}
                  {/* <IsVerified id={work.profile?.id} size="xs" /> */}
                  {/* </Link> */}
                </div>
              </div>
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default WorkCard;
