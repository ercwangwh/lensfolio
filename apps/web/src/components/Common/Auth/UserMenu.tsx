import DropMenu from '@components/UI/DropMenu';
import React, { FC } from 'react';
import { Button } from '@components/UI/Button';
import getAvatar from '@lib/getAvatar';
import type { Profile } from 'lens';

interface props {
  profile: Profile;
}

const UserMenu = ({ profile }: props) => {
  return (
    <DropMenu
      trigger={
        <Button className="!p-0 flex-none">
          <img
            className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
            src={getAvatar(profile)}
            alt="channel picture"
            draggable={false}
          />
        </Button>
      }
    >
      <div />
    </DropMenu>
  );
};

export default UserMenu;
