import { useEffect, useState } from 'react';

import { isTokenExpired } from '@token/tokenManager';
import {
  clearEmailFromLocalStorage,
  clearSessionData,
  getRememberedEmailRequest,
  isValidCookieStringValue,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
  takeRedirectState,
} from '@storage/storageManager';

// What the login adds to the redirect URI for the SDK. Removed once read, so
// the token isn't left in the address bar and history or read again on reload.
// Other keys (error, transactionHash, signature…) stay for the app to read.
const SESSION_PARAMS = ['token', 'walletAddress', 'email', 'logout'];

const CONSUMED_KEYS = [...SESSION_PARAMS, 'dimoState'];

// The login's fragment is `key=value&…`. An app's own hash route has no
// `dimoState=`, so it is never read or changed.
const FRAGMENT_MARKER = /(^|&)dimoState=/;
const fragmentOf = (hash: string) => hash.replace(/^#/, '');

// Raw segments are filtered so the app's own content isn't re-encoded. A
// percent-encoded key is read but not stripped; the login never emits one.
const stripFragment = (hash: string): string => {
  const raw = fragmentOf(hash);
  if (!FRAGMENT_MARKER.test(raw)) return hash;
  const rest = raw
    .split('&')
    .filter((part) => !CONSUMED_KEYS.includes(part.split('=')[0]));
  return rest.length ? `#${rest.join('&')}` : '';
};

// Removes the consumed keys from both the query and the fragment.
const cleanAddressBar = () => {
  const query = new URLSearchParams(window.location.search);
  CONSUMED_KEYS.forEach((key) => query.delete(key));
  const search = query.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}${stripFragment(window.location.hash)}`
  );
};

const carriesSession = (p: URLSearchParams) =>
  SESSION_PARAMS.some((key) => p.has(key));

/**
 * Handles the login's redirect back: stores the session it returns, or clears
 * it for a logout. Only for a redirect this tab started, whose `dimoState`
 * matches the one redirectAuth kept: anyone can link to the app with a token,
 * wallet or email of their choosing, or with `logout=true`.
 *
 * The session comes back in the query, or in the fragment when the app opted
 * into `redirectResponseMode: 'fragment'`. A fragment is used only when it
 * carries the matching `dimoState`, and is preferred when both do. Once the
 * state matches, the consumed keys are always removed from both places.
 */
export const consumeRedirectReturn = (): {
  tokenStored: boolean;
  logout: boolean;
} => {
  const nothing = { tokenStored: false, logout: false };
  const rawFragment = fragmentOf(window.location.hash);
  const sources = [
    ...(FRAGMENT_MARKER.test(rawFragment) ? [new URLSearchParams(rawFragment)] : []),
    new URLSearchParams(window.location.search),
  ].filter(carriesSession);
  if (!sources.length) return nothing;

  // `find` stops at the first match, which uses the nonce up.
  const params = sources.find((p) => takeRedirectState(p.get('dimoState')));
  if (!params) {
    console.warn("Ignored a Login with DIMO return this page didn't start.");
    return nothing;
  }

  if (params.get('logout') === 'true') {
    clearSessionData();
    cleanAddressBar();
    return { tokenStored: false, logout: true };
  }

  const token = params.get('token');
  if (!token || isTokenExpired(token)) {
    cleanAddressBar();
    return nothing;
  }
  storeJWTInCookies(token);

  const walletAddress = params.get('walletAddress');
  storeWalletAddressInLocalStorage(walletAddress);

  // A button that asked for no email leaves the stored one as it was.
  if (getRememberedEmailRequest() !== 'none') {
    const email = params.get('email');
    if (isValidCookieStringValue(email)) {
      storeEmailInLocalStorage(email);
    } else if (walletAddress) {
      // A login (token + walletAddress) without an email means this user
      // doesn't share it, so drop any email an earlier login left.
      // Transaction and signature returns carry no walletAddress and leave
      // the stored email alone.
      clearEmailFromLocalStorage();
    }
  }
  cleanAddressBar();
  return { tokenStored: true, logout: false };
};

export const useRedirectReturn = () => {
  const [isTokenStored, setIsTokenStored] = useState(false);
  const [hasLogoutParam, setHasLogoutParam] = useState(false);

  useEffect(() => {
    const { tokenStored, logout } = consumeRedirectReturn();
    setIsTokenStored(tokenStored);
    setHasLogoutParam(logout);
  }, []);

  return { isTokenStored, hasLogoutParam };
};
