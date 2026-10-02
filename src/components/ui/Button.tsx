import React from 'react';
import {
  ActivityIndicator,
  Platform,
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

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'clayPrimary'
  | 'claySecondary';
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
      opacity: isDisabled ? 0.5 : 1,
    };

    switch (variant) {
      case 'clayPrimary':
        return {
          ...base,
          backgroundColor: theme.colors.primary,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: theme.borderRadius.lg,
          transform: pressed ? [{ scale: 0.985 }, { translateY: 1.5 }] : [],
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webButtonPressedShadow
                : theme.clay.webButtonShadow,
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.18s ease',
            } as any,
            default: {
              ...theme.clay.shadowButton,
            },
          }),
        };
      case 'claySecondary':
        return {
          ...base,
          backgroundColor: theme.clay.surface,
          borderWidth: 1,
          borderColor: theme.clay.borderCard,
          borderRadius: theme.borderRadius.lg,
          transform: pressed ? [{ scale: 0.985 }, { translateY: 1 }] : [],
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webSecondaryButtonPressedShadow
                : theme.clay.webSecondaryButtonShadow,
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.18s ease',
            } as any,
            default: {
              ...theme.clay.shadowPill,
            },
          }),
        };
      case 'secondary':
        return {
          ...base,
          backgroundColor: theme.colors.surfaceSubtle,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.border,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: 'transparent',
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: theme.colors.error,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        };
      case 'primary':
      default:
        return {
          ...base,
          backgroundColor: theme.colors.primary,
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'claySecondary':
      case 'secondary':
      case 'outline':
        return theme.colors.text;
      case 'ghost':
        return theme.colors.primary;
      case 'danger':
      case 'clayPrimary':
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
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          style={styles.spinner}
        />
      ) : (
        <>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              styles.text,
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
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  spinner: {
    marginRight: 6,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  text: {
    textAlign: 'center',
  },
});
