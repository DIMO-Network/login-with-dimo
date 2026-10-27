import {
  clearEmailFromLocalStorage,
  clearSessionData,
  isValidCookieStringValue,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
} from '@storage/storageManager';
import { AuthData } from '@dimo-types/index';

export const processAuthResponse = (
  { token, walletAddress, email, sharedVehicles, accountGranted }: any,
  setAuthenticated: (status: boolean) => void,
  onSuccess: (data: AuthData) => void
) => {
  // This auth response may be triggered for a coupled or decoupled flow
  // If decoupled, it will only return token
  // If coupled, it will return token + updatedVehicles
  storeWalletAddressInLocalStorage(walletAddress);
  const sharedEmail = isValidCookieStringValue(email) ? email : undefined;
  if (sharedEmail) {
    storeEmailInLocalStorage(sharedEmail);
  } else if (token) {
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
      ...(accountGranted !== undefined && { accountGranted }),
    });
  }
};

export const logout = (setAuthenticated: (status: boolean) => void) => {
  clearSessionData();
  setAuthenticated(false);
};
