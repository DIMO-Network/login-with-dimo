import { EntryState, EventTypes } from '@enums/index';
import { TransactionData } from './transaction.types';
import { AuthData, InternalDimoActionParams } from './common.types';

export interface EventHandlers {
  onSuccess: (data: AuthData) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BaseAuthParams {
  entryState: EntryState;
  dimoLogin: string;
  forceEmail: boolean;
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  altTitle?: boolean;
}

export interface AuthPayload extends BaseAuthParams, EventHandlers {}

export interface DimoActionPayload extends InternalDimoActionParams {
  eventType: EventTypes;
  transactionData?: TransactionData | string;
}

