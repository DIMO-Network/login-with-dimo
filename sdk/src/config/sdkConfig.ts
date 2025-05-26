import { Environment } from '@enums/index';

let sdkConfig: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: Environment;
  options?: {
    forceEmail?: boolean;
  };
} = {
  clientId: '',
  redirectUri: '',
};

export const initializeDimoSDK = ({
  clientId,
  redirectUri,
  apiKey = 'some_api_key',
  environment = Environment.PRODUCTION,
  options = {},
}: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: Environment;
  options?: {
    forceEmail?: boolean;
  };
}) => {
  sdkConfig = { clientId, redirectUri, apiKey, environment, options };
};

export const getDimoConfig = () => {
  if (!sdkConfig.clientId || !sdkConfig.redirectUri) {
    throw new Error(
      'Dimo SDK has not been initialized. Call `initializeDimoSDK` first.'
    );
  }
  return sdkConfig;
};
