/**
 * @file storageManager.ts
 * @description This module is responsible for managing JWT tokens.
 * 
 * It handles:
 * Storing tokens (cookies)
 * Retrieving tokens from cookies
 
 */

export const storeJWTInCookies = (jwt: string): void => {
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 10); // Set expiration to 10 years in the future

  document.cookie = `dimo_auth_token=${jwt}; expires=${expirationDate.toUTCString()}; path=/`;
};

// Utility function to store user properties in localStorage for a given clientId
export const storeWalletAddressInLocalStorage = (
  walletAddress: string
): void => {
  localStorage.setItem(`dimo_wallet_address`, walletAddress);
};

export const storeEmailInLocalStorage = (email: string): void => {
  localStorage.setItem(`dimo_user_email`, email);
};

export const getJWTFromCookies = (): string | null => {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`dimo_auth_token=`));
  return cookie ? cookie.split("=")[1] : null;
};

export const getWalletAddressFromLocalStorage = (): string | null => {
  const walletAddress = localStorage.getItem("dimo_wallet_address");
  return walletAddress;
};

export const getEmailFromLocalStorage = (): string | null => {
  const email = localStorage.getItem("dimo_user_email");
  return email;
};
