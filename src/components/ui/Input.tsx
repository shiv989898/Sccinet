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
    if (isFocused) return theme.isDark ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.35)';
    return variant === 'clay' ? 'transparent' : theme.colors.border;
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
            borderRadius: 14,
            height: theme.dimensions.inputHeight,
            paddingHorizontal: theme.spacing.md,
            ...Platform.select({
              web: {
                boxShadow: isFocused
                  ? theme.isDark
                    ? 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.25), 0 0 0 2px rgba(59, 130, 246, 0.2)'
                    : 'inset 0 1px 2px 0 rgba(25, 42, 75, 0.04), 0 0 0 2px rgba(37, 99, 235, 0.15)'
                  : variant === 'clay'
                  ? theme.clay.webRecessedShadow
                  : undefined,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
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
