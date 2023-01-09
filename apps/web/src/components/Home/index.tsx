/* pages/index.js */
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

function Home() {
  /* create initial state to hold array of profiles */
  // const [profiles, setProfiles] = useState([]);
  // useEffect(() => {
  //   fetchProfiles();
  // }, []);
  // const request = { profile: <Profile></Profile>, limit: 10 };
  // useProfilePostsLazyQuery();

  const currentProfile = useAppStore((state) => state.currentProfile);

  const publicationTypes = [PublicationTypes.Post, PublicationTypes.Mirror, PublicationTypes.Comment];

  const request = {
    publicationTypes,
    profileId: currentProfile?.id,
    limit: 10,
    sources: [LENSFOLIO_APP_ID]
  };
  const reactionRequest = currentProfile ? { profileId: currentProfile?.id } : null;
  const profileId = currentProfile?.id ?? null;
  const { data, loading, error, fetchMore } = useProfilePostsQuery({
    variables: {
      request: request,
      reactionRequest: reactionRequest,
      profileId: profileId
    },
    skip: !currentProfile?.id
  });
  // const { data, loading, error, fetchMore } = useExploreProfilesQuery();

  // const profiles = data?.exploreProfiles.items;
  const publications = data?.publications?.items;
  const pageInfo = data?.publications?.pageInfo;
  const hasMore = pageInfo?.next && publications?.length !== pageInfo.totalCount;

  console.log(data);

  const loadMore = async () => {
    await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next }, reactionRequest, profileId }
    });
  };

  if (loading) {
    return <div>is loading</div>;
  }
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
      {/* <LoginButton /> */}
      {/* <Header /> */}
      {/* <ViewProfile /> */}
      {data?.publications.items.map((item, index) => {
        return (
          <Card forceRounded={true} key={`${item}_${index}`}>
            {item.__typename === 'Post' ? (
              <div>
                {item.metadata.name} {item.metadata.description} {item.appId}
                {item.metadata.media.map((media) => {
                  return (
                    <div>
                      {media.original.url}
                      {/* {console.log(media.original.url)} */}
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* <div>Title</div>
            <div>Description</div> */}
          </Card>
        );
      })}
    </div>
  );
}

export default Home;
