import React, { useEffect, useState } from 'react';
import {
  AccessibilityInfo,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { BlurView, BlurTint, BlurMethod } from 'expo-blur';
import { useTheme } from '../../hooks/useTheme';

export type GlassVariant = 'regular' | 'clear' | 'prominent' | 'tabBar';

export interface GlassViewProps {
  variant?: GlassVariant;
  intensity?: number;
  tint?: BlurTint;
  border?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  blurTarget?: React.RefObject<View | null>;
  blurMethod?: BlurMethod;
}

/**
 * GlassView — Apple-native Liquid Glass surface primitive
 *
 * Provides translucent glass materials with:
 * - Native iOS/Android BlurView backed by platform blur engines
 * - High-vibrancy backdropFilter on Web
 * - Controlled opacity, hairline specular highlights, and ambient depth
 * - Strict accessibility fallback when Reduce Transparency is enabled
 */
export function GlassView({
  variant = 'regular',
  intensity,
  tint,
  border = true,
  borderRadius = 0,
  style,
  children,
  pointerEvents,
  blurTarget,
  blurMethod,
}: GlassViewProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const [reduceTransparency, setReduceTransparency] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (AccessibilityInfo?.isReduceTransparencyEnabled) {
      AccessibilityInfo.isReduceTransparencyEnabled()
        .then((enabled) => {
          if (isMounted) setReduceTransparency(enabled);
        })
        .catch(() => {});
    }

    const subscription = AccessibilityInfo?.addEventListener?.(
      'reduceTransparencyChanged',
      (enabled) => {
        setReduceTransparency(enabled);
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  const glassConfig = theme.glass[variant] || theme.glass.regular;
  const effectiveIntensity = intensity ?? glassConfig.blurIntensity;
  const effectiveTint: BlurTint =
    tint ?? (theme.isDark ? 'dark' : 'light');

  // Edge highlight styling
  const borderStyles: ViewStyle = {};
  if (border) {
    if (variant === 'tabBar') {
      borderStyles.borderTopWidth = StyleSheet.hairlineWidth || 1;
      borderStyles.borderTopColor =
        (glassConfig as any).borderTop || theme.glass.tabBar.borderTop;
    } else {
      borderStyles.borderWidth = StyleSheet.hairlineWidth || 1;
      borderStyles.borderColor =
        (glassConfig as any).border || theme.glass.regular.border;
    }
  }

  // Corner radius
  const radiusStyle: ViewStyle = borderRadius > 0 ? { borderRadius, overflow: 'hidden' } : {};

  // Ambient depth shadow
  const shadowStyle: ViewStyle =
    variant !== 'tabBar' && borderRadius > 0 ? theme.glass.ambientShadow : {};

  // Fallback for Reduce Transparency (WCAG Accessibility compliance)
  if (reduceTransparency) {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors.surfaceElevated,
          },
          radiusStyle,
          borderStyles,
          shadowStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Web rendering with CSS backdrop-filter
  if (isWeb) {
    const webBlurFilter = `blur(${Math.round(effectiveIntensity / 3)}px) saturate(180%)`;
    return (
      <View
        pointerEvents={pointerEvents}
        style={[
          styles.container,
          {
            backgroundColor: glassConfig.fill,
            backdropFilter: webBlurFilter,
            WebkitBackdropFilter: webBlurFilter,
          } as any,
          radiusStyle,
          borderStyles,
          shadowStyle,
          style,
        ]}
      >
        {children}
      </View>
    );
  }

  // Native BlurView rendering (iOS and Android)
  const resolvedBlurMethod: BlurMethod | undefined =
    Platform.OS === 'android'
      ? blurTarget
        ? blurMethod || 'dimezisBlurViewSdk31Plus'
        : 'none'
      : undefined;

  return (
    <View
      pointerEvents={pointerEvents}
      style={[styles.container, radiusStyle, shadowStyle, style]}
    >
      <BlurView
        intensity={effectiveIntensity}
        tint={effectiveTint}
        blurMethod={resolvedBlurMethod}
        blurTarget={blurTarget}
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: glassConfig.fill,
          },
          radiusStyle,
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          radiusStyle,
          borderStyles,
        ]}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
});
