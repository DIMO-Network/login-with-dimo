import { DimoSDKModes } from '@enums/index';
import { DimoLanguage } from './common.types';

export interface ProvisionResult {
  clientId: string;
  privateKey: string; // raw hex, no 0x prefix
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
  /** Button text. Defaults to "Set up developer access". */
  label?: string;
  language?: DimoLanguage;
}
