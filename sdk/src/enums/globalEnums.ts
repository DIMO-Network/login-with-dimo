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

export enum MessageEventType {
  READY = 'READY',
  AUTH_INIT = 'AUTH_INIT',
  TRANSACTION_RESPONSE = 'transactionResponse',
  LOGOUT = 'logout',
}

export enum DimoSDKModes {
  POPUP = 'popup',
  EMBED = 'embed',
  REDIRECT = 'redirect',
}

export enum Environment {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  LOCAL = 'local',
}
