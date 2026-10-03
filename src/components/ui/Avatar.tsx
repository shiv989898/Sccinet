import React, { useState } from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';

import { useTheme } from '../../hooks/useTheme';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  url?: string | null;
  name?: string;
  size?: AvatarSize | number;
  style?: StyleProp<ViewStyle>;
}

export function Avatar({ url, name, size = 'md', style }: AvatarProps) {
  const theme = useTheme();
  const [hasError, setHasError] = useState(false);

  const getDimension = (): number => {
    if (typeof size === 'number') return size;
    switch (size) {
      case 'sm':
        return theme.dimensions.avatarSize.sm;
      case 'lg':
        return theme.dimensions.avatarSize.lg;
      case 'xl':
        return theme.dimensions.avatarSize.xl;
      case 'md':
      default:
        return theme.dimensions.avatarSize.md;
    }
  };

  const dimension = getDimension();

  const getInitials = (fullName?: string): string => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const showImage = url && !hasError;

  return (
    <View
      style={[
        styles.container,
        {
          width: dimension,
          height: dimension,
          borderRadius: dimension / 2,
          backgroundColor: theme.clay.surfaceRecessed,
          borderColor: theme.clay.borderCard,
          borderWidth: 1.5,
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webChipShadow,
            } as any,
            default: {
              ...theme.clay.shadowChip,
            },
          }),
        },
        style,
      ]}
    >
      {showImage ? (
        <Image
          source={{ uri: url }}
          style={{ width: dimension, height: dimension, borderRadius: dimension / 2 }}
          contentFit="cover"
          transition={200}
          onError={() => setHasError(true)}
        />
      ) : (
        <Text
          style={{
            color: theme.colors.textSecondary,
            fontSize: dimension * 0.38,
            fontWeight: theme.typography.weights.semibold,
            letterSpacing: -0.2,
          }}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
