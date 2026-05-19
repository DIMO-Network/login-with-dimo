import { DimoSDKModes } from '@enums/index';
import { AuthData, DimoActionParams } from './common.types';

export interface ButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

/**
 * Per-call override for the OEM brand the button renders. Wins over the
 * brand fetched at init time from dev-console-api. All three fields are
 * optional — pass only what you want to override.
 *
 * `logoURI` and `iconURI` should be ready-to-render https URLs (the
 * dev-console-api already resolves IPFS CIDs to its gateway server-side).
 */
export interface BrandOverride {
  name?: string;
  logoURI?: string;
  iconURI?: string;
}

export interface BaseButtonProps extends DimoActionParams {
  mode: DimoSDKModes;
  altTitle?: boolean;
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  labels?: ButtonLabels;
  brandOverride?: BrandOverride;
}

export type LoginButtonProps = DimoActionParams;
