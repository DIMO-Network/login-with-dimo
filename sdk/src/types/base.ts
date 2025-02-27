import { AuthData } from './';
import { LoginMode } from './';

export interface BaseButtonProps {
  altTitle?: boolean;
  mode: LoginMode;
  onError: (error: Error) => void; // Error callback
  onSuccess: (authData: AuthData) => void; // Success callback
}

export interface DynamicButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

export interface BaseLoginButtonProps {
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles
  vehicleMakes?: string[];
  expirationDate?: string;
  utm?: string | null;
}

export interface ExecuteAdvancedTransactionButtonProps {
  address: string;
  value?: string;
  abi: any;
  functionName: string;
  args: string[];
}
