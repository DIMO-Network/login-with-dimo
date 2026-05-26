import { DimoSDKModes } from '@enums/index';
import { AuthData, DimoActionParams } from './common.types';

export interface ButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

/**
 * Per-call brand *selector* — picks which console brand the button renders,
 * for licenses that have more than one. Assets (logo/icon/color) are always
 * resolved from the DIMO dev console by `clientId + name`; callers cannot
 * supply local assets. Omit `name` to render the license's default brand.
 */
export interface BrandOverride {
  /** Which console brand to render, for licenses with more than one. */
  name?: string;
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
