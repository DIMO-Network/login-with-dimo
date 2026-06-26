import { DimoSDKModes } from '@enums/index';

export interface ProvisionResult {
  clientId: string;
  privateKey: `0x${string}`;
  domain: string;
  tokenId: number;
}

export interface ProvisionDeveloperLicenseProps {
  mode: DimoSDKModes;
  domain: string;
  appName?: string;
  onSuccess: (result: ProvisionResult) => void;
  onError: (error: Error) => void;
  existingTokenId?: number;
  existingClientId?: string;
}
