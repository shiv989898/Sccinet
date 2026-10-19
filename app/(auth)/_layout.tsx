import React from 'react';
import { Stack } from 'expo-router';

export default function AuthLayout() {

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        animationDuration: 200,
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="sign-in" options={{ animation: 'fade' }} />
      <Stack.Screen name="onboarding" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
