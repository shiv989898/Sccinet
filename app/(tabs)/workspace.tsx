import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Button, EmptyState, AnimatedEntrance, SkeletonLoader } from '../../src/components/ui';
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
      <View style={styles.innerStack}>
        {/* Header */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.headerRow}>
            <View>
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
                Workspace
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
                Manage your active projects
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
        </AnimatedEntrance>

        {/* Projects / Loading Skeleton / Empty State */}
        {isLoadingProjects ? (
          <View style={styles.projectsList}>
            {[1, 2].map((i) => (
              <Card key={i} variant="clay" padding="md">
                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <SkeletonLoader width={140} height={18} borderRadius={6} />
                    <SkeletonLoader width={60} height={18} borderRadius={12} />
                  </View>
                  <SkeletonLoader width="85%" height={14} borderRadius={4} />
                  <SkeletonLoader width={100} height={12} borderRadius={4} />
                </View>
              </Card>
            ))}
          </View>
        ) : userProjects.length > 0 ? (
          <View style={styles.projectsList}>
            {userProjects.map((proj, idx) => (
              <AnimatedEntrance key={proj.id} staggerIndex={1 + Math.min(idx, 5)}>
                <Card
                  variant="clay"
                  padding="md"
                  onPress={() =>
                    router.push({
                      pathname: '/projects/[id]',
                      params: { id: proj.id },
                    })
                  }
                >
                  <View style={styles.projectCardInner}>
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
                            lineHeight: 19,
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
                  </View>
                </Card>
              </AnimatedEntrance>
            ))}
          </View>
        ) : (
          <AnimatedEntrance staggerIndex={1}>
            <Card variant="clay" padding="lg">
              <EmptyState
                icon={<Ionicons name="folder-open-outline" size={30} color={theme.colors.primary} />}
                title="No projects yet"
                description="Create your first project to start building and recruiting collaborators."
                actionTitle="Create a Project"
                onActionPress={() => router.push('/projects/new')}
              />
            </Card>
          </AnimatedEntrance>
        )}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  pageTitle: {},
  pageSubtitle: {
    marginTop: 2,
  },
  projectsList: {
    gap: 12,
  },
  projectCardInner: {
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
  projectItemDesc: {},
  projectItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  projectItemSlug: {
    fontFamily: 'monospace',
  },
});
