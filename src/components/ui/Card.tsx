import React from 'react';
import {
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type CardVariant = 'default' | 'elevated' | 'outlined';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
  children,
  variant = 'default',
  style,
  onPress,
  padding = 'md',
  ...props
}: CardProps) {
  const theme = useTheme();

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.xl;
      case 'md':
      default:
        return theme.spacing.lg;
    }
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.surfaceElevated,
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          ...Platform.select({
            web: {
              boxShadow: theme.isDark
                ? '0 2px 8px rgba(0, 0, 0, 0.4)'
                : '0 2px 8px rgba(0, 0, 0, 0.06)',
            } as any,
            default: {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme.isDark ? 0.3 : 0.06,
              shadowRadius: 8,
              elevation: 2,
            },
          }),
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'default':
      default:
        return {
          backgroundColor: theme.colors.surface,
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
    }
  };

  const containerStyle: ViewStyle = {
    borderRadius: theme.borderRadius.lg,
    padding: getPadding(),
    ...getVariantStyle(),
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => [
          containerStyle,
          pressed && { opacity: 0.9, transform: [{ scale: 0.99 }] },
          style,
        ]}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
}
