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
// `dimoState=`, so it is never parsed or changed.
const parseFragment = (hash: string): URLSearchParams | null => {
  const raw = hash.replace(/^#/, '');
  return /(^|&)dimoState=/.test(raw) ? new URLSearchParams(raw) : null;
};

// Drops the consumed keys from the raw fragment and keeps the rest as it was
// written (no re-encoding of what isn't ours).
const stripFragment = (hash: string): string => {
  const rest = hash
    .replace(/^#/, '')
    .split('&')
    .filter((part) => !CONSUMED_KEYS.includes(part.split('=')[0]));
  return rest.length ? `#${rest.join('&')}` : '';
};

const removeFromAddressBar = (query: URLSearchParams) => {
  CONSUMED_KEYS.forEach((key) => query.delete(key));
  const search = query.toString();
  const hash = parseFragment(window.location.hash)
    ? stripFragment(window.location.hash)
    : window.location.hash;
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${search ? `?${search}` : ''}${hash}`
  );
};

/**
 * Handles the login's redirect back: stores the session it returns, or clears
 * it for a logout. Only for a redirect this tab started, whose `dimoState`
 * matches the one redirectAuth kept: anyone can link to the app with a token,
 * wallet or email of their choosing, or with `logout=true`.
 *
 * The session comes back in the query, or in the fragment when the app opted
 * into `redirectResponseMode: 'fragment'`. A fragment is used only when it
 * carries the matching `dimoState`, and is preferred when both do.
 */
export const useRedirectReturn = () => {
  const [isTokenStored, setIsTokenStored] = useState(false);
  const [hasLogoutParam, setHasLogoutParam] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const fragment = parseFragment(window.location.hash);
    const carriesSession = (p: URLSearchParams | null) =>
      !!p && SESSION_PARAMS.some((key) => p.has(key));
    if (!carriesSession(query) && !carriesSession(fragment)) return;

    // The nonce is used up by the first match, so ask for the fragment first.
    let params: URLSearchParams;
    if (carriesSession(fragment) && takeRedirectState(fragment!.get('dimoState'))) {
      params = fragment!;
    } else if (carriesSession(query) && takeRedirectState(query.get('dimoState'))) {
      params = query;
    } else {
      console.warn("Ignored a Login with DIMO return this page didn't start.");
      return;
    }

    if (params.get('logout') === 'true') {
      clearSessionData();
      setHasLogoutParam(true);
      removeFromAddressBar(query);
      return;
    }

    const token = params.get('token');
    if (!token || isTokenExpired(token)) return;
    storeJWTInCookies(token);
    setIsTokenStored(true);

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
    removeFromAddressBar(query);
  }, []);

  return { isTokenStored, hasLogoutParam };
};
