export const palette = {
  // Brand / Accents
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryMuted: 'rgba(37, 99, 235, 0.12)',

  // Neutrals - Light
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceSubtle: '#F1F5F9',
    surfaceElevated: '#FFFFFF',
    border: '#E2E8F0',
    borderSubtle: '#EDF2F7',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
  },

  // Neutrals - Dark
  dark: {
    background: '#090D16',
    surface: '#111827',
    surfaceSubtle: '#1F2937',
    surfaceElevated: '#1E293B',
    border: '#1F2937',
    borderSubtle: '#1A2234',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',
  },

  // Semantic Status
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#0EA5E9',
  infoMuted: 'rgba(14, 165, 233, 0.15)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
} as const;

export const borderRadius = {
  none: 0,
  xs: 4,
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export const dimensions = {
  buttonHeight: {
    sm: 36,
    md: 44,
    lg: 52,
  },
  inputHeight: 48,
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 96,
  },
  headerHeight: 56,
  bottomTabHeight: 64,
} as const;
