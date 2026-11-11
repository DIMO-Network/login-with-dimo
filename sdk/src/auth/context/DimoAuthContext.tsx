import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { useLocalStorageData, useRedirectReturn } from '@hooks/index';
import {
  clearSessionData,
  getEmailFromLocalStorage,
  getJWTFromCookies,
  markLoggedOut,
} from '@storage/storageManager';
import { isTokenExpired } from '@token/tokenManager';

type DimoAuthContextType = {
  isAuthenticated: boolean;
  walletAddress: string | null;
  email: string | null;
  getValidJWT: () => string | null;
  /** The shared email; throws `No permission to access email` when there's none. */
  getEmail: () => string;
  /**
   * Ends this app's session without opening the login: clears the stored
   * token, wallet and email. The next login button click then shows the
   * account chooser. To also end the session inside the login, use
   * `LogoutWithDimo`.
   */
  logout: () => void;
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
  const { isTokenStored, hasLogoutParam } = useRedirectReturn();
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

  const logout = useCallback(() => {
    try {
      clearSessionData();
    } finally {
      markLoggedOut();
      setAuthenticated(false);
    }
  }, []);

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
        logout,
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
