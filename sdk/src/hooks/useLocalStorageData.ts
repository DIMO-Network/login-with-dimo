import { useSyncExternalStore } from 'react';

import {
  getEmailFromLocalStorage,
  getWalletAddressFromLocalStorage,
  subscribeToStoredUser,
} from '@storage/storageManager';

const serverSnapshot = () => null;

// Subscribed rather than re-read in an effect: the login response stores the
// email and flips isAuthenticated in the same tick, so both land in the same
// render and an app effect keyed on isAuthenticated already sees the email.
export const useLocalStorageData = () => {
  const email = useSyncExternalStore(
    subscribeToStoredUser,
    getEmailFromLocalStorage,
    serverSnapshot
  );
  const walletAddress = useSyncExternalStore(
    subscribeToStoredUser,
    getWalletAddressFromLocalStorage,
    serverSnapshot
  );

  return { email, walletAddress };
};
