import React, { useState } from 'react';
import {
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import {
  Card,
  Input,
  Badge,
  Avatar,
  AnimatedEntrance,
  SegmentedControl,
  SkeletonLoader,
  EmptyState,
} from '../../src/components/ui';
import {
  useDebounce,
  useDiscoverProjects,
  useDiscoverBuilders,
} from '../../src/features/discover';

export default function DiscoverScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  // Debounce search input to ~300ms
  const debouncedSearch = useDebounce(searchQuery, 300);

  // Queries for real Supabase data
  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    isError: isProjectsError,
    error: projectsError,
    refetch: refetchProjects,
    isRefetching: isRefetchingProjects,
  } = useDiscoverProjects(debouncedSearch);

  const {
    data: builders = [],
    isLoading: isLoadingBuilders,
    isError: isBuildersError,
    error: buildersError,
    refetch: refetchBuilders,
    isRefetching: isRefetchingBuilders,
  } = useDiscoverBuilders(debouncedSearch);

  const isRefreshing =
    activeTab === 'projects' ? isRefetchingProjects : isRefetchingBuilders;

  const handleRefresh = () => {
    if (activeTab === 'projects') {
      refetchProjects();
    } else {
      refetchBuilders();
    }
  };

  const isSearching = debouncedSearch.trim().length > 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
        />
      }
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
              Discover
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: 2,
                },
              ]}
            >
              Discover and connect with builders across nodes.
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Search Bar */}
        <AnimatedEntrance staggerIndex={1}>
          <Input
            placeholder={
              activeTab === 'projects'
                ? 'Search active projects...'
                : 'Search builders by name or headline...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            leftAccessory={
              <Ionicons
                name="search"
                size={18}
                color={theme.colors.textMuted}
                style={{ marginRight: 8 }}
              />
            }
            rightAccessory={
              searchQuery.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  activeOpacity={0.7}
                  accessibilityLabel="Clear search"
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name="close-circle"
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </AnimatedEntrance>

        {/* Segmented Control */}
        <AnimatedEntrance staggerIndex={2}>
          <SegmentedControl<'projects' | 'people'>
            options={[
              { label: 'Projects', value: 'projects' },
              { label: 'Builders', value: 'people' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </AnimatedEntrance>

        {/* Tab Content */}
        {activeTab === 'projects' ? (
          /* PROJECTS TAB */
          isLoadingProjects ? (
            <View style={styles.listStack}>
              {[1, 2, 3].map((key) => (
                <Card key={key} variant="clay" padding="md">
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <SkeletonLoader width={36} height={36} borderRadius={10} />
                      <View style={{ gap: 6, flex: 1 }}>
                        <SkeletonLoader width={160} height={16} borderRadius={4} />
                        <SkeletonLoader width={110} height={12} borderRadius={4} />
                      </View>
                    </View>
                    <SkeletonLoader width="100%" height={14} borderRadius={4} />
                    <SkeletonLoader width={140} height={20} borderRadius={6} />
                  </View>
                </Card>
              ))}
            </View>
          ) : isProjectsError ? (
            <Card variant="clay" padding="lg">
              <EmptyState
                icon={
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={theme.colors.error}
                  />
                }
                title="Failed to load projects"
                description={
                  projectsError instanceof Error
                    ? projectsError.message
                    : 'An error occurred while fetching projects.'
                }
                actionTitle="Retry"
                onActionPress={() => refetchProjects()}
              />
            </Card>
          ) : projects.length === 0 ? (
            <AnimatedEntrance staggerIndex={3} key="projects-empty">
              <Card variant="clay" padding="lg">
                <View style={styles.emptyContent}>
                  <View
                    style={[
                      styles.emptyIconWrap,
                      {
                        backgroundColor: theme.isDark
                          ? '#262A34'
                          : theme.clay.surfaceRecessed,
                        borderColor: theme.clay.borderCard,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSearching ? 'search-outline' : 'folder-open-outline'}
                      size={26}
                      color={theme.isDark ? '#4CD7F6' : theme.colors.primary}
                    />
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
                    {isSearching
                      ? `No projects found`
                      : 'No active projects yet'}
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
                    {isSearching
                      ? `No projects matched "${debouncedSearch.trim()}". Try searching with different terms.`
                      : 'Published active projects will appear here when builders share their work.'}
                  </Text>
                </View>
              </Card>
            </AnimatedEntrance>
          ) : (
            <View style={styles.listStack}>
              {projects.map((project, index) => (
                <AnimatedEntrance key={project.id} staggerIndex={index}>
                  <Card
                    variant="clay"
                    padding="md"
                    onPress={() =>
                      router.push({
                        pathname: '/projects/[id]',
                        params: { id: project.id },
                      })
                    }
                  >
                    <View style={styles.projectCardInner}>
                      <View style={styles.projectItemHeader}>
                        <View
                          style={[
                            styles.projectIconSquircle,
                            {
                              backgroundColor: theme.isDark
                                ? '#262A34'
                                : theme.clay.surfaceTrack,
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
                            {project.title}
                          </Text>

                          {project.owner ? (
                            <Text
                              style={[
                                styles.projectOwnerText,
                                {
                                  color: theme.colors.textSecondary,
                                  fontSize: theme.typography.sizes.micro,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              by {project.owner.full_name} (@{project.owner.username})
                            </Text>
                          ) : null}
                        </View>

                        <View
                          style={[
                            styles.statusPill,
                            {
                              backgroundColor: theme.isDark
                                ? '#262A34'
                                : theme.clay.surfaceRecessed,
                              borderColor: theme.clay.borderCard,
                            },
                          ]}
                        >
                          <View
                            style={[
                              styles.statusDot,
                              {
                                backgroundColor:
                                  theme.isDark ? '#4CD7F6' : theme.colors.primary,
                              },
                            ]}
                          />
                          <Text
                            style={[
                              styles.statusLabel,
                              {
                                color:
                                  theme.isDark ? '#4CD7F6' : theme.colors.primary,
                                fontSize: theme.typography.sizes.micro,
                                fontWeight: theme.typography.weights.medium,
                              },
                            ]}
                          >
                            active
                          </Text>
                        </View>
                      </View>

                      {project.description ? (
                        <Text
                          style={[
                            styles.projectDescription,
                            {
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.sizes.xs,
                              lineHeight: 18,
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {project.description}
                        </Text>
                      ) : null}

                      {project.skills && project.skills.length > 0 && (
                        <View style={styles.skillsRow}>
                          {project.skills.slice(0, 4).map((skill) => (
                            <Badge
                              key={skill.id}
                              label={skill.name}
                              variant="outline"
                              size="sm"
                            />
                          ))}
                          {project.skills.length > 4 && (
                            <Text
                              style={[
                                styles.moreSkillsText,
                                {
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.micro,
                                },
                              ]}
                            >
                              +{project.skills.length - 4}
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  </Card>
                </AnimatedEntrance>
              ))}
            </View>
          )
        ) : (
          /* BUILDERS TAB */
          isLoadingBuilders ? (
            <View style={styles.listStack}>
              {[1, 2, 3].map((key) => (
                <Card key={key} variant="clay" padding="md">
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <SkeletonLoader width={44} height={44} borderRadius={22} />
                      <View style={{ gap: 6, flex: 1 }}>
                        <SkeletonLoader width={140} height={16} borderRadius={4} />
                        <SkeletonLoader width={90} height={12} borderRadius={4} />
                      </View>
                    </View>
                    <SkeletonLoader width="100%" height={14} borderRadius={4} />
                    <SkeletonLoader width={130} height={20} borderRadius={6} />
                  </View>
                </Card>
              ))}
            </View>
          ) : isBuildersError ? (
            <Card variant="clay" padding="lg">
              <EmptyState
                icon={
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={theme.colors.error}
                  />
                }
                title="Failed to load builders"
                description={
                  buildersError instanceof Error
                    ? buildersError.message
                    : 'An error occurred while fetching builders.'
                }
                actionTitle="Retry"
                onActionPress={() => refetchBuilders()}
              />
            </Card>
          ) : builders.length === 0 ? (
            <AnimatedEntrance staggerIndex={3} key="builders-empty">
              <Card variant="clay" padding="lg">
                <View style={styles.emptyContent}>
                  <View
                    style={[
                      styles.emptyIconWrap,
                      {
                        backgroundColor: theme.isDark
                          ? '#262A34'
                          : theme.clay.surfaceRecessed,
                        borderColor: theme.clay.borderCard,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name={isSearching ? 'search-outline' : 'people-outline'}
                      size={26}
                      color={theme.isDark ? '#4CD7F6' : theme.colors.primary}
                    />
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
                    {isSearching
                      ? `No builders found`
                      : 'No builders yet'}
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
                    {isSearching
                      ? `No builders matched "${debouncedSearch.trim()}". Try searching by name or headline.`
                      : 'Builders will appear here as the community grows.'}
                  </Text>
                </View>
              </Card>
            </AnimatedEntrance>
          ) : (
            <View style={styles.listStack}>
              {builders.map((builder, index) => (
                <AnimatedEntrance key={builder.id} staggerIndex={index}>
                  <Card
                    variant="clay"
                    padding="md"
                    onPress={() =>
                      router.push({
                        pathname: '/profiles/[id]' as any,
                        params: { id: builder.id },
                      })
                    }
                  >
                    <View style={styles.builderCardInner}>
                      <View style={styles.builderItemHeader}>
                        <Avatar
                          url={builder.avatar_url}
                          name={builder.full_name}
                          size={44}
                        />

                        <View style={styles.builderTitleWrapper}>
                          <Text
                            style={[
                              styles.builderItemTitle,
                              {
                                color: theme.colors.text,
                                fontSize: theme.typography.sizes.md,
                                fontWeight: theme.typography.weights.semibold,
                                letterSpacing: -0.2,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {builder.full_name}
                          </Text>

                          <Text
                            style={[
                              styles.builderUsername,
                              {
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.sizes.micro,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            @{builder.username}
                          </Text>

                          {builder.headline ? (
                            <Text
                              style={[
                                styles.builderHeadline,
                                {
                                  color: theme.isDark
                                    ? '#4CD7F6'
                                    : theme.colors.primary,
                                  fontSize: theme.typography.sizes.xs,
                                  fontWeight: theme.typography.weights.medium,
                                  marginTop: 2,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {builder.headline}
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {builder.bio ? (
                        <Text
                          style={[
                            styles.builderBio,
                            {
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.sizes.xs,
                              lineHeight: 18,
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {builder.bio}
                        </Text>
                      ) : null}

                      <View style={styles.builderFooterRow}>
                        {builder.location ? (
                          <View style={styles.builderLocationRow}>
                            <Ionicons
                              name="location-outline"
                              size={12}
                              color={theme.colors.textMuted}
                            />
                            <Text
                              style={[
                                styles.builderLocationText,
                                {
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.micro,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {builder.location}
                            </Text>
                          </View>
                        ) : (
                          <View />
                        )}

                        {builder.skills && builder.skills.length > 0 && (
                          <View style={styles.skillsRow}>
                            {builder.skills.slice(0, 3).map((skill) => (
                              <Badge
                                key={skill.id}
                                label={skill.name}
                                variant="outline"
                                size="sm"
                              />
                            ))}
                            {builder.skills.length > 3 && (
                              <Text
                                style={[
                                  styles.moreSkillsText,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.micro,
                                  },
                                ]}
                              >
                                +{builder.skills.length - 3}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </Card>
                </AnimatedEntrance>
              ))}
            </View>
          )
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
  pageHeader: {
    paddingTop: 4,
  },
  pageTitle: {},
  pageSubtitle: {},
  listStack: {
    gap: 12,
  },
  // Projects item styles
  projectCardInner: {
    gap: 10,
  },
  projectItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  projectIconSquircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectTitleWrapper: {
    flex: 1,
    gap: 2,
  },
  projectItemTitle: {},
  projectOwnerText: {},
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusLabel: {},
  projectDescription: {},
  skillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  moreSkillsText: {
    marginLeft: 2,
  },
  // Builders item styles
  builderCardInner: {
    gap: 10,
  },
  builderItemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  builderTitleWrapper: {
    flex: 1,
    gap: 1,
  },
  builderItemTitle: {},
  builderUsername: {},
  builderHeadline: {},
  builderBio: {},
  builderFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 8,
  },
  builderLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  builderLocationText: {},
  // Empty state styles
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 12,
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
});
