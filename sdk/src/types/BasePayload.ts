import { EntryState } from "../enums/globalEnums";

export interface BasePayload {
  entryState: EntryState;
  onSuccess: (data: {
    token: string;
    transactionHash?: string;
    transactionReceipt?: any;
  }) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  dimoLogin: string;
  forceEmail: boolean;
  clientId?: string;
  redirectUri?: string;
  apiKey?: string; // Avoid sending API key in the URL
}
