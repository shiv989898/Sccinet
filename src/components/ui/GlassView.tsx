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

export type GlassVariant = 'regular' | 'clear' | 'prominent' | 'elevated' | 'tabBar';

export interface GlassViewProps {
  variant?: GlassVariant;
  intensity?: number;
  tint?: BlurTint;
  border?: boolean;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  blurTarget?: React.RefObject<View | null>;
  blurMethod?: BlurMethod;
}

/**
 * GlassView — Apple-grade Liquid Glass surface primitive
 *
 * Provides real translucent glass materials with:
 * - Native iOS/Android BlurView backed by platform blur engines
 * - High-vibrancy backdropFilter on Web
 * - Dual-layer architecture: outer ambient shadow + inner rounded blur clipping
 * - Hairline specular highlights catching light on edges
 * - Strict accessibility fallback when Reduce Transparency is enabled
 */
export function GlassView({
  variant = 'regular',
  intensity,
  tint,
  border = true,
  borderRadius = 0,
  style,
  contentStyle,
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

  const glassConfig = (theme.glass as any)[variant] || theme.glass.regular;
  const effectiveIntensity = intensity ?? glassConfig.blurIntensity;
  const effectiveTint: BlurTint =
    tint ?? (theme.isDark ? 'dark' : 'light');

  // Specular edge highlight styling
  const borderStyles: ViewStyle = {};
  if (border) {
    if (variant === 'tabBar') {
      borderStyles.borderTopWidth = StyleSheet.hairlineWidth || 1;
      borderStyles.borderTopColor =
        glassConfig.borderTop || theme.glass.tabBar.borderTop;
    } else {
      borderStyles.borderWidth = StyleSheet.hairlineWidth || 1;
      borderStyles.borderColor = glassConfig.border || theme.glass.regular.border;
      if (glassConfig.borderTop) {
        borderStyles.borderTopColor = glassConfig.borderTop;
      }
    }
  }

  // Corner radius style
  const radiusStyle: ViewStyle =
    borderRadius > 0 ? { borderRadius, overflow: 'hidden' } : {};

  // Ambient depth shadow on outer wrapper (avoids clipping on iOS)
  const shadowStyle: ViewStyle =
    variant === 'elevated'
      ? theme.glass.elevatedShadow
      : variant !== 'tabBar' && borderRadius > 0
      ? theme.glass.ambientShadow
      : {};

  // Fallback for Reduce Transparency (WCAG Accessibility compliance)
  if (reduceTransparency) {
    return (
      <View
        pointerEvents={pointerEvents}
        style={[styles.container, shadowStyle, style]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            radiusStyle,
            { backgroundColor: theme.colors.surfaceElevated },
            borderStyles,
          ]}
        />
        <View style={[styles.content, contentStyle]}>{children}</View>
      </View>
    );
  }

  // Web rendering with CSS backdrop-filter
  if (isWeb) {
    const webBlurFilter = `blur(${Math.round(effectiveIntensity / 3)}px) saturate(180%)`;
    return (
      <View
        pointerEvents={pointerEvents}
        style={[styles.container, shadowStyle, style]}
      >
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius,
              backgroundColor: glassConfig.fill,
              backdropFilter: webBlurFilter,
              WebkitBackdropFilter: webBlurFilter,
              overflow: 'hidden',
            } as any,
            borderStyles,
          ]}
        />
        <View style={[styles.content, contentStyle]}>{children}</View>
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
      style={[styles.container, shadowStyle, style]}
    >
      {/* Inner clipping container for native blur and corner radius */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          radiusStyle,
        ]}
      >
        <BlurView
          intensity={effectiveIntensity}
          tint={effectiveTint}
          blurMethod={resolvedBlurMethod}
          blurTarget={blurTarget}
          style={StyleSheet.absoluteFill}
        />
        {/* Color tone fill layer */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: glassConfig.fill },
          ]}
        />
        {/* Hairline specular highlight border */}
        {border && (
          <View
            style={[
              StyleSheet.absoluteFill,
              radiusStyle,
              borderStyles,
            ]}
          />
        )}
      </View>

      {/* Children rendered cleanly above glass material */}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    backgroundColor: 'transparent',
  },
  content: {
    width: '100%',
  },
});
