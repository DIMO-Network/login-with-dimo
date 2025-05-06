import { useEffect, useState } from 'react';

import { isTokenExpired } from '@token/tokenManager';
import {
  storeEmailInLocalStorage,
  storeJWTInCookies,
  storeWalletAddressInLocalStorage,
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

    if (email) {
      storeEmailInLocalStorage(email);
    }
  }, []);

  return { isTokenStored };
};
