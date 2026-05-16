import { Environment } from '@enums/index';
import { fetchManufacturerBrand, ManufacturerBrand } from '@utils/identityApi';

let sdkConfig: {
  clientId: string;
  redirectUri: string;
  apiKey?: string;
  environment?: Environment;
  options?: {
    forceEmail?: boolean;
  };
} = {
  clientId: '',
  redirectUri: '',
};

/**
 * Brand metadata resolved from the dev license's linked Manufacturer NFT on
 * identity-api. Populated asynchronously by `initializeDimoSDK` and cached
 * here (plus localStorage when available) so subsequent renders read it
 * synchronously.
 */
let sdkBrand: ManufacturerBrand | null = null;
const brandSubscribers = new Set<() => void>();

const BRAND_STORAGE_KEY = 'dimo.brand.v1';
const BRAND_STORAGE_TTL_MS = 24 * 60 * 60 * 1000; // 24h — re-fetch daily.

function readBrandFromStorage(clientId: string): ManufacturerBrand | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const raw = window.localStorage.getItem(BRAND_STORAGE_KEY);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { clientId: string; cachedAt: number; brand: ManufacturerBrand };
    if (cached.clientId.toLowerCase() !== clientId.toLowerCase()) return null;
    if (Date.now() - cached.cachedAt > BRAND_STORAGE_TTL_MS) return null;
    return cached.brand;
  } catch {
    return null;
  }
}

function writeBrandToStorage(clientId: string, brand: ManufacturerBrand): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem(BRAND_STORAGE_KEY, JSON.stringify({
      clientId, cachedAt: Date.now(), brand,
    }));
  } catch { /* quota / private mode — ignore */ }
}

function setBrand(b: ManufacturerBrand | null): void {
  sdkBrand = b;
  brandSubscribers.forEach((cb) => cb());
}

/**
 * Internal: kicks off a brand fetch. Fire-and-forget — failures leave brand
 * null and the button keeps its default DIMO chrome.
 */
function loadBrand(clientId: string, environment: Environment): void {
  // Seed from localStorage first so the first render is already branded
  // (avoids a flash of DIMO before the network round-trip resolves).
  const cached = readBrandFromStorage(clientId);
  if (cached) setBrand(cached);

  // Then revalidate from identity-api in the background.
  fetchManufacturerBrand(clientId, environment).then((fresh) => {
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
export const getBrand = (): ManufacturerBrand | null => sdkBrand;

/**
 * Internal: subscribe to brand-state changes. Used by `useDimoAuthBrand` via
 * `useSyncExternalStore` to re-render components when the async fetch
 * resolves after init.
 */
export const subscribeBrand = (callback: () => void): (() => void) => {
  brandSubscribers.add(callback);
  return () => brandSubscribers.delete(callback);
};
