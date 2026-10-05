import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { AuthProvider, useAuth } from '../src/features/auth/AuthContext';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'sccinet-web-focus-reset';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      input, textarea, select, [contenteditable="true"] {
        outline: none !important;
        outline-style: none !important;
        box-shadow: none !important;
      }
      input:focus, textarea:focus, select:focus, [contenteditable="true"]:focus {
        outline: none !important;
        outline-style: none !important;
        box-shadow: none !important;
      }
      *:focus-visible {
        outline: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

function RootNavigator() {
  const theme = useTheme();
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = (segments as string[])[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to sign in if unauthenticated and trying to access app
      router.replace('/(auth)/sign-in');
    } else if (isAuthenticated && inAuthGroup && (segments as string[])[1] === 'sign-in') {
      // Redirect to main tabs if authenticated and on sign-in
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerTintColor: theme.colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
          animation: Platform.OS === 'web' ? 'fade' : 'slide_from_right',
          animationDuration: 200,
          gestureEnabled: true,
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen
          name="projects/new"
          options={{
            headerShown: false,
            animation: Platform.OS === 'web' ? 'fade' : 'slide_from_bottom',
            animationDuration: 220,
          }}
        />
        <Stack.Screen
          name="projects/[id]"
          options={{
            headerShown: false,
            animation: Platform.OS === 'web' ? 'fade' : 'slide_from_right',
            animationDuration: 220,
          }}
        />
        <Stack.Screen
          name="projects/edit"
          options={{
            headerShown: false,
            animation: Platform.OS === 'web' ? 'fade' : 'slide_from_bottom',
            animationDuration: 220,
          }}
        />
        <Stack.Screen
          name="+not-found"
          options={{
            title: 'Not Found',
            presentation: 'modal',
          }}
        />
      </Stack>

    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
