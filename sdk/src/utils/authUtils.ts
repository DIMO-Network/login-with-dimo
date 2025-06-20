import {
  clearSessionData,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
} from '@storage/storageManager';

export const processAuthResponse = (
  { token, walletAddress, email, sharedVehicles }: any,
  setAuthenticated: (status: boolean) => void,
  onSuccess: (data: { token: string; sharedVehicles: string[] }) => void
) => {
  // This auth response may be triggered for a coupled or decoupled flow
  // If decoupled, it will only return token
  // If coupled, it will return token + updatedVehicles
  storeWalletAddressInLocalStorage(walletAddress);
  storeEmailInLocalStorage(email);
  if (token) {
    storeJWTInCookies(token);
    setAuthenticated(true);
    onSuccess({ token, sharedVehicles });
  }
};

export const logout = (setAuthenticated: (status: boolean) => void) => {
  clearSessionData();
  setAuthenticated(false);
};
