import { ViewStyle } from 'react-native';

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

  // Neutrals - Dark (Deep matte slate matching Stitch)
  dark: {
    background: '#0D111A',
    surface: '#161C28',
    surfaceSubtle: '#101524',
    surfaceElevated: '#1A2130',
    border: '#1E2638',
    borderSubtle: '#141926',
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
  cyan: '#4CD7F6',
} as const;

export const clayTokens = {
  light: {
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#F0F4FA',
    surfaceTrack: '#E5EBF5',
    surfaceChip: '#EBF2FF',
    surfaceNeutralChip: '#F1F5F9',
    borderHighlight: 'rgba(255, 255, 255, 0.95)',
    borderSubtle: 'rgba(0, 0, 0, 0.07)',
    borderActive: '#2563EB',
    shadowColor: '#64748B',
    shadowCard: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
      elevation: 6,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    webCardShadow: 'inset 0 1px 1px rgba(255,255,255,0.9), 0 16px 36px -8px rgba(100,116,139,0.12)',
    webRecessedShadow: 'inset 0 2px 4px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.8)',
    webButtonShadow: '0 10px 25px -4px rgba(37,99,235,0.35), inset 0 1px 1px rgba(255,255,255,0.45), inset 0 -2px 4px rgba(0,0,0,0.15)',
    webChipShadow: '0 2px 8px rgba(37,99,235,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
    webNeutralChipShadow: '0 2px 6px rgba(100,116,139,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
  },
  dark: {
    surface: '#161C28',
    surfaceElevated: '#1A2130',
    surfaceRecessed: '#101524',
    surfaceTrack: '#0F1420',
    surfaceChip: '#1D2B48',
    surfaceNeutralChip: '#141926',
    borderHighlight: 'rgba(255, 255, 255, 0.10)',
    borderSubtle: 'rgba(255, 255, 255, 0.05)',
    borderActive: 'rgba(59, 130, 246, 0.5)',
    shadowColor: '#000000',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.65,
      shadowRadius: 28,
      elevation: 10,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 22,
      elevation: 8,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
      elevation: 3,
    } as ViewStyle,
    webCardShadow: 'inset 0 1px 1px rgba(255,255,255,0.08), 0 20px 40px -10px rgba(0,0,0,0.65), 0 1px 0 rgba(255,255,255,0.05)',
    webRecessedShadow: 'inset 0 2px 4px rgba(0,0,0,0.45), inset 0 0 1px rgba(255,255,255,0.05)',
    webButtonShadow: '0 10px 25px -4px rgba(59,130,246,0.5), inset 0 1px 1px rgba(255,255,255,0.35), inset 0 -2px 4px rgba(0,0,0,0.25)',
    webChipShadow: '0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
    webNeutralChipShadow: '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
  },
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
  xxl: 28,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    micro: 10,
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
    lg: 50,
  },
  inputHeight: 48,
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 84,
  },
  headerHeight: 56,
  bottomTabHeight: 64,
} as const;
