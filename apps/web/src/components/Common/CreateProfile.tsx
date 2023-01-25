// import React, { ReactNode } from 'react';

import Header from './Header';
import { FC, ReactNode, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTheme } from 'next-themes';
import { useCreateProfileMutation } from 'lens';
import { Button } from '@components/UI/Button';
import type { CreateProfileRequest } from 'lens';
import onError from '@lib/onError';

const CreateProfile: FC = () => {
  const [handle, setHandle] = useState('');
  // CreateProfileRequest
  const request = { handle: handle };

  const [createProfileMutation, { data, loading }] = useCreateProfileMutation({
    variables: {
      request // value for 'request'
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
    createProfileMutation();
  };

  return (
    <div>
      <input onChange={handleChange}></input>
      <Button disabled={loading} onClick={onCreate}>
        Create
      </Button>
    </div>
  );
};

export default CreateProfile;
