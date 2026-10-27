/**
 * @file storageManager.ts
 * @description This module is responsible for managing JWT tokens.
 */

import { jwtDecode } from 'jwt-decode';
import type { EmailRequest } from '../types/common.types';

const DEFAULT_COOKIE_EXPIRATION_DAYS = 14; // Default expiration for cookies is 2 weeks

const getExpiration = (jwt: string) => {
  let expirationDate = new Date();
  const decoded = jwtDecode(jwt);
  if (decoded.exp) {
    expirationDate = new Date(decoded.exp * 1000);
  } else {
    expirationDate.setDate(expirationDate.getDate() + DEFAULT_COOKIE_EXPIRATION_DAYS);
  }
  return expirationDate;
};

export const createCookieString = (name: string, jwt: string): string => {
  const expires = getExpiration(jwt);
  let cookieString = `${name}=${jwt}; expires=${expires.toUTCString()}; path=/`;
  if (window.location.hostname !== 'localhost') {
    cookieString += '; SameSite=None; Secure';
  }
  return cookieString;
};

export const storeJWTInCookies = (jwt: string): void => {
  document.cookie = createCookieString('dimo_auth_token', jwt);
};

export const isValidCookieStringValue = (str: string | null | undefined): str is string => {
  return !!str && str !== 'undefined' && str !== 'null';
};

// The auth provider reads the stored user through useSyncExternalStore, so
// every write notifies it. Without this the email reached React a render after
// the login response, and getEmail() in onSuccess threw.
const storedUserListeners = new Set<() => void>();

export const subscribeToStoredUser = (listener: () => void): (() => void) => {
  storedUserListeners.add(listener);
  return () => {
    storedUserListeners.delete(listener);
  };
};

const notifyStoredUser = (): void => {
  storedUserListeners.forEach((listener) => listener());
};

export const storeWalletAddressInLocalStorage = (
  walletAddress: string
): void => {
  if (!isValidCookieStringValue(walletAddress)) return;
  localStorage.setItem(`dimo_wallet_address`, walletAddress);
  notifyStoredUser();
};

export const storeEmailInLocalStorage = (email: string): void => {
  if (!isValidCookieStringValue(email)) return;
  localStorage.setItem(`dimo_user_email`, email);
  notifyStoredUser();
};

/** Drops the stored email, e.g. when the latest login didn't share it. */
export const clearEmailFromLocalStorage = (): void => {
  localStorage.removeItem(`dimo_user_email`);
  notifyStoredUser();
};

export const getJWTFromCookies = (): string | null => {
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`dimo_auth_token=`));
  return cookie ? cookie.split('=')[1] : null;
};

// Reads run during render now, so a blocked localStorage (private mode, site
// data disabled) must not throw.
const readLocalStorage = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

export const getWalletAddressFromLocalStorage = (): string | null => {
  return readLocalStorage('dimo_wallet_address');
};

export const getEmailFromLocalStorage = (): string | null => {
  return readLocalStorage('dimo_user_email');
};

export const clearSessionData = (): void => {
  document.cookie = `dimo_auth_token=; Max-Age=0`;
  localStorage.removeItem(`dimo_wallet_address`);
  localStorage.removeItem(`dimo_user_email`);
  notifyStoredUser();
};

// A redirect login returns on a fresh page load, so the button's email request
// is kept in sessionStorage for the return trip. Blocked storage just means
// the return is handled as an email-asking request.
const EMAIL_REQUEST_KEY = 'dimo_email_request';

export const rememberEmailRequest = (emailRequest?: EmailRequest): void => {
  try {
    if (emailRequest) sessionStorage.setItem(EMAIL_REQUEST_KEY, emailRequest);
    else sessionStorage.removeItem(EMAIL_REQUEST_KEY);
  } catch {
    // storage unavailable
  }
};

/** The request the last redirect was made with, read once. */
export const takeEmailRequest = (): EmailRequest | undefined => {
  try {
    const value = sessionStorage.getItem(EMAIL_REQUEST_KEY);
    sessionStorage.removeItem(EMAIL_REQUEST_KEY);
    return value === 'none' || value === 'optional' || value === 'required'
      ? value
      : undefined;
  } catch {
    return undefined;
  }
};
