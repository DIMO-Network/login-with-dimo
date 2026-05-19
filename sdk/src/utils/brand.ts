import { useDimoAuthBrand } from '@hooks/useDimoAuthBrand';
import type { BrandOverride } from '@dimo-types/index';
import type { ResolvedBrand } from '@components/BaseDimoButton';

/**
 * Merges the per-call `brandOverride` prop with the brand fetched at SDK
 * init and produces the ResolvedBrand shape that BaseDimoButton + the
 * popup/redirect URL payload consume.
 *
 *   - override.name     wins over fetched name
 *   - override.logoURI  wins over fetched logoURI (https expected at this
 *                       layer; the SDK no longer resolves ipfs:// itself
 *                       since dev-console-api emits ready URLs)
 *   - override.iconURI  wins over fetched iconURI
 *
 * Anything not overridden falls back to the init-time brand, or `null` if
 * no brand could be fetched.
 */
export function useResolvedBrand(override?: BrandOverride): ResolvedBrand {
  const fetched = useDimoAuthBrand();
  return {
    name:    override?.name         ?? fetched?.name         ?? null,
    logoURI: override?.logoURI      ?? fetched?.logoURI      ?? null,
    iconURI: override?.iconURI      ?? fetched?.iconURI      ?? null,
    primaryColor: override?.primaryColor ?? fetched?.primaryColor ?? null,
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
