// import React, { ReactNode } from 'react';
import Header from './Header';
import { FC, ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { useCreateProfileMutation, Scalars } from 'lens';
import { Button } from '@components/UI/Button';
import type { CreateProfileRequest } from 'lens';
import onError from '@lib/onError';
import { Input } from '@components/UI/Input';

const CreateProfile: FC = () => {
  const [handle, setHandle] = useState('');

  const [createProfileMutation, { data, loading }] = useCreateProfileMutation({
    variables: {
      request: { handle: handle } // value for 'request'
    },
    onCompleted: (data) => {
      data.createProfile.__typename === 'RelayerResult' ? toast.success(data.createProfile.txId) : null;
    },
    onError
  });

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setHandle(evt.target.value);
  };
  const onCreate = () => {
    if (!handle) return toast.error('Handlename should not be null');
    createProfileMutation();
  };

  return (
    <div className="flex flex-row">
      <Input onChange={handleChange} placeholder="create testnet profile"></Input>
      <Button disabled={loading} onClick={onCreate}>
        Create
      </Button>
    </div>
  );
};

export default CreateProfile;
