import { CustomFiltersTypes } from 'lens';
import getEnvConfig from './functions/getEnvConfig';

export const LENSFOLIO_APP_NAME = 'Lensfolio';
export const LENSFOLIO_APP_DESCRIPTION =
  'Lensfolio is a decentralized creator platform built with Lens protocol.';
export const LENSFOLIO_OG_IMAGE = '/banner.png';

export const LENS_ENV = process.env.NEXT_PUBLIC_ENVIRONMENT;
export const IS_MAINNET = LENS_ENV === 'mainnet';
export const RELAYER_ENABLED = true;
export const STATIC_ASSETS = 'https://assets.lensfolio.xyz';
export const STATIC_ASSETS_URL = 'https://assets.lensfolio.xyz';
export const STATIC_IMAGES_URL = `${STATIC_ASSETS_URL}/images`;
export const LENSFOLIO_WEBSITE_URL = IS_MAINNET ? 'https://lensfolio.xyz' : 'https://testnet.lensfolio.xyz';

export const EVER_API = 'https://endpoint.4everland.co';

// Lens
export const MAINNET_API_URL = 'https://api.lens.dev';
export const TESTNET_API_URL = 'https://api-mumbai.lens.dev';
export const STAGING_MAINNET_API_URL = 'https://staging-api-social-polygon.lens.crtlkey.com';
export const STAGING_TESTNET_API_URL = 'https://staging-api-social-mumbai.lens.crtlkey.com';
export const STAGING_API_URL = IS_MAINNET ? STAGING_MAINNET_API_URL : STAGING_TESTNET_API_URL;
export const LENS_API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL;
export const LENS_CUSTOM_FILTERS = [CustomFiltersTypes.Gardeners];
export const API_URL = IS_MAINNET ? MAINNET_API_URL : TESTNET_API_URL;
export const LENSHUB_PROXY_ADDRESS = IS_MAINNET
  ? '0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d'
  : '0x60Ae865ee4C725cd04353b5AAb364553f56ceF82';
export const LENS_PERIPHERY_ADDRESS = IS_MAINNET
  ? '0xeff187b4190E551FC25a7fA4dFC6cf7fDeF7194f'
  : '0xD5037d72877808cdE7F669563e9389930AF404E8';
export const WMATIC_TOKEN_ADDRESS = IS_MAINNET
  ? '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
  : '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889';
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

// Lensfolio Serverless API
export const SERVERLESS_MAINNET_API_URL = 'https://api.lensfolio.xyz';
export const SERVERLESS_TESTNET_API_URL = 'https://api-testnet.lensfolio.xyz';
export const SERVERLESS_DEVELOPMENT_API_URL = 'https://api-testnet.lensfolio.xyz';
// export const SERVERLESS_DEVELOPMENT_API_URL = 'http://localhost:4784';
export const SERVERLESS_URL = getEnvConfig().serverlessEndpoint;

// polygon
export const POLYGON_RPC_URL = IS_MAINNET
  ? 'https://rpc.ankr.com/polygon'
  : 'https://rpc.ankr.com/polygon_mumbai';

export const POLYGONSCAN_URL = IS_MAINNET ? 'https://polygonscan.com' : 'https://mumbai.polygonscan.com';
export const POLYGON_CHAIN_ID = IS_MAINNET ? 137 : 80001;

export const IMGPROXY_URL = 'https://media.lensfolio.xyz';

// cdn
export const IMAGE_CDN_URL = IS_MAINNET ? 'https://ik.imagekit.io/lenstubemain' : '';
export const VIDEO_CDN_URL = 'https://cdn.livepeer.com';

export const SCROLL_ROOT_MARGIN = '40% 0px';

// ipfs
export const IPFS_FREE_UPLOAD_LIMIT = IS_MAINNET ? 1000 : 100;
export const IPFS_GATEWAY = 'https://4everland.io/ipfs/';

export const EVER_ENDPOINT = 'https://endpoint.4everland.co';
export const EVER_REGION = 'us-west-2';
// export const EVER_ACCESS_KEY = process.env.EVER_ACCESS_KEY as string;
// export const EVER_ACCESS_SECRET = process.env.EVER_ACCESS_SECRET as string;
export const NEXT_PUBLIC_EVER_BUCKET_NAME = IS_MAINNET ? 'lensfolio' : 'testnet';

// bundlr
export const BUNDLR_NODE_URL = IS_MAINNET ? 'https://node1.bundlr.network' : 'https://devnet.bundlr.network';
export const BUNDLR_METADATA_UPLOAD_URL = IS_MAINNET
  ? 'https://node2.bundlr.network'
  : 'https://devnet.bundlr.network';
export const BUNDLR_CURRENCY = 'matic';
export const BUNDLR_WEBSITE_URL = 'https://bundlr.network';
export const ARWEAVE_WEBSITE_URL = 'https://arweave.net';
export const BUNDLR_PRIVATE_KEY = process.env.BUNDLR_PRIVATE_KEY as string;
export const BUNDLR_CONNECT_MESSAGE = 'Sign to initialize & estimate upload...';

// App Ids
// export const LENSFOLIO_APP_ID = 'Lensfolio-test1';
export const LENSFOLIO_APP_ID = 'Lensfolio-test2';

// admin
export const ADMIN_IDS = IS_MAINNET ? ['0x2d'] : ['0x2f'];

// other apps
export const LENSTER_WEBSITE_URL = IS_MAINNET ? 'https://lenster.xyz' : 'https://testnet.lenster.xyz';
export const OPENSEA_MARKETPLACE_URL = IS_MAINNET ? 'https://opensea.io' : 'https://testnets.opensea.io';
export const RARIBLE_MARKETPLACE_URL = IS_MAINNET ? 'https://rarible.com' : 'https://testnet.rarible.com';
export const LENSPORT_MARKETPLACE_URL = 'https://lensport.io';

// Named transforms
export const AVATAR = 'avatar';
export const COVER = 'cover';
export const ATTACHMENT = 'attachment';

// Localstorage keys
export const LS_KEYS = {
  LENSFOILIO_STORE: 'lensfoilio.store',
  TRANSACTION_STORE: 'transaction.store',
  TIMELINE_STORE: 'timeline.store',
  MESSAGE_STORE: 'message.store'
};

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_ATTACHMENTS_TYPES = [
  'application/zip',
  'application/vnd.rar',
  'application/octet-stream',
  'application/x-rar-compressed',
  'application/x-zip-compressed',
  'multipart/x-zip'
];

// S3 bucket
export const S3_BUCKET = {
  LENSFOLIO_MEDIA: 'lensfolio-media',
  LENSFOLIO_METADATA: 'lensfolio-metadata'
};

// Errors
export const ERRORS = {
  notMined:
    'A previous transaction may not been mined yet or you have passed in a invalid nonce. You must wait for that to be mined before doing another action, please try again in a few moments. Nonce out of sync.'
};
export const ERROR_MESSAGE = 'Oops, something went wrong!';
export const SIGN_IN_REQUIRED_MESSAGE = 'Sign in required';
