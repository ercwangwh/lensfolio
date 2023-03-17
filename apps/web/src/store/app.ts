import { LS_KEYS } from 'utils';
import type { LensfolioWorks } from 'utils';
import type { Profile } from 'lens';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WMATIC_TOKEN_ADDRESS } from 'utils';
import { CREATOR_WORK_CATEGORIES } from 'utils/categories';
// import { OutputData } from '@editorjs/editorjs';

interface AppState {
  profiles: Profile[] | [];
  setProfiles: (profiles: Profile[]) => void;
  currentProfile: Profile | null;
  setCurrentProfile: (currentProfile: Profile | null) => void;
  userSigNonce: number;
  setUserSigNonce: (userSigNonce: number) => void;
  uploadedWorks: LensfolioWorks;
  setUploadedWorks: (works: { [k: string]: any }) => void;
  activeTagFilter: string;
  setActiveTagFilter: (activeTagFilter: string) => void;
}

export const LENSFOLIO_ATTACHMENT_DEFAULT = {
  item: '',
  type: '',
  altTag: ''
};

export const LENSFOLIO_WORK_COVER_IMG_DEFAULT = {
  item: '',
  type: '',
  altTag: ''
};

export const UPLOADED_WORKS_DEAFULT = {
  description: '',
  attachment: LENSFOLIO_ATTACHMENT_DEFAULT,
  content: '',
  percent: 0,
  title: '',
  workCategory: CREATOR_WORK_CATEGORIES[0],
  coverImg: LENSFOLIO_WORK_COVER_IMG_DEFAULT,
  loading: false,
  statusText: '',
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
};

export const useAppStore = create<AppState>((set) => ({
  profiles: [],
  setProfiles: (profiles) => set(() => ({ profiles })),
  currentProfile: null,
  setCurrentProfile: (currentProfile) => set(() => ({ currentProfile })),
  userSigNonce: 0,
  setUserSigNonce: (userSigNonce) => set(() => ({ userSigNonce })),
  uploadedWorks: UPLOADED_WORKS_DEAFULT,
  setUploadedWorks: (uploadedData) =>
    set((state) => ({ uploadedWorks: { ...state.uploadedWorks, ...uploadedData } })),
  activeTagFilter: 'all',
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter })
}));

interface AppPersistState {
  profileId: string | null;
  setProfileId: (profileId: string | null) => void;
  staffMode: boolean;
  setStaffMode: (staffMode: boolean) => void;
  notificationCount: number;
  setNotificationCount: (notificationCount: number) => void;
}

export const useAppPersistStore = create(
  persist<AppPersistState>(
    (set) => ({
      profileId: null,
      setProfileId: (profileId) => set(() => ({ profileId })),
      staffMode: false,
      setStaffMode: (staffMode) => set(() => ({ staffMode })),
      notificationCount: 0,
      setNotificationCount: (notificationCount) => set(() => ({ notificationCount }))
    }),
    { name: LS_KEYS.LENSFOILIO_STORE }
  )
);
