import { maxTier } from "./graphUtils";

/**
 * utils/colors.js
 *
 * Defines the tier colors and exports them as needed.
 */

/**
 * Gold-to-amber palette — one entry per visual "stop".
 * getTierColor interpolates across this array so it works for any number
 * of tiers without needing to be updated when the data changes.
 */
export const TIER_COLORS = [
  "#e2b96f",
  "#d4a853",
  "#c49440",
  "#b07f2e",
  "#9c6b1e",
  "#875810",
  "#744806",
];

/**
 * Maps a tier integer to a hex colour string by interpolating across
 * TIER_COLORS relative to the maximum tier in the current dataset.
 */
export function getTierColor(tier) {
  const idx =
    maxTier === 0 ? 0 : (tier / maxTier) * (TIER_COLORS.length - 1);
  const hi = Math.ceil(idx);
  return TIER_COLORS[Math.min(hi, TIER_COLORS.length - 1)];
}
