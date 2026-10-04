import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { motionTokens } from '../../theme/motion';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  variant?: 'default' | 'clay';
  leftAccessory?: React.ReactNode;
  rightAccessory?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export function Input({
  label,
  error,
  hint,
  variant = 'clay',
  leftAccessory,
  rightAccessory,
  containerStyle,
  inputContainerStyle,
  inputStyle,
  onFocus,
  onBlur,
  ...props
}: InputProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const [isFocused, setIsFocused] = useState(false);

  // Smooth error transition animations
  const [errorAnim] = useState(() => new Animated.Value(error ? 1 : 0));
  const [errorTranslateY] = useState(() => new Animated.Value(error ? 0 : -4));

  useEffect(() => {
    if (error) {
      Animated.parallel([
        Animated.timing(errorAnim, {
          toValue: 1,
          duration: motionTokens.duration.fast,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(errorTranslateY, {
          toValue: 0,
          tension: motionTokens.spring.snappy.tension,
          friction: motionTokens.spring.snappy.friction,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    } else {
      Animated.timing(errorAnim, {
        toValue: 0,
        duration: motionTokens.duration.instant,
        useNativeDriver: !isWeb,
      }).start();
    }
  }, [error, errorAnim, errorTranslateY, isWeb]);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (isFocused) return theme.isDark ? 'rgba(59, 130, 246, 0.6)' : 'rgba(37, 99, 235, 0.45)';
    return theme.clay.borderCard;
  };

  const getBackgroundColor = () => {
    if (variant === 'clay') return theme.clay.surfaceRecessed;
    return theme.colors.surface;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.sm,
              fontWeight: theme.typography.weights.medium,
              marginBottom: 6,
              letterSpacing: -0.1,
            },
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: isFocused ? 1.5 : 1,
            borderRadius: 14,
            height: props.multiline ? undefined : theme.dimensions.inputHeight,
            minHeight: props.multiline ? 88 : theme.dimensions.inputHeight,
            paddingHorizontal: theme.spacing.md,
            ...Platform.select({
              web: {
                boxShadow: isFocused
                  ? error
                    ? 'inset 0 1px 2px 0 rgba(239, 68, 68, 0.1), 0 0 0 2.5px rgba(239, 68, 68, 0.2)'
                    : theme.clay.webRecessedFocusedShadow
                  : variant === 'clay'
                  ? theme.clay.webRecessedShadow
                  : undefined,
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              } as any,
            }),
          },
          inputContainerStyle,
        ]}
      >
        {leftAccessory && <View style={styles.accessory}>{leftAccessory}</View>}

        <TextInput
          placeholderTextColor={theme.colors.textMuted}
          style={[
            styles.input,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
            },
            Platform.OS === 'web' && ({
              outlineStyle: 'none',
              outlineWidth: 0,
            } as any),
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightAccessory && <View style={styles.accessory}>{rightAccessory}</View>}
      </View>

      {error ? (
        <Animated.View
          style={{
            opacity: errorAnim,
            transform: [{ translateY: errorTranslateY }],
          }}
        >
          <Text
            style={[
              styles.helperText,
              {
                color: theme.colors.error,
                fontSize: theme.typography.sizes.xs,
                marginTop: 4,
                fontWeight: theme.typography.weights.medium,
              },
            ]}
          >
            {error}
          </Text>
        </Animated.View>
      ) : hint ? (
        <Text
          style={[
            styles.helperText,
            {
              color: theme.colors.textMuted,
              fontSize: theme.typography.sizes.xs,
              marginTop: 4,
            },
          ]}
        >
          {hint}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  label: {},
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        outlineWidth: 0,
      } as any,
    }),
  },
  accessory: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {},
});
