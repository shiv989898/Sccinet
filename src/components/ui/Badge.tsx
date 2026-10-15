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
  | 'active'
  | 'builds'
  | 'completed'
  | 'roleOwner'
  | 'roleAdmin'
  | 'roleMember'
  | 'roleRemove'
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
      case 'active':
      case 'success':
        return {
          bg: theme.isDark ? 'rgba(34, 197, 94, 0.16)' : 'rgba(34, 197, 94, 0.12)',
          text: theme.isDark ? '#4ADE80' : '#16A34A',
          border: theme.isDark ? 'rgba(34, 197, 94, 0.35)' : 'rgba(34, 197, 94, 0.25)',
        };
      case 'builds':
      case 'primary':
        return {
          bg: theme.isDark ? 'rgba(0, 102, 255, 0.20)' : 'rgba(0, 102, 255, 0.12)',
          text: theme.isDark ? '#60A5FA' : '#0066FF',
          border: theme.isDark ? 'rgba(0, 102, 255, 0.38)' : 'rgba(0, 102, 255, 0.25)',
        };
      case 'completed':
        return {
          bg: theme.isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
          text: theme.isDark ? '#94A3B8' : '#64748B',
          border: theme.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
        };
      case 'roleOwner':
        return {
          bg: '#0066FF',
          text: '#FFFFFF',
          border: 'rgba(255, 255, 255, 0.30)',
        };
      case 'roleAdmin':
        return {
          bg: theme.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(0, 0, 0, 0.08)',
          text: theme.isDark ? '#E2E8F0' : '#1E293B',
          border: theme.isDark ? 'rgba(255, 255, 255, 0.18)' : 'rgba(0, 0, 0, 0.12)',
        };
      case 'roleMember':
        return {
          bg: theme.isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.04)',
          text: theme.isDark ? '#94A3B8' : '#64748B',
          border: theme.isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.06)',
        };
      case 'roleRemove':
        return {
          bg: theme.isDark ? 'rgba(239, 68, 68, 0.18)' : 'rgba(239, 68, 68, 0.10)',
          text: theme.isDark ? '#F87171' : '#DC2626',
          border: theme.isDark ? 'rgba(239, 68, 68, 0.35)' : 'rgba(239, 68, 68, 0.20)',
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
