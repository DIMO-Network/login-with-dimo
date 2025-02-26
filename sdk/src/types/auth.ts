import { EntryState, EventTypes } from '../enums';
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
  altTitle?: boolean;
  apiKey?: string; // Avoid sending API key in the URL
  clientId?: string;
  dimoLogin: string;
  entryState: EntryState;
  forceEmail: boolean;
  redirectUri?: string;
}

export type DimoActionPayload = {
  eventType: EventTypes;
  permissionTemplateId?: string;
  vehicles?: string[];
  vehicleMakes?: string[];
  expirationDate?: string;
  transactionData?: TransactionData | string;
};
