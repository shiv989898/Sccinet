import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { motionTokens, useReducedMotion } from '../../theme/motion';

export interface ConnectButtonProps {
  isConnected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ConnectButton({
  isConnected,
  onPress,
  style,
}: ConnectButtonProps) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (reducedMotion) {
      iconScaleAnim.setValue(1);
      return;
    }

    // Micro spring pop for the icon when connection state changes
    iconScaleAnim.setValue(0.5);
    Animated.spring(iconScaleAnim, {
      toValue: 1,
      tension: 320,
      friction: 14,
      useNativeDriver: !isWeb,
    }).start();
  }, [isConnected, isWeb, reducedMotion, iconScaleAnim]);

  const handlePressIn = () => {
    if (!reducedMotion) {
      Animated.spring(scaleAnim, {
        toValue: motionTokens.scale.pressedChip,
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
        tension: motionTokens.spring.tactile.tension,
        friction: motionTokens.spring.tactile.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const backgroundColor = isConnected
    ? theme.clay.surfaceRecessed
    : '#0066FF';

  const borderColor = isConnected
    ? theme.clay.borderCard
    : 'rgba(0, 102, 255, 0.45)';

  const textColor = isConnected
    ? theme.colors.textSecondary
    : '#FFFFFF';

  return (
    <Animated.View
      style={[
        { transform: [{ scale: scaleAnim }] },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityRole="button"
        accessibilityLabel={isConnected ? 'Connected. Tap to disconnect.' : 'Connect'}
        accessibilityState={{ selected: isConnected }}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor,
            borderColor,
            opacity: pressed ? 0.88 : 1,
            ...Platform.select({
              web: {
                cursor: 'pointer',
                transition: 'background-color 160ms ease, border-color 160ms ease',
              } as any,
            }),
          },
        ]}
      >
        <Animated.View style={{ transform: [{ scale: iconScaleAnim }] }}>
          <Ionicons
            name={isConnected ? 'checkmark' : 'person-add-outline'}
            size={14}
            color={textColor}
          />
        </Animated.View>

        <Text
          style={[
            styles.label,
            {
              color: textColor,
              fontSize: theme.typography.sizes.xs,
              fontWeight: isConnected ? '500' : '600',
            },
          ]}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    letterSpacing: 0.1,
  },
});
