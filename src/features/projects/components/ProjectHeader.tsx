import React from 'react';
import {
  Linking,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Avatar, Badge, Card } from '../../../components/ui';
import { BadgeVariant } from '../../../components/ui/Badge';
import { ProjectWithDetails } from '../../../types/database';

interface ProjectHeaderProps {
  project: ProjectWithDetails;
  isOwner: boolean;
  onEditPress?: () => void;
  onBackPress?: () => void;
  onProfilePress?: (profileId: string) => void;
}

export function ProjectHeader({
  project,
  isOwner,
  onEditPress,
  onBackPress,
  onProfilePress,
}: ProjectHeaderProps) {
  const theme = useTheme();

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

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/workspace');
    }
  };

  const handleEdit = () => {
    if (onEditPress) {
      onEditPress();
    } else {
      router.push({
        pathname: '/projects/edit',
        params: { id: project.id },
      });
    }
  };

  const handleOwnerPress = () => {
    if (!project.owner_id) return;
    if (onProfilePress) {
      onProfilePress(project.owner_id);
    } else {
      router.push({
        pathname: '/profiles/[id]' as any,
        params: { id: project.owner_id },
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={handleBack}
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

        {isOwner ? (
          <Pressable
            onPress={handleEdit}
            style={({ pressed }) => [
              styles.editButtonPill,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
                opacity: pressed ? 0.85 : 1,
                transform: pressed ? [{ scale: 0.96 }] : [],
                ...Platform.select({
                  web: {
                    boxShadow: theme.clay.webChipShadow,
                    cursor: 'pointer',
                  } as any,
                  default: theme.clay.shadowChip,
                }),
              },
            ]}
          >
            <Ionicons name="pencil" size={14} color={theme.colors.primary} />
            <Text
              style={[
                styles.editButtonText,
                { color: theme.colors.primary, fontSize: theme.typography.sizes.xs },
              ]}
            >
              Edit
            </Text>
          </Pressable>
        ) : (
          <View style={styles.topBarRightSlot} />
        )}
      </View>

      {/* Main Identity Card */}
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

        {/* Project Owner Attribution */}
        {project.owner && (
          <Pressable
            onPress={handleOwnerPress}
            style={({ pressed }) => [
              styles.ownerRow,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.clay.borderCard,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Avatar
              url={project.owner.avatar_url}
              name={project.owner.full_name || project.owner.username}
              size="sm"
            />
            <View style={styles.ownerInfo}>
              <Text
                style={[
                  styles.ownerLabel,
                  { color: theme.colors.textMuted, fontSize: 11 },
                ]}
              >
                Created by
              </Text>
              <Text
                style={[
                  styles.ownerName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                {project.owner.full_name || project.owner.username}
                {project.owner.username && (
                  <Text style={{ color: theme.colors.textMuted, fontWeight: '400' }}>
                    {' '}@{project.owner.username}
                  </Text>
                )}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={14} color={theme.colors.textMuted} />
          </Pressable>
        )}

        {/* Skills cluster */}
        {project.skills && project.skills.length > 0 && (
          <View style={styles.skillsSection}>
            <Text
              style={[
                styles.skillsHeading,
                { color: theme.colors.textMuted, fontSize: 11 },
              ]}
            >
              TECH STACK & TAGS
            </Text>
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
          </View>
        )}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  topBarTitle: {
    letterSpacing: -0.3,
  },
  editButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 9999,
    borderWidth: 1,
  },
  editButtonText: {
    fontWeight: '600',
  },
  topBarRightSlot: {
    width: 38,
  },
  sectionCard: {
    marginBottom: 16,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  slugText: {
    fontWeight: '500',
  },
  projectTitle: {
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  projectDescription: {
    lineHeight: 20,
    marginBottom: 14,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1,
  },
  linkChipText: {},
  ownerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
    gap: 10,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  ownerName: {
    marginTop: 1,
  },
  skillsSection: {
    marginTop: 4,
    gap: 8,
  },
  skillsHeading: {
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  skillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillBadgeText: {},
});
