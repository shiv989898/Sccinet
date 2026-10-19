import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Card, Badge, Button, AnimatedEntrance, SkeletonLoader, SegmentedControl } from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useProjects } from '../../src/features/projects';

export default function WorkspaceScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'ACTIVE' | 'COMPLETED'>('all');

  const { data: userProjects = [], isLoading: isLoadingProjects } = useProjects(
    user ? { ownerId: user.id } : undefined
  );

  const mockProjects = [
    {
      id: 'mock-p1',
      title: 'AI Content Studio',
      slug: 'ai-content-studio',
      category: 'Personal project',
      description: 'An AI-powered content generation tool for YouTube, blogs and social media.',
      status: 'ACTIVE' as const,
      tags: ['Python', 'AI', 'Docker'],
      updated: '2h ago',
    },
    {
      id: 'mock-p2',
      title: 'Sccinet Mobile',
      slug: 'sccinet-mobile',
      category: 'Main application',
      description: 'The native mobile experience for the Sccinet collaborative builder network.',
      status: 'ACTIVE' as const,
      tags: ['React Native', 'TypeScript'],
      updated: '1d ago',
    },
    {
      id: 'mock-p3',
      title: 'YouTube Automator',
      slug: 'youtube-automator',
      category: 'Video automation pipeline',
      description: 'Automated video rendering and publishing pipeline with audio alignment.',
      status: 'COMPLETED' as const,
      tags: ['Python', 'FFmpeg'],
      updated: '4d ago',
    },
  ];

  const sourceProjects = userProjects.length > 0 ? userProjects : mockProjects;

  const filteredProjects = sourceProjects.filter((proj) => {
    if (activeTab === 'all') return true;
    return proj.status === activeTab;
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: theme.spacing.lg,
          paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
          paddingBottom: Math.max(insets.bottom + 96, 110),
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerStack}>
        {/* Header - Matching Screen 6 */}
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

            {/* Active Builds Badge matching Screen 6 */}
            <Badge variant="builds" label="+ 2 Active Builds" size="sm" />
          </View>
        </View>

        {/* Filter Segmented Control & New Project Button */}
        <View style={styles.actionBar}>
          <SegmentedControl<'all' | 'ACTIVE' | 'COMPLETED'>
            size="sm"
            options={[
              { label: 'All', value: 'all' },
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Completed', value: 'COMPLETED' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />

          <Button
            title="New Project"
            size="md"
            variant="clayPrimary"
            leftIcon={<Ionicons name="add" size={18} color="#FFFFFF" />}
            onPress={() => router.push('/projects/new')}
            style={styles.newProjectButton}
          />
        </View>

        {/* Projects List */}
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
        ) : (
          <View style={styles.projectsList}>
            {filteredProjects.map((proj: any, index) => {
              const tags = proj.tags || (proj.skills?.map((s: any) => s.skill?.name || s.name)) || ['TypeScript'];
              const isCompleted = proj.status === 'COMPLETED';
              const updatedText = proj.updated || 'Updated recently';
              const categoryText = proj.category || 'Repository build';

              return (
                <AnimatedEntrance key={proj.id} staggerIndex={index}>
                  <Card
                    variant="clay"
                    padding="md"
                    style={styles.projectCard}
                    onPress={() =>
                      router.push({
                        pathname: '/projects/[id]',
                        params: { id: proj.id },
                      })
                    }
                  >
                    <View style={styles.projectCardInner}>
                      {/* Top Row: Icon + Title & Category + Badge */}
                      <View style={styles.projectHeaderRow}>
                        <View style={styles.projectLeftGroup}>
                          <View
                            style={[
                              styles.iconBox,
                              {
                                backgroundColor: isCompleted
                                  ? 'rgba(255, 255, 255, 0.08)'
                                  : 'rgba(0, 102, 255, 0.22)',
                                borderColor: isCompleted
                                  ? 'rgba(255, 255, 255, 0.14)'
                                  : 'rgba(0, 102, 255, 0.40)',
                              },
                            ]}
                          >
                            <Ionicons
                              name={isCompleted ? 'play-circle-outline' : 'layers-outline'}
                              size={20}
                              color={isCompleted ? theme.colors.textMuted : theme.colors.primary}
                            />
                          </View>

                          <View style={styles.titleColumn}>
                            <Text
                              style={[
                                styles.projectTitle,
                                {
                                  color: theme.colors.text,
                                  fontSize: theme.typography.sizes.md,
                                  fontWeight: theme.typography.weights.semibold,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {proj.title}
                            </Text>

                            <Text
                              style={[
                                styles.projectCategory,
                                {
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.xs,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {categoryText}
                            </Text>
                          </View>
                        </View>

                        <Badge
                          label={proj.status}
                          variant={isCompleted ? 'completed' : 'active'}
                          size="sm"
                        />
                      </View>

                      {/* Tech Tags Row matching Screen 6 */}
                      <View style={styles.tagsRow}>
                        {tags.map((tag: string) => (
                          <View
                            key={tag}
                            style={[
                              styles.techPill,
                              {
                                backgroundColor: theme.clay.surfaceRecessed,
                                borderColor: theme.clay.borderCard,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.techPillText,
                                {
                                  color: theme.colors.textSecondary,
                                  fontSize: theme.typography.sizes.micro,
                                },
                              ]}
                            >
                              {tag}
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Footer: Branch & Updated Info matching Screen 6 */}
                      <View style={styles.footerRow}>
                        <View style={styles.branchGroup}>
                          <Ionicons
                            name="git-branch-outline"
                            size={12}
                            color={theme.colors.textMuted}
                          />
                          <Text
                            style={[
                              styles.footerText,
                              { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
                            ]}
                          >
                            main • Updated {updatedText}
                          </Text>
                        </View>

                        <Ionicons
                          name="chevron-forward"
                          size={16}
                          color={theme.colors.textMuted}
                        />
                      </View>
                    </View>
                  </Card>
                </AnimatedEntrance>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    gap: 16,
  },
  innerStack: {
    gap: 16,
  },
  headerBlock: {},
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {},
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  newProjectButton: {
    borderRadius: 14,
  },
  projectsList: {
    gap: 12,
  },
  projectCard: {
    borderRadius: 22,
  },
  projectCardInner: {
    gap: 12,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  projectTitle: {},
  projectCategory: {
    marginTop: 2,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  techPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  techPillText: {
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  branchGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {},
});
