import { EntryState, EventTypes } from '@enums/index';
import { SignMessageData, TransactionData } from './transaction.types';
import {
  AuthData,
  DimoLanguage,
  EmailRequest,
  InternalDimoActionParams,
} from './common.types';

export interface EventHandlers {
  onSuccess: (data: AuthData) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BaseAuthParams {
  entryState: EntryState;
  dimoLogin: string;
  /** Kept for login builds that predate `emailRequest`. */
  forceEmail: boolean;
  emailRequest?: EmailRequest;
  clientId?: string;
  redirectUri?: string;
  apiKey?: string;
  altTitle?: boolean;
  brandName?: string;
  tosUrl?: string;
  privacyPolicyUrl?: string;
  language?: DimoLanguage;
}

export interface AuthPayload extends BaseAuthParams, EventHandlers {}

export interface DimoActionPayload extends InternalDimoActionParams {
  eventType: EventTypes;
  transactionData?: TransactionData | string;
  messageData?: SignMessageData | string;
  existingTokenId?: number;
  existingClientId?: string;
}
