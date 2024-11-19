let sdkConfig: {
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  environment?: "development" | "production";
} = {};

export const initializeDimoSDK = ({
  clientId,
  redirectUri,
  apiKey,
  environment = "production",
}: {
  clientId: string;
  redirectUri: string;
  apiKey: string;
  environment?: "development" | "production";
}) => {
  sdkConfig = { clientId, redirectUri, apiKey, environment };
};

export const getDimoConfig = () => {
  if (!sdkConfig.clientId || !sdkConfig.redirectUri || !sdkConfig.apiKey) {
    throw new Error(
      "Dimo SDK has not been initialized. Call `initializeDimoSDK` first."
    );
  }
  return sdkConfig;
};
