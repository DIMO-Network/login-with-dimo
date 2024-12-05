import {
    clearSessionData,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
} from "../storage/storageManager";

export const processAuthResponse = (
  { token, walletAddress, email }: any,
  setAuthenticated: (status: boolean) => void,
  onSuccess: (data: {
    token: string;
    transactionHash?: string;
    transactionReceipt?: any;
  }) => void
) => {
  if (walletAddress) storeWalletAddressInLocalStorage(walletAddress);
  if (email) storeEmailInLocalStorage(email);
  if (token) {
    storeJWTInCookies(token);
    setAuthenticated(true);
    onSuccess({ token });
  }
};

export const logout = (setAuthenticated: (status: boolean) => void) => {
    clearSessionData();
    setAuthenticated(false);
};
