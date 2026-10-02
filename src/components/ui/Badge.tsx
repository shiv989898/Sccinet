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
          text: theme.colors.primary,
          border: 'transparent',
        };
      case 'success':
        return {
          bg: theme.colors.successMuted,
          text: theme.colors.success,
          border: 'transparent',
        };
      case 'warning':
        return {
          bg: theme.colors.warningMuted,
          text: theme.colors.warning,
          border: 'transparent',
        };
      case 'error':
        return {
          bg: theme.colors.errorMuted,
          text: theme.colors.error,
          border: 'transparent',
        };
      case 'outline':
        return {
          bg: 'transparent',
          text: theme.colors.textSecondary,
          border: theme.colors.border,
        };
      case 'default':
      default:
        return {
          bg: theme.colors.surfaceSubtle,
          text: theme.colors.textSecondary,
          border: 'transparent',
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
          borderWidth: variant === 'outline' ? 1 : 0,
          borderRadius: theme.borderRadius.full,
          paddingVertical: isSm ? 2 : 4,
          paddingHorizontal: isSm ? 8 : 12,
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
