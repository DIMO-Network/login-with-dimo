export enum EntryState {
    EMAIL_INPUT = "EMAIL_INPUT",
    OTP_INPUT = "OTP_INPUT",
    SUCCESS = "SUCCESS",
    VEHICLE_MANAGER = "VEHICLE_MANAGER",
    ADVANCED_TRANSACTION = "ADVANCED_TRANSACTION",
    ERROR = "ERROR",
    LOADING = "LOADING",
}

export enum MessageEventType {
    READY = "READY",
    AUTH_INIT = "AUTH_INIT",
}

export enum DimoSDKModes {
    POPUP = "popup",
    EMBED = "embed",
    REDIRECT = "redirect"
}
  