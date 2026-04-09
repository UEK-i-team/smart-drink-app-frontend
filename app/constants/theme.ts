export const colors = {
  primary: '#C73E1D',
  primaryLight: '#F3D9D0',
  primaryDark: '#8C1F07',
  background: '#F8F4F2',
  backgroundMuted: 'rgba(235, 231, 230, 1)',
  card: '#ffffff',
  border: '#EFE6E1',
  textDark: '#2E1A1A',
  textMuted: '#4A4A4A',
  textLight: '#6B5F5B',
  textPlaceholder: '#999999',
  accent: '#FF6B35',
  black: '#111111',
  white: '#ffffff',
  inactive: '#cccccc',
  tabActive: '#111111',
  tabInactive: '#cecece',
  error: '#B00020',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  full: 999,
} as const;

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '700' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 14, fontWeight: '400' as const },
  caption: { fontSize: 12, fontWeight: '400' as const },
  label: { fontSize: 11, fontWeight: '700' as const, letterSpacing: 0.7 },
} as const;
