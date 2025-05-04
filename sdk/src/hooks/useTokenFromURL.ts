import { useEffect, useState } from 'react';

import { storeJWTInCookies } from '@storage/storageManager';
import { isTokenExpired } from '@token/tokenManager';

export const useTokenFromURL = () => {
  const [isTokenStored, setIsTokenStored] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token && !isTokenExpired(token)) {
      storeJWTInCookies(token);
      setIsTokenStored(true);
    }
  }, []);

  return { isTokenStored };
};
