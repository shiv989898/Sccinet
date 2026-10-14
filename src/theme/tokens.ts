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

  // Light Appearance (Apple iOS Grouped & Liquid Glass System)
  light: {
    background: '#F2F2F7', // Apple system grouped background
    surface: '#FFFFFF', // Secondary grouped background / card surface
    surfaceSubtle: '#F7F7FA',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#E5E5EA', // Apple system gray 5 / search well
    surfaceTrack: '#E5E5EA',
    border: 'rgba(0, 0, 0, 0.08)', // Hairline separator (0.5 - 1px)
    borderSubtle: 'rgba(0, 0, 0, 0.04)',
    borderActive: '#007AFF',
    text: '#1C1C1E', // Apple primary label (> 13:1 contrast on #F2F2F7, AAA)
    textSecondary: '#48484A', // Apple secondary label (> 8:1 contrast on #F2F2F7, AAA)
    textMuted: '#636366', // Apple tertiary label (> 5.4:1 contrast on #F2F2F7, AA)
    textInverse: '#FFFFFF',
  },

  // Dark Appearance (Apple iOS Pure Black & Elevated Materials)
  dark: {
    background: '#000000', // Apple true black canvas
    surface: '#1C1C1E', // Apple system gray 6 card surface
    surfaceSubtle: '#141416',
    surfaceElevated: '#2C2C2E', // Apple system gray 5
    surfaceRecessed: '#1C1C1E', // Search well
    surfaceTrack: '#121214',
    border: 'rgba(255, 255, 255, 0.12)', // Hairline light reflection
    borderSubtle: 'rgba(255, 255, 255, 0.06)',
    borderActive: '#0A84FF',
    text: '#FFFFFF', // Crisp pure white (> 18:1 contrast, AAA)
    textSecondary: '#AEAEB2', // Apple dark secondary label (> 8:1 contrast on #000000, AAA)
    textMuted: '#8E8E93', // Apple dark tertiary label (> 5.7:1 contrast on #000000, AA)
    textInverse: '#000000',
  },

  // Apple Status Colors
  success: '#34C759',
  successMuted: 'rgba(52, 199, 89, 0.14)',
  warning: '#FF9500',
  warningMuted: 'rgba(255, 149, 0, 0.14)',
  error: '#FF3B30',
  errorMuted: 'rgba(255, 59, 48, 0.14)',
  info: '#32ADE6',
  infoMuted: 'rgba(50, 173, 230, 0.14)',
} as const;

