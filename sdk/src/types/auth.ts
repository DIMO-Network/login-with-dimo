import { EventTypes } from '@enums/index';
import { TransactionData } from './TransactionData';
import { AuthData, BaseAuthParams, DimoActionParams } from './common';

export enum AuthParam {
  AltTitle = 'altTitle',
  ClientId = 'clientId',
  EntryState = 'entryState',
  ExpirationDate = 'expirationDate',
  ForceEmail = 'forceEmail',
  PermissionTemplateId = 'permissionTemplateId',
  RedirectUri = 'redirectUri',
  TransactionData = 'transactionData',
  Utm = 'utm',
  VehicleMakes = 'vehicleMakes',
  Onboarding = 'onboarding',
  Vehicles = 'vehicles',
  PowertrainTypes = 'powertrainTypes'
}

export interface AuthPayload extends BaseAuthParams {
  onSuccess: (authData: AuthData) => void;
  onError: (error: Error) => void;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DimoActionPayload extends DimoActionParams {
  eventType: EventTypes;
  transactionData?: TransactionData | string;
}
