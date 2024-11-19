let sdkConfig: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: "development" | "production";
} = {
  clientId: "",
  redirectUri: ""
};

export const initializeDimoSDK = ({
  clientId,
  redirectUri,
  apiKey = "some_api_key",
  environment = "production",
}: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: "development" | "production";
}) => {
  sdkConfig = { clientId, redirectUri, apiKey, environment };
};

export const getDimoConfig = () => {
  if (!sdkConfig.clientId || !sdkConfig.redirectUri) {
    throw new Error(
      "Dimo SDK has not been initialized. Call `initializeDimoSDK` first."
    );
  }
  return sdkConfig;
};