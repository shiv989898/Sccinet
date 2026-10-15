import React from 'react';
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../hooks/useTheme';

export interface AtmosphericBackgroundProps {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}

const ambientBgSource = require('../../../assets/images/ambient-bg.jpg');

export function AtmosphericBackground({
  children,
  style,
  contentStyle,
}: AtmosphericBackgroundProps) {
  const theme = useTheme();

  return (
    <View style={[styles.root, { backgroundColor: theme.colors.background }, style]}>
      {/* Background Architectural Ambient Image */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <Image
          source={ambientBgSource}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="center"
          priority="high"
          cachePolicy="memory-disk"
        />
        {/* Deep Slate / Midnight Overlay */}
        <LinearGradient
          colors={[
            theme.isDark ? 'rgba(11, 16, 27, 0.72)' : 'rgba(240, 243, 249, 0.85)',
            theme.isDark ? 'rgba(8, 12, 20, 0.88)' : 'rgba(235, 240, 248, 0.92)',
            theme.isDark ? 'rgba(6, 10, 18, 0.94)' : 'rgba(225, 232, 244, 0.96)',
          ]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
        {/* Subtle Cyan/Blue Ambient Glow in Top-Right */}
        <LinearGradient
          colors={[
            theme.isDark ? 'rgba(0, 102, 255, 0.12)' : 'rgba(0, 122, 255, 0.06)',
            'transparent',
          ]}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.2, y: 0.6 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      {/* Screen Content */}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
});
