import clsx from 'clsx';
// import dayjs from 'dayjs';
// import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import type { FC } from 'react';
import React, { useState } from 'react';
import type { LensfolioPublication } from 'utils';
// import { Analytics, LENSTUBE_BYTES_APP_ID, STATIC_ASSETS, TRACK } from 'utils';
// import { getIsSensitiveContent } from 'utils/functions/getIsSensitiveContent';
import getAvatar from '@lib/getAvatar';
// import getThumbnailUrl from 'utils/functions/getThumbnailUrl';
// import imageCdn from 'utils/functions/imageCdn';

// import IsVerified from '../IsVerified';
// import ReportModal from './ReportModal';
// import ShareModal from './ShareModal';
// import ThumbnailOverlays from './ThumbnailOverlays';
// import VideoOptions from './VideoOptions';

import getIPFSLink from '@lib/getIPFSLink';

// dayjs.extend(relativeTime);

interface Props {
  work: LensfolioPublication;
}

const WorkCard: FC<Props> = ({ work }) => {
  //   const [showShare, setShowShare] = useState(false);
  //   const [showReport, setShowReport] = useState(false);
  //   const isSensitiveContent = getIsSensitiveContent(video.metadata, video.id);
  //   const isByte = video.appId === LENSTUBE_BYTES_APP_ID;
  //   const thumbnailUrl = imageCdn(
  //     isSensitiveContent ? `${STATIC_ASSETS}/images/sensor-blur.png` : getThumbnailUrl(video),
  //     isByte ? 'thumbnail_v' : 'thumbnail'
  //   );
  const thumbnailUrl = getIPFSLink(work.metadata.media[0].original.url);

  return (
    // <div onClick={() => Analytics.track(TRACK.CLICK_VIDEO)} className="group" role="button">
    <div>
      {work.hidden ? (
        <div className="grid h-full place-items-center">
          <span className="text-xs">Hidden by User</span>
        </div>
      ) : (
        <>
          {/* <ShareModal video={work} show={showShare} setShowShare={setShowShare} />
          <ReportModal video={work} show={showReport} setShowReport={setShowReport} /> */}
          <Link href={`/watch/${work.id}`}>
            <div className="relative overflow-hidden aspect-w-16 aspect-h-9">
              <img
                src={thumbnailUrl}
                draggable={false}
                className="object-center bg-gray-100 dark:bg-gray-900 w-full h-full md:rounded-xl lg:w-full lg:h-full object-cover"
                alt="thumbnail"
              />
              {/* <ThumbnailOverlays video={video} /> */}
            </div>
          </Link>
          <div className="py-2">
            <div className="flex items-start space-x-2.5">
              <Link href={`/watch/${work.id}`} className="flex-none mt-0.5">
                <img
                  className="w-8 h-8 rounded-full"
                  src={getAvatar(work.profile)}
                  alt={work.profile?.handle}
                  draggable={false}
                />
              </Link>
              <div className="grid flex-1">
                <div className="flex pb-1 w-full items-start justify-between space-x-1.5 min-w-0">
                  <Link href={`/watch/${work.id}`} className="text-sm font-semibold line-clamp-2 break-words">
                    {work.metadata?.name}
                  </Link>
                  {/* <VideoOptions video={work} setShowShare={setShowShare} setShowReport={setShowReport} /> */}
                </div>
                <Link
                  href={`/username/${work.profile?.handle}`}
                  className="flex w-fit items-center space-x-0.5 text-[13px] hover:opacity-100 opacity-70"
                >
                  <span>{work.profile?.handle}</span>
                  {/* <IsVerified id={work.profile?.id} size="xs" /> */}
                </Link>
                <div className="flex overflow-hidden items-center text-xs opacity-70">
                  <span className="whitespace-nowrap">{work.stats?.totalUpvotes} likes</span>
                  <span className="middot" />
                  {/* {video.createdAt && (
                    <span className="whitespace-nowrap">{dayjs(new Date(video.createdAt)).fromNow()}</span>
                  )} */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkCard;
