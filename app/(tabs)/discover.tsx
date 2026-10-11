import React, { useMemo, useState } from 'react';
import {
  Platform,
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
  AnimatedEntrance,
  Avatar,
  Badge,
  Card,
  EmptyState,
  FilterChip,
  Input,
  SegmentedControl,
  SkeletonLoader,
} from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useProjectsWithDetails } from '../../src/features/projects';
import {
  useAvailableSkills,
  useCurrentProfile,
  useProfiles,
} from '../../src/features/profiles/useProfile';
import { DiscoverProjectCard } from '../../src/features/projects/components/DiscoverProjectCard';
import { DiscoverBuilderCard } from '../../src/features/profiles/components/DiscoverBuilderCard';

// High-fidelity featured items matching the Stitch design
const FEATURED_MOCK_PROJECTS = [
  {
    id: 'hyperscale-db',
    title: 'HyperScale DB',
    slug: 'hyperscale-db',
    description:
      'Next-gen distributed SQLite engine optimized for edge compute and instant multi-region sync.',
    status: 'ACTIVE',
    openRolesCount: 2,
    memberCount: 4,
    skills: [
      { id: '1', name: 'Rust' },
      { id: '2', name: 'PostgreSQL' },
      { id: '3', name: 'Docker' },
      { id: '4', name: 'WASM' },
    ],
    members: [
      { profile: { id: 'm1', full_name: 'Elena Rostova', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120' } },
      { profile: { id: 'm2', full_name: 'Marcus Chen', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' } },
      { profile: { id: 'm3', full_name: 'Sarah Connor', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120' } },
    ],
  },
  {
    id: 'suno-canvas',
    title: 'Suno Canvas',
    slug: 'suno-canvas',
    description:
      'AI-assisted vector canvas designed for collaborative whiteboarding and design system compilation.',
    status: 'ACTIVE',
    openRolesCount: 1,
    memberCount: 3,
    skills: [
      { id: '5', name: 'React Native' },
      { id: '6', name: 'TypeScript' },
      { id: '7', name: 'Figma' },
      { id: '8', name: 'WebGL' },
    ],
    members: [
      { profile: { id: 'm4', full_name: 'David Kim', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' } },
      { profile: { id: 'm5', full_name: 'Aisha Patel', avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' } },
    ],
  },
];

const SPOTLIGHT_BUILDER = {
  id: 'alex-rivera',
  username: 'arivera',
  full_name: 'Alex Rivera',
  headline:
    'Staff Mobile Architect • Building open-source audio engines and real-time DSP pipelines.',
  avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140',
  skills: [
    { id: 'b1', name: 'React Native' },
    { id: 'b2', name: 'WebAudio' },
    { id: 'b3', name: 'TypeScript' },
  ],
};

const FEATURED_BUILDERS = [
  SPOTLIGHT_BUILDER,
  {
    id: 'maya-lin',
    username: 'mayalin',
    full_name: 'Maya Lin',
    headline: 'Founding Engineer at Synthetix • Rust, WebGPU & Graphics programming.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=140',
    skills: [
      { id: 'b4', name: 'Rust' },
      { id: 'b5', name: 'WebGPU' },
      { id: 'b6', name: 'WASM' },
    ],
  },
  {
    id: 'jordan-vance',
    username: 'jvance',
    full_name: 'Jordan Vance',
    headline: 'Distributed Systems & Database Reliability • Ex-Cockroach Labs.',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=140',
    skills: [
      { id: 'b7', name: 'Go' },
      { id: 'b8', name: 'PostgreSQL' },
      { id: 'b9', name: 'Kubernetes' },
    ],
  },
];

export default function DiscoverScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: currentProfile } = useCurrentProfile();

  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  // Queries
  const { data: dbProjects = [], isLoading: isLoadingProjects } = useProjectsWithDetails();
  const { data: availableSkills = [] } = useAvailableSkills();
  const { data: dbProfiles = [] } = useProfiles(20);

  // Combine real DB projects with featured projects if DB has few
  const allProjects = useMemo(() => {
    if (dbProjects.length === 0) {
      return FEATURED_MOCK_PROJECTS;
    }
    // Prepend user projects or merge with mock items for a rich showcase
    const dbProjectIds = new Set(dbProjects.map((p) => p.slug || p.id));
    const supplemental = FEATURED_MOCK_PROJECTS.filter((p) => !dbProjectIds.has(p.slug));
    return [...dbProjects, ...supplemental];
  }, [dbProjects]);

  // Combine profiles
  const allBuilders = useMemo(() => {
    if (dbProfiles.length === 0) {
      return FEATURED_BUILDERS;
    }
    const dbUsernames = new Set(dbProfiles.map((p) => p.username));
    const supplemental = FEATURED_BUILDERS.filter((b) => !dbUsernames.has(b.username));
    return [...dbProfiles, ...supplemental];
  }, [dbProfiles]);

  // Skill filter list
  const skillFilters = useMemo(() => {
    const defaultList = ['React Native', 'TypeScript', 'Rust', 'Python', 'UI/UX', 'AI/ML', 'Docker'];
    const dbSkillNames = availableSkills.map((s) => s.name);
    return Array.from(new Set([...defaultList, ...dbSkillNames])).slice(0, 10);
  }, [availableSkills]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return allProjects.filter((proj) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.slug.toLowerCase().includes(q) ||
        (proj.description && proj.description.toLowerCase().includes(q)) ||
        (proj.skills && proj.skills.some((s) => s.name.toLowerCase().includes(q)));

      const matchesSkill =
        !selectedSkill ||
        (proj.skills &&
          proj.skills.some(
            (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
          ));

      return matchesSearch && matchesSkill;
    });
  }, [allProjects, searchQuery, selectedSkill]);

  // Filtered Builders
  const filteredBuilders = useMemo(() => {
    return allBuilders.filter((builder) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        builder.full_name.toLowerCase().includes(q) ||
        builder.username.toLowerCase().includes(q) ||
        (builder.headline && builder.headline.toLowerCase().includes(q)) ||
        (builder.skills && builder.skills.some((s) => s.name.toLowerCase().includes(q)));

      const matchesSkill =
        !selectedSkill ||
        (builder.skills &&
          builder.skills.some(
            (s) => s.name.toLowerCase() === selectedSkill.toLowerCase()
          ));

      return matchesSearch && matchesSkill;
    });
  }, [allBuilders, searchQuery, selectedSkill]);

  const activeProjectsCount = filteredProjects.length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerStack}>
        {/* Top App Header: User Avatar + Brand Logo + Notification Bell */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <Avatar
                url={currentProfile?.avatar_url || null}
                name={currentProfile?.full_name || user?.email || 'Builder'}
                size={36}
                style={styles.headerAvatar}
              />
              <Text
                style={[
                  styles.brandTitle,
                  {
                    color: theme.colors.primary,
                    fontSize: theme.typography.sizes.xl,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Sccinet
              </Text>
            </View>

            {/* Notification Bell Button */}
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/workspace')}
              activeOpacity={0.8}
              style={[
                styles.bellButton,
                {
                  backgroundColor: theme.clay.surfaceElevated,
                  borderColor: theme.clay.borderCard,
                  ...Platform.select({
                    web: { boxShadow: theme.clay.webChipShadow } as any,
                    default: { ...theme.clay.shadowChip },
                  }),
                },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={theme.colors.text}
              />
              <View
                style={[
                  styles.notificationDot,
                  { backgroundColor: theme.colors.primary },
                ]}
              />
            </TouchableOpacity>
          </View>
        </AnimatedEntrance>

        {/* Page Title & "• LIVE" Badge */}
        <AnimatedEntrance staggerIndex={1}>
          <View style={styles.pageTitleRow}>
            <View style={styles.titleCol}>
              <Text
                style={[
                  styles.pageTitle,
                  {
                    color: theme.colors.text,
                    fontSize: 32,
                    fontWeight: theme.typography.weights.bold,
                    letterSpacing: -0.8,
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
                    marginTop: 3,
                  },
                ]}
              >
                Find projects and collaborators
              </Text>
            </View>

            {/* LIVE Pill Badge */}
            <View
              style={[
                styles.liveBadge,
                {
                  backgroundColor: theme.isDark
                    ? 'rgba(16, 185, 129, 0.15)'
                    : '#EFF6FF',
                  borderColor: theme.isDark
                    ? 'rgba(16, 185, 129, 0.3)'
                    : '#DBEAFE',
                },
              ]}
            >
              <View
                style={[
                  styles.liveDot,
                  { backgroundColor: theme.isDark ? '#34D399' : '#2563EB' },
                ]}
              />
              <Text
                style={[
                  styles.liveText,
                  { color: theme.isDark ? '#34D399' : '#2563EB' },
                ]}
              >
                LIVE
              </Text>
            </View>
          </View>
        </AnimatedEntrance>

        {/* Search Bar & Filter Button */}
        <AnimatedEntrance staggerIndex={2}>
          <View style={styles.searchRow}>
            <View style={styles.searchInputWrap}>
              <Input
                placeholder="Search projects, skills, or builders..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                leftAccessory={
                  <Ionicons
                    name="search"
                    size={18}
                    color={theme.colors.textMuted}
                    style={{ marginRight: 8 }}
                  />
                }
                style={styles.searchInput}
              />
            </View>

            {/* Sliders Filter Button */}
            <TouchableOpacity
              onPress={() => setSelectedSkill(null)}
              activeOpacity={0.8}
              style={[
                styles.filterIconButton,
                {
                  backgroundColor: theme.clay.surfaceElevated,
                  borderColor: theme.clay.borderCard,
                  ...Platform.select({
                    web: { boxShadow: theme.clay.webChipShadow } as any,
                    default: { ...theme.clay.shadowChip },
                  }),
                },
              ]}
            >
              <Ionicons
                name="options-outline"
                size={19}
                color={selectedSkill ? theme.colors.primary : theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </AnimatedEntrance>

        {/* Segmented Control ("Projects" vs "Builders") */}
        <AnimatedEntrance staggerIndex={3}>
          <SegmentedControl<'projects' | 'people'>
            options={[
              { label: 'Projects', value: 'projects' },
              { label: 'Builders', value: 'people' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </AnimatedEntrance>

        {/* Horizontal Skill Filter Chips Carousel */}
        <AnimatedEntrance staggerIndex={4}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterChipsScroll}
          >
            {/* "All" chip */}
            <FilterChip
              label="All"
              count={activeProjectsCount}
              active={selectedSkill === null}
              onPress={() => setSelectedSkill(null)}
            />

            {/* Skill chips */}
            {skillFilters.map((skillName) => (
              <FilterChip
                key={skillName}
                label={skillName}
                active={selectedSkill?.toLowerCase() === skillName.toLowerCase()}
                onPress={() =>
                  setSelectedSkill(
                    selectedSkill?.toLowerCase() === skillName.toLowerCase()
                      ? null
                      : skillName
                  )
                }
              />
            ))}
          </ScrollView>
        </AnimatedEntrance>

        {/* Loading Skeletons */}
        {isLoadingProjects ? (
          <View style={{ gap: 14, marginTop: 8 }}>
            {[1, 2].map((i) => (
              <Card key={i} variant="clay" padding="md">
                <View style={{ gap: 12 }}>
                  <SkeletonLoader width="100%" height={120} borderRadius={16} />
                  <SkeletonLoader width={180} height={20} borderRadius={6} />
                  <SkeletonLoader width="90%" height={14} borderRadius={4} />
                  <SkeletonLoader width={120} height={14} borderRadius={4} />
                </View>
              </Card>
            ))}
          </View>
        ) : activeTab === 'projects' ? (
          /* =================== PROJECTS TAB =================== */
          <View style={styles.tabContentWrap}>
            {/* Section Header: Featured Projects */}
            <View style={styles.sectionHeaderRow}>
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
                Featured Projects
              </Text>

              <Badge
                label={`${activeProjectsCount} Active`}
                variant="primary"
                size="sm"
              />
            </View>

            {/* Projects List */}
            {filteredProjects.length > 0 ? (
              <View style={styles.projectsList}>
                {filteredProjects.map((project, idx) => (
                  <AnimatedEntrance
                    key={project.id}
                    staggerIndex={5 + Math.min(idx, 4)}
                  >
                    <DiscoverProjectCard project={project} />
                  </AnimatedEntrance>
                ))}
              </View>
            ) : (
              <Card variant="clay" padding="lg">
                <EmptyState
                  icon={
                    <Ionicons
                      name="search-outline"
                      size={32}
                      color={theme.colors.primary}
                    />
                  }
                  title="No projects found"
                  description={
                    searchQuery || selectedSkill
                      ? `No projects matched "${searchQuery || selectedSkill}". Try clearing your filters.`
                      : 'No published projects available at this time.'
                  }
                  actionTitle="Clear Filters"
                  onActionPress={() => {
                    setSearchQuery('');
                    setSelectedSkill(null);
                  }}
                />
              </Card>
            )}

            {/* Section Header: Builder Spotlight */}
            <View style={[styles.sectionHeaderRow, { marginTop: 20 }]}>
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
                Builder Spotlight
              </Text>

              <TouchableOpacity
                onPress={() => setActiveTab('people')}
                activeOpacity={0.7}
                style={styles.exploreLinkRow}
              >
                <Text
                  style={[
                    styles.exploreLinkText,
                    { color: theme.colors.primary },
                  ]}
                >
                  Explore All
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>

            {/* Spotlight Builder Card */}
            <AnimatedEntrance staggerIndex={9}>
              <DiscoverBuilderCard
                builder={SPOTLIGHT_BUILDER}
                onPress={() =>
                  router.push({
                    pathname: '/profiles/[id]' as any,
                    params: { id: SPOTLIGHT_BUILDER.id },
                  })
                }
              />
            </AnimatedEntrance>
          </View>
        ) : (
          /* =================== BUILDERS TAB =================== */
          <View style={styles.tabContentWrap}>
            <View style={styles.sectionHeaderRow}>
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
                All Builders
              </Text>

              <Badge
                label={`${filteredBuilders.length} Members`}
                variant="default"
                size="sm"
              />
            </View>

            {filteredBuilders.length > 0 ? (
              <View style={styles.buildersList}>
                {filteredBuilders.map((builder, idx) => (
                  <AnimatedEntrance
                    key={builder.id}
                    staggerIndex={5 + Math.min(idx, 5)}
                  >
                    <DiscoverBuilderCard
                      builder={builder}
                      onPress={() =>
                        router.push({
                          pathname: '/profiles/[id]' as any,
                          params: { id: builder.id },
                        })
                      }
                    />
                  </AnimatedEntrance>
                ))}
              </View>
            ) : (
              <Card variant="clay" padding="lg">
                <EmptyState
                  icon={
                    <Ionicons
                      name="people-outline"
                      size={32}
                      color={theme.colors.primary}
                    />
                  }
                  title="No builders found"
                  description={
                    searchQuery || selectedSkill
                      ? `No builders matched "${searchQuery || selectedSkill}". Try clearing your filters.`
                      : 'Builders will appear here as the community expands.'
                  }
                  actionTitle="Clear Filters"
                  onActionPress={() => {
                    setSearchQuery('');
                    setSelectedSkill(null);
                  }}
                />
              </Card>
            )}
          </View>
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
    paddingTop: 12,
    paddingBottom: 48,
  },
  innerStack: {
    gap: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {},
  brandTitle: {
    letterSpacing: -0.5,
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 7,
    right: 8,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  titleCol: {
    flex: 1,
  },
  pageTitle: {},
  pageSubtitle: {},
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    marginTop: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 5,
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  searchInputWrap: {
    flex: 1,
  },
  searchInput: {
    marginBottom: 0,
  },
  filterIconButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipsScroll: {
    paddingVertical: 4,
    paddingRight: 16,
  },
  tabContentWrap: {
    gap: 14,
    marginTop: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionTitle: {
    letterSpacing: -0.3,
  },
  exploreLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  exploreLinkText: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  projectsList: {
    gap: 4,
  },
  buildersList: {
    gap: 4,
  },
});
