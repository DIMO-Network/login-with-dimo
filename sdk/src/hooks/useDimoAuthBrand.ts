import { useSyncExternalStore } from 'react';
import { getBrand, subscribeBrand } from '../config/sdkConfig';
import type { ManufacturerBrand } from '@utils/identityApi';

/**
 * Returns the OEM brand metadata (name + resolved logo URL) for the dev
 * license configured via `initializeDimoSDK`. Re-renders when the async
 * fetch resolves.
 *
 * Returns `null` until the fetch completes, or if the dev license has no
 * linked manufacturer (or the fetch fails). Consumers should fall back to
 * their default UI when this is `null`.
 */
export function useDimoAuthBrand(): ManufacturerBrand | null {
  return useSyncExternalStore(
    subscribeBrand,
    getBrand,
    // SSR snapshot — no brand is known before hydration.
    () => null
  );
}
