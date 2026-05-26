/**
 * Pick a readable text color (#ffffff or #000000) for a given background hex,
 * using WCAG relative luminance. Used by the button to flip between light
 * and dark labels when the OEM picks a brand color.
 *
 *   readableTextOn('#C8A84B')  // → '#000000'  (gold → black)
 *   readableTextOn('#0B1E16')  // → '#ffffff'  (ink → white)
 */
export function readableTextOn(hex: string): '#ffffff' | '#000000' {
  const parsed = parseHex(hex);
  if (!parsed) return '#000000';
  const luma = relativeLuminance(parsed);
  return luma > 0.5 ? '#000000' : '#ffffff';
}

function parseHex(hex: string): { r: number; g: number; b: number } | null {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return null;
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function relativeLuminance({ r, g, b }: { r: number; g: number; b: number }): number {
  // WCAG 2.x. Channel values [0, 1] → linear-light → weighted sum.
  const ch = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * ch(r) + 0.7152 * ch(g) + 0.0722 * ch(b);
}
