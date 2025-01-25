import { TransactionData } from "./TransactionData";

export interface RedirectAuth {
  permissionTemplateId?: string; // Optional: Permissions template
  vehicles?: string[]; // Optional: List of vehicles
  vehicleMakes?: string[];
  expirationDate?: string;
  transactionData?: TransactionData;
}
