import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Button, AnimatedEntrance } from '../../src/components/ui';

export default function FeedScreen() {
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
              Feed
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
              Project updates from your network
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Empty State */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="lg" style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <View
                style={[
                  styles.emptyIconWrap,
                  { backgroundColor: theme.colors.primaryMuted },
                ]}
              >
                <Ionicons name="layers-outline" size={26} color={theme.colors.primary} />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.semibold,
                    letterSpacing: -0.3,
                    marginTop: 16,
                  },
                ]}
              >
                Nothing here yet
              </Text>
              <Text
                style={[
                  styles.emptyDesc,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                    lineHeight: 20,
                    marginTop: 6,
                    textAlign: 'center',
                  },
                ]}
              >
                Start a project to see updates, milestones, and team activity from your workspace.
              </Text>
              <Button
                title="Start a Project"
                size="md"
                variant="clayPrimary"
                leftIcon={<Ionicons name="add" size={16} color="#FFFFFF" />}
                onPress={() => router.push('/projects/new')}
                style={styles.emptyAction}
              />
            </View>
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
  emptyCard: {},
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDesc: {},
  emptyAction: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
