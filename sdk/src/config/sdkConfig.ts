import { Environment } from '@enums/index';
import { fetchOemBrand, OemBrand } from '@utils/devConsoleApi';

let sdkConfig: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: Environment;
  options?: {
    forceEmail?: boolean;
    tosUrl?: string;
    privacyPolicyUrl?: string;
  };
} = {
  clientId: '',
  redirectUri: '',
};

/**
 * Brand metadata resolved from dev-console-api at init time. Populated
 * asynchronously and cached here (plus localStorage when available) so
 * subsequent renders read it synchronously.
 */
let sdkBrand: OemBrand | null = null;
const brandSubscribers = new Set<() => void>();

// Cache key is namespaced per clientId so a browser that loads multiple
// DIMO-integrated apps doesn't constantly evict the cache for app A every
// time app B is opened. Each clientId gets its own slot.
const BRAND_STORAGE_KEY_PREFIX = 'dimo.brand.v1.';
const BRAND_STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — re-fetch daily.

// Keyed by clientId, plus brandName when a specific (non-default) brand is
// selected, so the default brand and each named brand get their own slot.
function brandStorageKey(clientId: string, brandName?: string | null): string {
  const base = BRAND_STORAGE_KEY_PREFIX + clientId.toLowerCase();
  return brandName ? `${base}.${brandName.toLowerCase()}` : base;
}

export function readBrandFromStorage(
  clientId: string,
  brandName?: string | null,
): OemBrand | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(brandStorageKey(clientId, brandName));
    if (!raw) return null;
    const cached = JSON.parse(raw) as { cachedAt: number; brand: OemBrand };
    if (Date.now() - cached.cachedAt > BRAND_STORAGE_TTL_MS) return null;
    return cached.brand;
  } catch {
    return null;
  }
}

export function writeBrandToStorage(
  clientId: string,
  brand: OemBrand,
  brandName?: string | null,
): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(brandStorageKey(clientId, brandName), JSON.stringify({
      cachedAt: Date.now(), brand,
    }));
  } catch { /* quota / private mode — ignore */ }
}

function setBrand(b: OemBrand | null): void {
  sdkBrand = b;
  brandSubscribers.forEach((cb) => cb());
}

/**
 * Internal: kicks off the brand fetch. Fire-and-forget — failures leave
 * brand null and the button keeps its default DIMO chrome.
 */
function loadBrand(clientId: string, environment: Environment): void {
  // Clear stale brand from a previous init before seeding from cache/network.
  setBrand(null);

  // Seed from localStorage first so the first render is already branded
  // (avoids a flash of DIMO before the network round-trip resolves).
  const cached = readBrandFromStorage(clientId);
  if (cached) setBrand(cached);

  // Then revalidate from dev-console-api in the background.
  fetchOemBrand(clientId, environment).then((fresh) => {
    if (!fresh) return;
    setBrand(fresh);
    writeBrandToStorage(clientId, fresh);
  }).catch(() => { /* swallowed — already typed as null */ });
}

export const initializeDimoSDK = ({
  clientId,
  redirectUri,
  apiKey = 'some_api_key',
  environment = Environment.PRODUCTION,
  options = {},
}: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: Environment;
  options?: {
    forceEmail?: boolean;
    tosUrl?: string;
    privacyPolicyUrl?: string;
  };
}) => {
  sdkConfig = { clientId, redirectUri, apiKey, environment, options };
  loadBrand(clientId, environment);
};

export const getDimoConfig = () => {
  if (!sdkConfig.clientId || !sdkConfig.redirectUri) {
    throw new Error(
      'Dimo SDK has not been initialized. Call `initializeDimoSDK` first.'
    );
  }
  return sdkConfig;
};

/** Returns the cached brand for the configured dev license, or null. */
export const getBrand = (): OemBrand | null => sdkBrand;

/**
 * Internal: subscribe to brand-state changes. Used by `useDimoAuthBrand` via
 * `useSyncExternalStore` to re-render components when the async fetch
 * resolves after init.
 */
export const subscribeBrand = (callback: () => void): (() => void) => {
  brandSubscribers.add(callback);
  return () => brandSubscribers.delete(callback);
};
