import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useTheme } from '../../src/hooks/useTheme';
import { profileService } from '../../src/services/profiles/profileService';
import { projectService } from '../../src/services/projects/projectService';
import {
  Card,
  Avatar,
  Badge,
  SkeletonLoader,
  EmptyState,
  AnimatedEntrance,
} from '../../src/components/ui';

export default function PublicProfileScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  const profileQuery = useQuery({
    queryKey: ['profile', 'public', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await profileService.getProfileById(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const skillsQuery = useQuery({
    queryKey: ['skills', 'user', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await profileService.getUserSkills(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const projectsQuery = useQuery({
    queryKey: ['projects', 'builder', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await projectService.listProjects({
        ownerId: id,
        status: 'ACTIVE',
      });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const profile = profileQuery.data;
  const skills = skillsQuery.data || [];
  const projects = projectsQuery.data || [];
  const isLoading = profileQuery.isLoading;
  const isError = profileQuery.isError || (!isLoading && !profile);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/discover');
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.headerBar, { paddingHorizontal: theme.spacing.lg }]}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.8}
            style={[
              styles.backButton,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { padding: theme.spacing.lg, gap: 16 }]}>
          <Card variant="clay" padding="lg">
            <View style={{ alignItems: 'center', gap: 12 }}>
              <SkeletonLoader width={80} height={80} borderRadius={40} />
              <SkeletonLoader width={160} height={22} borderRadius={6} />
              <SkeletonLoader width={100} height={14} borderRadius={4} />
              <SkeletonLoader width={220} height={16} borderRadius={4} />
            </View>
          </Card>
        </View>
      </View>
    );
  }

  if (isError || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={[styles.headerBar, { paddingHorizontal: theme.spacing.lg }]}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.8}
            style={[
              styles.backButton,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
              },
            ]}
          >
            <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.content, { padding: theme.spacing.lg }]}>
          <EmptyState
            icon={
              <Ionicons
                name="person-outline"
                size={32}
                color={theme.colors.textSecondary}
              />
            }
            title="Builder Not Found"
            description="The profile you are looking for does not exist or is unavailable."
            actionTitle="Back to Discover"
            onActionPress={handleBack}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Navigation Bar */}
      <View style={[styles.headerBar, { paddingHorizontal: theme.spacing.lg }]}>
        <TouchableOpacity
          onPress={handleBack}
          activeOpacity={0.8}
          accessibilityLabel="Back"
          style={[
            styles.backButton,
            {
              backgroundColor: theme.clay.surface,
              borderColor: theme.clay.borderCard,
              ...Platform.select({
                web: { boxShadow: theme.clay.webChipShadow } as any,
                default: { ...theme.clay.shadowChip },
              }),
            },
          ]}
        >
          <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.semibold,
            },
          ]}
        >
          Builder Profile
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stack}>
          {/* Profile Identity Card */}
          <AnimatedEntrance staggerIndex={0}>
            <Card variant="clay" padding="lg">
              <View style={styles.identitySection}>
                <Avatar
                  url={profile.avatar_url}
                  name={profile.full_name}
                  size={76}
                />

                <View style={styles.namesBlock}>
                  <Text
                    style={[
                      styles.fullName,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.xl,
                        fontWeight: theme.typography.weights.bold,
                        letterSpacing: -0.3,
                      },
                    ]}
                  >
                    {profile.full_name}
                  </Text>
                  <Text
                    style={[
                      styles.username,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    @{profile.username}
                  </Text>
                </View>

                {profile.headline ? (
                  <Text
                    style={[
                      styles.headline,
                      {
                        color: theme.isDark ? '#4CD7F6' : theme.colors.primary,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    {profile.headline}
                  </Text>
                ) : null}

                {profile.location ? (
                  <View style={styles.locationRow}>
                    <Ionicons
                      name="location-outline"
                      size={14}
                      color={theme.colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.locationText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {profile.location}
                    </Text>
                  </View>
                ) : null}

                {profile.bio ? (
                  <Text
                    style={[
                      styles.bioText,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                        lineHeight: 20,
                      },
                    ]}
                  >
                    {profile.bio}
                  </Text>
                ) : null}
              </View>
            </Card>
          </AnimatedEntrance>

          {/* Skills Section */}
          {skills.length > 0 && (
            <AnimatedEntrance staggerIndex={1}>
              <View style={styles.sectionBlock}>
                <Text
                  style={[
                    styles.sectionHeading,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.semibold,
                    },
                  ]}
                >
                  Skills
                </Text>

                <View style={styles.skillsWrap}>
                  {skills.map((skill) => (
                    <Badge
                      key={skill.id}
                      label={skill.name}
                      variant="default"
                      size="md"
                    />
                  ))}
                </View>
              </View>
            </AnimatedEntrance>
          )}

          {/* Active Projects Section */}
          <AnimatedEntrance staggerIndex={2}>
            <View style={styles.sectionBlock}>
              <Text
                style={[
                  styles.sectionHeading,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Active Projects ({projects.length})
              </Text>

              {projects.length > 0 ? (
                <View style={styles.projectsList}>
                  {projects.map((proj) => (
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
                        <View style={styles.projectHeaderRow}>
                          <View
                            style={[
                              styles.projectIconWrap,
                              {
                                backgroundColor: theme.isDark
                                  ? '#262A34'
                                  : theme.clay.surfaceTrack,
                                borderColor: theme.clay.borderCard,
                              },
                            ]}
                          >
                            <Ionicons
                              name="cube-outline"
                              size={16}
                              color={theme.isDark ? '#4CD7F6' : theme.colors.primary}
                            />
                          </View>
                          <View style={{ flex: 1 }}>
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
                                styles.projectSlug,
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
                          <Ionicons
                            name="chevron-forward"
                            size={16}
                            color={theme.colors.textMuted}
                          />
                        </View>

                        {proj.description ? (
                          <Text
                            style={[
                              styles.projectDesc,
                              {
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.sizes.xs,
                                lineHeight: 18,
                              },
                            ]}
                            numberOfLines={2}
                          >
                            {proj.description}
                          </Text>
                        ) : null}
                      </View>
                    </Card>
                  ))}
                </View>
              ) : (
                <Card variant="clay" padding="md">
                  <Text
                    style={[
                      styles.noProjectsText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    No active public projects yet.
                  </Text>
                </Card>
              )}
            </View>
          </AnimatedEntrance>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'ios' ? 44 : 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    textAlign: 'center',
  },
  content: {
    paddingBottom: 40,
  },
  stack: {
    gap: 16,
  },
  identitySection: {
    alignItems: 'center',
    gap: 8,
  },
  namesBlock: {
    alignItems: 'center',
    marginTop: 4,
  },
  fullName: {
    textAlign: 'center',
  },
  username: {
    marginTop: 2,
  },
  headline: {
    textAlign: 'center',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {},
  bioText: {
    textAlign: 'center',
    marginTop: 8,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionHeading: {
    paddingHorizontal: 2,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  projectsList: {
    gap: 10,
  },
  projectCardInner: {
    gap: 8,
  },
  projectHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  projectIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectTitle: {},
  projectSlug: {},
  projectDesc: {},
  noProjectsText: {
    textAlign: 'center',
    paddingVertical: 8,
  },
});
