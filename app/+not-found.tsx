import React from 'react';
import { StyleSheet, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/hooks/useTheme';
import { EmptyState } from '../src/components/ui';

export default function NotFoundScreen() {
  const theme = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <EmptyState
          icon={<Ionicons name="alert-circle-outline" size={32} color={theme.colors.textMuted} />}
          title="Screen not found"
          description="The link you followed may be broken or the screen may have been moved."
          actionTitle="Return to Workspace"
          onActionPress={() => router.replace('/(tabs)/workspace')}
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

