import { AuthData } from "./";

export interface BaseButtonProps {
  mode: "popup" | "embed" | "redirect";
  onSuccess: (authData: AuthData) => void; // Success callback
  onError: (error: Error) => void; // Error callback
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
