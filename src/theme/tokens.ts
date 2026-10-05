import { ViewStyle } from 'react-native';

export const palette = {
  // Brand / Primary (Cobalt Blue from Stitch)
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  primaryMuted: 'rgba(59, 130, 246, 0.15)',

  // Secondary indicator (Cyan / Cool Slate from Stitch)
  secondary: '#4CD7F6',
  secondaryMuted: 'rgba(76, 215, 246, 0.15)',

  // Light Mode (True Claymorphism)
  light: {
    background: '#EEF1F7', // Soft porcelain clay canvas
    surface: '#FFFFFF',
    surfaceSubtle: '#F6F8FC',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#F1F4F9',
    surfaceTrack: '#E8EDF5',
    border: 'rgba(255, 255, 255, 0.95)',
    borderSubtle: 'rgba(218, 226, 239, 0.6)',
    borderActive: '#3B82F6',
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    textInverse: '#FFFFFF',
  },

  // Dark Mode (Machined Slate Claymorphism from Stitch DESIGN.md)
  dark: {
    background: '#0D111A', // Foundational void canvas base
    surface: '#161C28', // Surface elevation for cards and floating controls
    surfaceSubtle: '#121622',
    surfaceElevated: '#1C2230',
    surfaceRecessed: '#101522', // Substrate well for inputs and tracks
    surfaceTrack: '#0A0E17', // Container lowest
    border: 'rgba(255, 255, 255, 0.08)', // Inner rim highlight
    borderSubtle: 'rgba(255, 255, 255, 0.04)',
    borderActive: '#3B82F6',
    text: '#F8FAFC', // Crisp off-white
    textSecondary: '#94A3B8', // Muted cool slate
    textMuted: '#64748B',
    textInverse: '#0D111A',
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
      'inset 0 1px 2px 0 rgba(20, 35, 65, 0.04), 0 0 0 2.5px rgba(59, 130, 246, 0.25)',
    webRecessedTrackShadow:
      'inset 0 2px 4px 0 rgba(20, 35, 65, 0.06), inset 0 -1px 1.5px 0 rgba(255, 255, 255, 0.85)',
    webButtonShadow:
      '0 8px 18px -4px rgba(37, 99, 235, 0.22), 0 2px 6px -1px rgba(37, 99, 235, 0.12), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.35), inset 0 -2px 3px 0 rgba(15, 45, 130, 0.25)',
    webButtonPressedShadow:
      '0 3px 8px -2px rgba(37, 99, 235, 0.18), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.2), inset 0 -1px 2px 0 rgba(15, 45, 130, 0.3)',
    webSecondaryButtonShadow:
      '0 4px 12px -2px rgba(20, 35, 65, 0.05), 0 1px 3px 0 rgba(20, 35, 65, 0.02), inset 0 1px 1.5px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1.5px 0 rgba(190, 202, 222, 0.18)',
    webSecondaryButtonPressedShadow:
      '0 1.5px 4px 0 rgba(20, 35, 65, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 0.9)',
    webPillShadow:
      '0 3px 8px 0 rgba(20, 35, 65, 0.07), inset 0 1px 1.5px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1.5px 0 rgba(200, 210, 228, 0.18)',
    webChipShadow:
      '0 2px 5px 0 rgba(20, 35, 65, 0.04), inset 0 1px 1px 0 rgba(255, 255, 255, 1.0), inset 0 -1px 1px 0 rgba(200, 210, 228, 0.12)',
    webChipSelectedShadow:
      '0 2px 6px 0 rgba(59, 130, 246, 0.12), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.9), inset 0 -1px 1px 0 rgba(191, 219, 254, 0.25)',
  },
  dark: {
    surface: '#161C28', // Surface elevation from Stitch
    surfaceElevated: '#1C2230',
    surfaceRecessed: '#101522', // Substrate well from Stitch
    surfaceTrack: '#0A0E17', // Lowest container
    surfaceActivePill: '#262A34', // Highest active container
    surfaceChipSelected: '#1C2230',
    surfaceChipSuggested: '#101522',
    borderCard: 'rgba(255, 255, 255, 0.08)',
    borderRecessed: 'transparent',
    borderChipSelected: 'rgba(59, 130, 246, 0.45)',
    borderChipSuggested: 'rgba(255, 255, 255, 0.04)',
    textChipSelected: '#93C5FD',
    textChipSuggested: '#94A3B8',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 4,
    } as ViewStyle,
    shadowCardPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 2,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#3B82F6',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 3,
    } as ViewStyle,
    shadowButtonPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.35,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    // Dual-opposed directional claymorphism shadows matching Stitch DESIGN.md
    webCardShadow:
      '4px 8px 20px rgba(0, 0, 0, 0.45), -2px -2px 10px rgba(255, 255, 255, 0.03), inset 1px 1px 2px rgba(255, 255, 255, 0.08), inset -2px -2px 4px rgba(0, 0, 0, 0.35)',
    webCardHoverShadow:
      '4px 12px 28px rgba(0, 0, 0, 0.52), -2px -2px 10px rgba(255, 255, 255, 0.04), inset 1px 1px 2px rgba(255, 255, 255, 0.1), inset -2px -2px 4px rgba(0, 0, 0, 0.35)',
    webCardPressedShadow:
      '2px 4px 10px rgba(0, 0, 0, 0.4), inset 1px 1px 1px rgba(255, 255, 255, 0.06), inset -1px -1px 2px rgba(0, 0, 0, 0.35)',
    webRecessedShadow:
      'inset 2px 2px 6px rgba(0, 0, 0, 0.55), inset -1px -1px 2px rgba(255, 255, 255, 0.03)',
    webRecessedFocusedShadow:
      'inset 2px 2px 6px rgba(0, 0, 0, 0.55), 0 0 0 1.5px rgba(59, 130, 246, 0.35)',
    webRecessedTrackShadow:
      'inset 3px 3px 6px rgba(0, 0, 0, 0.6), inset -2px -2px 4px rgba(255, 255, 255, 0.02)',
    webButtonShadow:
      '0px 6px 16px rgba(59, 130, 246, 0.25), 2px 4px 12px rgba(0, 0, 0, 0.4), inset 1px 1px 2px rgba(255, 255, 255, 0.35), inset -2px -2px 4px rgba(0, 0, 0, 0.3)',
    webButtonPressedShadow:
      'inset 2px 2px 4px rgba(0, 0, 0, 0.5), inset -1px -1px 1px rgba(255, 255, 255, 0.2)',
    webSecondaryButtonShadow:
      '2px 4px 12px rgba(0, 0, 0, 0.3), inset 1px 1px 1px rgba(255, 255, 255, 0.06), inset -1px -1px 2px rgba(0, 0, 0, 0.3)',
    webSecondaryButtonPressedShadow:
      'inset 2px 2px 4px rgba(0, 0, 0, 0.5)',
    webPillShadow:
      '2px 4px 10px rgba(0, 0, 0, 0.4), inset 1px 1px 1px rgba(255, 255, 255, 0.08)',
    webChipShadow:
      '2px 3px 8px rgba(0, 0, 0, 0.35), inset 1px 1px 1px rgba(255, 255, 255, 0.06), inset -1px -1px 2px rgba(0, 0, 0, 0.3)',
    webChipSelectedShadow:
      '0 2px 8px rgba(59, 130, 246, 0.25), inset 1px 1px 1px rgba(255, 255, 255, 0.2), inset -1px -1px 2px rgba(0, 0, 0, 0.3)',
  },
} as const;

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
  sm: 8, // Compact sub-elements (chips, tags, badges) from Stitch
  md: 12, // Sub-buttons and secondary containers
  lg: 16, // Unified structural containers from Stitch DESIGN.md
  xl: 20,
  xxl: 24,
  card: 16, // Unified 16px corner rounding from Stitch DESIGN.md
  full: 9999, // Pill rounding from Stitch DESIGN.md
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

