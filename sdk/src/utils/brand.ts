import { useDimoAuthBrand } from '@hooks/useDimoAuthBrand';
import { resolveImageURI } from './identityApi';
import type { BrandOverride } from '@dimo-types/index';
import type { ResolvedBrand } from '@components/BaseDimoButton';

/**
 * Merges the per-call `brandOverride` prop with the brand fetched at SDK
 * init and produces the ResolvedBrand shape that BaseDimoButton + the
 * popup/redirect URL payload consume.
 *
 * Resolution rules:
 *   - `brandOverride.name`     wins over fetched `name`.
 *   - `brandOverride.logoURI`  wins over fetched `logoURI`. ipfs:// is
 *                              resolved to the DIMO HTTP gateway here so
 *                              consumers can drop either scheme into the
 *                              prop.
 *   - Anything not overridden falls back to the init-time brand, or null
 *     if no brand could be fetched (or the dev license has no manufacturer
 *     linkage yet).
 */
export function useResolvedBrand(override?: BrandOverride): ResolvedBrand {
  const fetched = useDimoAuthBrand();

  const name = override?.name ?? fetched?.name ?? null;
  const overrideLogo = override?.logoURI ? resolveImageURI(override.logoURI) : null;
  const logoURI = overrideLogo ?? fetched?.logoURI ?? null;

  return { name, logoURI };
}

/**
 * Helper for label templates. Substitutes `{name}` placeholder when a brand
 * name is available; otherwise returns the SDK default verbatim.
 *
 *   formatBrandedLabel('Sign in with {name}', 'Toyota', 'Continue with DIMO')
 *   // → 'Sign in with Toyota'
 *
 *   formatBrandedLabel('Sign in with {name}', null, 'Continue with DIMO')
 *   // → 'Continue with DIMO'
 */
export function formatBrandedLabel(
  template: string,
  brandName: string | null,
  fallback: string
): string {
  if (!brandName) return fallback;
  return template.replace(/\{name\}/g, brandName);
}
