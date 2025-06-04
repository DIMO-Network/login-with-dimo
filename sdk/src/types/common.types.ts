import { TransactionReceipt } from './transaction.types';
import { PERMISSIONS } from '../enums/permission.enum';

export type Permission = keyof typeof PERMISSIONS;

export interface AuthData {
  token: string;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  sharedVehicles?: string[];
}

export interface DimoActionParams {
  permissionTemplateId?: string;
  vehicles?: string[];
  vehicleMakes?: string[];
  onboarding?: string[];
  expirationDate?: string;
  utm?: string | null;
  powertrainTypes?: string[];
  permissions?: Permission[];
}

export interface InternalDimoActionParams
  extends Omit<DimoActionParams, 'permissions'> {
  permissions?: string;
}
