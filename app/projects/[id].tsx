import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Avatar, Badge, Button, Card } from '../../src/components/ui';
import { useProject } from '../../src/features/projects';
import { BadgeVariant } from '../../src/components/ui/Badge';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const { data: project, isLoading, error } = useProject(id);

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'ARCHIVED':
      default:
        return 'default';
    }
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Gracefully handle invalid or unopenable link
    }
  };

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Minimal Clay Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/workspace');
            }
          }}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: theme.clay.surface,
              borderColor: theme.clay.borderCard,
              opacity: pressed ? 0.85 : 1,
              transform: pressed ? [{ scale: 0.96 }, { translateY: 0.5 }] : [],
              ...Platform.select({
                web: {
                  boxShadow: pressed ? theme.clay.webChipShadow : theme.clay.webPillShadow,
                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                  cursor: 'pointer',
                } as any,
                default: theme.clay.shadowPill,
              }),
            },
          ]}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </Pressable>


        <View style={styles.topBarTitleContainer}>
          <Text
            style={[
              styles.topBarTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
              },
            ]}
          >
            Project Details
          </Text>
        </View>

        <View style={styles.topBarRightSlot} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
              ]}
            >
              Loading project details...
            </Text>
          </View>
        ) : error || !project ? (
          <View style={styles.errorContainer}>
            <Card variant="clay" padding="lg" style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={44} color={theme.colors.error} />
              <Text
                style={[
                  styles.errorTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Project Not Found
              </Text>
              <Text
                style={[
                  styles.errorSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                The requested project could not be located or may have been removed.
              </Text>

              <Button
                title="Return to Workspace"
                variant="clayPrimary"
                size="md"
                onPress={() => router.replace('/(tabs)/workspace')}
                style={{ marginTop: 14 }}
              />
            </Card>
          </View>
        ) : (
          <AnimatedEntrance duration={260}>
            <View style={styles.centerContainer}>
              {/* 1. Project Identity Card */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.headerMetaRow}>
                  <Badge
                    label={project.status}
                    variant={getStatusBadgeVariant(project.status)}
                    size="sm"
                  />
                  <Text
                    style={[
                      styles.slugText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    /{project.slug}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.projectTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xxl,
                      fontWeight: theme.typography.weights.bold,
                    },
                  ]}
                >
                  {project.title}
                </Text>

                {project.description ? (
                  <Text
                    style={[
                      styles.projectDescription,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {project.description}
                  </Text>
                ) : null}

                {/* External Links */}
                {(project.repository_url || project.live_url) && (
                  <View style={styles.linksRow}>
                    {project.repository_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.repository_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.85 : 1,
                            transform: pressed ? [{ scale: 0.98 }, { translateY: 0.5 }] : [],
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipShadow,
                                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Ionicons
                          name="logo-github"
                          size={16}
                          color={theme.colors.text}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Repository
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}

                    {project.live_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.live_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.85 : 1,
                            transform: pressed ? [{ scale: 0.98 }, { translateY: 0.5 }] : [],
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipShadow,
                                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Ionicons
                          name="globe-outline"
                          size={16}
                          color={theme.colors.primary}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Live Platform
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                )}
              </Card>

              {/* 2. Project Skills Section */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.semibold,
                        letterSpacing: -0.2,
                      },
                    ]}
                  >
                    Project Skills
                  </Text>
                  {project.skills && project.skills.length > 0 && (
                    <Text
                      style={[
                        styles.sectionCountText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {project.skills.length} skills
                    </Text>
                  )}
                </View>

                {project.skills && project.skills.length > 0 ? (
                  <View style={styles.skillsCluster}>
                    {project.skills.map((skill) => (
                      <View
                        key={skill.id}
                        style={[
                          styles.skillBadge,
                          {
                            backgroundColor: theme.clay.surfaceChipSelected,
                            borderColor: theme.clay.borderChipSelected,
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipSelectedShadow,
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.skillBadgeText,
                            {
                              color: theme.clay.textChipSelected,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          {skill.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (

                  <Text
                    style={[
                      styles.emptySectionText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    No specific skills attached to this project.
                  </Text>
                )}
              </Card>

              {/* 3. Roles Section */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    Project Roles
                  </Text>
                  {project.roles && project.roles.length > 0 && (
                    <Text
                      style={[
                        styles.sectionCountText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {project.roles.length} roles
                    </Text>
                  )}
                </View>

                {project.roles && project.roles.length > 0 ? (
                  <View style={styles.rolesList}>
                    {project.roles.map((role) => {
                      const assignedMember = (project.members || []).find(
                        (m) => m.role_id === role.id
                      );

                      return (
                        <View
                          key={role.id}
                          style={[
                            styles.roleItem,
                            {
                              backgroundColor: theme.clay.surfaceRecessed,
                              borderColor: theme.clay.borderCard,
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webRecessedShadow,
                                } as any,
                              }),
                            },
                          ]}
                        >
                          <View style={styles.roleItemHeader}>
                            <Text
                              style={[
                                styles.roleTitle,
                                {
                                  color: theme.colors.text,
                                  fontSize: theme.typography.sizes.sm,
                                  fontWeight: theme.typography.weights.semibold,
                                },
                              ]}
                            >
                              {role.title}
                            </Text>

                            {assignedMember ? (
                              <Badge label="Assigned" variant="success" size="sm" />
                            ) : (
                              <Badge label="Open" variant="outline" size="sm" />
                            )}
                          </View>

                          {role.description ? (
                            <Text
                              style={[
                                styles.roleDescription,
                                {
                                  color: theme.colors.textSecondary,
                                  fontSize: theme.typography.sizes.xs,
                                },
                              ]}
                            >
                              {role.description}
                            </Text>
                          ) : null}

                          {role.skills && role.skills.length > 0 && (
                            <View style={styles.roleSkillsCluster}>
                              {role.skills.map((s) => (
                                <View
                                  key={s.id}
                                  style={[
                                    styles.roleSkillTag,
                                    {
                                      backgroundColor: theme.clay.surface,
                                      borderColor: theme.clay.borderCard,
                                    },
                                  ]}
                                >
                                  <Text
                                    style={[
                                      styles.roleSkillTagText,
                                      {
                                        color: theme.colors.textSecondary,
                                        fontSize: 11,
                                      },
                                    ]}
                                  >
                                    {s.name}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}

                          {assignedMember?.profile && (
                            <View style={styles.assignedMemberRow}>
                              <Avatar
                                url={assignedMember.profile.avatar_url}
                                name={
                                  assignedMember.profile.full_name ||
                                  assignedMember.profile.username
                                }
                                size="sm"
                              />
                              <Text
                                style={[
                                  styles.assignedMemberName,
                                  {
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.typography.sizes.xs,
                                  },
                                ]}
                              >
                                Assigned to{' '}
                                <Text
                                  style={{
                                    color: theme.colors.text,
                                    fontWeight: theme.typography.weights.medium,
                                  }}
                                >
                                  {assignedMember.profile.full_name ||
                                    assignedMember.profile.username}
                                </Text>
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.emptySectionText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    No specific roles defined for this project.
                  </Text>
                )}
              </Card>

              {/* 4. Members & Owner Section */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    Project Team
                  </Text>
                  {project.members && project.members.length > 0 && (
                    <Text
                      style={[
                        styles.sectionCountText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                    </Text>
                  )}
                </View>

                {project.members && project.members.length > 0 ? (
                  <View style={styles.membersList}>
                    {project.members.map((member) => {
                      const isOwner = member.profile_id === project.owner_id;
                      const profile = member.profile;

                      return (
                        <View
                          key={member.profile_id}
                          style={[
                            styles.memberRow,
                            {
                              backgroundColor: theme.clay.surfaceRecessed,
                              borderColor: theme.clay.borderCard,
                            },
                          ]}
                        >
                          <Avatar
                            url={profile?.avatar_url}
                            name={profile?.full_name || profile?.username || 'Member'}
                            size="md"
                          />

                          <View style={styles.memberInfo}>
                            <View style={styles.memberNameRow}>
                              <Text
                                style={[
                                  styles.memberName,
                                  {
                                    color: theme.colors.text,
                                    fontSize: theme.typography.sizes.sm,
                                    fontWeight: theme.typography.weights.semibold,
                                  },
                                ]}
                              >
                                {profile?.full_name || profile?.username || 'Builder'}
                              </Text>

                              {isOwner ? (
                                <Badge label="Owner" variant="primary" size="sm" />
                              ) : member.role?.title ? (
                                <Badge label={member.role.title} variant="default" size="sm" />
                              ) : null}
                            </View>

                            {profile?.username ? (
                              <Text
                                style={[
                                  styles.memberHandle,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.xs,
                                  },
                                ]}
                              >
                                @{profile.username}
                              </Text>
                            ) : null}

                            {profile?.headline ? (
                              <Text
                                style={[
                                  styles.memberHeadline,
                                  {
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.typography.sizes.xs,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {profile.headline}
                              </Text>
                            ) : null}

                            {member.joined_at ? (
                              <Text
                                style={[
                                  styles.memberJoinedText,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: 11,
                                  },
                                ]}
                              >
                                Joined {formatJoinedDate(member.joined_at)}
                              </Text>
                            ) : null}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                ) : project.owner ? (
                  /* Fallback to display owner if members junction is empty */
                  <View
                    style={[
                      styles.memberRow,
                      {
                        backgroundColor: theme.clay.surfaceRecessed,
                        borderColor: theme.clay.borderCard,
                      },
                    ]}
                  >
                    <Avatar
                      url={project.owner.avatar_url}
                      name={project.owner.full_name || project.owner.username}
                      size="md"
                    />

                    <View style={styles.memberInfo}>
                      <View style={styles.memberNameRow}>
                        <Text
                          style={[
                            styles.memberName,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.sm,
                              fontWeight: theme.typography.weights.semibold,
                            },
                          ]}
                        >
                          {project.owner.full_name || project.owner.username}
                        </Text>
                        <Badge label="Owner" variant="primary" size="sm" />
                      </View>
                      <Text
                        style={[
                          styles.memberHandle,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        @{project.owner.username}
                      </Text>
                    </View>
                  </View>
                ) : null}
              </Card>

              {/* Back to Workspace CTA */}
              <View style={styles.footerContainer}>
                <Button
                  title="Back to Workspace"
                  variant="clayPrimary"
                  size="md"
                  onPress={() => router.replace('/(tabs)/workspace')}
                  leftIcon={<Ionicons name="briefcase-outline" size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </AnimatedEntrance>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topBarTitleContainer: {
    alignItems: 'center',
  },
  topBarTitle: {},
  topBarRightSlot: {
    width: 38,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  loadingContainer: {
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  errorCard: {
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 24,
    gap: 12,
  },
  errorTitle: {},
  errorSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionCard: {
    borderRadius: 24,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slugText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
  },
  projectTitle: {
    marginBottom: 10,
    lineHeight: 32,
  },
  projectDescription: {
    lineHeight: 22,
    marginBottom: 16,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkChipText: {},
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {},
  sectionCountText: {},
  emptySectionText: {
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  skillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 9999,
    borderWidth: 1,
  },
  skillBadgeText: {},
  rolesList: {
    gap: 10,
  },
  roleItem: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 12,
    gap: 6,
  },
  roleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleTitle: {},
  roleDescription: {
    lineHeight: 18,
  },
  roleSkillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 2,
  },
  roleSkillTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleSkillTagText: {},
  assignedMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 165, 185, 0.2)',
  },
  assignedMemberName: {},
  membersList: {
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 12,
  },
  memberInfo: {
    flex: 1,
    gap: 2,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberName: {},
  memberHandle: {},
  memberHeadline: {
    marginTop: 2,
  },
  memberJoinedText: {
    marginTop: 2,
  },
  footerContainer: {
    marginTop: 10,
  },
});
