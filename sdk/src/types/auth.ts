import { EntryState } from "../enums";
import { TransactionData } from "./";

export interface AuthData {
  token: string;
  transactionHash?: string;
  transactionReceipt?: any;
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

export interface RedirectAuth {
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles
  vehicleMakes?: string[];
  expirationDate?: string;
  transactionData?: TransactionData;
}
