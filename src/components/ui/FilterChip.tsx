import React from 'react';
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
import { useTheme } from '../../hooks/useTheme';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface FilterChipProps {
  label: string;
  count?: number | string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function FilterChip({
  label,
  count,
  active = false,
  onPress,
  style,
}: FilterChipProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const [scaleAnim] = React.useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    if (!reducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: motionTokens.scale.pressedCard,
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!reducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: motionTokens.spring.snappy.tension,
        friction: motionTokens.spring.snappy.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const backgroundColor = active
    ? theme.colors.primary
    : theme.clay.surfaceElevated;

  const textColor = active
    ? '#FFFFFF'
    : theme.colors.text;

  const borderColor = active
    ? theme.colors.primary
    : theme.clay.borderCard;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor,
            borderColor,
            borderRadius: theme.borderRadius.full,
            transform: [{ scale: scaleAnim }],
            ...Platform.select({
              web: {
                boxShadow: active ? theme.clay.webPillShadow : theme.clay.webChipShadow,
                transition: 'background-color 0.15s ease, border-color 0.15s ease',
              } as any,
              default: {
                ...(active ? theme.clay.shadowPill : theme.clay.shadowChip),
              },
            }),
          },
          style,
        ]}
      >
        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: theme.typography.sizes.sm,
              fontWeight: active
                ? theme.typography.weights.semibold
                : theme.typography.weights.medium,
            },
          ]}
        >
          {label}
        </Text>

        {count !== undefined && count !== null ? (
          <View
            style={[
              styles.countBadge,
              {
                backgroundColor: active
                  ? 'rgba(255, 255, 255, 0.28)'
                  : theme.clay.surfaceRecessed,
              },
            ]}
          >
            <Text
              style={[
                styles.countText,
                {
                  color: active ? '#FFFFFF' : theme.colors.textMuted,
                  fontSize: theme.typography.sizes.micro,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
            >
              {count}
            </Text>
          </View>
        ) : null}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginRight: 8,
  },
  label: {
    letterSpacing: -0.2,
  },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    letterSpacing: 0.1,
  },
});
