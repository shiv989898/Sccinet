import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Button, EmptyState } from '../../src/components/ui';

export default function WorkspaceScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
    >
      {/* Workspace Quick Actions */}
      <View style={styles.actionRow}>
        <View>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            My Workspace
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            Manage active projects and team applications
          </Text>
        </View>

        <Button
          title="New Project"
          size="sm"
          variant="primary"
          leftIcon={<Ionicons name="add" size={16} color="#FFFFFF" />}
        />
      </View>

      {/* Collaboration Requests Quick Panel */}
      <Card variant="outlined" style={styles.requestsCard}>
        <View style={styles.requestsHeader}>
          <View style={styles.requestsTitleRow}>
            <Ionicons name="mail-unread-outline" size={20} color={theme.colors.primary} />
            <Text
              style={[
                styles.requestsTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  marginLeft: 8,
                },
              ]}
            >
              Collaboration Requests
            </Text>
          </View>
          <Badge label="0 Pending" variant="default" size="sm" />
        </View>

        <Text
          style={[
            styles.requestsNotice,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.xs,
              marginTop: theme.spacing.sm,
            },
          ]}
        >
          When other builders request to join your project roles, applications will appear here
          for review.
        </Text>
      </Card>

      {/* Projects Section with EmptyState */}
      <Card variant="default" style={styles.projectsContainer}>
        <EmptyState
          icon={<Ionicons name="folder-open-outline" size={32} color={theme.colors.primary} />}
          title="No Active Projects Yet"
          description="Create your first project to start recruiting collaborators and sharing milestones."
          actionTitle="Create a Project"
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {},
  sectionSubtitle: {
    marginTop: 2,
  },
  requestsCard: {},
  requestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  requestsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestsTitle: {},
  requestsNotice: {},
  projectsContainer: {
    paddingVertical: 16,
  },
});
