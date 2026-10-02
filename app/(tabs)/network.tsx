import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, EmptyState } from '../../src/components/ui';

export default function NetworkScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
    >
      {/* Network Stats Card */}
      <Card variant="elevated" style={styles.statsCard}>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              0
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                  marginTop: 2,
                },
              ]}
            >
              Connections
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              0
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                  marginTop: 2,
                },
              ]}
            >
              Following
            </Text>
          </View>

          <View style={[styles.statDivider, { backgroundColor: theme.colors.border }]} />

          <View style={styles.statItem}>
            <Text
              style={[
                styles.statNumber,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              0
            </Text>
            <Text
              style={[
                styles.statLabel,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                  marginTop: 2,
                },
              ]}
            >
              Followers
            </Text>
          </View>
        </View>
      </Card>

      {/* Suggested Collaborators Section */}
      <View style={styles.sectionHeader}>
        <Text
          style={[
            styles.sectionTitle,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.semibold,
            },
          ]}
        >
          Suggested Collaborators
        </Text>
        <Badge label="Based on Skills" variant="default" size="sm" />
      </View>

      <Card variant="default">
        <EmptyState
          icon={<Ionicons name="people-outline" size={32} color={theme.colors.primary} />}
          title="Grow Your Professional Network"
          description="Discover fellow creators, developers, and designers to build projects together."
          actionTitle="Explore Creators"
          onActionPress={() => {}}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  statsCard: {
    paddingVertical: 18,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {},
  statLabel: {},
  statDivider: {
    width: 1,
    height: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  sectionTitle: {},
});
