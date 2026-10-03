import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Button, EmptyState, AnimatedEntrance } from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useProjects } from '../../src/features/projects';

export default function WorkspaceScreen() {
  const theme = useTheme();
  const { user } = useAuth();

  const { data: userProjects = [], isLoading: isLoadingProjects } = useProjects(
    user ? { ownerId: user.id } : undefined
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <AnimatedEntrance duration={240}>
        <View style={styles.innerStack}>
          {/* Workspace Quick Actions */}
          <View style={styles.actionRow}>
            <View>
              <Text
                style={[
                  styles.sectionTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xl,
                    fontWeight: theme.typography.weights.bold,
                    letterSpacing: -0.3,
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
              variant="clayPrimary"
              leftIcon={<Ionicons name="add" size={16} color="#FFFFFF" />}
              onPress={() => router.push('/projects/new')}
            />
          </View>

          {/* Collaboration Requests Quick Panel */}
          <Card variant="clay" padding="lg" style={styles.requestsCard}>
            <View style={styles.requestsHeader}>
              <View style={styles.requestsTitleRow}>
                <Ionicons name="mail-unread-outline" size={19} color={theme.colors.primary} />
                <Text
                  style={[
                    styles.requestsTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.md,
                      fontWeight: theme.typography.weights.semibold,
                      letterSpacing: -0.2,
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
                  lineHeight: 18,
                  marginTop: theme.spacing.sm,
                },
              ]}
            >
              When other builders request to join your project roles, applications will appear here
              for review.
            </Text>
          </Card>

          {/* Projects Section */}
          {isLoadingProjects ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
          ) : userProjects.length > 0 ? (
            <View style={styles.projectsSection}>
              <View style={styles.projectsSectionHeader}>
                <Text
                  style={[
                    styles.projectsHeading,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.md,
                      fontWeight: theme.typography.weights.semibold,
                      letterSpacing: -0.2,
                    },
                  ]}
                >
                  My Projects ({userProjects.length})
                </Text>
              </View>

              <View style={styles.projectsList}>
                {userProjects.map((proj) => (
                  <Card
                    key={proj.id}
                    variant="clay"
                    padding="lg"
                    style={styles.projectItemCard}
                    onPress={() =>
                      router.push({
                        pathname: '/projects/[id]',
                        params: { id: proj.id },
                      })
                    }
                  >
                    <View style={styles.projectItemHeader}>
                      <Text
                        style={[
                          styles.projectItemTitle,
                          {
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.md,
                            fontWeight: theme.typography.weights.semibold,
                            letterSpacing: -0.2,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {proj.title}
                      </Text>
                      <Badge
                        label={proj.status}
                        variant={proj.status === 'ACTIVE' ? 'success' : 'default'}
                        size="sm"
                      />
                    </View>

                    {proj.description ? (
                      <Text
                        style={[
                          styles.projectItemDesc,
                          {
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.sizes.sm,
                            lineHeight: 20,
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {proj.description}
                      </Text>
                    ) : null}

                    <View style={styles.projectItemFooter}>
                      <Text
                        style={[
                          styles.projectItemSlug,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        /{proj.slug}
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={theme.colors.textMuted} />
                    </View>
                  </Card>
                ))}
              </View>
            </View>
          ) : (
            <Card variant="clay" padding="lg" style={styles.projectsContainer}>
              <EmptyState
                icon={<Ionicons name="folder-open-outline" size={30} color={theme.colors.primary} />}
                title="No Active Projects Yet"
                description="Create your first project to start recruiting collaborators and sharing milestones."
                actionTitle="Create a Project"
                onActionPress={() => router.push('/projects/new')}
              />
            </Card>
          )}
        </View>
      </AnimatedEntrance>
    </ScrollView>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  innerStack: {
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
  loadingBox: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  projectsSection: {
    gap: 10,
  },
  projectsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectsHeading: {},
  projectsList: {
    gap: 10,
  },
  projectItemCard: {
    borderRadius: 16,
    gap: 6,
  },
  projectItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectItemTitle: {
    flex: 1,
    marginRight: 8,
  },
  projectItemDesc: {
    lineHeight: 18,
  },
  projectItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  projectItemSlug: {
    fontFamily: 'monospace',
  },
  projectsContainer: {
    paddingVertical: 16,
  },
});
