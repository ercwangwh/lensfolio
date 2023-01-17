import { FC } from 'react';
import type { LensfolioPublication } from 'utils';
import WorkCard from '@components/Common/WorkCard';
interface Props {
  works: LensfolioPublication[];
  workType?: 'Post' | 'Mirror' | 'Comment';
}

const Timeline: FC<Props> = ({ works, workType = 'Post' }) => {
  const isComment = workType === 'Comment';
  const isMirror = workType === 'Mirror';

  return (
    <div className="grid gap-x-4 2xl:grid-cols-5 md:gap-y-8 gap-y-2 ultrawide:grid-cols-4 laptop:grid-cols-3 md:grid-cols-2 grid-col-1">
      {works?.map((work: LensfolioPublication) => {
        const isPub = work.__typename === workType && !work.collectedBy;
        // return isPub && isComment ? (
        //   <CommentedVideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // ) : isPub && isMirror ? (
        //   <MirroredVideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // ) : (
        //   isPub && <VideoCard key={`${work?.id}_${work.createdAt}`} video={work} />
        // );
        return isPub && <WorkCard key={`${work?.id}_${work.createdAt}`} work={work} />;
      })}
    </div>
  );
};
export default Timeline;
