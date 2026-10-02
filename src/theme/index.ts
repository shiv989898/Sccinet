import { palette, clayTokens, spacing, borderRadius, typography, dimensions } from './tokens';
import { Theme, ThemeColors, ColorScheme } from '../types/theme';

export const lightColors: ThemeColors = {
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryDark: palette.primaryDark,
  primaryMuted: palette.primaryMuted,
  background: palette.light.background,
  surface: palette.light.surface,
  surfaceSubtle: palette.light.surfaceSubtle,
  surfaceElevated: palette.light.surfaceElevated,
  border: palette.light.border,
  borderSubtle: palette.light.borderSubtle,
  text: palette.light.text,
  textSecondary: palette.light.textSecondary,
  textMuted: palette.light.textMuted,
  textInverse: palette.light.textInverse,
  success: palette.success,
  successMuted: palette.successMuted,
  warning: palette.warning,
  warningMuted: palette.warningMuted,
  error: palette.error,
  errorMuted: palette.errorMuted,
  info: palette.info,
  infoMuted: palette.infoMuted,
};

export const darkColors: ThemeColors = {
  primary: palette.primaryLight,
  primaryLight: palette.primary,
  primaryDark: palette.primaryDark,
  primaryMuted: palette.primaryMuted,
  background: palette.dark.background,
  surface: palette.dark.surface,
  surfaceSubtle: palette.dark.surfaceSubtle,
  surfaceElevated: palette.dark.surfaceElevated,
  border: palette.dark.border,
  borderSubtle: palette.dark.borderSubtle,
  text: palette.dark.text,
  textSecondary: palette.dark.textSecondary,
  textMuted: palette.dark.textMuted,
  textInverse: palette.dark.textInverse,
  success: palette.success,
  successMuted: palette.successMuted,
  warning: palette.warning,
  warningMuted: palette.warningMuted,
  error: palette.error,
  errorMuted: palette.errorMuted,
  info: palette.info,
  infoMuted: palette.infoMuted,
};

export const getTheme = (scheme: ColorScheme): Theme => ({
  colors: scheme === 'dark' ? darkColors : lightColors,
  clay: scheme === 'dark' ? (clayTokens.dark as any) : (clayTokens.light as any),
  spacing,
  borderRadius,
  typography,
  dimensions,
  isDark: scheme === 'dark',
});

export * from './tokens';
