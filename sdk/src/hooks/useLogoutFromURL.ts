import { useEffect, useState } from 'react';

import { clearSessionData } from '@storage/storageManager';

export const useLogoutFromURL = () => {
  const [hasLogoutParam, setHasLogoutParam] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const logoutParam = params.get('logout');

    if (logoutParam === 'true') {
      clearSessionData();
      setHasLogoutParam(true);
    } else {
      setHasLogoutParam(false);
    }
  }, []);

  return { hasLogoutParam };
};
