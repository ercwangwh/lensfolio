import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Modal } from '@components/UI/Modal';
import WorkHeader from './WorkHeader';
import type { Publication } from 'lens';
import { usePublicationDetailsQuery } from 'lens';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';
import UserHeaderShimmer from '@components/Common/Shimmer/UserHeaderShimmer';
import WorkDetailShimmer from '@components/Common/Shimmer/WorkDetailShimmer';
import { LensfolioPublication } from 'utils';
import WorkDetail from './WorkDetail';
// interface Props {
//   work: Publication;
// }
const Work: FC = () => {
  const {
    query: { id }
  } = useRouter();
  //   console.log(id);
  const currentProfile = useAppStore((state) => state.currentProfile);
  // const selectedProfile = useAppStore((state) => state.selectedProfile);
  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: currentProfile ? { profileId: currentProfile?.id } : null,
      profileId: currentProfile?.id ?? null
    },
    skip: !id
  });
  if (error) toast.error(error.message);

  const workData = data?.publication as LensfolioPublication;

  // console.log('Detail Work Data', workData);
  return (
    <div className="w-2/3 mx-auto">
      {loading && (
        <>
          <UserHeaderShimmer />
          <WorkDetailShimmer />
        </>
      )}
      {/* <WorkHeader work={workData} /> */}
      {!error && !loading && workData && (
        <div>
          <WorkHeader work={workData} />
          <WorkDetail work={workData} />
        </div>
      )}
    </div>
  );
};

export default Work;
