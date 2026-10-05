import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Button, EmptyState, AnimatedEntrance, SkeletonLoader, SegmentedControl } from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useProjects } from '../../src/features/projects';

export default function WorkspaceScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'ACTIVE' | 'COMPLETED'>('all');

  const { data: userProjects = [], isLoading: isLoadingProjects } = useProjects(
    user ? { ownerId: user.id } : undefined
  );

  const activeProjectsCount = userProjects.filter((p) => p.status === 'ACTIVE').length;

  const filteredProjects = userProjects.filter((proj) => {
    if (activeTab === 'all') return true;
    return proj.status === activeTab;
  });

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerStack}>
        {/* Header - Matching Stitch Projects Screen */}
        <View style={styles.headerBlock}>
          <View style={styles.headerTitleRow}>
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
              Projects
            </Text>

            {/* Tactile Active Builds Indicator */}
            <View
              style={[
                styles.activeBadge,
                {
                  backgroundColor: theme.isDark ? '#262A34' : theme.clay.surfaceRecessed,
                  borderColor: theme.clay.borderCard,
                },
              ]}
            >
              <View
                style={[
                  styles.pulseDot,
                  {
                    backgroundColor: theme.isDark ? '#4CD7F6' : theme.colors.primary,
                  },
                ]}
              />
              <Text
                style={[
                  styles.activeBadgeText,
                  {
                    color: theme.isDark ? '#4CD7F6' : theme.colors.primary,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                {activeProjectsCount} Active {activeProjectsCount === 1 ? 'Build' : 'Builds'}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.pageSubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            Repositories and active collaborative builds.
          </Text>
        </View>

        {/* Top Action Bar: Segmented Switch & Tactile Button */}
        <View style={styles.actionBar}>
          <SegmentedControl<'all' | 'ACTIVE' | 'COMPLETED'>
            size="sm"
            options={[
              { label: 'All Projects', value: 'all' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Completed', value: 'COMPLETED' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          <Button
            title="+ New Project"
            size="md"
            variant="clayPrimary"
            leftIcon={<Ionicons name="add-circle-outline" size={18} color="#FFFFFF" />}
            onPress={() => router.push('/projects/new')}
            style={styles.newProjectButton}
          />
        </View>

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
        ) : filteredProjects.length > 0 ? (
          <AnimatedEntrance duration={180}>
            <View style={styles.projectsList}>
              {filteredProjects.map((proj) => (
                <Card
                  key={proj.id}
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
                      <View style={styles.projectIdentityRow}>
                        {/* Tactile Squircle Icon Box from Stitch */}
                        <View
                          style={[
                            styles.projectIconSquircle,
                            {
                              backgroundColor: theme.isDark ? '#262A34' : theme.clay.surfaceTrack,
                              borderColor: theme.clay.borderCard,
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webChipShadow,
                                } as any,
                                default: {
                                  ...theme.clay.shadowChip,
                                },
                              }),
                            },
                          ]}
                        >
                          <Ionicons
                            name="cube-outline"
                            size={18}
                            color={theme.isDark ? '#4CD7F6' : theme.colors.primary}
                          />
                        </View>

                        <View style={styles.projectTitleWrapper}>
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

                          <View style={styles.projectMetaRow}>
                            <Text
                              style={[
                                styles.projectStatusIndicator,
                                {
                                  color: proj.status === 'ACTIVE'
                                    ? (theme.isDark ? '#4CD7F6' : theme.colors.primary)
                                    : theme.colors.textSecondary,
                                  fontSize: theme.typography.sizes.micro,
                                  fontWeight: theme.typography.weights.medium,
                                },
                              ]}
                            >
                              {proj.status.toLowerCase()}
                            </Text>
                            <Text style={[styles.metaDot, { color: theme.colors.textMuted }]}>•</Text>
                            <Text
                              style={[
                                styles.projectItemSlug,
                                {
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.micro,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              /{proj.slug}
                            </Text>
                          </View>
                        </View>
                      </View>

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
                      <View style={styles.footerTag}>
                        <Ionicons
                          name="git-branch-outline"
                          size={13}
                          color={theme.colors.textMuted}
                        />
                        <Text style={[styles.footerBranch, { color: theme.colors.textMuted }]}>
                          main
                        </Text>
                      </View>

                      <View style={styles.footerChevronWrap}>
                        <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
                      </View>
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          </AnimatedEntrance>
        ) : (
          <AnimatedEntrance duration={180}>
            <Card variant="clay" padding="lg">
              <EmptyState
                icon={<Ionicons name="folder-open-outline" size={30} color={theme.colors.primary} />}
                title={activeTab === 'all' ? 'No projects yet' : `No ${activeTab.toLowerCase()} projects`}
                description={
                  activeTab === 'all'
                    ? 'Create your first project to start building and recruiting collaborators.'
                    : `You don't have any projects with ${activeTab.toLowerCase()} status.`
                }
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
    gap: 16,
  },
  headerBlock: {
    gap: 4,
    paddingTop: 4,
  },
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pageTitle: {},
  pageSubtitle: {},
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 6,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  activeBadgeText: {},
  actionBar: {
    gap: 10,
  },
  newProjectButton: {
    width: '100%',
  },
  projectsList: {
    gap: 12,
  },
  projectCardInner: {
    gap: 10,
  },
  projectItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  projectIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  projectIconSquircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  projectTitleWrapper: {
    flex: 1,
    minWidth: 0,
  },
  projectItemTitle: {},
  projectMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  projectStatusIndicator: {
    textTransform: 'uppercase',
  },
  metaDot: {
    fontSize: 10,
  },
  projectItemSlug: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    flexShrink: 1,
  },
  projectItemDesc: {},
  projectItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  footerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerBranch: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footerChevronWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
