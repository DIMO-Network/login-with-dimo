import { EventTypes } from '@enums/index';
import { TransactionData } from './TransactionData';
import { AuthData, BaseAuthParams, DimoActionParams } from './common';

export interface AuthPayload extends BaseAuthParams {
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DimoActionPayload extends DimoActionParams {
  eventType: EventTypes;
  transactionData?: TransactionData | string;
}
