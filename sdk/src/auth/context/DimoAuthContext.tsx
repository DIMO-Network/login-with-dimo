import React, { createContext, useContext, useEffect, useState } from 'react';

import {
  useAuthParamsFromURL,
  useLocalStorageData,
  useLogoutFromURL,
} from '@hooks/index';
import {
  getEmailFromLocalStorage,
  getJWTFromCookies,
} from '@storage/storageManager';
import { isTokenExpired } from '@token/tokenManager';

type DimoAuthContextType = {
  isAuthenticated: boolean;
  walletAddress: string | null;
  email: string | null;
  getValidJWT: () => string | null;
  /** The shared email; throws `No permission to access email` when there's none. */
  getEmail: () => string;
};

const DimoAuthContext = createContext<DimoAuthContextType | undefined>(
  undefined
);

type DimoAuthUpdaterContextType = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
const DimoAuthUpdaterContext = createContext<
  DimoAuthUpdaterContextType | undefined
>(undefined);

export const DimoAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const { isTokenStored } = useAuthParamsFromURL();
  const { hasLogoutParam } = useLogoutFromURL();
  const { email, walletAddress } = useLocalStorageData();

  // Reads storage only, not render state: onSuccess runs in the same tick the
  // response is stored or cleared, before React re-renders, so render state
  // can still hold the previous user's email.
  const getEmail = () => {
    const current = getEmailFromLocalStorage();
    if (current) {
      return current;
    }
    throw new Error('No permission to access email');
  };

  const getValidJWT = () => {
    const jwt = getJWTFromCookies();
    if (jwt && !isTokenExpired(jwt)) {
      return jwt;
    }
    if (jwt) {
      console.warn('Invalid or expired JWT.');
    }
    return null;
  };

  useEffect(() => {
    const jwt = getValidJWT();
    if (jwt) {
      setAuthenticated(true);
    }
  }, [isTokenStored, hasLogoutParam]);

  return (
    <DimoAuthContext.Provider
      value={{
        isAuthenticated,
        getValidJWT,
        email,
        getEmail,
        walletAddress,
      }}
    >
      <DimoAuthUpdaterContext.Provider value={{ setAuthenticated }}>
        {children}
      </DimoAuthUpdaterContext.Provider>
    </DimoAuthContext.Provider>
  );
};

export const useDimoAuthState = () => {
  const context = useContext(DimoAuthContext);
  if (!context) {
    throw new Error('useDimoAuthState must be used within a DimoAuthProvider');
  }
  return context;
};

export const useDimoAuthUpdater = () => {
  const context = useContext(DimoAuthUpdaterContext);
  if (!context) {
    throw new Error(
      'useDimoAuthUpdater must be used within a DimoAuthProvider'
    );
  }
  return context;
};
