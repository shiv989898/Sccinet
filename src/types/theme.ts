import { ViewStyle } from 'react-native';
import { spacing, borderRadius, typography, dimensions } from '../theme/tokens';

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
  border: string;
  borderSubtle: string;
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
  surfaceChip: string;
  surfaceNeutralChip: string;
  borderHighlight: string;
  borderSubtle: string;
  borderActive: string;
  shadowColor: string;
  shadowCard: ViewStyle;
  shadowButton: ViewStyle;
  shadowChip: ViewStyle;
  webCardShadow: string;
  webRecessedShadow: string;
  webButtonShadow: string;
  webChipShadow: string;
  webNeutralChipShadow: string;
}

export interface Theme {
  colors: ThemeColors;
  clay: ClayTheme;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  typography: typeof typography;
  dimensions: typeof dimensions;
  isDark: boolean;
}
