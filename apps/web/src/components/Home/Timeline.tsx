import { FC } from 'react';
import type { LensfolioPublication, QueuedWorkType } from 'utils';
import WorkCard from '@components/Common/WorkCard';
// import { useAppPersistStore } from 'src/store/app';
import { useTransactionPersistStore } from 'src/store/transaction';
import { useAppStore } from 'src/store/app';
import QueuedWork from '@components/Common/WorkCard/QueuedWork';
// import { getRelativeTime } from '@lib/formatTime';

interface Props {
  works: LensfolioPublication[];
  workType?: 'Post' | 'Mirror' | 'Comment';
}

const Timeline: FC<Props> = ({ works, workType = 'Post' }) => {
  const txnQueue = useTransactionPersistStore((state) => state.txnQueue);
  const currentProfile = useAppStore((state) => state.currentProfile);
  const isComment = workType === 'Comment';
  const isMirror = workType === 'Mirror';
  const isProfilePage = location.pathname === `/user/${currentProfile?.handle}`;

  console.log('txnQueue', txnQueue);

  return (
    <div className="grid gap-x-4 2xl:grid-cols-5 md:gap-y-8 gap-y-2 ultrawide:grid-cols-4 laptop:grid-cols-3 md:grid-cols-2 grid-col-1">
      {!isProfilePage &&
        txnQueue?.map((queuedWork) =>
          queuedWork.type === 'NEW_POST' ? <QueuedWork key={queuedWork.id} queuedWork={queuedWork} /> : null
        )}
      {works?.map((work: LensfolioPublication) => {
        const isPub = work.__typename === workType && !work.collectedBy;
        // console.log(work.metadata.name);
        // return isPub && isComment ? (
        //   <CommentedVideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // ) : isPub && isMirror ? (
        //   <MirroredVideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // ) : (
        //   isPub && <VideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // );
        // return isPub && <WorkCard key={`${work?.id}_${work.createdAt}`} work={work} />;
        return isPub && <WorkCard key={`${work.id}_${work.createdAt}`} work={work} />;
      })}
    </div>
  );
};
export default Timeline;
