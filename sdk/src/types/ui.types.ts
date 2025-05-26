import { DimoSDKModes } from '@enums/index';
import { AuthData, DimoActionParams } from './common.types';

export interface ButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

export interface BaseButtonProps extends DimoActionParams {
  mode: DimoSDKModes;
  altTitle?: boolean;
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  labels?: ButtonLabels;
}

export type LoginButtonProps = DimoActionParams;
