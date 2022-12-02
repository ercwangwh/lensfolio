import React, { FC } from 'react';
import { Tab } from '@headlessui/react';
import Works from './Works';
import LikedWorks from './LikedWorks';
const UserTab: FC = () => {
  return (
    <Tab.Group>
      <Tab.List>
        <Tab>Works</Tab>
        <Tab>Liked Works</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel>
          <Works />
        </Tab.Panel>
        <Tab.Panel>
          <LikedWorks />
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

export default UserTab;
