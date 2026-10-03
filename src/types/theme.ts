import { ViewStyle } from 'react-native';
import { spacing, borderRadius, typography, dimensions, motion } from '../theme/tokens';

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  background: string;
  surface: string;
  surfaceSubtle: string;
  surfaceElevated: string;
  surfaceRecessed: string;
  border: string;
  borderSubtle: string;
  borderActive: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  success: string;
  successMuted: string;
  warning: string;
  warningMuted: string;
  error: string;
  errorMuted: string;
  info: string;
  infoMuted: string;
}

export interface ClayTheme {
  surface: string;
  surfaceElevated: string;
  surfaceRecessed: string;
  surfaceTrack: string;
  surfaceActivePill: string;
  surfaceChipSelected: string;
  surfaceChipSuggested: string;
  borderCard: string;
  borderRecessed: string;
  borderChipSelected: string;
  borderChipSuggested: string;
  textChipSelected: string;
  textChipSuggested: string;
  shadowCard: ViewStyle;
  shadowCardPressed: ViewStyle;
  shadowButton: ViewStyle;
  shadowButtonPressed: ViewStyle;
  shadowPill: ViewStyle;
  shadowChip: ViewStyle;
  webCardShadow: string;
  webCardHoverShadow: string;
  webCardPressedShadow: string;
  webRecessedShadow: string;
  webRecessedFocusedShadow: string;
  webRecessedTrackShadow: string;
  webButtonShadow: string;
  webButtonPressedShadow: string;
  webSecondaryButtonShadow: string;
  webSecondaryButtonPressedShadow: string;
  webPillShadow: string;
  webChipShadow: string;
  webChipSelectedShadow: string;
}

export interface Theme {
  colors: ThemeColors;
  clay: ClayTheme;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  dimensions: typeof dimensions;
  motion: typeof motion;
  isDark: boolean;
}

