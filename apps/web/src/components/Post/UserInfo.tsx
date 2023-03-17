import getAvatar from '@lib/getAvatar';
import { shortenAddress } from '@lib/shortenAddress';
import React from 'react';
import { useAppStore } from 'src/store/app';
import Category from './Category';
import CollectModule from './CollectModule';
import ReferenceModule from './ReferenceModule';

export const UserInfo = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row space-x-3 items-center">
        <img
          className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
          src={getAvatar(currentProfile, false)}
          alt="avatar picture"
          draggable={false}
        />
        <span className=" font-semibold">{currentProfile?.handle}</span>
        <span className=" bg-gray-200 p-1 rounded-full text-xs">
          {shortenAddress(currentProfile?.ownedBy)}
        </span>
      </div>

      <div className="flex flex-row space-x-3 justify-between">
        <CollectModule />
        <ReferenceModule />
      </div>

      {/* <Category /> */}
    </div>
  );
};
