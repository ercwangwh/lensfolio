import MetaTags from '@components/Common/MetaTags';
import { useEffect, useState } from 'react';
// import { client, exploreProfiles } from "../api";
import client from '../../apollo';
import { Profile, useProfilePostsLazyQuery, PublicationTypes, useProfilePostsQuery } from 'lens';
import { useExploreProfilesQuery } from 'lens';
import Link from 'next/link';
// import LoginButton from "@components/Common/Header/LoginButton";
import Header from '@components/Common/Header';
import ViewProfile from '@components/Profile';
import { useRouter } from 'next/router';
import { Card } from '@components/UI/Card';
import { useAppStore } from 'src/store/app';
import { LENSFOLIO_APP_ID } from 'utils';
import getIPFSLink from '@lib/getIPFSLink';
import { GridLayout, GridItemFour } from '@components/UI/GridLayout';
import getAvatar from '@lib/getAvatar';
import { useProfileInterestsQuery } from 'lens';
import { Button } from '@components/UI/Button';
import useHorizontalScroll from '@utils/hooks/useHorizantalScroll';
import CategoryFilters from './CategoryFilters';
import Curated from './Curated';
import { Modal } from '@components/UI/Modal';
import { usePublicationStore } from 'src/store/publication';
import Work from '@components/Work';
import { SortCriteriaFilters } from './SortCriteriaFilters';

function Home() {
  /* create initial state to hold array of profiles */
  // const [profiles, setProfiles] = useState([]);
  // useEffect(() => {
  //   fetchProfiles();
  // }, []);
  // const request = { profile: <Profile></Profile>, limit: 10 };
  // useProfilePostsLazyQuery();
  const router = useRouter();
  // const selectedWorkId = usePublicationStore((state) => state.selectedWorkId);
  // const setSelectedWorkId = usePublicationStore((state) => state.setSelectedWorkId);
  // const selectedProfile = useAppStore((state) => state.selectedProfile);
  // const setSelectedProfile = useAppStore((state) => state.setSelectedProfile);
  // const scrollRef = useHorizontalScroll();
  // const publicationTypes = [PublicationTypes.Post, PublicationTypes.Mirror, PublicationTypes.Comment];

  // const request = {
  //   publicationTypes,
  //   profileId: currentProfile?.id,
  //   limit: 10,
  //   sources: [LENSFOLIO_APP_ID]
  // };
  // const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  // const profileId = currentProfile?.id ?? null;
  // const { data, loading, error, fetchMore } = useProfilePostsQuery({
  //   variables: {
  //     request: request,
  //     reactionRequest: reactionRequest,
  //     profileId: profileId
  //   },
  //   skip: !currentProfile?.id
  // });

  // const
  // async function fetchProfiles() {
  //   try {
  //     /* fetch profiles from Lens API */
  //     // let response = await client.query({ query: exploreProfiles });
  //     /* loop over profiles, create properly formatted ipfs image links */
  //     let profileData = await Promise.all(
  //       data?.exploreProfiles.items.map(async (profileInfo) => {
  //         let profile = { ...profileInfo };
  //         let picture = profile.picture;
  //         if (picture && picture.original && picture.original.url) {
  //           if (picture.original.url.startsWith("ipfs://")) {
  //             let result = picture.original.url.substring(
  //               7,
  //               picture.original.url.length
  //             );
  //             profile.avatarUrl = `http://lens.infura-ipfs.io/ipfs/${result}`;
  //           } else {
  //             profile.avatarUrl = picture.original.url;
  //           }
  //         }
  //         return profile;
  //       })
  //     );

  //     /* update the local state with the profiles array */
  //     setProfiles(profileData);
  //   } catch (err) {
  //     console.log({ err });
  //   }
  // }
  return (
    <div>
      {/* <CategoryFilters /> */}
      <MetaTags />
      <div className="flex flex-row pb-8">
        <SortCriteriaFilters />
      </div>
      {/* <GridLayout>
        {data?.publications.items.map((item, index) => {
          return (
            <Card forceRounded={true} key={`${item}_${index}`}>
              {item.__typename === 'Post' ? (
                <div>
                  {item.metadata.media.map((media) => {
                    return (
                      <div>
                        <img src={getIPFSLink(media.original.url)}></img>
                      </div>
                    );
                  })}
                  <img
                    src={getAvatar(item.profile)}
                    className="object-cover bg-white rounded-full dark:bg-theme w-8 h-8 md:w-9 md:h-9"
                    alt="avatar picture"
                    draggable={false}
                  />
                  {item.profile.handle}
                </div>
              ) : null}
            </Card>
          );
        })}
      </GridLayout> */}
      <Curated />
      {/* <Modal
        title={selectedProfile?.handle}
        show={!!selectedProfile}
        onClose={() => {
          router.push('/', undefined, { scroll: false });
          setSelectedProfile(null);
        }}
        size={'full'}
      >
        <Work></Work>
      </Modal> */}
    </div>
  );
}

export default Home;
