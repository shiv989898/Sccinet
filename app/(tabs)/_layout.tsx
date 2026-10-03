import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useTheme } from '../../src/hooks/useTheme';

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
            <Ionicons
              name={focused ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={color}
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
            <Ionicons
              name={focused ? 'compass' : 'compass-outline'}
              size={23}
              color={color}
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
            <Ionicons
              name={focused ? 'briefcase' : 'briefcase-outline'}
              size={22}
              color={color}
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
            <Ionicons
              name={focused ? 'people' : 'people-outline'}
              size={23}
              color={color}
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
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
