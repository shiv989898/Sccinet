import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { ProjectWithDetails, Skill } from '../../../types/database';
import { Avatar } from '../../../components/ui/Avatar';

export interface DiscoverProjectCardProps {
  project: ProjectWithDetails | {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    cover_image_url?: string | null;
    status: string;
    skills?: Skill[] | { id: string; name: string }[];
    roles?: { id: string; title: string }[];
    members?: { profile?: { id: string; full_name?: string; avatar_url?: string | null } }[];
    memberCount?: number;
    openRolesCount?: number;
  };
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export function DiscoverProjectCard({
  project,
  style,
  onPress,
}: DiscoverProjectCardProps) {
  const theme = useTheme();

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: '/projects/[id]',
        params: { id: project.id },
      });
    }
  };

  const openRolesCount =
    'openRolesCount' in project && typeof project.openRolesCount === 'number'
      ? project.openRolesCount
      : project.roles?.length ?? 1;

  const skills = project.skills || [];
  const members = project.members || [];
  const totalMemberCount =
    'memberCount' in project && typeof project.memberCount === 'number'
      ? project.memberCount
      : Math.max(members.length, 1);

  const displayMembers = members.slice(0, 3);
  const extraMembersCount = totalMemberCount > 3 ? totalMemberCount - 3 : 0;

  const defaultBannerGradient = theme.isDark
    ? ['#1E293B', '#0F172A']
    : ['#DBEAFE', '#BFDBFE'];

  return (
    <Pressable
      onPress={handleCardPress}
      style={({ pressed }) => [
        styles.cardContainer,
        {
          backgroundColor: theme.clay.surfaceElevated,
          borderColor: theme.clay.borderCard,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webCardShadow,
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            } as any,
            default: {
              ...theme.clay.shadowCard,
            },
          }),
        },
        style,
      ]}
    >
      {/* Banner with Status & Role Overlays */}
      <View
        style={[
          styles.bannerWrap,
          {
            backgroundColor: defaultBannerGradient[0],
          },
        ]}
      >
        {project.cover_image_url ? (
          <Image
            source={{ uri: project.cover_image_url }}
            style={styles.bannerImage}
            contentFit="cover"
            transition={200}
          />
        ) : (
          <View
            style={[
              styles.fallbackBanner,
              {
                backgroundColor: theme.isDark ? '#1E293B' : '#E0E7FF',
              },
            ]}
          >
            {/* Tech isometric visual styling */}
            <View style={styles.gridPatternOverlay}>
              <Ionicons
                name="cube-outline"
                size={54}
                color={theme.isDark ? '#334155' : '#C7D2FE'}
              />
            </View>
          </View>
        )}

        {/* Top-Left: Active Pill */}
        <View
          style={[
            styles.overlayBadge,
            styles.statusBadge,
            {
              backgroundColor: theme.isDark
                ? 'rgba(27, 34, 48, 0.92)'
                : 'rgba(255, 255, 255, 0.95)',
              borderColor: theme.isDark
                ? 'rgba(255, 255, 255, 0.1)'
                : 'rgba(226, 232, 240, 0.8)',
            },
          ]}
        >
          <View style={styles.statusDot} />
          <Text
            style={[
              styles.statusText,
              { color: theme.isDark ? '#34D399' : '#059669' },
            ]}
          >
            Active
          </Text>
        </View>

        {/* Top-Right: Open Roles Pill */}
        {openRolesCount > 0 ? (
          <View
            style={[
              styles.overlayBadge,
              styles.rolesBadge,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(27, 34, 48, 0.92)'
                  : 'rgba(255, 255, 255, 0.95)',
                borderColor: theme.isDark
                  ? 'rgba(59, 130, 246, 0.3)'
                  : 'rgba(219, 234, 254, 0.9)',
              },
            ]}
          >
            <Text
              style={[
                styles.rolesBadgeText,
                { color: theme.colors.primary },
              ]}
            >
              {openRolesCount} {openRolesCount === 1 ? 'Role Open' : 'Roles Open'}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Card Body */}
      <View style={styles.bodyWrap}>
        {/* Title & Slug Header */}
        <View style={styles.headerRow}>
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
            numberOfLines={1}
          >
            {project.title}
          </Text>

          <Text
            style={[
              styles.slugText,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
            numberOfLines={1}
          >
            /{project.slug}
          </Text>
        </View>

        {/* Description Snippet */}
        {project.description ? (
          <Text
            style={[
              styles.description,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
            numberOfLines={2}
          >
            {project.description}
          </Text>
        ) : null}

        {/* Tech Stack Chips */}
        {skills.length > 0 ? (
          <View style={styles.skillsRow}>
            {skills.slice(0, 4).map((skill, idx) => (
              <View
                key={'id' in skill ? skill.id : idx}
                style={[
                  styles.skillChip,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.skillChipText,
                    {
                      color: theme.colors.textSecondary,
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
        ) : null}

        {/* Divider */}
        <View
          style={[
            styles.divider,
            { backgroundColor: theme.clay.borderCard },
          ]}
        />

        {/* Footer: Avatar Stack & View Project Action */}
        <View style={styles.footerRow}>
          {/* Avatar Stack */}
          <View style={styles.avatarStackWrap}>
            {displayMembers.length > 0 ? (
              displayMembers.map((member, i) => (
                <View
                  key={member.profile?.id || i}
                  style={[
                    styles.avatarOverlap,
                    {
                      marginLeft: i > 0 ? -9 : 0,
                      borderColor: theme.clay.surfaceElevated,
                    },
                  ]}
                >
                  <Avatar
                    url={member.profile?.avatar_url}
                    name={member.profile?.full_name || 'Builder'}
                    size={28}
                  />
                </View>
              ))
            ) : (
              <View
                style={[
                  styles.avatarOverlap,
                  { borderColor: theme.clay.surfaceElevated },
                ]}
              >
                <Avatar name={project.title} size={28} />
              </View>
            )}

            {extraMembersCount > 0 ? (
              <View
                style={[
                  styles.extraCountBubble,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.extraCountText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.micro,
                    },
                  ]}
                >
                  +{extraMembersCount}
                </Text>
              </View>
            ) : null}
          </View>

          {/* View Project Button */}
          <Pressable
            onPress={handleCardPress}
            style={({ pressed }) => [
              styles.actionButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Text style={styles.actionButtonText}>View Project</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 22,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
  },
  bannerWrap: {
    width: '100%',
    height: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  fallbackBanner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridPatternOverlay: {
    opacity: 0.85,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayBadge: {
    position: 'absolute',
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusBadge: {
    left: 12,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  rolesBadge: {
    right: 12,
  },
  rolesBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bodyWrap: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    letterSpacing: -0.4,
  },
  slugText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: -0.2,
  },
  description: {
    marginTop: 6,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  skillChip: {
    paddingVertical: 3.5,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillChipText: {
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    marginTop: 14,
    marginBottom: 12,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarStackWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarOverlap: {
    borderWidth: 2,
    borderRadius: 999,
  },
  extraCountBubble: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extraCountText: {
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
