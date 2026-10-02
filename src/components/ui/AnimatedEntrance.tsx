import React, { useEffect, useState } from 'react';
import { Animated, StyleProp, ViewStyle } from 'react-native';

export interface AnimatedEntranceProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  offsetY?: number;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedEntrance({
  children,
  delay = 0,
  duration = 300,
  offsetY = 12,
  style,
}: AnimatedEntranceProps) {
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [translateYAnim] = useState(() => new Animated.Value(offsetY));

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 140,
          friction: 12,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, opacityAnim, translateYAnim]);

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
