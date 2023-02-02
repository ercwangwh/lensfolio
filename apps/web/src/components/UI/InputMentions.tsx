// import IsVerified from '@components/Common/IsVerified'
import clsx from 'clsx';
import type { Profile } from 'lens';
import { SearchRequestTypes, useSearchProfilesLazyQuery } from 'lens';
import type { ComponentProps, FC } from 'react';
import React, { useId } from 'react';
import type { SuggestionDataItem } from 'react-mentions';
import { Mention, MentionsInput } from 'react-mentions';
// import {Mention} from
import { LENS_CUSTOM_FILTERS } from 'utils';
import nFormatter from '@lib/nFormatter';
// import {  } from 'utils/functions/formatNumber';
import getAvatar from '@lib/getAvatar';
// import getProfilePicture from 'utils/functions/getProfilePicture';

interface Props extends ComponentProps<'textarea'> {
  label?: string;
  type?: string;
  className?: string;
  validationError?: string;
  value: string;
  onContentChange: (value: string) => void;
  mentionsSelector: string;
}

const InputMentions: FC<Props> = ({
  label,
  validationError,
  value,
  onContentChange,
  mentionsSelector,
  ...props
}) => {
  const id = useId();
  const [searchProfiles] = useSearchProfilesLazyQuery();

  const fetchSuggestions = async (query: string, callback: (data: SuggestionDataItem[]) => void) => {
    if (!query) return;
    try {
      const { data } = await searchProfiles({
        variables: {
          request: {
            type: SearchRequestTypes.Profile,
            query,
            limit: 5,
            customFilters: LENS_CUSTOM_FILTERS
          }
        }
      });
      if (data?.search.__typename === 'ProfileSearchResult') {
        const profilesData = data?.search?.items as Profile[];
        const profiles = profilesData?.map((profile: Profile) => ({
          id: profile.handle,
          display: profile.handle,
          profileId: profile.id,
          picture: getAvatar(profile),
          followers: profile.stats.totalFollowers
        }));
        callback(profiles);
      }
    } catch {
      callback([]);
    }
  };

  return (
    <label className="w-full" htmlFor={id}>
      {label && (
        <div className="flex items-center mb-1 space-x-1.5">
          <div className="text-[11px] font-semibold uppercase opacity-70">{label}</div>
        </div>
      )}
      <div className="flex">
        <MentionsInput
          id={id}
          className={mentionsSelector}
          value={value}
          placeholder={props.placeholder}
          onChange={(e) => onContentChange(e.target.value)}
        >
          <Mention
            trigger="@"
            displayTransform={(handle) => `@${handle} `}
            markup=" @__id__ "
            appendSpaceOnAdd
            renderSuggestion={(
              suggestion: SuggestionDataItem & {
                picture?: string;
                followers?: number;
                profileId?: string;
              },
              _search,
              _highlightedDisplay,
              _index,
              focused
            ) => (
              <div
                className={clsx('flex truncate px-1.5 py-1.5 space-x-1.5', {
                  'bg-indigo-50 rounded dark:bg-theme': focused
                })}
              >
                <img
                  src={suggestion?.picture}
                  className="w-6 h-6 mt-1 rounded-full"
                  alt="pfp"
                  draggable={false}
                />
                <div className="overflow-hidden">
                  <div className="flex items-center space-x-0.5">
                    <p className="font-medium leading-4 truncate">{suggestion?.id}</p>
                    {/* <IsVerified id={suggestion.profileId as string} size="xs" /> */}
                  </div>
                  {suggestion?.followers && (
                    <span className="text-xs opacity-80">
                      {nFormatter(suggestion?.followers)} subscribers
                    </span>
                  )}
                </div>
              </div>
            )}
            data={fetchSuggestions}
          />
        </MentionsInput>
      </div>
      {validationError && <div className="mx-1 mt-1 text-xs font-medium text-red-500">{validationError}</div>}
    </label>
  );
};

export default InputMentions;
