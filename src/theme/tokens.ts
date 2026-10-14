import { ViewStyle } from 'react-native';

export const palette = {
  // Apple System Blue Brand Primary
  primary: '#007AFF',
  primaryLight: '#409CFF',
  primaryDark: '#0062CC',
  primaryMuted: 'rgba(0, 122, 255, 0.12)',

  // Apple System Secondary (Indigo / Teal Accent)
  secondary: '#5E5CE6',
  secondaryMuted: 'rgba(94, 92, 230, 0.12)',

  // Light Appearance (Apple Liquid Glass System)
  light: {
    background: '#F0F3F9', // Calm frosted porcelain canvas
    surface: 'rgba(255, 255, 255, 0.82)', // Translucent frosted glass card
    surfaceSubtle: 'rgba(240, 244, 252, 0.75)',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: 'rgba(225, 232, 244, 0.65)', // Search & input well
    surfaceTrack: 'rgba(225, 232, 244, 0.60)',
    border: 'rgba(0, 0, 0, 0.07)', // Hairline separator
    borderSubtle: 'rgba(0, 0, 0, 0.04)',
    borderActive: '#007AFF',
    text: '#0F172A', // Crisp primary text (high contrast)
    textSecondary: '#475569', // Secondary slate
    textMuted: '#64748B', // Tertiary slate
    textInverse: '#FFFFFF',
  },

  // Dark Appearance (Apple Liquid Glass Midnight Canvas - Reference Image)
  dark: {
    background: '#0B101B', // Deep serene midnight slate canvas
    surface: 'rgba(22, 32, 50, 0.72)', // Translucent frosted glass card
    surfaceSubtle: 'rgba(16, 24, 38, 0.60)',
    surfaceElevated: 'rgba(28, 42, 66, 0.82)', // Elevated floating surface
    surfaceRecessed: 'rgba(18, 26, 42, 0.60)', // Input & search well
    surfaceTrack: 'rgba(14, 21, 35, 0.55)', // Segmented control track
    border: 'rgba(255, 255, 255, 0.12)', // Specular hairline highlight
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    borderActive: '#0A84FF',
    text: '#FFFFFF', // Crisp pure white
    textSecondary: '#94A3B8', // Cool secondary slate (> 7:1 contrast on #0B101B)
    textMuted: '#64748B', // Cool muted slate (> 4.8:1 contrast on #0B101B)
    textInverse: '#0B101B',
  },

  // Apple Status Colors
  success: '#10B981', // Clean Apple Emerald / Mint
  successMuted: 'rgba(16, 185, 129, 0.15)',
  warning: '#F59E0B',
  warningMuted: 'rgba(245, 158, 11, 0.15)',
  error: '#EF4444',
  errorMuted: 'rgba(239, 68, 68, 0.15)',
  info: '#0A84FF',
  infoMuted: 'rgba(10, 132, 255, 0.15)',
} as const;

export const glassTokens = {
  light: {
    regular: {
      fill: 'rgba(255, 255, 255, 0.78)',
      blurIntensity: 50,
      border: 'rgba(255, 255, 255, 0.75)',
    },
    clear: {
      fill: 'rgba(255, 255, 255, 0.48)',
      blurIntensity: 25,
      border: 'rgba(255, 255, 255, 0.50)',
    },
    prominent: {
      fill: 'rgba(255, 255, 255, 0.90)',
      blurIntensity: 70,
      border: 'rgba(255, 255, 255, 0.90)',
    },
    tabBar: {
      fill: 'rgba(255, 255, 255, 0.84)',
      blurIntensity: 65,
      borderTop: 'rgba(0, 0, 0, 0.07)',
    },
    highlight: 'rgba(255, 255, 255, 0.75)',
    ambientShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 3,
    } as ViewStyle,
  },
  dark: {
    regular: {
      fill: 'rgba(22, 32, 50, 0.70)',
      blurIntensity: 50,
      border: 'rgba(255, 255, 255, 0.12)',
    },
    clear: {
      fill: 'rgba(18, 26, 42, 0.45)',
      blurIntensity: 25,
      border: 'rgba(255, 255, 255, 0.08)',
    },
    prominent: {
      fill: 'rgba(28, 42, 66, 0.85)',
      blurIntensity: 70,
      border: 'rgba(255, 255, 255, 0.16)',
    },
    tabBar: {
      fill: 'rgba(13, 19, 32, 0.84)',
      blurIntensity: 65,
      borderTop: 'rgba(255, 255, 255, 0.10)',
    },
    highlight: 'rgba(255, 255, 255, 0.15)',
    ambientShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 20,
      elevation: 4,
    } as ViewStyle,
  },
} as const;

/**
 * Standardized Component Tokens
 * Replaces clay with Apple Glass / Material primitives while maintaining full API compatibility
 */
