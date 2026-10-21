import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleProp, ViewStyle } from 'react-native';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface AnimatedTabTransitionProps {
  activeKey: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  duration?: number;
}

/**
 * AnimatedTabTransition wraps tabbed content panes.
 * When activeKey changes, it runs a gentle, calm cross-fade and 8px upward settle
 * to provide continuous physical transition without visual jarring.
 */
export function AnimatedTabTransition({
  activeKey,
  children,
  style,
  duration = motionTokens.duration.fast + 60,
}: AnimatedTabTransitionProps) {
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const opacityAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const prevKey = useRef(activeKey);

  useEffect(() => {
    if (prevKey.current !== activeKey) {
      prevKey.current = activeKey;

      if (reducedMotion) {
        opacityAnim.setValue(1);
        translateYAnim.setValue(0);
        return;
      }

      // Quick smooth entrance from slight offset
      opacityAnim.setValue(0.3);
      translateYAnim.setValue(8);

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
    }
  }, [activeKey, duration, isWeb, opacityAnim, reducedMotion, translateYAnim]);

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
