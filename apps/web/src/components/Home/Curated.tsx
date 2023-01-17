import React, { FC } from 'react';
import { useExploreQuery, PublicationSortCriteria, PublicationTypes } from 'lens';
import { LensfolioPublication, LENSFOLIO_APP_ID } from 'utils';
import TimelineShimmer from '@components/Common/Shimmer/TimelineShimmer';

const Curated: FC = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    sources: [LENSFOLIO_APP_ID],
    publicationTypes: [PublicationTypes.Post]
  };

  const { data, loading, error } = useExploreQuery({
    variables: { request }
  });

  const pageInfo = data?.explorePublications?.pageInfo;
  const works = data?.explorePublications?.items as LensfolioPublication[];

  console.log('what error', works);
  return (
    <div>
      {!loading && <TimelineShimmer />}
      {/* {<ThumbnailsShimmer />} */}
      {!error && !loading && works && (
        <>
          {works.map((work) => {
            console.log('waht error', work);
            return <div>{work.metadata.description}</div>;
          })}
        </>
      )}
    </div>
  );
};

export default Curated;
