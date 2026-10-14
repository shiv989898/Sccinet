import React, { useEffect } from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { motionTokens, useReducedMotion } from '../../src/theme/motion';
import { GlassView } from '../../src/components/ui/GlassView';

function AnimatedTabIcon({
  name,
  outlineName,
  color,
  focused,
  size = 22,
}: {
  name: any;
  outlineName: any;
  color: any;
  focused: boolean;
  size?: number;
}) {
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();
  const theme = useTheme();
  const [scaleAnim] = React.useState(() => new Animated.Value(focused ? 1 : 0.92));
  const [pillOpacity] = React.useState(() => new Animated.Value(focused ? 1 : 0));

  useEffect(() => {
    if (reducedMotion) {
      scaleAnim.setValue(1);
      pillOpacity.setValue(focused ? 1 : 0);
      return;
    }

    if (focused) {
      scaleAnim.setValue(0.82);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 280,
          friction: 14,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(pillOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0.92,
          tension: 240,
          friction: 20,
          useNativeDriver: !isWeb,
        }),
        Animated.timing(pillOpacity, {
          toValue: 0,
          duration: 140,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    }
  }, [focused, scaleAnim, pillOpacity, isWeb, reducedMotion]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 3,
        borderRadius: 16,
      }}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: theme.isDark
              ? 'rgba(10, 132, 255, 0.18)'
              : 'rgba(0, 122, 255, 0.10)',
            borderRadius: 16,
            opacity: pillOpacity,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: theme.isDark
              ? 'rgba(10, 132, 255, 0.35)'
              : 'rgba(0, 122, 255, 0.20)',
          },
        ]}
      />
      <Ionicons
        name={focused ? name : outlineName}
        size={size}
        color={color}
      />
    </Animated.View>
  );
}

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarBackground: () => (
          <GlassView
            variant="tabBar"
            border={true}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : theme.glass.tabBar.fill,
          borderTopWidth: 0,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webCardShadow,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            } as any,
          }),
        },
        tabBarLabelStyle: {
          fontSize: theme.typography.sizes.micro,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarLabel: 'Feed',
          headerTitle: 'Sccinet',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="sparkles"
              outlineName="sparkles-outline"
              color={color}
              focused={focused}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: 'Discover',
          tabBarLabel: 'Discover',
          headerTitle: 'Discover',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="compass"
              outlineName="compass-outline"
              color={color}
              focused={focused}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="workspace"
        options={{
          title: 'Projects',
          tabBarLabel: 'Projects',
          headerTitle: 'Projects',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="layers"
              outlineName="layers-outline"
              color={color}
              focused={focused}
              size={22}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          title: 'Network',
          tabBarLabel: 'Network',
          headerTitle: 'Network',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="people"
              outlineName="people-outline"
              color={color}
              focused={focused}
              size={23}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
          headerTitle: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="person"
              outlineName="person-outline"
              color={color}
              focused={focused}
              size={22}
            />
          ),
        }}
      />
    </Tabs>
  );
}
