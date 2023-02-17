import {
  LENS_ENV,
  MAINNET_API_URL,
  SERVERLESS_DEVELOPMENT_API_URL,
  SERVERLESS_MAINNET_API_URL,
  SERVERLESS_TESTNET_API_URL,
  TESTNET_API_URL
} from '../constants';

const getEnvConfig = (): {
  apiEndpoint: string;
  serverlessEndpoint: string;
  litProtocolEnvironment: string;
} => {
  switch (LENS_ENV) {
    case 'mainnet':
      return {
        apiEndpoint: MAINNET_API_URL,
        serverlessEndpoint: SERVERLESS_MAINNET_API_URL,
        litProtocolEnvironment: 'polygon'
      };
    case 'testnet':
      return {
        apiEndpoint: TESTNET_API_URL,
        serverlessEndpoint: SERVERLESS_TESTNET_API_URL,
        litProtocolEnvironment: 'mumbai'
      };
    default:
      return {
        apiEndpoint: TESTNET_API_URL,
        serverlessEndpoint: SERVERLESS_DEVELOPMENT_API_URL,
        litProtocolEnvironment: 'polygon'
      };
  }
};

export default getEnvConfig;
