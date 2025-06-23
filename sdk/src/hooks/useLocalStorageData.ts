import { useEffect, useState } from 'react';

import {
  getEmailFromLocalStorage,
  getWalletAddressFromLocalStorage,
} from '@storage/storageManager';

export const useLocalStorageData = (isAuthenticated: boolean) => {
  const [email, setEmail] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    setEmail(getEmailFromLocalStorage());
    setWalletAddress(getWalletAddressFromLocalStorage());
  }, [isAuthenticated]);

  return { email, walletAddress };
};
