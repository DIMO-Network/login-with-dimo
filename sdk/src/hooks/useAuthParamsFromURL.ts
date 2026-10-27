import { useEffect, useState } from 'react';

import { isTokenExpired } from '@token/tokenManager';
import {
  clearEmailFromLocalStorage,
  isValidCookieStringValue,
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
  takeEmailRequest,
} from '@storage/storageManager';

export const useAuthParamsFromURL = () => {
  const [isTokenStored, setIsTokenStored] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const walletAddress = params.get('walletAddress');
    const email = params.get('email');

    if (token && !isTokenExpired(token)) {
      storeJWTInCookies(token);
      setIsTokenStored(true);
    }

    if (walletAddress) {
      storeWalletAddressInLocalStorage(walletAddress);
    }

    // A button that asked for no email leaves the stored one as it was.
    if (token && takeEmailRequest() === 'none') return;

    if (isValidCookieStringValue(email)) {
      storeEmailInLocalStorage(email);
    } else if (token && walletAddress) {
      // A login redirect (token + walletAddress) without an email means this
      // user doesn't share it, so drop any email an earlier login left.
      // Transaction and signature redirects carry no walletAddress and leave
      // the stored email alone.
      clearEmailFromLocalStorage();
    }
  }, []);

  return { isTokenStored };
};
