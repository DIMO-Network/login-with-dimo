import { TransactionReceipt } from './transaction.types';
import { Permissions } from '../enums/permission.enum';
import { DocumentAccess } from '../enums/documents.enum';

/**
 * A cloudevent agreement signed into a vehicle grant. Mirrors the SACD
 * document's agreement shape; `source` defaults to the signed-in user, and
 * empty or missing `ids` means every event of the type.
 */
export interface CloudEventAgreement {
  eventType: string;
  source?: `0x${string}`;
  ids?: string[];
  tags?: string[];
}

export interface AuthData {
  token: string;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  sharedVehicles?: string[];
  accountGranted?: boolean;
  signature?: `0x${string}`;
  signer?: `0x${string}`;
}

export interface DimoActionParams {
  permissionTemplateId?: string;
  vehicles?: string[];
  vehicleMakes?: string[];
  onboarding?: string[];
  expirationDate?: string;
  utm?: string | null;
  powertrainTypes?: string[];
  permissions?: Permissions[];
}

/**
 * Document access for the vehicle-sharing buttons (ShareVehiclesWithDimo, and
 * LoginWithDimo with permissions). Needs `permissions` or `permissionTemplateId`
 * alongside it.
 */
export interface DocumentShareParams {
  /** Documents the app can read for each shared vehicle. */
  documents?: DocumentAccess[];
  /**
   * Raw cloudevent agreements, e.g. to limit a request to specific document
   * `ids`. DIMO login signs only the `DocumentAccess` event types and drops
   * anything else.
   */
  cloudEvents?: CloudEventAgreement[];
}

export interface InternalDimoActionParams
  extends Omit<DimoActionParams, 'permissions'> {
  permissions?: string;
  cloudEvent?: CloudEventAgreement[];
}
