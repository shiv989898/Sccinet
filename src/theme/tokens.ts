import { ViewStyle } from 'react-native';

export const palette = {
  // Brand / Primary
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryMuted: 'rgba(37, 99, 235, 0.10)',

  // Light Mode (Minimal Claymorphism)
  light: {
    background: '#F4F6FB',
    surface: '#FFFFFF',
    surfaceSubtle: '#F8FAFC',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#F8FAFC',
    border: '#EDF2F7',
    borderSubtle: '#E2E8F0',
    borderActive: '#2563EB',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
  },

  // Dark Mode (Minimal Claymorphism)
  dark: {
    background: '#0D111A',
    surface: '#161C28',
    surfaceSubtle: '#101524',
    surfaceElevated: '#1A2130',
    surfaceRecessed: '#101524',
    border: '#1E2638',
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    borderActive: '#3B82F6',
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    textInverse: '#0F172A',
  },

  // Status Colors
  success: '#10B981',
  successMuted: 'rgba(16, 185, 129, 0.12)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.12)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.12)',
  info: '#0EA5E9',
  infoMuted: 'rgba(14, 165, 233, 0.12)',
} as const;

export const clayTokens = {
  light: {
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#F8FAFC',
    surfaceTrack: '#EEF2F8',
    surfaceActivePill: '#FFFFFF',
    surfaceChipSelected: '#EFF6FF',
    surfaceChipSuggested: '#F8FAFC',
    borderCard: '#EDF2F7',
    borderRecessed: '#E2E8F0',
    borderChipSelected: '#BFDBFE',
    borderChipSuggested: '#E2E8F0',
    textChipSelected: '#1D4ED8',
    textChipSuggested: '#334155',
    shadowCard: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 3,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#2563EB',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 6,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 3,
      elevation: 1,
    } as ViewStyle,
    webCardShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.06), 0 4px 12px -2px rgba(15, 23, 42, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
    webRecessedShadow: 'inset 0 2px 4px rgba(15, 23, 42, 0.04)',
    webButtonShadow: '0 8px 20px -2px rgba(37, 99, 235, 0.35), 0 2px 6px -1px rgba(37, 99, 235, 0.2), inset 0 1px 1px 0 rgba(255, 255, 255, 0.35)',
    webPillShadow: '0 2px 8px rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15, 23, 42, 0.04), inset 0 1px 1px rgba(255, 255, 255, 0.9)',
    webChipShadow: '0 1px 3px rgba(15, 23, 42, 0.04)',
  },
  dark: {
    surface: '#161C28',
    surfaceElevated: '#1A2130',
    surfaceRecessed: '#101524',
    surfaceTrack: '#0F1420',
    surfaceActivePill: '#222A3D',
    surfaceChipSelected: '#1D2B48',
    surfaceChipSuggested: '#141926',
    borderCard: 'rgba(255, 255, 255, 0.06)',
    borderRecessed: 'rgba(255, 255, 255, 0.06)',
    borderChipSelected: 'rgba(59, 130, 246, 0.4)',
    borderChipSuggested: 'rgba(255, 255, 255, 0.06)',
    textChipSelected: '#93C5FD',
    textChipSuggested: '#CBD5E1',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 14 },
      shadowOpacity: 0.5,
      shadowRadius: 28,
      elevation: 8,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 18,
      elevation: 6,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 3,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    webCardShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.65), inset 0 1px 1px rgba(255, 255, 255, 0.08)',
    webRecessedShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.45)',
    webButtonShadow: '0 10px 25px -4px rgba(59, 130, 246, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
    webPillShadow: '0 4px 12px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
    webChipShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const typography = {
  sizes: {
    micro: 11,
    xs: 12,
    sm: 13,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 22,
    xxxl: 26,
    display: 32,
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
    lg: 48,
  },
  inputHeight: 48,
  avatarSize: {
    sm: 32,
    md: 44,
    lg: 64,
    xl: 88,
  },
  headerHeight: 56,
  bottomTabHeight: 64,
} as const;
