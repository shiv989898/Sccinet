import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { motionTokens } from '../../theme/motion';

export type CardVariant = 'clay' | 'elevated' | 'outlined' | 'default';

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

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
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

  const getVariantStyle = (pressed?: boolean): ViewStyle => {
    switch (variant) {
      case 'clay':
      case 'default':
        return {
          backgroundColor: theme.clay.surface,
          borderWidth: 1,
          borderColor: theme.clay.borderCard,
          borderRadius: theme.borderRadius.card,
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webCardPressedShadow
                : theme.clay.webCardShadow,
              transition:
                'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: onPress ? 'pointer' : 'default',
            } as any,
            default: {
              ...(pressed ? theme.clay.shadowCardPressed : theme.clay.shadowCard),
            },
          }),
        };
      case 'elevated':
        return {
          backgroundColor: theme.clay.surfaceElevated,
          borderWidth: 1,
          borderColor: theme.clay.borderCard,
          borderRadius: theme.borderRadius.card,
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webCardPressedShadow
                : theme.clay.webCardHoverShadow,
              transition:
                'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: onPress ? 'pointer' : 'default',
            } as any,
            default: {
              ...(pressed ? theme.clay.shadowCardPressed : theme.clay.shadowCard),
            },
          }),
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: theme.colors.borderSubtle,
          borderRadius: theme.borderRadius.card,
          ...Platform.select({
            web: {
              transition: 'transform 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
              cursor: onPress ? 'pointer' : 'default',
            } as any,
          }),
        };
    }
  };

  if (onPress) {
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
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={({ pressed }) => [
            {
              padding: getPadding(),
              transform:
                isWeb && pressed
                  ? [
                      { scale: motionTokens.scale.pressedCard },
                      { translateY: motionTokens.pressedTranslateY },
                    ]
                  : [],
            },
            getVariantStyle(pressed),
            style,
          ]}
          {...props}
        >
          {children}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View
      style={[
        {
          padding: getPadding(),
        },
        getVariantStyle(false),
        style,
      ]}
    >
      {children}
    </View>
  );
}
