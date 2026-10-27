import { TransactionReceipt } from './transaction.types';
import { Permissions } from '../enums/permission.enum';
import { DocumentAccess } from '../enums/documents.enum';

/**
 * A cloudevent agreement signed into a vehicle grant. Mirrors the SACD
 * document's agreement shape. It always covers the signed-in user's own files
 * (DIMO login sets the source), and empty or missing `ids` means every event
 * of the type.
 */
export interface CloudEventAgreement {
  eventType: string;
  ids?: string[];
  tags?: string[];
}

/**
 * Language for the DIMO login screens. `en` and `ja` are supported; other
 * BCP 47 tags such as `ja-JP` are accepted and matched, and unsupported ones
 * fall back to the user's browser language.
 */
// `string & {}` keeps editor suggestions for the known codes.
export type DimoLanguage = 'en' | 'ja' | (string & {});

/**
 * Whether the app asks for the user's email. DIMO login asks once per app and
 * account, together with the rest of the request (or on a short "Continue to
 * {app}" step for a plain login), and remembers the answer.
 * - `none`: don't ask; `onSuccess` never includes an email.
 * - `optional` (the default): the user chooses.
 * - `required`: the user shares it to continue.
 */
export type EmailRequest = 'none' | 'optional' | 'required';

export interface AuthData {
  token: string;
  /**
   * The user's email, present only when they chose to share it with this app
   * (always, once they approve, when `emailRequest` is `required`).
   */
  email?: string;
  transactionHash?: string;
  transactionReceipt?: TransactionReceipt;
  sharedVehicles?: string[];
  /** Vehicles the user stopped sharing with this app (Manage → Stop sharing). */
  revokedVehicles?: string[];
  /** Vehicles whose sharing the user extended by a year. */
  extendedVehicles?: string[];
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
