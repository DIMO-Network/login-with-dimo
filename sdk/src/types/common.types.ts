import { TransactionReceipt } from './transaction.types';
import { Permissions } from '../enums/permission.enum';

export interface AuthData {
  token: string;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  sharedVehicles?: string[];
  signature?: `0x${string}`;
  signer?: `0x${string}`;
}

export interface DimoActionParams {
  permissionTemplateId?: string;
  configurationId?: string;
  vehicles?: string[];
  vehicleMakes?: string[];
  onboarding?: string[];
  expirationDate?: string;
  utm?: string | null;
  powertrainTypes?: string[];
  permissions?: Permissions[];
}

export interface InternalDimoActionParams
  extends Omit<DimoActionParams, 'permissions'> {
  permissions?: string;
}
