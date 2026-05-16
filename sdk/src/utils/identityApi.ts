/**
 * Minimal identity-api client used to resolve OEM brand metadata from a
 * dev license clientId.
 *
 * - Reads `Manufacturer.imageURI` and `Manufacturer.name` filtered by the
 *   `devLicenseClientId` on-chain attribute.
 * - Resolves `ipfs://Qm…` to the DIMO IPFS HTTP gateway so an `<img>` element
 *   can render it directly.
 * - Swallows every error and returns `null`. The button must always render
 *   regardless of network conditions.
 */

import { Environment } from '@enums/index';

export interface ManufacturerBrand {
  /** Manufacturer name from on-chain (e.g. "Toyota"). */
  name: string;
  /** HTTPS-resolved logo URL ready to drop into an <img> src. */
  logoURI: string | null;
}

const IDENTITY_API_URLS: Record<Environment, string> = {
  [Environment.LOCAL]:       'http://localhost:8080/query',
  [Environment.DEVELOPMENT]: 'https://identity-api.dev.dimo.zone/query',
  [Environment.PRODUCTION]:  'https://identity-api.dimo.zone/query',
};

const IPFS_GATEWAY = 'https://assets.dimo.org/ipfs';

/** GraphQL query: lookup a manufacturer by its associated dev license clientId. */
const BRAND_QUERY = `
  query BrandByDevLicense($clientId: Address!) {
    manufacturer(by: { devLicenseClientId: $clientId }) {
      name
      imageURI
    }
  }
`.replace(/\s+/g, ' ').trim();

/**
 * Resolve an `imageURI` value to a URL that an <img> tag can load.
 *   ipfs://Qm…  → https://assets.dimo.org/ipfs/Qm…
 *   https://…   → returned as-is
 *   anything else (incl. null/empty) → null
 */
export function resolveImageURI(imageURI: string | null | undefined): string | null {
  if (!imageURI) return null;
  if (imageURI.startsWith('ipfs://')) {
    return `${IPFS_GATEWAY}/${imageURI.slice('ipfs://'.length)}`;
  }
  if (imageURI.startsWith('https://') || imageURI.startsWith('http://')) {
    return imageURI;
  }
  return null;
}

/**
 * One-shot brand lookup. Resolves to `null` on any failure — the button
 * silently keeps its default DIMO branding rather than blocking auth.
 */
export async function fetchManufacturerBrand(
  clientId: string,
  environment: Environment = Environment.PRODUCTION
): Promise<ManufacturerBrand | null> {
  if (!clientId) return null;
  const url = IDENTITY_API_URLS[environment] ?? IDENTITY_API_URLS[Environment.PRODUCTION];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: BRAND_QUERY,
        variables: { clientId },
      }),
    });
    if (!response.ok) return null;
    const body = await response.json() as {
      data?: { manufacturer?: { name?: string; imageURI?: string | null } | null };
    };
    const mfr = body.data?.manufacturer;
    if (!mfr?.name) return null;
    return {
      name: mfr.name,
      logoURI: resolveImageURI(mfr.imageURI),
    };
  } catch {
    return null;
  }
}
