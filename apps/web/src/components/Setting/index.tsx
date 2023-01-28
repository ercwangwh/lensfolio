// import MetaTags from '@components/Common/MetaTags';
import SettingsShimmer from '@components/Common/Shimmer/SettingsShimmer';
import { useAppStore } from 'src/store/app';
import type { MediaSet, Profile } from 'lens';
import { useProfileQuery } from 'lens';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
// import { Analytics, TRACK } from 'utils';

import BasicInfo from './BasicInfo';
import SideNav from './SideNav';
// import ProfileInterests from './ProfileInterests';
// import SideNav from './SideNav';

const Permissions = dynamic(() => import('./Permissions'));
// const Membership = dynamic(() => import('./Membership'));
// const DangerZone = dynamic(() => import('./DangerZone'));

export const SETTING_MEMBERSHIP = '/setting/membership';
export const SETTING_INTERESTS = '/setting/interests';
export const SETTING_PERMISSIONS = '/setting/permissions';
export const SETTING_DANGER_ZONE = '/setting/danger';
export const SETTING = '/setting';

const Setting = () => {
  const router = useRouter();

  const currentProfile = useAppStore((state) => state.currentProfile);

  //   useEffect(() => {
  //     Analytics.track('Pageview', { path: TRACK.PAGE_VIEW.SETTINGS });
  //   }, []);

  const { data, loading, error } = useProfileQuery({
    variables: {
      request: { handle: currentProfile?.handle }
    },
    skip: !currentProfile?.handle
  });

  if (error) return <Custom500 />;
  if (loading || !data) return <SettingsShimmer />;

  if (!data?.profile || (!currentProfile && router.isReady)) return <Custom404 />;

  const profile = data?.profile as Profile & {
    coverPicture: MediaSet;
  };

  return (
    <div className="container max-w-7xl mx-auto">
      {/* <MetaTags title="Setting" /> */}
      {!loading && !error && profile ? (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="md:col-span-1">
            <SideNav profile={profile} />
          </div>
          <div className="md:col-span-3">
            {router.pathname === SETTING && <BasicInfo profile={profile} />}

            {router.pathname === SETTING_PERMISSIONS && <Permissions />}
            {/* {router.pathname === SETTINGS_MEMBERSHIP && <Membership profile={profile} />}

            {router.pathname === SETTINGS_INTERESTS && <ProfileInterests />}
            {router.pathname === SETTINGS_DANGER_ZONE && <DangerZone />} */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Setting;
