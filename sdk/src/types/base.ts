import { LoginMode } from './LoginMode';
import { AuthData, DimoActionParams, ButtonLabels, TransactionParams } from './common';

export interface BaseButtonProps extends DimoActionParams {
  mode: LoginMode;
  altTitle?: boolean;
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  labels?: ButtonLabels;
}

export type LoginButtonProps = DimoActionParams;

export type ExecuteAdvancedTransactionButtonProps = TransactionParams;
