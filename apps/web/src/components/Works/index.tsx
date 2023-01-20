import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { Modal } from '@components/UI/Modal';

// interface Props {
//   workId: string | null;
// }

const Works: FC = () => {
  const {
    query: { id }
  } = useRouter();
  //   console.log(id);
  return <div>what is modal query id {id}</div>;
};

export default Works;
