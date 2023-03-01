import { Tab } from '@headlessui/react';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import clsx from 'clsx';
import {
  BanknotesIcon,
  BookOpenIcon,
  ChatBubbleBottomCenterIcon,
  ArrowPathIcon,
  InboxIcon,
  RectangleGroupIcon,
  EllipsisHorizontalCircleIcon
} from '@heroicons/react/24/outline';
import type { Profile } from 'lens';
import AllWorks from './AllWorks';
import CollectedNFTs from './CollectedNFTs';
import About from './About';
import CollectedWorks from './CollectedWorks';

interface Props {
  profile: Profile;
}

const Activities: FC<Props> = ({ profile }) => {
  const { query } = useRouter();

  const getDefaultTab = () => {
    switch (query.tab) {
      case 'allWorks':
        return 1;
      case 'colleted':
        return 2;
      // case 'mirrored':
      //   return 3;
      // case 'commented':
      //   return 4;
      // case 'nfts':
      //   return 5;
      // case 'about':
      //   return 6;
      default:
        return 0;
    }
  };
  return (
    <Tab.Group as="div" className="w-full h-full pt-3" defaultIndex={getDefaultTab()}>
      <div className="flex flex-col items-center">
        <Tab.List className="p-2 rounded-xl flex overflow-x-auto no-scrollbar justify-center space-x-4 bg-blue-500">
          <Tab
            //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
            className={({ selected }) =>
              clsx(
                ' p-2 flex items-center space-x-2 text-sm focus:outline-none rounded-2xl ',
                selected ? 'bg-white text-gray-800' : 'text-white'
              )
            }
          >
            <BookOpenIcon className="h-6 w-6" />
            <span>All Works</span>
          </Tab>
          <Tab
            //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
            className={({ selected }) =>
              clsx(
                ' p-2  flex items-center space-x-2 text-sm focus:outline-none rounded-2xl',
                selected ? 'bg-white text-gray-800' : 'text-white'
              )
            }
          >
            <InboxIcon className="h-6 w-6" />
            <span>Collected</span>
          </Tab>
          {/* <Tab
          //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected ? 'border-blue-900 opacity-100' : 'border-transparent opacity-50'
            )
          }
        >
          <ArrowPathIcon className="h-6 w-6" />
          <span>Mirrored</span>
        </Tab>
        <Tab
          //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected ? 'border-blue-900 opacity-100' : 'border-transparent opacity-50'
            )
          }
        >
          <ChatBubbleBottomCenterIcon className="h-6 w-6" />
          <span>Commented</span>
        </Tab>
        <Tab
          //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected ? 'border-blue-900 opacity-100' : 'border-transparent opacity-50'
            )
          }
        >
          <RectangleGroupIcon className="h-6 w-6" />
          <span>NFTs</span>
        </Tab>
        <Tab
          //   onClick={() => Analytics.track(TRACK.CHANNEL.CLICK_CHANNEL_VIDEOS)}
          className={({ selected }) =>
            clsx(
              'px-4 py-2 flex items-center space-x-2 border-b-2 text-sm focus:outline-none',
              selected ? 'border-blue-900 opacity-100' : 'border-transparent opacity-50'
            )
          }
        >
          <EllipsisHorizontalCircleIcon className="h-6 w-6" />
          <span>About</span>
        </Tab> */}
        </Tab.List>
      </div>
      <Tab.Panels>
        <Tab.Panel className="py-4 focus:outline-none">
          <AllWorks profile={profile} />
        </Tab.Panel>
        <Tab.Panel className="py-4 focus:outline-none">
          <CollectedWorks profile={profile} />
        </Tab.Panel>
        {/* <Tab.Panel className="py-3 focus:outline-none">mirror</Tab.Panel>
        <Tab.Panel className="py-3 focus:outline-none">comment</Tab.Panel>
        <Tab.Panel className="py-3 focus:outline-none">
          <CollectedNFTs profile={profile} />
        </Tab.Panel>
        <Tab.Panel className="py-3 focus:outline-none">
          <About profile={profile} />
        </Tab.Panel> */}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default Activities;
