import React, { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { motionTokens } from '../../src/theme/motion';

function AnimatedTabIcon({
  name,
  outlineName,
  color,
  focused,
  size = 22,
}: {
  name: any;
  outlineName: any;
  color: string;
  focused: boolean;
  size?: number;
}) {
  const isWeb = Platform.OS === 'web';
  const scaleAnim = useRef(new Animated.Value(focused ? 1 : 0.92)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: focused ? 1 : 0.92,
      tension: motionTokens.spring.snappy.tension,
      friction: motionTokens.spring.snappy.friction,
      useNativeDriver: !isWeb,
    }).start();
  }, [focused, scaleAnim, isWeb]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
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
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.clay.surface,
          borderBottomWidth: 1,
          borderBottomColor: theme.clay.borderCard,
        },
        headerTitleStyle: {
          color: theme.colors.text,
          fontSize: theme.typography.sizes.lg,
          fontWeight: '600',
          letterSpacing: -0.3,
        },
        headerShadowVisible: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.clay.surface,
          borderTopWidth: 1,
          borderTopColor: theme.clay.borderCard,
          height: Platform.OS === 'ios' ? 88 : 64,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webCardShadow,
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
            } as any,
            default: {
              ...theme.clay.shadowPill,
            },
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
          title: 'Workspace',
          tabBarLabel: 'Workspace',
          headerTitle: 'My Workspace',
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon
              name="briefcase"
              outlineName="briefcase-outline"
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
