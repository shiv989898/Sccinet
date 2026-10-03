import React, { useEffect, useState } from 'react';
import {
  Animated,
  DimensionValue,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

export interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: DimensionValue;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

export function SkeletonLoader({
  width = '100%',
  height = 20,
  borderRadius: radius,
  style,
}: SkeletonLoaderProps) {
  const theme = useTheme();
  const [opacityAnim] = useState(() => new Animated.Value(0.35));

  useEffect(() => {
    const isWeb = Platform.OS === 'web';
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 800,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: !isWeb,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius ?? theme.borderRadius.md,
          backgroundColor: theme.clay.surfaceRecessed,
          borderWidth: 1,
          borderColor: theme.clay.borderCard,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

