/* pages/index.js */
import { useEffect, useState } from 'react';
// import { client, exploreProfiles } from "../api";
import client from '../../apollo';
import type { Profile } from 'lens';
import { useExploreProfilesQuery } from 'lens';
import Link from 'next/link';
// import LoginButton from "@components/Common/Header/LoginButton";
import Header from '@components/Common/Header';
import ViewProfile from '@components/Profile';

function Home() {
  /* create initial state to hold array of profiles */
  // const [profiles, setProfiles] = useState([]);
  // useEffect(() => {
  //   fetchProfiles();
  // }, []);
  // const request = { profile: <Profile></Profile>, limit: 10 };
  const { data, loading, error, fetchMore } = useExploreProfilesQuery();

  const profiles = data?.exploreProfiles.items;

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
      <Header />
      <ViewProfile />
    </div>
  );
}

export default Home;