export const glassTokens = {
  light: {
    regular: {
      fill: 'rgba(255, 255, 255, 0.75)',
      blurIntensity: 65,
      border: 'rgba(255, 255, 255, 0.65)',
    },
    clear: {
      fill: 'rgba(255, 255, 255, 0.45)',
      blurIntensity: 35,
      border: 'rgba(255, 255, 255, 0.45)',
    },
    prominent: {
      fill: 'rgba(255, 255, 255, 0.88)',
      blurIntensity: 85,
      border: 'rgba(255, 255, 255, 0.85)',
    },
    tabBar: {
      fill: 'rgba(255, 255, 255, 0.80)',
      blurIntensity: 75,
      borderTop: 'rgba(0, 0, 0, 0.08)',
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
      fill: 'rgba(28, 28, 30, 0.75)',
      blurIntensity: 65,
      border: 'rgba(255, 255, 255, 0.12)',
    },
    clear: {
      fill: 'rgba(28, 28, 30, 0.45)',
      blurIntensity: 35,
      border: 'rgba(255, 255, 255, 0.08)',
    },
    prominent: {
      fill: 'rgba(22, 22, 24, 0.88)',
      blurIntensity: 85,
      border: 'rgba(255, 255, 255, 0.16)',
    },
    tabBar: {
      fill: 'rgba(18, 18, 20, 0.80)',
      blurIntensity: 75,
      borderTop: 'rgba(255, 255, 255, 0.10)',
    },
    highlight: 'rgba(255, 255, 255, 0.14)',
    ambientShadow: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.40,
      shadowRadius: 24,
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
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    surfaceRecessed: '#E5E5EA',
    surfaceTrack: '#E5E5EA',
    surfaceActivePill: '#FFFFFF',
    surfaceChipSelected: 'rgba(0, 122, 255, 0.10)',
    surfaceChipSuggested: 'rgba(0, 0, 0, 0.04)',
    borderCard: 'rgba(0, 0, 0, 0.06)',
    borderRecessed: 'transparent',
    borderChipSelected: 'rgba(0, 122, 255, 0.35)',
    borderChipSuggested: 'transparent',
    textChipSelected: '#007AFF',
    textChipSuggested: '#48484A',
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
      '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    webCardHoverShadow:
      '0 8px 24px -2px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.06)',
    webCardPressedShadow:
      '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    webRecessedShadow:
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    webRecessedFocusedShadow:
      '0 0 0 3px rgba(0, 122, 255, 0.25), inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    webRecessedTrackShadow:
      'inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    webButtonShadow:
      '0 4px 14px -2px rgba(0, 122, 255, 0.35)',
    webButtonPressedShadow:
      '0 2px 6px -1px rgba(0, 122, 255, 0.25)',
    webSecondaryButtonShadow:
      '0 2px 8px -1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    webSecondaryButtonPressedShadow:
      '0 1px 4px 0 rgba(0, 0, 0, 0.04)',
    webPillShadow:
      '0 2px 8px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.04)',
    webChipShadow:
      '0 1px 3px rgba(0, 0, 0, 0.04)',
    webChipSelectedShadow:
      '0 2px 6px rgba(0, 122, 255, 0.15)',
  },
  dark: {
    surface: '#1C1C1E',
    surfaceElevated: '#2C2C2E',
    surfaceRecessed: '#1C1C1E',
    surfaceTrack: '#121214',
    surfaceActivePill: '#3A3A3C',
    surfaceChipSelected: 'rgba(10, 132, 255, 0.18)',
    surfaceChipSuggested: 'rgba(255, 255, 255, 0.07)',
    borderCard: 'rgba(255, 255, 255, 0.10)',
    borderRecessed: 'transparent',
    borderChipSelected: 'rgba(10, 132, 255, 0.45)',
    borderChipSuggested: 'transparent',
    textChipSelected: '#409CFF',
    textChipSuggested: '#AEAEB2',
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
      '0 8px 28px -4px rgba(0, 0, 0, 0.50), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webCardHoverShadow:
      '0 12px 36px -4px rgba(0, 0, 0, 0.60), 0 0 0 1px rgba(255, 255, 255, 0.12)',
    webCardPressedShadow:
      '0 4px 14px -2px rgba(0, 0, 0, 0.40), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webRecessedShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.06)',
    webRecessedFocusedShadow:
      '0 0 0 3px rgba(10, 132, 255, 0.35), inset 0 1px 2px rgba(0, 0, 0, 0.4)',
    webRecessedTrackShadow:
      'inset 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.04)',
    webButtonShadow:
      '0 4px 16px rgba(10, 132, 255, 0.35)',
    webButtonPressedShadow:
      '0 2px 6px rgba(10, 132, 255, 0.20)',
    webSecondaryButtonShadow:
      '0 2px 8px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.08)',
    webSecondaryButtonPressedShadow:
      '0 1px 4px rgba(0, 0, 0, 0.3)',
    webPillShadow:
      '0 2px 10px rgba(0, 0, 0, 0.35), 0 0 0 0.5px rgba(255, 255, 255, 0.12)',
    webChipShadow:
      '0 2px 6px rgba(0, 0, 0, 0.25), 0 0 0 0.5px rgba(255, 255, 255, 0.06)',
    webChipSelectedShadow:
      '0 2px 8px rgba(10, 132, 255, 0.25), 0 0 0 0.5px rgba(10, 132, 255, 0.4)',
  },
} as const;

export const motion = {
  duration: {
    instant: 70,
    fast: 140,
    normal: 240,
    deliberate: 320,
    slow: 440,
    stagger: 30,
  },
  distance: {
    subtle: 3,
    normal: 6,
    card: 10,
    sheet: 24,
  },
  scale: {
    pressedButton: 0.98,
    pressedCard: 0.988,
    pressedChip: 0.965,
    entranceStart: 0.995,
  },
  easing: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    subtle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
  spring: {
    tactile: { tension: 360, friction: 32 },
    gentle: { tension: 180, friction: 24 },
    snappy: { tension: 340, friction: 30 },
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
  card: 16, // Apple 16px corner rounding
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
