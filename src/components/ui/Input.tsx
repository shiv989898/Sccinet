import React, { useState } from 'react';
import {
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
  const [isFocused, setIsFocused] = useState(false);

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
    if (isFocused) return theme.colors.primary;
    return variant === 'clay' ? theme.clay.borderRecessed : theme.colors.border;
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
              marginBottom: theme.spacing.xs,
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
            borderRadius: theme.borderRadius.md,
            height: theme.dimensions.inputHeight,
            paddingHorizontal: theme.spacing.md,
            ...Platform.select({
              web: {
                boxShadow: isFocused
                  ? '0 0 0 3px rgba(37, 99, 235, 0.12)'
                  : variant === 'clay'
                  ? theme.clay.webRecessedShadow
                  : undefined,
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
            inputStyle,
          ]}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...props}
        />

        {rightAccessory && <View style={styles.accessory}>{rightAccessory}</View>}
      </View>

      {error ? (
        <Text
          style={[
            styles.helperText,
            {
              color: theme.colors.error,
              fontSize: theme.typography.sizes.xs,
              marginTop: theme.spacing.xxs,
            },
          ]}
        >
          {error}
        </Text>
      ) : hint ? (
        <Text
          style={[
            styles.helperText,
            {
              color: theme.colors.textMuted,
              fontSize: theme.typography.sizes.xs,
              marginTop: theme.spacing.xxs,
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
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  accessory: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {},
});
