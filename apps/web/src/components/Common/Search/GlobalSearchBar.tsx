import { useLazyQuery } from '@apollo/client';
import { Loader } from '@components/UI/Loader';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';
import clsx from 'clsx';
import type { Profile, Publication } from 'lens';
import { SearchProfilesDocument, SearchPublicationsDocument, SearchRequestTypes } from 'lens';
import type { FC } from 'react';
import React, { useEffect, useRef, useState } from 'react';
import {
  // ALLOWED_APP_IDS,
  // Analytics,
  LENS_CUSTOM_FILTERS,
  LENSFOLIO_APP_ID
  // TRACK
} from 'utils';
import useDebounce from 'utils/hooks/useDebounce';
import useOutsideClick from 'utils/hooks/useOutsideClick';

import Profiles from './Profiles';
import Works from './Works';

interface Props {
  onSearchResults?: () => void;
}

const GlobalSearchBar: FC<Props> = ({ onSearchResults }) => {
  const [activeSearch, setActiveSearch] = useState(SearchRequestTypes.Profile);
  const [keyword, setKeyword] = useState('');
  const debouncedValue = useDebounce<string>(keyword, 500);
  const resultsRef = useRef(null);
  useOutsideClick(resultsRef, () => setKeyword(''));

  const [search, { data, loading }] = useLazyQuery(
    activeSearch === 'PROFILE' ? SearchProfilesDocument : SearchPublicationsDocument
  );

  const onDebounce = () => {
    if (keyword.trim().length) {
      search({
        variables: {
          request: {
            type: activeSearch,
            query: keyword,
            limit: 30,
            sources: [LENSFOLIO_APP_ID],
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      });
      // Analytics.track(activeSearch === 'PROFILE' ? TRACK.SEARCH_CHANNELS : TRACK.SEARCH_VIDEOS);
    }
  };

  const profiles = data?.search?.items;

  useEffect(() => {
    onDebounce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, activeSearch]);

  const clearSearch = () => {
    setKeyword('');
    onSearchResults?.();
  };

  return (
    <div className="md:w-96" data-testid="global-search">
      <div ref={resultsRef}>
        <div className="relative">
          <div className="relative w-full cursor-default overflow-hidden rounded-full border border-gray-200 dark:border-gray-700 sm:text-sm">
            <input
              className="w-full bg-transparent py-2 pl-4 pr-10 text-sm focus:outline-none"
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Search by profile / hashtag"
              value={keyword}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <div
            className={clsx(
              'dark:bg-theme z-10 mt-1 w-full overflow-hidden rounded-xl bg-white text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm md:absolute',
              { hidden: debouncedValue.length === 0 }
            )}
          >
            <Tab.Group>
              <Tab.List className="flex justify-center">
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full border-b-2 px-4 py-2 text-sm focus:outline-none',
                      selected
                        ? 'border-blue-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-blue-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch(SearchRequestTypes.Profile);
                  }}
                >
                  Profiles
                </Tab>
                <Tab
                  className={({ selected }) =>
                    clsx(
                      'w-full border-b-2 px-4 py-2 text-sm focus:outline-none',
                      selected
                        ? 'border-blue-500 opacity-100'
                        : 'border-transparent opacity-50 hover:bg-blue-500/[0.12]'
                    )
                  }
                  onClick={() => {
                    setActiveSearch(SearchRequestTypes.Publication);
                  }}
                >
                  Works
                </Tab>
              </Tab.List>
              <Tab.Panels>
                <Tab.Panel
                  className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none"
                  data-testid="search-channels-panel"
                >
                  {data?.search?.__typename === 'ProfileSearchResult' && (
                    <Profiles results={profiles as Profile[]} loading={loading} clearSearch={clearSearch} />
                  )}
                </Tab.Panel>
                <Tab.Panel className="no-scrollbar max-h-[80vh] overflow-y-auto focus:outline-none">
                  {data?.search?.__typename === 'PublicationSearchResult' && (
                    <Works results={profiles as Publication[]} loading={loading} clearSearch={clearSearch} />
                  )}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>

            {loading && (
              <div className="flex justify-center p-5">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GlobalSearchBar;
