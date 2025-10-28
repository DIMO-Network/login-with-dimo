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
  ConfigurationId = 'configurationId',
  EntryState = 'entryState',
  ExpirationDate = 'expirationDate',
  ForceEmail = 'forceEmail',
  Onboarding = 'onboarding',
  PermissionTemplateId = 'permissionTemplateId',
  Permissions = 'permissions',
  PowertrainTypes = 'powertrainTypes',
  RedirectUri = 'redirectUri',
  TransactionData = 'transactionData',
  Utm = 'utm',
  VehicleMakes = 'vehicleMakes',
  Vehicles = 'vehicles',
}
