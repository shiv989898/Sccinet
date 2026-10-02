import React, { useEffect, useState } from 'react';
import { Animated, Platform, StyleProp, ViewStyle } from 'react-native';

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
  duration = 320,
  offsetY = 14,
  style,
}: AnimatedEntranceProps) {
  const [opacityAnim] = useState(() => new Animated.Value(0));
  const [translateYAnim] = useState(() => new Animated.Value(offsetY));

  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          tension: 160,
          friction: 16,
          useNativeDriver: !isWeb,
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
