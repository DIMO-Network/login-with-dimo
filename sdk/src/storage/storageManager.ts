/**
 * @file storageManager.ts
 * @description This module is responsible for managing JWT tokens.
 */

const DEFAULT_COOKIE_EXPIRATION_DAYS = 14; // Default expiration for cookies is 2 weeks

export const createCookieString = (
  name: string,
  value: string,
): string => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + DEFAULT_COOKIE_EXPIRATION_DAYS);
  let cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  if (window.location.hostname !== 'localhost') {
    cookieString += '; SameSite=None; Secure';
  }
  return cookieString;
};

export const storeJWTInCookies = (jwt: string): void => {
  document.cookie = createCookieString('dimo_auth_token', jwt);
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
