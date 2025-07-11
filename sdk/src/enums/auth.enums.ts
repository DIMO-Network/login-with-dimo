export enum EntryState {
  EMAIL_INPUT = 'EMAIL_INPUT',
  OTP_INPUT = 'OTP_INPUT',
  SUCCESS = 'SUCCESS',
  VEHICLE_MANAGER = 'VEHICLE_MANAGER',
  ADVANCED_TRANSACTION = 'ADVANCED_TRANSACTION',
  ERROR = 'ERROR',
  LOADING = 'LOADING',
  LOGOUT = 'LOGOUT',
}

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
  PowertrainTypes = 'powertrainTypes',
}
