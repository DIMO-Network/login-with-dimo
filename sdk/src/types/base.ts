import { AuthData } from "./";

export interface BaseButtonProps {
  altTitle?: boolean;
  mode: "popup" | "embed" | "redirect";
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
}

export interface ExecuteAdvancedTransactionButtonProps {
  address: string;
  value?: string;
  abi: any;
  functionName: string;
  args: string[];
}
