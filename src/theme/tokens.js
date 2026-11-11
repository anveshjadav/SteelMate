/**
 * Design tokens — single source of truth for SteelMate.
 *
 * Derived from design.md (Falcon AI warm-light language), translated to
 * React Native idioms:
 *   - Warm paper neutrals tinted toward the orange brand hue
 *   - ONE committed accent (orange), green reserved for success states
 *   - Weight-carried type hierarchy (system fonts, no webfont)
 *   - Small, uniform radii (per this project's standing rule: no playful
 *     large-radius cards; 6 default, 10 cards/inputs, 12 bottom sheets)
 */

export const RADIUS = {
  sm: 6,
  md: 10,
  lg: 12, // bottom sheets / modals only
  pill: 999,
};

// No webfonts. Hierarchy is carried by weight (design.md: "weight carries
// hierarchy"), system faces only — never Inter / Space Grotesk.
export const TYPE = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

export const lightColors = {
  // Warm paper neutrals, tinted toward the orange brand hue.
  bg: '#F1EEE9',
  surface: '#FFFFFF',
  surface2: '#F6F1EA',
  surface3: '#EFE8DF',

  // Ink & muted (design.md: --ink #282828, --muted #777).
  text: '#282828',
  textSecondary: '#77716A',
  textTertiary: '#9A938A',

  // Peach borders & warm shadows (design.md card border rgb(255 233 218)).
  border: '#EBDFD2',
  borderStrong: '#D9C9BA',

  // Single committed accent (design.md --orange #FF6900).
  accent: '#FF6900',
  accentLight: '#FFE3CE',
  accentText: '#9A3F00',

  success: '#4D8C35',
  successLight: '#E9F2E1',
  successText: '#2E5A1D',

  warning: '#8A5A00',
  warningLight: '#FAEFDA',
  warningText: '#5E3E00',

  danger: '#B33A2B',
  dangerLight: '#FBE9E5',
  dangerText: '#7A2418',

  cardShadow: 'rgba(44,35,29,0.12)',
  headerBg: '#FFFFFF',
  tabActive: '#FF6900',
  tabInactive: '#9A938A',
};

export const darkColors = {
  bg: '#161311',
  surface: '#1E1A17',
  surface2: '#282320',
  surface3: '#322C27',

  text: '#F2EEE9',
  textSecondary: '#B8B0A7',
  textTertiary: '#847B72',

  border: '#3A332D',
  borderStrong: '#4E453D',

  accent: '#FF7A1F',
  accentLight: '#3A2410',
  accentText: '#FFB27A',

  success: '#6FBF42',
  successLight: '#1E2E12',
  successText: '#A8D97A',

  warning: '#E8A030',
  warningLight: '#2E2008',
  warningText: '#F0C070',

  danger: '#E05A48',
  dangerLight: '#2E1410',
  dangerText: '#F0958A',

  cardShadow: 'rgba(0,0,0,0.35)',
  headerBg: '#1E1A17',
  tabActive: '#FF7A1F',
  tabInactive: '#847B72',
};

export const palettes = { light: lightColors, dark: darkColors };
