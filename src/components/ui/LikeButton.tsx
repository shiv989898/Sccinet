import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onToggle: () => void;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export function LikeButton({
  isLiked,
  count,
  onToggle,
  size = 18,
  style,
}: LikeButtonProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const ringScaleAnim = useRef(new Animated.Value(0.6)).current;
  const ringOpacityAnim = useRef(new Animated.Value(0)).current;
  const countAnim = useRef(new Animated.Value(0)).current;
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (reducedMotion) {
      scaleAnim.setValue(1);
      return;
    }

    if (isLiked) {
      // Spring pop animation on like
      scaleAnim.setValue(0.72);
      ringScaleAnim.setValue(0.6);
      ringOpacityAnim.setValue(0.6);
      countAnim.setValue(-4);

      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 340,
          friction: 12,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(ringScaleAnim, {
          toValue: 1.6,
          duration: 320,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(ringOpacityAnim, {
          toValue: 0,
          duration: 320,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(countAnim, {
          toValue: 0,
          tension: 280,
          friction: 18,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    } else {
      // Gentle compression on unlike
      scaleAnim.setValue(0.88);
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 260,
        friction: 20,
        useNativeDriver: !isWeb,
      }).start();
    }
  }, [isLiked, isWeb, reducedMotion, scaleAnim, ringScaleAnim, ringOpacityAnim, countAnim]);

  const handlePressIn = () => {
    if (!reducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: 0.85,
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion && !isLiked) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const heartColor = isLiked ? '#EF4444' : theme.colors.textMuted;

  return (
    <Pressable
      onPress={onToggle}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={isLiked ? `Liked, ${count} likes` : `Like, ${count} likes`}
      accessibilityState={{ selected: isLiked }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={({ pressed }) => [
        styles.container,
        isWeb && ({ cursor: 'pointer', opacity: pressed ? 0.8 : 1 } as any),
        style,
      ]}
    >
      <View style={styles.iconWrapper}>
        {/* Bloom ring on like */}
        <Animated.View
          style={[
            styles.bloomRing,
            {
              width: size * 1.6,
              height: size * 1.6,
              borderRadius: (size * 1.6) / 2,
              transform: [{ scale: ringScaleAnim }],
              opacity: ringOpacityAnim,
            },
          ]}
        />

        {/* Heart Icon with spring pop */}
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={size}
            color={heartColor}
          />
        </Animated.View>
      </View>

      <Animated.Text
        style={[
          styles.countText,
          {
            color: heartColor,
            fontSize: theme.typography.sizes.xs,
            transform: [{ translateY: countAnim }],
          },
        ]}
      >
        {count}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
    height: 24,
  },
  bloomRing: {
    position: 'absolute',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  countText: {
    fontWeight: '500',
    fontVariant: ['tabular-nums'],
  },
});
