import { ViewStyle } from 'react-native';

export const palette = {
  // Brand / Primary
  primary: '#2563EB',
  primaryLight: '#3B82F6',
  primaryDark: '#1D4ED8',
  primaryMuted: 'rgba(37, 99, 235, 0.10)',

  // Light Mode (True Claymorphism)
  light: {
    background: '#EEF1F7', // Soft porcelain clay canvas
    surface: '#FFFFFF',
    surfaceSubtle: '#F6F8FC',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#F6F8FC',
    border: 'rgba(255, 255, 255, 0.9)',
    borderSubtle: 'rgba(218, 226, 239, 0.6)',
    borderActive: '#2563EB',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
  },

  // Dark Mode (True Claymorphism)
  dark: {
    background: '#131722', // Soft matte slate clay canvas
    surface: '#1B2230',
    surfaceSubtle: '#161B26',
    surfaceElevated: '#202838',
    surfaceRecessed: '#161B26',
    border: 'rgba(255, 255, 255, 0.03)',
    borderSubtle: 'rgba(255, 255, 255, 0.02)',
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
    surfaceRecessed: '#F4F7FC',
    surfaceTrack: '#EFF2F8',
    surfaceActivePill: '#FFFFFF',
    surfaceChipSelected: '#EFF6FF',
    surfaceChipSuggested: '#F4F7FC',
    borderCard: 'rgba(255, 255, 255, 0.95)',
    borderRecessed: 'transparent',
    borderChipSelected: 'rgba(191, 219, 254, 0.7)',
    borderChipSuggested: 'transparent',
    textChipSelected: '#1D4ED8',
    textChipSuggested: '#334155',
    shadowCard: {
      shadowColor: '#10223E',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.05,
      shadowRadius: 20,
      elevation: 3,
    } as ViewStyle,
    shadowCardPressed: {
      shadowColor: '#10223E',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.04,
      shadowRadius: 8,
      elevation: 1,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#1D4ED8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 10,
      elevation: 3,
    } as ViewStyle,
    shadowButtonPressed: {
      shadowColor: '#1D4ED8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 1,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#10223E',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 5,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#10223E',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.04,
      shadowRadius: 3,
      elevation: 1,
    } as ViewStyle,
    webCardShadow:
      '0 16px 36px -6px rgba(20, 35, 65, 0.05), 0 4px 12px -2px rgba(20, 35, 65, 0.02), inset 0 1px 1px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 2px 0 rgba(190, 202, 222, 0.12)',
    webCardHoverShadow:
      '0 20px 42px -6px rgba(20, 35, 65, 0.08), 0 6px 16px -2px rgba(20, 35, 65, 0.03), inset 0 1px 1px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 2px 0 rgba(190, 202, 222, 0.15)',
    webCardPressedShadow:
      '0 6px 16px -4px rgba(20, 35, 65, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 1px 0 rgba(190, 202, 222, 0.1)',
    webRecessedShadow:
      'inset 0 2px 4px 0 rgba(20, 35, 65, 0.05), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.85)',
    webRecessedFocusedShadow:
      'inset 0 1px 2px 0 rgba(20, 35, 65, 0.04), 0 0 0 2.5px rgba(37, 99, 235, 0.15)',
    webRecessedTrackShadow:
      'inset 0 2px 4px 0 rgba(20, 35, 65, 0.06), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.85)',
    webButtonShadow:
      '0 8px 18px -4px rgba(29, 78, 216, 0.22), 0 2px 6px -1px rgba(29, 78, 216, 0.12), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 3px 0 rgba(15, 45, 130, 0.25)',
    webButtonPressedShadow:
      '0 3px 8px -2px rgba(29, 78, 216, 0.18), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 2px 0 rgba(15, 45, 130, 0.3)',
    webSecondaryButtonShadow:
      '0 4px 12px -2px rgba(20, 35, 65, 0.05), 0 1px 3px 0 rgba(20, 35, 65, 0.02), inset 0 1px 1.5px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1.5px 0 rgba(190, 202, 222, 0.18)',
    webSecondaryButtonPressedShadow:
      '0 1.5px 4px 0 rgba(20, 35, 65, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
    webPillShadow:
      '0 3px 8px 0 rgba(20, 35, 65, 0.07), inset 0 1px 1.5px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1.5px 0 rgba(200, 210, 228, 0.18)',
    webChipShadow:
      '0 2px 5px 0 rgba(20, 35, 65, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1px 0 rgba(200, 210, 228, 0.12)',
    webChipSelectedShadow:
      '0 2px 6px 0 rgba(37, 99, 235, 0.10), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 1px 0 rgba(191, 219, 254, 0.25)',
  },
  dark: {
    surface: '#1B2230',
    surfaceElevated: '#202838',
    surfaceRecessed: '#161B26',
    surfaceTrack: '#141822',
    surfaceActivePill: '#242C3D',
    surfaceChipSelected: '#1E2940',
    surfaceChipSuggested: '#161B26',
    borderCard: 'rgba(255, 255, 255, 0.05)',
    borderRecessed: 'transparent',
    borderChipSelected: 'rgba(59, 130, 246, 0.35)',
    borderChipSuggested: 'transparent',
    textChipSelected: '#93C5FD',
    textChipSuggested: '#CBD5E1',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.38,
      shadowRadius: 20,
      elevation: 4,
    } as ViewStyle,
    shadowCardPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 10,
      elevation: 2,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.38,
      shadowRadius: 10,
      elevation: 3,
    } as ViewStyle,
    shadowButtonPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.28,
      shadowRadius: 5,
      elevation: 1,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 1,
    } as ViewStyle,
    webCardShadow:
      '0 18px 36px -6px rgba(0, 0, 0, 0.4), inset 0 1px 1px 0 rgba(255, 255, 255, 0.06), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.3)',
    webCardHoverShadow:
      '0 22px 42px -6px rgba(0, 0, 0, 0.48), inset 0 1px 1px 0 rgba(255, 255, 255, 0.08), inset 0 -1.5px 2px 0 rgba(0, 0, 0, 0.3)',
    webCardPressedShadow:
      '0 8px 18px -4px rgba(0, 0, 0, 0.35), inset 0 1px 1px 0 rgba(255, 255, 255, 0.04), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.35)',
    webRecessedShadow:
      'inset 0 2px 4px 0 rgba(0, 0, 0, 0.42), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.02)',
    webRecessedFocusedShadow:
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.3), 0 0 0 2.5px rgba(59, 130, 246, 0.25)',
    webRecessedTrackShadow:
      'inset 0 2px 4px 0 rgba(0, 0, 0, 0.45), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.02)',
    webButtonShadow:
      '0 8px 20px -4px rgba(0, 0, 0, 0.45), 0 2px 6px -1px rgba(0, 0, 0, 0.3), inset 0 1.5px 1.5px 0 rgba(255, 255, 255, 0.25), inset 0 -2px 3px 0 rgba(0, 0, 0, 0.3)',
    webButtonPressedShadow:
      '0 3px 8px -2px rgba(0, 0, 0, 0.35), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.15), inset 0 -1px 2px 0 rgba(0, 0, 0, 0.35)',
    webSecondaryButtonShadow:
      '0 4px 12px -2px rgba(0, 0, 0, 0.32), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.07), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.25)',
    webSecondaryButtonPressedShadow:
      '0 1.5px 4px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.04)',
    webPillShadow:
      '0 3px 8px 0 rgba(0, 0, 0, 0.3), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.08), inset 0 -1px 1.5px 0 rgba(0, 0, 0, 0.25)',
    webChipShadow:
      '0 2px 5px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.06)',
    webChipSelectedShadow:
      '0 2px 6px 0 rgba(0, 0, 0, 0.25), inset 0 1px 1.5px 0 rgba(59, 130, 246, 0.3), inset 0 -1px 1px 0 rgba(0, 0, 0, 0.3)',
  },
} as const;

export { motionTokens } from './motion';
export const motion = {
  duration: {
    instant: 80,
    fast: 150,
    normal: 220,
    deliberate: 300,
    slow: 450,
    stagger: 40,
  },
  distance: {
    subtle: 4,
    normal: 8,
    card: 12,
    sheet: 24,
  },
  scale: {
    pressedButton: 0.975,
    pressedCard: 0.988,
    pressedChip: 0.96,
    entranceStart: 0.99,
  },
  easing: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    subtle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  spring: {
    tactile: { tension: 300, friction: 20 },
    gentle: { tension: 190, friction: 18 },
    snappy: { tension: 320, friction: 24 },
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
  card: 24,
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
    normal: 1.45,
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

