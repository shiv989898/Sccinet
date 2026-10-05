import React, { useEffect, useState } from 'react';
import { Animated, Platform, StyleProp, ViewStyle } from 'react-native';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface AnimatedEntranceProps {
  children: React.ReactNode;
  staggerIndex?: number;
  delay?: number;
  duration?: number;
  offsetY?: number;
  distance?: number;
  direction?: 'up' | 'down' | 'none';
  style?: StyleProp<ViewStyle>;
}

export function AnimatedEntrance({
  children,
  staggerIndex,
  delay: explicitDelay,
  duration = motionTokens.duration.normal,
  offsetY,
  distance,
  direction = 'up',
  style,
}: AnimatedEntranceProps) {
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  // Restrain stagger delay: capped at max 2 stagger tiers (max 50ms) to prioritize immediate usability
  const computedDelay =
    explicitDelay !== undefined
      ? explicitDelay
      : staggerIndex !== undefined
      ? Math.min(staggerIndex, 2) * motionTokens.duration.stagger
      : 0;

  // Translation distance: subtle 6px default
  const travelDistance =
    offsetY !== undefined
      ? offsetY
      : distance !== undefined
      ? distance
      : motionTokens.distance.normal;

  const initialY = direction === 'up' ? travelDistance : direction === 'down' ? -travelDistance : 0;

  const [opacityAnim] = useState(() => new Animated.Value(reducedMotion ? 1 : 0));
  const [translateYAnim] = useState(() => new Animated.Value(reducedMotion ? 0 : initialY));

  useEffect(() => {
    if (reducedMotion) {
      opacityAnim.setValue(1);
      translateYAnim.setValue(0);
      return;
    }

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: motionTokens.spring.gentle.tension,
          friction: motionTokens.spring.gentle.friction,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    }, computedDelay);

    return () => clearTimeout(timer);
  }, [computedDelay, duration, isWeb, opacityAnim, reducedMotion, translateYAnim]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
