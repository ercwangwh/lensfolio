import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Modal } from '@components/UI/Modal';
import WorkHeader from './WorkHeader';
import type { Publication } from 'lens';
import { usePublicationDetailsQuery } from 'lens';
import { toast } from 'react-hot-toast';
import { useAppStore } from 'src/store/app';

// interface Props {
//   work: Publication;
// }
const Work: FC = () => {
  const {
    query: { id }
  } = useRouter();
  //   console.log(id);
  const selectedProfile = useAppStore((state) => state.selectedProfile);
  const { data, error, loading } = usePublicationDetailsQuery({
    variables: {
      request: { publicationId: id },
      reactionRequest: selectedProfile ? { profileId: selectedProfile?.id } : null,
      profileId: selectedProfile?.id ?? null
    },
    skip: !id
  });
  if (error) toast.error(error.message);

  const workData = data?.publication as Publication;
  console.log(workData);
  return (
    <div className="w-full">
      {/* {loading && <WorkHeader />} */}
      {/* <WorkHeader work={workData} /> */}
      {!error && !loading && workData && (
        <div>
          <WorkHeader work={workData} />
        </div>
      )}
    </div>
  );
};

export default Work;
