import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { useTheme } from '../src/hooks/useTheme';
import { EmptyState } from '../src/components/ui';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon="alert-circle-outline"
          title="Screen not found"
          description="The link you followed may be broken or the screen may have been moved."
          actionLabel="Return to Workspace"
          onAction={() => router.replace('/(tabs)/workspace')}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
});

