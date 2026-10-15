import React from 'react';
import { StyleSheet, View, Text, ViewStyle, StyleProp, Platform } from 'react-native';
import { Image } from 'expo-image';
import { useTheme } from '../../hooks/useTheme';

export interface SccinetLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  style?: StyleProp<ViewStyle>;
}

const shieldSource = require('../../../assets/images/sccinet-shield.png');

export function SccinetLogo({
  size = 'md',
  showWordmark = false,
  style,
}: SccinetLogoProps) {
  const theme = useTheme();

  const getShieldDimensions = () => {
    switch (size) {
      case 'sm':
        return { containerSize: 28, iconSize: 22, radius: 8 };
      case 'md':
        return { containerSize: 42, iconSize: 34, radius: 12 };
      case 'lg':
        return { containerSize: 64, iconSize: 52, radius: 18 };
      case 'xl':
        return { containerSize: 96, iconSize: 80, radius: 26 };
    }
  };

  const { containerSize, iconSize, radius } = getShieldDimensions();

  return (
    <View style={[styles.root, style]}>
      {/* 3D Shield Icon Container */}
      <View
        style={[
          styles.shieldWrapper,
          {
            width: containerSize,
            height: containerSize,
            borderRadius: radius,
            backgroundColor: 'rgba(10, 132, 255, 0.15)',
            borderWidth: 1,
            borderColor: 'rgba(255, 255, 255, 0.22)',
            ...Platform.select({
              web: {
                boxShadow:
                  '0 6px 20px rgba(0, 102, 255, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              } as any,
              default: {
                shadowColor: '#0066FF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 10,
                elevation: 4,
              },
            }),
          },
        ]}
      >
        <Image
          source={shieldSource}
          style={{ width: iconSize, height: iconSize, borderRadius: radius - 2 }}
          contentFit="contain"
          priority="high"
        />
      </View>

      {/* Optional Wordmark */}
      {showWordmark && (
        <Text
          style={[
            styles.wordmark,
            {
              color: theme.colors.text,
              fontSize: size === 'sm' ? 16 : size === 'md' ? 19 : 26,
              fontWeight: '700',
              letterSpacing: -0.3,
            },
          ]}
        >
          Sccinet
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shieldWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  wordmark: {
    fontFamily: Platform.OS === 'ios' ? 'System' : undefined,
  },
});