export const clayTokens = {
  light: {
    surface: 'rgba(255, 255, 255, 0.82)',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: 'rgba(225, 232, 244, 0.65)',
    surfaceTrack: 'rgba(225, 232, 244, 0.60)',
    surfaceActivePill: '#FFFFFF',
    surfaceChipSelected: 'rgba(0, 122, 255, 0.12)',
    surfaceChipSuggested: 'rgba(0, 0, 0, 0.04)',
    borderCard: 'rgba(0, 0, 0, 0.07)',
    borderRecessed: 'rgba(0, 0, 0, 0.04)',
    borderChipSelected: 'rgba(0, 122, 255, 0.35)',
    borderChipSuggested: 'transparent',
    textChipSelected: '#007AFF',
    textChipSuggested: '#475569',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    } as ViewStyle,
    shadowCardPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.20,
      shadowRadius: 8,
      elevation: 3,
    } as ViewStyle,
    shadowButtonPressed: {
      shadowColor: '#007AFF',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.12,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.03,
      shadowRadius: 2,
      elevation: 1,
    } as ViewStyle,
    webCardShadow:
      '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(255, 255, 255, 0.8)',
    webCardHoverShadow:
      '0 8px 24px -2px rgba(15, 23, 42, 0.10), 0 0 0 1px rgba(255, 255, 255, 0.9)',
    webCardPressedShadow:
      '0 2px 8px -2px rgba(15, 23, 42, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    webRecessedShadow:
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.04)',
    webRecessedFocusedShadow:
      '0 0 0 3px rgba(0, 122, 255, 0.25), inset 0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px #007AFF',
    webRecessedTrackShadow:
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.03)',
    webButtonShadow:
      '0 4px 14px -2px rgba(0, 122, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
    webButtonPressedShadow:
      '0 2px 6px -1px rgba(0, 122, 255, 0.25)',
    webSecondaryButtonShadow:
      '0 2px 8px -1px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.07)',
    webSecondaryButtonPressedShadow:
      '0 1px 4px 0 rgba(15, 23, 42, 0.04)',
    webPillShadow:
      '0 2px 8px rgba(15, 23, 42, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
    webChipShadow:
      '0 1px 3px rgba(15, 23, 42, 0.04)',
    webChipSelectedShadow:
      '0 2px 6px rgba(0, 122, 255, 0.15)',
  },
  dark: {
    surface: 'rgba(22, 32, 50, 0.72)',
    surfaceElevated: 'rgba(28, 42, 66, 0.82)',
    surfaceRecessed: 'rgba(18, 26, 42, 0.60)',
    surfaceTrack: 'rgba(14, 21, 35, 0.55)',
    surfaceActivePill: 'rgba(38, 54, 84, 0.85)',
    surfaceChipSelected: 'rgba(10, 132, 255, 0.22)',
    surfaceChipSuggested: 'rgba(255, 255, 255, 0.08)',
    borderCard: 'rgba(255, 255, 255, 0.12)',
    borderRecessed: 'rgba(255, 255, 255, 0.06)',
    borderChipSelected: 'rgba(10, 132, 255, 0.45)',
    borderChipSuggested: 'rgba(255, 255, 255, 0.08)',
    textChipSelected: '#409CFF',
    textChipSuggested: '#94A3B8',
    shadowCard: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 4,
    } as ViewStyle,
    shadowCardPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 2,
    } as ViewStyle,
    shadowButton: {
      shadowColor: '#0A84FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 12,
      elevation: 3,
    } as ViewStyle,
    shadowButtonPressed: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    shadowPill: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.30,
      shadowRadius: 6,
      elevation: 2,
    } as ViewStyle,
    shadowChip: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.20,
      shadowRadius: 4,
      elevation: 1,
    } as ViewStyle,
    webCardShadow:
      '0 4px 24px -2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.10)',
    webCardHoverShadow:
      '0 8px 32px -4px rgba(0, 0, 0, 0.45), 0 0 0 1px rgba(255, 255, 255, 0.16)',
    webCardPressedShadow:
      '0 2px 10px -1px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webRecessedShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webRecessedFocusedShadow:
      '0 0 0 3px rgba(10, 132, 255, 0.25), inset 0 1px 2px rgba(0, 0, 0, 0.35), 0 0 0 1px #0A84FF',
    webRecessedTrackShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.30), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    webButtonShadow:
      '0 4px 16px rgba(10, 132, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.20)',
    webButtonPressedShadow:
      '0 2px 8px rgba(10, 132, 255, 0.20)',
    webSecondaryButtonShadow:
      '0 2px 10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.12)',
    webSecondaryButtonPressedShadow:
      '0 1px 4px rgba(0, 0, 0, 0.20), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webPillShadow:
      '0 2px 10px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.14)',
    webChipShadow:
      '0 2px 6px rgba(0, 0, 0, 0.20), 0 0 0 0.5px rgba(255, 255, 255, 0.08)',
    webChipSelectedShadow:
      '0 2px 8px rgba(10, 132, 255, 0.25), 0 0 0 0.5px rgba(10, 132, 255, 0.4)',
  },
} as const;

export const motion = {
  duration: {
    instant: 80,
    fast: 160,
    normal: 280,
    deliberate: 360,
    slow: 480,
    stagger: 45,
  },
  distance: {
    subtle: 4,
    normal: 16,
    card: 20,
    sheet: 36,
  },
  scale: {
    pressedButton: 0.95,
    pressedCard: 0.965,
    pressedChip: 0.93,
    entranceStart: 0.98,
  },
  easing: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    subtle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  spring: {
    tactile: { tension: 280, friction: 22 },
    gentle: { tension: 160, friction: 20 },
    snappy: { tension: 300, friction: 26 },
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
  sm: 8, // Apple compact controls & tags
  md: 12, // Sub-buttons and secondary containers
  lg: 16, // Apple standard grouped cards
  xl: 20, // Floating panels & sheets
  xxl: 24,
  card: 18, // Apple 18px corner rounding
  full: 9999, // Pill / Capsule rounding
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
    lg: 50,
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
