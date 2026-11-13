import { DimoSDKModes } from '@enums/index';
import { AuthData, DimoActionParams, DimoLanguage, EmailRequest, LoginPrompt } from './common.types';

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
  /**
   * Language for the login screens this button opens, overriding the
   * `language` option of initializeDimoSDK.
   */
  language?: DimoLanguage;
  /** Overrides the `emailRequest` option of initializeDimoSDK for this button. */
  emailRequest?: EmailRequest;
  /**
   * `'select_account'` shows the account chooser; `'login'` requires a fresh
   * sign-in. Without it, the chooser is requested after `logout()`, until a
   * login completes.
   */
  prompt?: LoginPrompt;
  /** Pre-fills the email on the login's sign-in step. */
  loginHint?: string;
}

export type LoginButtonProps = DimoActionParams;
