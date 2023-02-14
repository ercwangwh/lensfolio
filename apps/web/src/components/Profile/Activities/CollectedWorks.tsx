import Timeline from '@components/Home/Timeline';
import TimelineShimmer from '@components/Common/Shimmer/TimelineShimmer';
// import { Loader } from '@components/UIElements/Loader';
// import { NoDataFound } from '@components/UIElements/NoDataFound';
import type { Profile } from 'lens';
import { PublicationMainFocus, PublicationTypes, useProfilePostsQuery } from 'lens';
import type { FC } from 'react';
import React from 'react';
// import { useInView } from 'react-cool-inview';
import type { PublicationsQueryRequest } from 'lens';
import { LensfolioPublication, LENSFOLIO_APP_ID } from 'utils';
import { LENS_CUSTOM_FILTERS, SCROLL_ROOT_MARGIN } from 'utils';

interface Props {
  profile: Profile;
}

const CollectedWorks: FC<Props> = ({ profile }) => {
  const request: PublicationsQueryRequest = {
    publicationTypes: [PublicationTypes.Post],
    limit: 32,
    metadata: { mainContentFocus: [PublicationMainFocus.Image, PublicationMainFocus.Article] },
    // customFilters: LENS_CUSTOM_FILTERS,
    collectedBy: profile.ownedBy,
    profileId: profile?.id,
    sources: [LENSFOLIO_APP_ID]
  };

  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: {
      request
    },
    skip: !profile?.id
  });

  const profileWorks = data?.publications?.items as LensfolioPublication[];
  const pageInfo = data?.publications?.pageInfo;

  // const { observe } = useInView({
  //   rootMargin: SCROLL_ROOT_MARGIN,
  //   onEnter: async () => {
  //     await fetchMore({
  //       variables: {
  //         request: {
  //           ...request,
  //           cursor: pageInfo?.next
  //         }
  //       }
  //     });
  //   }
  // });

  if (loading) return <TimelineShimmer />;

  // if (data?.publications?.items?.length === 0) {
  //   return <NoDataFound isCenter withImage text="No videos found" />;
  // }

  return (
    <div className="w-full">
      {!error && !loading && (
        <>
          <Timeline works={profileWorks} />
          {/* {pageInfo?.next && profileWorks.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )} */}
        </>
      )}
    </div>
  );
};

export default CollectedWorks;
