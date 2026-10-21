import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
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

export interface FilterPillOption<T extends string = string> {
  label: string;
  value: T;
  count?: number;
}

export interface AnimatedFilterPillsProps<T extends string = string> {
  options: FilterPillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
}

export function AnimatedFilterPills<T extends string = string>({
  options,
  value,
  onChange,
  style,
}: AnimatedFilterPillsProps<T>) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const translateX = useRef(new Animated.Value(0)).current;

  const itemWidth =
    containerWidth > 0 && options.length > 0
      ? (containerWidth - 6) / options.length
      : 0;

  useEffect(() => {
    if (itemWidth > 0) {
      if (reducedMotion) {
        translateX.setValue(selectedIndex * itemWidth);
        return;
      }
      Animated.spring(translateX, {
        toValue: selectedIndex * itemWidth,
        tension: motionTokens.spring.snappy.tension,
        friction: motionTokens.spring.snappy.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  }, [selectedIndex, itemWidth, translateX, isWeb, reducedMotion]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    const calculatedItemWidth = (width - 6) / options.length;
    translateX.setValue(selectedIndex * calculatedItemWidth);
  };

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          backgroundColor: theme.clay.surfaceRecessed,
          borderColor: theme.clay.borderCard,
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* Gliding Active Pill */}
      {itemWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: itemWidth,
              backgroundColor: 'rgba(0, 102, 255, 0.28)',
              borderColor: 'rgba(0, 102, 255, 0.50)',
              transform: [{ translateX }],
            },
          ]}
        />
      )}

      {/* Pill Options */}
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="tab"
              accessibilityLabel={option.label}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.optionItem,
                isWeb && ({ cursor: 'pointer', opacity: pressed ? 0.75 : 1 } as any),
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? '#FFFFFF' : theme.colors.textSecondary,
                    fontWeight: isSelected ? '600' : '500',
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {option.label}
              </Text>
              {option.count !== undefined && (
                <View
                  style={[
                    styles.countBadge,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(255, 255, 255, 0.20)'
                        : theme.clay.surfaceElevated,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.countBadgeText,
                      { color: isSelected ? '#FFFFFF' : theme.colors.textMuted },
                    ]}
                  >
                    {option.count}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    padding: 3,
    position: 'relative',
    justifyContent: 'center',
  },
  indicator: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 9,
    borderWidth: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    height: '100%',
    zIndex: 1,
  },
  optionItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  optionText: {
    letterSpacing: -0.1,
  },
  countBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
