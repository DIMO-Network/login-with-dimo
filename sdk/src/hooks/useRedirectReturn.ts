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

const removeFromAddressBar = (params: URLSearchParams) => {
  [...SESSION_PARAMS, 'dimoState'].forEach((key) => params.delete(key));
  const query = params.toString();
  window.history.replaceState(
    window.history.state,
    '',
    `${window.location.pathname}${query ? `?${query}` : ''}${window.location.hash}`
  );
};

/**
 * Handles the login's redirect back: stores the session it returns, or clears
 * it for a logout. Only for a redirect this tab started, whose `dimoState`
 * matches the one redirectAuth kept: anyone can link to the app with a token,
 * wallet or email of their choosing, or with `logout=true`.
 */
export const useRedirectReturn = () => {
  const [isTokenStored, setIsTokenStored] = useState(false);
  const [hasLogoutParam, setHasLogoutParam] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!SESSION_PARAMS.some((key) => params.has(key))) return;
    if (!takeRedirectState(params.get('dimoState'))) {
      console.warn("Ignored a Login with DIMO return this page didn't start.");
      return;
    }

    if (params.get('logout') === 'true') {
      clearSessionData();
      setHasLogoutParam(true);
      removeFromAddressBar(params);
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
    removeFromAddressBar(params);
  }, []);

  return { isTokenStored, hasLogoutParam };
};
