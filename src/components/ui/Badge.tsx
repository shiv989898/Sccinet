import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'outline';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Badge({
  label,
  variant = 'default',
  size = 'md',
  icon,
  style,
  textStyle,
}: BadgeProps) {
  const theme = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'primary':
        return {
          bg: theme.colors.primaryMuted,
          text: theme.isDark ? theme.colors.primaryLight : theme.colors.primary,
          border: theme.isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(37, 99, 235, 0.15)',
        };
      case 'success':
        return {
          bg: theme.colors.successMuted,
          text: theme.colors.success,
          border: theme.isDark ? 'rgba(16, 185, 129, 0.25)' : 'rgba(16, 185, 129, 0.2)',
        };
      case 'warning':
        return {
          bg: theme.colors.warningMuted,
          text: theme.colors.warning,
          border: theme.isDark ? 'rgba(245, 158, 11, 0.25)' : 'rgba(245, 158, 11, 0.2)',
        };
      case 'error':
        return {
          bg: theme.colors.errorMuted,
          text: theme.colors.error,
          border: theme.isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.2)',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.textSecondary,
          border: theme.colors.borderSubtle,
        };
      case 'default':
      default:
        return {
          bg: theme.clay.surfaceRecessed,
          text: theme.colors.textSecondary,
          border: theme.clay.borderCard,
        };
    }
  };

  const colors = getColors();
  const isSm = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.bg,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: theme.borderRadius.full,
          paddingVertical: isSm ? 2.5 : 4.5,
          paddingHorizontal: isSm ? 9 : 12,
        },
        style,
      ]}
    >
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <Text
        style={[
          styles.text,
          {
            color: colors.text,
            fontSize: isSm ? theme.typography.sizes.xs : theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
            letterSpacing: 0.1,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  iconContainer: {
    marginRight: 4,
  },
  text: {},
});
