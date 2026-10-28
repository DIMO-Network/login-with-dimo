import {
  clearEmailFromLocalStorage,
  clearSessionData,
  isValidCookieStringValue,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
} from '@storage/storageManager';
import { AuthData, EmailRequest, MessageData } from '@dimo-types/index';

export const processAuthResponse = (
  {
    token,
    walletAddress,
    email,
    sharedVehicles,
    revokedVehicles,
    extendedVehicles,
    accountGranted,
  }: MessageData,
  setAuthenticated: (status: boolean) => void,
  onSuccess: (data: AuthData) => void,
  /** What the button asked for; `none` leaves the stored email alone. */
  emailRequest?: EmailRequest
) => {
  // A plain login returns the token (and email, if shared); a share also
  // returns what changed (shared, extended or revoked vehicles, accountGranted).
  storeWalletAddressInLocalStorage(walletAddress);
  // A request that didn't ask for the email says nothing about it: never hand
  // one over (older login builds may still send it), and keep the one an
  // earlier login shared.
  const asked = emailRequest !== 'none';
  const sharedEmail = asked && isValidCookieStringValue(email) ? email : undefined;
  if (sharedEmail) {
    storeEmailInLocalStorage(sharedEmail);
  } else if (token && asked) {
    // Each login says whether this user shares their email with the app. When
    // this one doesn't, drop any email left by an earlier user or login.
    clearEmailFromLocalStorage();
  }
  if (token) {
    storeJWTInCookies(token);
    setAuthenticated(true);
    onSuccess({
      token,
      sharedVehicles,
      ...(sharedEmail && { email: sharedEmail }),
      ...(revokedVehicles?.length && { revokedVehicles }),
      ...(extendedVehicles?.length && { extendedVehicles }),
      ...(accountGranted !== undefined && { accountGranted }),
    });
  }
};

export const logout = (setAuthenticated: (status: boolean) => void) => {
  clearSessionData();
  setAuthenticated(false);
};
