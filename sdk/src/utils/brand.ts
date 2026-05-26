import { useDimoAuthBrand } from '@hooks/useDimoAuthBrand';
import { useOemBrand } from '@hooks/useOemBrand';
import { getDimoConfig } from '../config/sdkConfig';
import type { BrandOverride } from '@dimo-types/index';
import type { ResolvedBrand } from '@components/BaseDimoButton';

/**
 * Resolves the brand a button renders entirely from the DIMO dev console —
 * callers can only *select* which brand (by `brandOverride.name`), never
 * supply assets. Produces the ResolvedBrand shape that BaseDimoButton + the
 * popup/redirect payload consume.
 *
 *   - no `name`  -> the license default brand (init-time fetch, `clientId`)
 *   - with `name` -> that specific console brand (`clientId + name`)
 *
 * Unknown/absent brand -> all fields null -> default DIMO chrome.
 */
export function useResolvedBrand(override?: BrandOverride): ResolvedBrand {
  const { clientId, environment } = getDimoConfig();
  // Both hooks run every render (Rules of Hooks); we pick based on `name`.
  const defaultBrand = useDimoAuthBrand();
  const namedBrand = useOemBrand({ clientId, environment, brandName: override?.name });
  const brand = override?.name ? namedBrand : defaultBrand;
  return {
    name:         brand?.name         ?? null,
    logoURI:      brand?.logoURI      ?? null,
    iconURI:      brand?.iconURI      ?? null,
    primaryColor: brand?.primaryColor ?? null,
  };
}

/**
 * Substitutes `{name}` in a label template when a brand name is available;
 * otherwise returns the fallback verbatim.
 */
export function formatBrandedLabel(
  template: string,
  brandName: string | null,
  fallback: string,
): string {
  if (!brandName) return fallback;
  return template.replace(/\{name\}/g, brandName);
}
