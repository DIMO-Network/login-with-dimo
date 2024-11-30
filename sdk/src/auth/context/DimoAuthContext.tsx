// DimoAuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { getEmailFromLocalStorage, getJWTFromCookies, getWalletAddressFromLocalStorage } from "../../storage/storageManager";
import { isTokenExpired } from "../../token/tokenManager";

// Define the type of the context
type DimoAuthContextType = {
  isAuthenticated: boolean; // Read-only for app developers
  walletAddress: string | null;
  email: string | null;
  getValidJWT: () => string | null;
  getEmail: () => string | null;
};

// Create the context
const DimoAuthContext = createContext<DimoAuthContextType | undefined>(
  undefined
);

// Internal updater function type (hidden from the app)
type DimoAuthUpdaterContextType = {
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
};
const DimoAuthUpdaterContext = createContext<
  DimoAuthUpdaterContextType | undefined
>(undefined);

// Provider to manage auth state
export const DimoAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setAuthenticated] = useState(false);

  const hasEmailPermission = !!getEmailFromLocalStorage();
  const email = hasEmailPermission ? getEmailFromLocalStorage() : "";
  const walletAddress = getWalletAddressFromLocalStorage();

  const getEmail = () => {
    if (hasEmailPermission) {
      return email;
    } else {
      throw new Error("No permission to access email");
    }
  };    
  

  const getValidJWT = () => {
    const jwt = getJWTFromCookies();
    if (jwt && !isTokenExpired(jwt)) {
      return jwt;
    }
    console.warn("Invalid or expired JWT.");
    return null;
  }

  useEffect(() => {
    if (getValidJWT()) {
      setAuthenticated(true);
    }
  }, []);

  return (
    <DimoAuthContext.Provider value={{ isAuthenticated, getValidJWT, email, getEmail, walletAddress }}>
      <DimoAuthUpdaterContext.Provider value={{ setAuthenticated }}>
        {children}
      </DimoAuthUpdaterContext.Provider>
    </DimoAuthContext.Provider>
  );
};

// Hook to expose read-only auth state to developers
export const useDimoAuthState = () => {
  const context = useContext(DimoAuthContext);
  if (!context) {
    throw new Error("useDimoAuthState must be used within a DimoAuthProvider");
  }
  return context; // Only exposes isAuthenticated
};

// Internal SDK hook to update the state
export const useDimoAuthUpdater = () => {
  const context = useContext(DimoAuthUpdaterContext);
  if (!context) {
    throw new Error(
      "useDimoAuthUpdater must be used within a DimoAuthProvider"
    );
  }
  return context; // Exposes setAuthenticated only for SDK
};
