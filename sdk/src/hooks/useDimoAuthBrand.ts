import { useSyncExternalStore } from 'react';
import { getBrand, subscribeBrand } from '../config/sdkConfig';
import type { OemBrand } from '@utils/devConsoleApi';

/**
 * Returns the OEM brand metadata (name + resolved logo/icon URLs) for the
 * dev license configured via `initializeDimoSDK`. Re-renders when the
 * async fetch resolves.
 *
 * Returns `null` until the fetch completes, or if the dev license has no
 * brand configured (or the fetch fails). Consumers should fall back to
 * their default UI when this is `null`.
 */
export function useDimoAuthBrand(): OemBrand | null {
  return useSyncExternalStore(
    subscribeBrand,
    getBrand,
    // SSR snapshot — no brand is known before hydration.
    () => null,
  );
}
