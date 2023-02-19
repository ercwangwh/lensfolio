import React, { FC } from 'react';
import { useExploreQuery, PublicationSortCriteria, PublicationTypes } from 'lens';
import { LensfolioPublication, LENSFOLIO_APP_ID } from 'utils';
import TimelineShimmer from '@components/Common/Shimmer/TimelineShimmer';
import Timeline from './Timeline';
import { useRouter } from 'next/router';
import { Modal } from '@components/UI/Modal';
import { useAppStore } from 'src/store/app';

const Curated: FC = () => {
  const router = useRouter();
  const currentProfile = useAppStore((state) => state.currentProfile);
  const request = {
    sortCriteria: PublicationSortCriteria.Latest,
    limit: 32,
    noRandomize: true,
    sources: [LENSFOLIO_APP_ID],
    publicationTypes: [PublicationTypes.Post]
  };

  const { data, loading, error } = useExploreQuery({
    variables: { request }
  });

  const pageInfo = data?.explorePublications?.pageInfo;
  const works = data?.explorePublications?.items as LensfolioPublication[];

  console.log('works', works);
  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && works && (
        <>
          {/* {works.map((work) => {
            console.log('waht error', work);
            return <div>{work.metadata.description}</div>;
          })} */}
          <Timeline works={works} />
        </>
      )}
    </div>
  );
};

export default Curated;
