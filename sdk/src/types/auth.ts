import { EntryState, EventTypes } from '@enums/index';
import { TransactionData } from './';

export interface AuthData {
  token: string;
  transactionHash?: string;
  transactionReceipt?: any;
  sharedVehicles?: string[];
}

export interface BasePayload extends BasePayloadParams {
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface BasePayloadParams {
  entryState: EntryState;
  dimoLogin: string;
  forceEmail: boolean;
  clientId?: string;
  redirectUri?: string;
  apiKey?: string; // Avoid sending API key in the URL
}

export type DimoActionPayload = {
  eventType: EventTypes;
  permissionTemplateId?: string;
  vehicles?: string[];
  vehicleMakes?: string[];
  onboarding?: string[];
  expirationDate?: string;
  utm?: string | null;
  transactionData?: TransactionData | string;
};
