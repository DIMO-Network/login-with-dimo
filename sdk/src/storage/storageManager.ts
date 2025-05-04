/**
 * @file storageManager.ts
 * @description This module is responsible for managing JWT tokens.
 */

const DEFAULT_COOKIE_EXPIRATION_YEARS = 10; // Default expiration for cookies is 10 years if not specified.

export const createCookieString = (
  name: string,
  value: string,
  expiresAt?: Date
): string => {
  const expirationDate = expiresAt || new Date();
  if (!expiresAt) {
    // If no expiration date is provided, cookies are set to expire in 10 years by default.
    expirationDate.setFullYear(
      expirationDate.getFullYear() + DEFAULT_COOKIE_EXPIRATION_YEARS
    );
  }
  let cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  if (window.location.hostname !== 'localhost') {
    cookieString += '; SameSite=None; Secure';
  }
  return cookieString;
};

export const storeJWTInCookies = (jwt: string, expiresAt?: Date): void => {
  document.cookie = createCookieString('dimo_auth_token', jwt, expiresAt);
};

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
    .split('; ')
    .find((row) => row.startsWith(`dimo_auth_token=`));
  return cookie ? cookie.split('=')[1] : null;
};

export const getWalletAddressFromLocalStorage = (): string | null => {
  return localStorage.getItem('dimo_wallet_address');
};

export const getEmailFromLocalStorage = (): string | null => {
  return localStorage.getItem('dimo_user_email');
};

export const clearSessionData = (): void => {
  document.cookie = `dimo_auth_token=; Max-Age=0`;
  localStorage.removeItem(`dimo_wallet_address`);
  localStorage.removeItem(`dimo_user_email`);
};
