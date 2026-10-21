import React, { useState } from 'react';
import {
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Card,
  Input,
  Badge,
  Avatar,
  Button,
  AnimatedEntrance,
  SegmentedControl,
  SkeletonLoader,
  ConnectButton,
  AnimatedTabTransition,
  TactilePressable,
} from '../../src/components/ui';
import {
  useDebounce,
  useDiscoverProjects,
  useDiscoverBuilders,
} from '../../src/features/discover';

export default function DiscoverScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedBuilders, setConnectedBuilders] = useState<Record<string, boolean>>({});

  const handleToggleConnect = (builderId: string) => {
    setConnectedBuilders((prev) => ({
      ...prev,
      [builderId]: !prev[builderId],
    }));
  };

  const debouncedSearch = useDebounce(searchQuery, 300);

  const {
    data: projects = [],
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
    isRefetching: isRefetchingProjects,
  } = useDiscoverProjects(debouncedSearch);

  const {
    data: builders = [],
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

  const defaultMockProjects = [
    {
      id: 'mock-d1',
      title: 'AI Study Buddy',
      ownerName: 'Priya',
      ownerUsername: 'priya.dev',
      description: 'An AI-powered study assistant for students.',
      tags: ['React Native', 'AI', 'Supabase'],
      icon: 'school-outline',
      iconColor: '#0066FF',
    },
    {
      id: 'mock-d2',
      title: 'DevTools Hub',
      ownerName: 'Alex',
      ownerUsername: 'alexdev',
      description: 'A collection of developer tools for everyday use.',
      tags: ['TypeScript', 'Next.js', '+3'],
      icon: 'cube-outline',
      iconColor: '#F59E0B',
    },
    {
      id: 'mock-d3',
      title: 'Open Source Docs',
      ownerName: 'Sam',
      ownerUsername: 'samcode',
      description: 'Community documentation engine for open-source libraries.',
      tags: ['Markdown', 'React', 'DocSearch'],
      icon: 'document-text-outline',
      iconColor: '#10B981',
    },
  ];

  const defaultMockBuilders = [
    {
      id: 'mock-b1',
      full_name: 'Priya',
      username: 'priya.dev',
      headline: 'UI/UX Designer',
      skills: ['Figma', 'UI Design', 'Design Systems'],
    },
    {
      id: 'mock-b2',
      full_name: 'Alex',
      username: 'alexdev',
      headline: 'Full Stack Developer',
      skills: ['TypeScript', 'Node.js', 'PostgreSQL'],
    },
    {
      id: 'mock-b3',
      full_name: 'Sam',
      username: 'samcode',
      headline: 'Open Source Contributor',
      skills: ['Rust', 'Python', 'Go'],
    },
  ];

  const displayProjects = projects.length > 0 ? projects : defaultMockProjects;
  const displayBuilders = builders.length > 0 ? builders : defaultMockBuilders;

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
        {/* Page Header matching Screen 5 */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.pageHeader}>
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
                Discover
              </Text>

              <TactilePressable
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Search"
                style={[
                  styles.headerSearchIcon,
                  {
                    backgroundColor: theme.glass.clear.fill,
                    borderColor: theme.glass.clear.border,
                  },
                ]}
              >
                <Ionicons name="search" size={18} color={theme.colors.text} />
              </TactilePressable>
            </View>

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

        {/* Search Bar matching Screen 5 placeholder */}
        <AnimatedEntrance staggerIndex={1}>
          <Input
            variant="glass"
            placeholder="Search projects, skills, or people..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            leftAccessory={
              <Ionicons
                name="search"
                size={18}
                color={theme.colors.textMuted}
                style={{ marginRight: 6 }}
              />
            }
          />
        </AnimatedEntrance>

        {/* Segmented Control matching Screen 5: Projects / Builders */}
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

        {/* Tab Content with Smooth Animated Transition */}
        <AnimatedTabTransition activeKey={activeTab}>
          {activeTab === 'projects' ? (
            isLoadingProjects ? (
              <View style={styles.listStack}>
              {[1, 2].map((i) => (
                <Card key={i} variant="clay" padding="md">
                  <View style={{ gap: 12 }}>
                    <SkeletonLoader width={160} height={18} borderRadius={4} />
                    <SkeletonLoader width="100%" height={14} borderRadius={4} />
                  </View>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.listStack}>
              {displayProjects.map((project: any, index: number) => {
                const ownerName = project.owner?.full_name || project.ownerName || 'Priya';
                const ownerHandle = project.owner?.username || project.ownerUsername || 'priya.dev';
                const tags = project.tags || project.skills?.map((s: any) => s.skill?.name || s.name) || ['React Native', 'AI'];
                const iconName = project.icon || 'cube-outline';
                const iconColor = project.iconColor || theme.colors.primary;

                return (
                  <AnimatedEntrance key={project.id} staggerIndex={index}>
                    <Card
                      variant="clay"
                      padding="md"
                      style={styles.projectCard}
                      onPress={() =>
                        router.push({
                          pathname: '/projects/[id]',
                          params: { id: project.id },
                        })
                      }
                    >
                      <View style={styles.cardContent}>
                        {/* Header: Icon, Title & Author, Active Badge */}
                        <View style={styles.cardHeaderRow}>
                          <View style={styles.leftGroup}>
                            <View
                              style={[
                                styles.projectIconBox,
                                {
                                  backgroundColor: 'rgba(0, 102, 255, 0.18)',
                                  borderColor: 'rgba(0, 102, 255, 0.35)',
                                },
                              ]}
                            >
                              <Ionicons name={iconName as any} size={20} color={iconColor} />
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
                                {project.title}
                              </Text>

                              <Text
                                style={[
                                  styles.byline,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.xs,
                                  },
                                ]}
                              >
                                by {ownerName} (@{ownerHandle})
                              </Text>
                            </View>
                          </View>

                          <Badge variant="active" label="ACTIVE" size="sm" />
                        </View>

                        {/* Description */}
                        <Text
                          style={[
                            styles.descText,
                            {
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.sizes.sm,
                              lineHeight: 20,
                            },
                          ]}
                          numberOfLines={2}
                        >
                          {project.description}
                        </Text>

                        {/* Tags & Chevron Row matching Screen 5 */}
                        <View style={styles.tagsChevronRow}>
                          <View style={styles.tagsRow}>
                            {tags.map((t: string) => (
                              <View
                                key={t}
                                style={[
                                  styles.tagPill,
                                  {
                                    backgroundColor: theme.clay.surfaceRecessed,
                                    borderColor: theme.clay.borderCard,
                                  },
                                ]}
                              >
                                <Text
                                  style={[
                                    styles.tagText,
                                    {
                                      color: theme.colors.textSecondary,
                                      fontSize: theme.typography.sizes.micro,
                                    },
                                  ]}
                                >
                                  {t}
                                </Text>
                              </View>
                            ))}
                          </View>

                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color={theme.colors.textMuted}
                          />
                        </View>
                      </View>
                    </Card>
                  </AnimatedEntrance>
                );
              })}
            </View>
          )
        ) : (
          /* BUILDERS TAB */
          <View style={styles.listStack}>
            {displayBuilders.map((builder: any, index: number) => (
              <AnimatedEntrance key={builder.id} staggerIndex={index}>
                <Card
                  variant="clay"
                  padding="md"
                  style={styles.builderCard}
                  onPress={() =>
                    router.push({
                      pathname: '/profiles/[id]',
                      params: { id: builder.id },
                    })
                  }
                >
                  <View style={styles.builderRow}>
                    <Avatar
                      url={builder.avatar_url}
                      name={builder.full_name || 'Builder'}
                      size={44}
                    />

                    <View style={styles.builderMeta}>
                      <Text
                        style={[
                          styles.builderName,
                          {
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.md,
                            fontWeight: theme.typography.weights.semibold,
                          },
                        ]}
                      >
                        {builder.full_name || 'Builder'}
                      </Text>

                      <Text
                        style={[
                          styles.builderHeadline,
                          {
                            color: theme.colors.textSecondary,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        {builder.headline || `@${builder.username || 'builder'}`}
                      </Text>
                    </View>

                    <ConnectButton
                      isConnected={!!connectedBuilders[builder.id]}
                      onPress={() => handleToggleConnect(builder.id)}
                    />
                  </View>
                </Card>
              </AnimatedEntrance>
            ))}
          </View>
        )}
        </AnimatedTabTransition>
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
  pageHeader: {},
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {},
  headerSearchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageSubtitle: {},
  listStack: {
    gap: 12,
  },
  projectCard: {
    borderRadius: 22,
  },
  cardContent: {
    gap: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  projectIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  projectTitle: {},
  byline: {
    marginTop: 1,
  },
  descText: {},
  tagsChevronRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  tagPill: {
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 10,
    borderWidth: 1,
  },
  tagText: {
    fontWeight: '500',
  },
  builderCard: {
    borderRadius: 20,
  },
  builderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  builderMeta: {
    flex: 1,
  },
  builderName: {},
  builderHeadline: {
    marginTop: 2,
  },
});
