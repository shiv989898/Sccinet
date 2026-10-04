import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  GestureResponderEvent,
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
import { motionTokens } from '../../theme/motion';

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
  onPressIn,
  onPressOut,
  ...props
}: ButtonProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const isDisabled = disabled || loading;

  // Native tactile press animation
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!isDisabled) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: motionTokens.scale.pressedButton,
          tension: motionTokens.spring.tactile.tension,
          friction: motionTokens.spring.tactile.friction,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(translateYAnim, {
          toValue: motionTokens.pressedTranslateY,
          tension: motionTokens.spring.tactile.tension,
          friction: motionTokens.spring.tactile.friction,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    }
    onPressIn?.(e);
  };

  const handlePressOut = (e: GestureResponderEvent) => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }),
      Animated.spring(translateYAnim, {
        toValue: 0,
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }),
    ]).start();
    onPressOut?.(e);
  };

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
      case 'primary':
      case 'clayPrimary':
        return {
          ...base,
          backgroundColor: theme.colors.primary,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.18)',
          borderRadius: size === 'sm' ? theme.borderRadius.md : theme.borderRadius.lg,
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webButtonPressedShadow
                : theme.clay.webButtonShadow,
              transition:
                'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: pressed
                ? `scale(${motionTokens.scale.pressedButton}) translateY(${motionTokens.pressedTranslateY}px)`
                : 'none',
            } as any,
            default: {
              ...(pressed ? theme.clay.shadowButtonPressed : theme.clay.shadowButton),
            },
          }),
        };
      case 'secondary':
      case 'claySecondary':
        return {
          ...base,
          backgroundColor: theme.clay.surface,
          borderWidth: 1,
          borderColor: theme.clay.borderCard,
          borderRadius: size === 'sm' ? theme.borderRadius.md : theme.borderRadius.lg,
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webSecondaryButtonPressedShadow
                : theme.clay.webSecondaryButtonShadow,
              transition:
                'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.15s ease',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: pressed
                ? `scale(${motionTokens.scale.pressedButton}) translateY(${motionTokens.pressedTranslateY}px)`
                : 'none',
            } as any,
            default: {
              ...theme.clay.shadowPill,
            },
          }),
        };
      case 'outline':
        return {
          ...base,
          backgroundColor: pressed ? theme.colors.surfaceSubtle : 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          borderRadius: size === 'sm' ? theme.borderRadius.md : theme.borderRadius.lg,
          ...Platform.select({
            web: {
              transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: pressed ? `scale(${motionTokens.scale.pressedButton})` : 'none',
            } as any,
          }),
        };
      case 'ghost':
        return {
          ...base,
          backgroundColor: pressed ? theme.colors.primaryMuted : 'transparent',
          borderRadius: size === 'sm' ? theme.borderRadius.md : theme.borderRadius.lg,
          ...Platform.select({
            web: {
              transition: 'all 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: pressed ? `scale(${motionTokens.scale.pressedButton})` : 'none',
            } as any,
          }),
        };
      case 'danger':
        return {
          ...base,
          backgroundColor: theme.colors.error,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.18)',
          borderRadius: size === 'sm' ? theme.borderRadius.md : theme.borderRadius.lg,
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? '0 2px 6px -1px rgba(239, 68, 68, 0.25), inset 0 1px 1px 0 rgba(255, 255, 255, 0.2)'
                : '0 6px 16px -3px rgba(239, 68, 68, 0.25), inset 0 1px 1.5px 0 rgba(255, 255, 255, 0.3)',
              transition:
                'transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transform: pressed
                ? `scale(${motionTokens.scale.pressedButton}) translateY(${motionTokens.pressedTranslateY}px)`
                : 'none',
            } as any,
            default: {
              ...(pressed ? theme.clay.shadowButtonPressed : theme.clay.shadowButton),
            },
          }),
        };
      default:
        return {
          ...base,
          backgroundColor: theme.colors.primary,
        };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'claySecondary':
      case 'secondary':
        return theme.colors.text;
      case 'outline':
        return theme.colors.textSecondary;
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
    <Animated.View
      style={
        isWeb
          ? undefined
          : {
              transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
            }
      }
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
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
    </Animated.View>
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
