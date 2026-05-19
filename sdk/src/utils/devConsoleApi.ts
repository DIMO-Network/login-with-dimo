/**
 * Minimal client for the DIMO developer-console-api brand endpoint.
 *
 *   GET https://console-api.dimo.org/api/brand?clientId=0xb92d74…
 *     200 { name, logoCid, iconCid, logoUrl, iconUrl, updatedAt }
 *     404 { error: 'not_found' }
 *
 * The endpoint resolves CID → HTTPS gateway URLs server-side, so the SDK
 * can drop `logoUrl` / `iconUrl` straight into an <img src=…>.
 *
 * All errors are swallowed and the function returns `null`. The button must
 * always render — never block auth on a brand lookup.
 */

import { Environment } from '@enums/index';

export interface OemBrand {
  /** OEM display name (e.g. "Toyota"). */
  name: string;
  /** Wide brand mark — resolved HTTPS URL ready for <img src>. */
  logoURI: string | null;
  /** Square icon — resolved HTTPS URL ready for <img src>. */
  iconURI: string | null;
  /** Primary accent color as a 7-char hex string (#RRGGBB) or null. */
  primaryColor: string | null;
}

const DEV_CONSOLE_API_URLS: Record<Environment, string> = {
  [Environment.LOCAL]:       'http://localhost:3001',
  [Environment.DEVELOPMENT]: 'https://console-api.dev.dimo.org',
  [Environment.PRODUCTION]:  'https://console-api.dimo.org',
};

interface BrandResponse {
  name?: string | null;
  logoCid?: string | null;
  iconCid?: string | null;
  logoUrl?: string | null;
  iconUrl?: string | null;
  primaryColor?: string | null;
}

const HEX_COLOR_RE = /^#[0-9a-fA-F]{6}$/;

export async function fetchOemBrand(
  clientId: string,
  environment: Environment = Environment.PRODUCTION,
): Promise<OemBrand | null> {
  if (!clientId) return null;
  const base = DEV_CONSOLE_API_URLS[environment] ?? DEV_CONSOLE_API_URLS[Environment.PRODUCTION];
  const url = `${base}/api/brand?clientId=${encodeURIComponent(clientId)}`;

  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const body = await r.json() as BrandResponse;
    if (!body.name) return null;
    return {
      name: body.name,
      logoURI: body.logoUrl ?? null,
      iconURI: body.iconUrl ?? null,
      primaryColor:
        body.primaryColor && HEX_COLOR_RE.test(body.primaryColor)
          ? body.primaryColor
          : null,
    };
  } catch {
    return null;
  }
}
