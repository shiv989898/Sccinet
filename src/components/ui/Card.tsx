import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { motionTokens, useReducedMotion } from '../../theme/motion';
import { GlassView, GlassVariant } from './GlassView';

export type CardVariant = 'clay' | 'elevated' | 'outlined' | 'glass' | 'default';

export interface CardProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  variant?: CardVariant;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({
  children,
  variant = 'clay',
  style,
  onPress,
  padding = 'md',
  onPressIn,
  onPressOut,
  ...props
}: CardProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const [scaleAnim] = React.useState(() => new Animated.Value(1));
  const [translateYAnim] = React.useState(() => new Animated.Value(0));

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!reducedMotion) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: motionTokens.scale.pressedCard,
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
    if (!reducedMotion) {
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
    }
    onPressOut?.(e);
  };

  const getPadding = () => {
    switch (padding) {
      case 'none':
        return 0;
      case 'sm':
        return theme.spacing.sm;
      case 'lg':
        return theme.spacing.xl;
      case 'xl':
        return theme.spacing.xxl;
      case 'md':
      default:
        return theme.spacing.lg;
    }
  };

  const flattenedStyle = StyleSheet.flatten(style);
  const resolvedRadius =
    (flattenedStyle?.borderRadius as number | undefined) ?? theme.borderRadius.card;

  const glassVariant: GlassVariant =
    variant === 'glass'
      ? 'clear'
      : variant === 'elevated'
      ? 'elevated'
      : 'regular';

  if (onPress) {
    return (
      <Animated.View
        style={[
          isWeb
            ? undefined
            : {
                transform: [{ scale: scaleAnim }, { translateY: translateYAnim }],
              },
          flattenedStyle?.flex !== undefined ? { flex: flattenedStyle.flex } : undefined,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          unstable_pressDelay={0}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.92 : 1,
            },
            isWeb && pressed
              ? {
                  transform: [
                    { scale: motionTokens.scale.pressedCard },
                    { translateY: motionTokens.pressedTranslateY },
                  ],
                }
              : undefined,
          ]}
          {...props}
        >
          {variant === 'outlined' ? (
            <View
              style={[
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: theme.colors.borderSubtle,
                  borderRadius: resolvedRadius,
                  padding: getPadding(),
                },
                style,
              ]}
            >
              {children}
            </View>
          ) : (
            <GlassView
              variant={glassVariant}
              borderRadius={resolvedRadius}
              border={true}
              style={style}
              contentStyle={{ padding: getPadding() }}
            >
              {children}
            </GlassView>
          )}
        </Pressable>
      </Animated.View>
    );
  }

  if (variant === 'outlined') {
    return (
      <View
        style={[
          {
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: theme.colors.borderSubtle,
            borderRadius: resolvedRadius,
            padding: getPadding(),
          },
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  return (
    <GlassView
      variant={glassVariant}
      borderRadius={resolvedRadius}
      border={true}
      style={style}
      contentStyle={{ padding: getPadding() }}
    >
      {children}
    </GlassView>
  );
}
