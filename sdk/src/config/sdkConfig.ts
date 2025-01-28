type SdkConfig = {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: "development" | "production";
  options?: {
    forceEmail?: boolean;
    // Add more options here in the future, for properties that need to be global
  };
}

let sdkConfig: SdkConfig= {
  clientId: "",
  redirectUri: "",
};

export const initializeDimoSDK = ({
  clientId,
  redirectUri,
  apiKey = "some_api_key",
  environment = "production",
  options = {}, // ✅ Default to an empty object to prevent undefined issues
}: SdkConfig) => {
  sdkConfig = { clientId, redirectUri, apiKey, environment, options };
};

export const getDimoConfig = () => {
  if (!sdkConfig.clientId || !sdkConfig.redirectUri) {
    throw new Error(
      "Dimo SDK has not been initialized. Call `initializeDimoSDK` first."
    );
  }
  return sdkConfig;
};
