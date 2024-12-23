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
    // Only run these storage calls in the client environment
    if (typeof window !== "undefined") {
      if (walletAddress) storeWalletAddressInLocalStorage(walletAddress);
      if (email) storeEmailInLocalStorage(email);
      if (token) {
        storeJWTInCookies(token);
        setAuthenticated(true);
        onSuccess({ token });
      }
    }
};

export const logout = (setAuthenticated: (status: boolean) => void) => {
    // Only clear session data when window is available
    if (typeof window !== "undefined") {
        clearSessionData();
        setAuthenticated(false);
    }
};
