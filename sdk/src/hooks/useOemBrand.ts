import { useEffect, useState } from 'react';

import { Environment } from '@enums/index';
import { fetchOemBrand, OemBrand } from '@utils/devConsoleApi';
import { readBrandFromStorage, writeBrandToStorage } from '../config/sdkConfig';

/**
 * Resolves a specific console brand by `clientId + brandName` (mirrors how the
 * hosted login popup resolves it, so the in-app button and the popup always
 * agree). Seeds synchronously from the `clientId+brandName`-keyed localStorage
 * cache for a branded first paint, then revalidates from dev-console-api.
 *
 * Returns `null` until the fetch resolves, or if the named brand isn't in the
 * console (or the fetch fails) — callers fall back to default DIMO chrome.
 * An empty `brandName` resolves the license default brand.
 */
export function useOemBrand({
  clientId,
  environment = Environment.PRODUCTION,
  brandName,
}: {
  clientId: string;
  environment?: Environment;
  brandName?: string | null;
}): OemBrand | null {
  const [brand, setBrand] = useState<OemBrand | null>(
    () => readBrandFromStorage(clientId, brandName),
  );

  useEffect(() => {
    if (!clientId) {
      setBrand(null);
      return;
    }
    let active = true;
    // Re-seed from cache when the key inputs change (avoids a flash of the
    // previously resolved brand when switching selectors).
    setBrand(readBrandFromStorage(clientId, brandName));
    fetchOemBrand(clientId, environment, brandName)
      .then((fresh) => {
        if (!active || !fresh) return;
        setBrand(fresh);
        writeBrandToStorage(clientId, fresh, brandName);
      })
      .catch(() => {
        /* swallowed — keep cached/null so the button never blocks on brand */
      });
    return () => {
      active = false;
    };
  }, [clientId, environment, brandName]);

  return brand;
}
