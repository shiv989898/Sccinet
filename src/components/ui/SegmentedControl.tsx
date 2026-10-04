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
import { motionTokens } from '../../theme/motion';

export interface SegmentedControlOption<T extends string = string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  style,
  size = 'md',
}: SegmentedControlProps<T>) {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const [containerWidth, setContainerWidth] = useState(0);

  const selectedIndex = Math.max(
    0,
    options.findIndex((opt) => opt.value === value)
  );

  const translateX = useRef(new Animated.Value(0)).current;

  const itemWidth =
    containerWidth > 0 && options.length > 0
      ? (containerWidth - 8) / options.length
      : 0;

  useEffect(() => {
    if (itemWidth > 0) {
      Animated.spring(translateX, {
        toValue: selectedIndex * itemWidth,
        tension: motionTokens.spring.snappy.tension,
        friction: motionTokens.spring.snappy.friction,
        useNativeDriver: !isWeb,
      }).start();
    }
  }, [selectedIndex, itemWidth, translateX, isWeb]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    const calculatedItemWidth = (width - 8) / options.length;
    translateX.setValue(selectedIndex * calculatedItemWidth);
  };

  const isSm = size === 'sm';
  const controlHeight = isSm ? 36 : 42;

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          height: controlHeight,
          backgroundColor: theme.clay.surfaceRecessed,
          borderColor: theme.clay.borderCard,
          borderRadius: 14,
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webRecessedTrackShadow,
            } as any,
          }),
        },
        style,
      ]}
      accessibilityRole="tablist"
    >
      {/* Sliding Active Pill Indicator */}
      {itemWidth > 0 && (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: itemWidth,
              height: controlHeight - 8,
              top: 4,
              left: 4,
              borderRadius: 10,
              backgroundColor: theme.clay.surfaceActivePill,
              borderColor: theme.clay.borderCard,
              transform: [{ translateX }],
              ...Platform.select({
                web: {
                  boxShadow: theme.clay.webPillShadow,
                  transition: 'none',
                } as any,
                default: {
                  ...theme.clay.shadowPill,
                },
              }),
            },
          ]}
        />
      )}

      {/* Options */}
      <View style={styles.optionsRow}>
        {options.map((option, index) => {
          const isSelected = option.value === value;
          return (
            <Pressable
              key={option.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: isSelected }}
              onPress={() => {
                if (option.value !== value) {
                  onChange(option.value);
                }
              }}
              style={({ pressed }) => [
                styles.option,
                {
                  opacity: pressed ? 0.8 : 1,
                  transform:
                    isWeb && pressed
                      ? [{ scale: motionTokens.scale.pressedChip }]
                      : [],
                  ...Platform.select({
                    web: {
                      cursor: 'pointer',
                      transition: 'opacity 0.15s ease',
                    } as any,
                  }),
                },
              ]}
            >
              {option.icon && (
                <View style={styles.iconContainer}>{option.icon}</View>
              )}
              <Text
                style={[
                  styles.optionText,
                  {
                    color: isSelected ? theme.colors.text : theme.colors.textSecondary,
                    fontSize: isSm
                      ? theme.typography.sizes.xs
                      : theme.typography.sizes.sm,
                    fontWeight: isSelected
                      ? theme.typography.weights.semibold
                      : theme.typography.weights.medium,
                    letterSpacing: -0.1,
                  },
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderWidth: 1,
    padding: 4,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  indicator: {
    position: 'absolute',
    borderWidth: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    zIndex: 1,
  },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    marginRight: 6,
  },
  optionText: {
    textAlign: 'center',
  },
});
