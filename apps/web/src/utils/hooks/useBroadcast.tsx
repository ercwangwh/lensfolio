import type { ApolloCache } from '@apollo/client';
import { ERRORS } from 'utils';
import { useBroadcastMutation } from 'lens';
import toast from 'react-hot-toast';

interface Props {
  onCompleted?: (data: any) => void;
  update?: (cache: ApolloCache<any>) => void;
}

const useBroadcast = ({ onCompleted, update }: Props): { broadcast: any; data: any; loading: boolean } => {
  const [broadcast, { data, loading }] = useBroadcastMutation({
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    },
    onCompleted,
    update,
    onError: (error) => {
      if (error.message === ERRORS.notMined) {
        toast.error(error.message);
      }
    }
  });

  return {
    broadcast: ({ request }: any) => broadcast({ variables: { request } }),
    data,
    loading
  };
};

export default useBroadcast;
