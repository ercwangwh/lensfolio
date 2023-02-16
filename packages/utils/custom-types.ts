// import type { WebBundlr } from '@bundlr-network/client'
import type {
  Attribute,
  Comment,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  Mirror,
  Post,
  RevertCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from 'lens';

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string;
  size: number;
  type: string;
  lastModified: string;
};

export type CollectModuleType = {
  isTimedFeeCollect?: boolean;
  isFreeCollect?: boolean;
  isFeeCollect?: boolean;
  isRevertCollect?: boolean;
  isLimitedFeeCollect?: boolean;
  isLimitedTimeFeeCollect?: boolean;
  amount?: { currency?: string; value: string };
  referralFee?: number;
  collectLimit?: string;
  followerOnlyCollect?: boolean;
  recipient?: string;
};

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean;
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean;
    mirrorsRestricted: boolean;
    degreesOfSeparation: number;
  } | null;
};

// export type UploadedVideo = {
//   stream: FileReaderStreamType | null;
//   preview: string;
//   videoType: string;
//   file: File | null;
//   title: string;
//   description: string;
//   thumbnail: string;
//   thumbnailType: string;
//   playbackId: string;
//   videoCategory: { tag: string; name: string };
//   percent: number;
//   isSensitiveContent: boolean;
//   isUploadToIpfs: boolean;
//   loading: boolean;
//   uploadingThumbnail: boolean;
//   videoSource: string;
//   buttonText: string;
//   durationInSeconds: string | null;
//   collectModule: CollectModuleType;
//   referenceModule: ReferenceModuleType;
//   isNSFW: boolean;
//   isNSFWThumbnail: boolean;
// };

export type LensfolioPublication = Post & Comment & Mirror;

export type IPFSUploadResult = {
  url: string;
  type: string;
};

export type StreamData = {
  streamKey: string;
  hostUrl: string;
  playbackId: string;
  streamId: string;
};

export type ProfileMetadata = {
  version: string;
  metadata_id: string;
  name: string | null;
  bio: string | null;
  cover_picture: string | null;
  attributes: Attribute[];
};

export type LensfolioCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings;

export interface CustomErrorWithData extends Error {
  data?: {
    message: string;
  };
}

export interface ProfileInterest {
  category: { label: string; id: string };
  subCategories: Array<{ label: string; id: string }>;
}

export interface LensfolioAttachment {
  item: string;
  type: string;
  altTag: string;
}

export interface LensfolioWorkCoverImg {
  item: string;
  type: string;
  altTag: string;
}

export interface LensfolioWorks {
  description: string;
  attachment: LensfolioAttachment;
  content: string;
  percent: number;
  title: string;
  coverImg: LensfolioWorkCoverImg;
  loading: boolean;
  statusText: string;
  collectModule: CollectModuleType;
  referenceModule: ReferenceModuleType;
}

export type QueuedWorkType = {
  coverImg: LensfolioWorkCoverImg;
  title: string;
  type?: string;
  txId?: string;
  txHash?: string;
};

export type QueuedCommentType = {
  comment: string;
  pubId: string;
  type?: string;
  txId?: string;
  txHash?: string;
};
