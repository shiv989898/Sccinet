import React, { useRef } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface TactilePressableProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  scaleTo?: number;
  translateYTo?: number;
  onPress?: () => void;
}

export function TactilePressable({
  children,
  style,
  scaleTo = motionTokens.scale.pressedChip,
  translateYTo = 1,
  onPress,
  onPressIn,
  onPressOut,
  ...props
}: TactilePressableProps) {
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = (e: GestureResponderEvent) => {
    if (!reducedMotion) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: scaleTo,
          tension: motionTokens.spring.tactile.tension,
          friction: motionTokens.spring.tactile.friction,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(translateYAnim, {
          toValue: translateYTo,
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

  return (
    <Animated.View
      style={[
        {
          transform: [
            { scale: scaleAnim },
            { translateY: translateYAnim },
          ],
        },
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          style,
          isWeb && ({ cursor: 'pointer', opacity: pressed ? 0.88 : 1 } as any),
        ]}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
