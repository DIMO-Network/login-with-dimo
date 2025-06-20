import { AuthData } from './';
import { LoginMode } from './';

export interface BaseButtonProps {
  mode: LoginMode;
  altTitle?: boolean;
  onSuccess: (authData: AuthData) => void; // Success callback
  onError: (error: Error) => void; // Error callback
}

export interface LoginButtonProps {
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles
  vehicleMakes?: string[];
  onboarding?: string[];
  expirationDate?: string;
  utm?: string | null;
  powertrainTypes?: string[];
}

export interface DynamicButtonLabels {
  authenticatedLabel?: string;
  unAuthenticatedLabel?: string;
}

export interface ExecuteAdvancedTransactionButtonProps {
  address: string;
  value?: string;
  abi: any;
  functionName: string;
  args: string[];
}
