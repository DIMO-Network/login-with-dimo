import { EntryState, EventTypes } from '@enums/index';
import { SignMessageData, TransactionData } from './transaction.types';
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
  /** OEM logo URL passed to the auth popup/redirect for brand-aware chrome. */
  icon?: string;
  /** OEM brand name used in popup/redirect copy (e.g. "Toyota"). */
  label?: string;
}

export interface AuthPayload extends BaseAuthParams, EventHandlers {}

export interface DimoActionPayload extends InternalDimoActionParams {
  eventType: EventTypes;
  transactionData?: TransactionData | string;
  messageData?: SignMessageData | string;
}
