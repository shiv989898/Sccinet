import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, EmptyState, AnimatedEntrance } from '../../src/components/ui';

export default function NetworkScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerStack}>
        {/* Page Header */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.pageHeader}>
            <Text
              style={[
                styles.pageTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xxl,
                  fontWeight: theme.typography.weights.bold,
                  letterSpacing: -0.5,
                },
              ]}
            >
              Network
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: 2,
                },
              ]}
            >
              Builders and collaborators you know
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Empty State */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="lg">
            <EmptyState
              icon={<Ionicons name="people-outline" size={30} color={theme.colors.primary} />}
              title="Your network is empty"
              description="Connect with other builders to see them here. Collaborate on projects to grow your professional network."
            />
          </Card>
        </AnimatedEntrance>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  innerStack: {
    gap: 20,
  },
  pageHeader: {
    paddingTop: 4,
  },
  pageTitle: {},
  pageSubtitle: {},
});
