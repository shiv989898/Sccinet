import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function Button({
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  ...props
}: ButtonProps) {
  const theme = useTheme();

  const isDisabled = disabled || loading;

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return theme.dimensions.buttonHeight.sm;
      case 'lg':
        return theme.dimensions.buttonHeight.lg;
      case 'md':
      default:
        return theme.dimensions.buttonHeight.md;
    }
  };

  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return theme.typography.sizes.sm;
      case 'lg':
        return theme.typography.sizes.lg;
      case 'md':
      default:
        return theme.typography.sizes.md;
    }
  };

  const getContainerStyle = (pressed: boolean): ViewStyle => {
    const base: ViewStyle = {
      height: getHeight(),
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: size === 'sm' ? theme.spacing.md : theme.spacing.xl,
      opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
    };

    switch (variant) {
      case 'secondary':
        return {
          ...base,
          backgroundColor: theme.colors.surfaceSubtle,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: theme.colors.error,
        };
      case 'primary':
      default:
        return {
          ...base,
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return theme.colors.text;
      case 'outline':
        return theme.colors.text;
      case 'ghost':
        return theme.colors.primary;
      case 'danger':
      case 'primary':
      default:
        return '#FFFFFF';
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [getContainerStyle(pressed), style]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <View style={styles.contentRow}>
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
          <Text
            style={[
              {
                color: getTextColor(),
                fontSize: getFontSize(),
                fontWeight: theme.typography.weights.semibold,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIconContainer: {
    marginRight: 8,
  },
  rightIconContainer: {
    marginLeft: 8,
  },
});
