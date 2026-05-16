import { DimoSDKModes } from '@enums/index';
import { AuthData, DimoActionParams } from './common.types';

export interface ButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

/**
 * Per-call override for the brand the button renders. Wins over the brand
 * fetched at init time from identity-api. Both fields are optional — pass
 * only what you want to override (e.g. just `logoURI`, or just `name`).
 *
 * `logoURI` accepts an `ipfs://Qm…` URI or any https URL; the SDK resolves
 * ipfs URIs to the DIMO HTTP gateway internally.
 */
export interface BrandOverride {
  name?: string;
  logoURI?: string;
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
