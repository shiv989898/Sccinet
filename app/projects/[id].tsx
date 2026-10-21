import React, { useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  Badge,
  Card,
  GlassView,
  SegmentedControl,
  TactilePressable,
  AnimatedTabTransition,
} from '../../src/components/ui';
import { useReducedMotion } from '../../src/theme/motion';
import { useProject } from '../../src/features/projects';

const sampleLandscape = require('../../assets/images/sample-landscape.jpg');

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const reducedMotion = useReducedMotion();
  const isWeb = Platform.OS === 'web';

  const { data: project } = useProject(id);

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'activity'>('overview');
  const [isStarred, setIsStarred] = useState(false);
  const [starCount, setStarCount] = useState(24);
  const [forkCount, setForkCount] = useState(8);

  const starAnim = useRef(new Animated.Value(1)).current;

  const toggleStar = () => {
    const nextStarred = !isStarred;
    setIsStarred(nextStarred);
    setStarCount((prev) => (isStarred ? prev - 1 : prev + 1));

    if (!reducedMotion) {
      Animated.sequence([
        Animated.spring(starAnim, {
          toValue: 1.35,
          tension: 300,
          friction: 12,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(starAnim, {
          toValue: 1,
          tension: 220,
          friction: 14,
          useNativeDriver: !isWeb,
        }),
      ]).start();
    }
  };

  const handleFork = () => {
    setForkCount((prev) => prev + 1);
    Alert.alert('Fork Created', 'Forked repository to your personal node.');
  };

  const handleShare = () => {
    Alert.alert('Share Project', 'Project link copied to clipboard.');
  };

  const defaultMockProject = {
    title: 'AI Content Studio',
    ownerName: 'Shiv',
    ownerUsername: 'shivgoyal9888',
    status: 'ACTIVE' as const,
    description: 'An AI-powered content generation tool for YouTube, blogs and social media.',
    tags: ['Python', 'AI', 'FFmpeg', 'YouTube API'],
    branch: 'main',
    updated: 'Updated 2h ago',
    readme: `# AI Content Studio\n\nA complete automation pipeline for generating high-quality videos and social posts using modern AI models. Features intelligent prompt synthesis, whisper-based transcription alignment, and automated GPU rendering.`,
  };

  const projectTitle = project?.title || defaultMockProject.title;
  const projectOwner = project?.owner?.full_name || defaultMockProject.ownerName;
  const projectOwnerHandle = project?.owner?.username || defaultMockProject.ownerUsername;
  const projectDesc = project?.description || defaultMockProject.description;
  const projectTags = (project?.skills?.map((s: any) => s.skill?.name || s.name)) || defaultMockProject.tags;

  const mockMembers = [
    { id: 'm1', name: 'Shiv', handle: 'shivgoyal9888', role: 'Owner' as const },
    { id: 'm2', name: 'Alex', handle: 'alexdev', role: 'Admin' as const },
    { id: 'm3', name: 'Priya', handle: 'priya.dev', role: 'Member' as const },
    { id: 'm4', name: 'Sam', handle: 'samcode', role: 'Member' as const },
    { id: 'm5', name: 'Neha', handle: 'nehacreates', role: 'Remove' as const },
    { id: 'm6', name: 'Arjun', handle: 'arjunbuilds', role: 'Remove' as const },
  ];

  const mockActivity = [
    {
      id: 'a1',
      icon: 'git-merge-outline' as const,
      title: 'Merged branch',
      detail: 'feat/render-engine into main',
      actor: 'Shiv',
      time: '2h ago',
    },
    {
      id: 'a2',
      icon: 'git-pull-request-outline' as const,
      title: 'Opened pull request',
      detail: '#14 — Audio timeline alignment',
      actor: 'Alex',
      time: '4h ago',
    },
    {
      id: 'a3',
      icon: 'rocket-outline' as const,
      title: 'Deployed release',
      detail: 'v1.2.0 deployed to production node',
      actor: 'Shiv',
      time: '1d ago',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom + 40, 60) },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner with Mountain Landscape matching Screen 11 */}
        <View style={styles.heroBannerContainer}>
          <Image
            source={sampleLandscape}
            style={styles.heroBannerImage}
            contentFit="cover"
            priority="high"
          />

          {/* Top Floating Action Bar */}
          <View
            style={[
              styles.topFloatingBar,
              { paddingTop: Math.max(insets.top + 6, 16) },
            ]}
          >
            <TactilePressable
              onPress={() => router.back()}
              scaleTo={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <GlassView
                variant="clear"
                borderRadius={19}
                style={styles.circleActionButton}
                contentStyle={styles.circleActionContent}
              >
                <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
              </GlassView>
            </TactilePressable>

            <TactilePressable
              onPress={() =>
                Alert.alert('Project Options', 'Project actions', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Copy Git URL' },
                  { text: 'Report' },
                ])
              }
              scaleTo={0.88}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityRole="button"
              accessibilityLabel="Project options"
            >
              <GlassView
                variant="clear"
                borderRadius={19}
                style={styles.circleActionButton}
                contentStyle={styles.circleActionContent}
              >
                <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </GlassView>
            </TactilePressable>
          </View>
        </View>

        {/* Floating Project Header Card matching Screen 11 */}
        <View style={styles.floatingCardWrapper}>
          <Card variant="glass" padding="lg" style={styles.detailCard}>
            {/* Header: Icon + Title & Byline + ACTIVE Badge */}
            <View style={styles.detailHeaderRow}>
              <View style={styles.detailLeftGroup}>
                <View
                  style={[
                    styles.projectIconBox,
                    {
                      backgroundColor: 'rgba(0, 102, 255, 0.22)',
                      borderColor: 'rgba(0, 102, 255, 0.40)',
                    },
                  ]}
                >
                  <Ionicons name="layers" size={22} color={theme.colors.primary} />
                </View>

                <View style={styles.titleColumn}>
                  <Text
                    style={[
                      styles.projectTitle,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.lg,
                        fontWeight: theme.typography.weights.bold,
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {projectTitle}
                  </Text>

                  <Text
                    style={[
                      styles.bylineText,
                      { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
                    ]}
                  >
                    by {projectOwner} (@{projectOwnerHandle})
                  </Text>
                </View>
              </View>

              <Badge variant="active" label="ACTIVE" size="sm" />
            </View>

            {/* Description */}
            <Text
              style={[
                styles.descriptionText,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  lineHeight: 22,
                  marginTop: 10,
                },
              ]}
            >
              {projectDesc}
            </Text>

            {/* Tech Tags Row matching Screen 11 */}
            <View style={styles.tagsRow}>
              {projectTags.map((tag: string) => (
                <View
                  key={tag}
                  style={[
                    styles.techTagPill,
                    {
                      backgroundColor: theme.clay.surfaceRecessed,
                      borderColor: theme.clay.borderCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.techTagText,
                      { color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs },
                    ]}
                  >
                    {tag}
                  </Text>
                </View>
              ))}
            </View>

            {/* Branch & Updated Info matching Screen 11 */}
            <View style={styles.branchRow}>
              <View style={styles.branchItem}>
                <Ionicons name="git-branch-outline" size={14} color={theme.colors.textMuted} />
                <Text style={[styles.branchText, { color: theme.colors.textMuted }]}>
                  main
                </Text>
              </View>

              <View style={styles.branchItem}>
                <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
                <Text style={[styles.branchText, { color: theme.colors.textMuted }]}>
                  Updated 2h ago
                </Text>
              </View>
            </View>

            {/* Action Buttons: Star, Fork, Share */}
            <View style={styles.actionButtonsRow}>
              <TactilePressable
                onPress={toggleStar}
                scaleTo={0.94}
                accessibilityRole="button"
                accessibilityLabel={isStarred ? 'Unstar project' : 'Star project'}
                style={[
                  styles.tactileActionButton,
                  {
                    backgroundColor: isStarred
                      ? 'rgba(245, 158, 11, 0.18)'
                      : theme.clay.surfaceRecessed,
                    borderColor: isStarred
                      ? 'rgba(245, 158, 11, 0.40)'
                      : theme.clay.borderCard,
                  },
                ]}
              >
                <Animated.View style={{ transform: [{ scale: starAnim }] }}>
                  <Ionicons
                    name={isStarred ? 'star' : 'star-outline'}
                    size={16}
                    color={isStarred ? '#F59E0B' : theme.colors.text}
                  />
                </Animated.View>
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: isStarred ? '#F59E0B' : theme.colors.text,
                      fontSize: theme.typography.sizes.xs,
                      fontWeight: '600',
                    },
                  ]}
                >
                  Star {starCount}
                </Text>
              </TactilePressable>

              <TactilePressable
                onPress={handleFork}
                scaleTo={0.94}
                accessibilityRole="button"
                accessibilityLabel="Fork project"
                style={[
                  styles.tactileActionButton,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <Ionicons name="git-network-outline" size={16} color={theme.colors.text} />
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xs,
                      fontWeight: '600',
                    },
                  ]}
                >
                  Fork {forkCount}
                </Text>
              </TactilePressable>

              <TactilePressable
                onPress={handleShare}
                scaleTo={0.94}
                accessibilityRole="button"
                accessibilityLabel="Share project"
                style={[
                  styles.tactileActionButton,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <Ionicons name="share-outline" size={16} color={theme.colors.text} />
                <Text
                  style={[
                    styles.actionButtonText,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xs,
                      fontWeight: '600',
                    },
                  ]}
                >
                  Share
                </Text>
              </TactilePressable>
            </View>
          </Card>
        </View>

        {/* Segmented Control matching Screen 11: Overview / Members / Activity */}
        <View style={styles.tabsWrapper}>
          <SegmentedControl<'overview' | 'members' | 'activity'>
            options={[
              { label: 'Overview', value: 'overview' },
              { label: 'Members', value: 'members' },
              { label: 'Activity', value: 'activity' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </View>

        {/* Animated Tab Content with Cross-Fade & Settle */}
        <AnimatedTabTransition activeKey={activeTab}>
          {activeTab === 'overview' && (
            <View style={styles.tabContentContainer}>
              <Card variant="clay" padding="lg" style={styles.readmeCard}>
                <Text
                  style={[
                    styles.readmeTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.md,
                      fontWeight: '700',
                      marginBottom: 10,
                    },
                  ]}
                >
                  README
                </Text>

                <Text
                  style={[
                    styles.readmeBody,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                      lineHeight: 22,
                    },
                  ]}
                >
                  A complete automation pipeline for generating high-quality videos using AI.
                  Integrates audio alignment, dynamic captions, and background b-roll selection.
                </Text>
              </Card>
            </View>
          )}

          {activeTab === 'members' && (
            <View style={styles.tabContentContainer}>
              <Card variant="clay" padding="lg" style={styles.membersCard}>
                <View style={styles.membersHeaderRow}>
                  <Text
                    style={[
                      styles.membersTitle,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: '700',
                      },
                    ]}
                  >
                    Members
                  </Text>

                  <TactilePressable
                    onPress={() => Alert.alert('Invite Member', 'Send an invite link to collaborate.')}
                    scaleTo={0.92}
                    accessibilityRole="button"
                    accessibilityLabel="Invite member"
                    style={styles.inviteButton}
                  >
                    <Text style={[styles.inviteText, { color: theme.colors.primary }]}>
                      Invite
                    </Text>
                  </TactilePressable>
                </View>

                <View style={styles.membersList}>
                  {mockMembers.map((member) => (
                    <TactilePressable
                      key={member.id}
                      onPress={() => router.push(`/profiles/${member.handle}`)}
                      scaleTo={0.98}
                      style={styles.memberRow}
                    >
                      <Avatar name={member.name} size={40} />

                      <View style={styles.memberMeta}>
                        <Text
                          style={[
                            styles.memberName,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.sm,
                              fontWeight: '600',
                            },
                          ]}
                        >
                          {member.name}
                        </Text>

                        <Text
                          style={[
                            styles.memberHandle,
                            { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
                          ]}
                        >
                          @{member.handle}
                        </Text>
                      </View>

                      {/* Role Badges */}
                      {member.role === 'Owner' && (
                        <Badge variant="roleOwner" label="Owner" size="sm" />
                      )}
                      {member.role === 'Admin' && (
                        <Badge variant="roleAdmin" label="Admin" size="sm" />
                      )}
                      {member.role === 'Member' && (
                        <Badge variant="roleMember" label="Member" size="sm" />
                      )}
                      {member.role === 'Remove' && (
                        <TactilePressable
                          onPress={() => Alert.alert('Remove Member', `Remove ${member.name} from project?`)}
                          scaleTo={0.9}
                          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        >
                          <Badge variant="roleRemove" label="Remove" size="sm" />
                        </TactilePressable>
                      )}
                    </TactilePressable>
                  ))}
                </View>
              </Card>
            </View>
          )}

          {activeTab === 'activity' && (
            <View style={styles.tabContentContainer}>
              <Card variant="clay" padding="lg">
                <View style={styles.activityList}>
                  {mockActivity.map((event, index) => (
                    <View key={event.id} style={styles.activityRow}>
                      <View style={styles.activityTimelineColumn}>
                        <View
                          style={[
                            styles.activityIconBox,
                            {
                              backgroundColor: theme.clay.surfaceRecessed,
                              borderColor: theme.clay.borderCard,
                            },
                          ]}
                        >
                          <Ionicons
                            name={event.icon}
                            size={14}
                            color={theme.colors.primary}
                          />
                        </View>
                        {index < mockActivity.length - 1 && (
                          <View
                            style={[
                              styles.activityConnector,
                              { backgroundColor: theme.colors.borderSubtle },
                            ]}
                          />
                        )}
                      </View>

                      <View style={styles.activityContent}>
                        <View style={styles.activityTitleRow}>
                          <Text
                            style={[
                              styles.activityTitle,
                              {
                                color: theme.colors.text,
                                fontSize: theme.typography.sizes.sm,
                                fontWeight: '600',
                              },
                            ]}
                          >
                            {event.title}
                          </Text>
                          <Text
                            style={[
                              styles.activityTime,
                              {
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.sizes.micro,
                              },
                            ]}
                          >
                            {event.time}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.activityDetail,
                            {
                              color: theme.colors.textSecondary,
                              fontSize: theme.typography.sizes.xs,
                              marginTop: 2,
                            },
                          ]}
                        >
                          {event.detail} • {event.actor}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </Card>
            </View>
          )}
        </AnimatedTabTransition>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    gap: 16,
  },
  heroBannerContainer: {
    height: 190,
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
  },
  topFloatingBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  circleActionButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  circleActionContent: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingCardWrapper: {
    paddingHorizontal: 16,
    marginTop: -40,
    zIndex: 3,
  },
  detailCard: {
    borderRadius: 24,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  detailLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  projectIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleColumn: {
    flex: 1,
  },
  projectTitle: {},
  bylineText: {
    marginTop: 2,
  },
  descriptionText: {},
  tagsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  techTagPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  techTagText: {
    fontWeight: '500',
  },
  branchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 12,
  },
  branchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  branchText: {
    fontSize: 12,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  tactileActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionButtonText: {},
  tabsWrapper: {
    paddingHorizontal: 16,
  },
  tabContentContainer: {
    paddingHorizontal: 16,
  },
  readmeCard: {
    borderRadius: 22,
  },
  readmeTitle: {},
  readmeBody: {},
  membersCard: {
    borderRadius: 22,
  },
  membersHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  membersTitle: {},
  inviteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inviteText: {
    fontSize: 14,
    fontWeight: '600',
  },
  membersList: {
    gap: 12,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberMeta: {
    flex: 1,
  },
  memberName: {},
  memberHandle: {
    marginTop: 2,
  },
  activityList: {
    gap: 16,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  activityTimelineColumn: {
    alignItems: 'center',
    width: 28,
  },
  activityIconBox: {
    width: 28,
    height: 28,
    borderRadius: 9,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityConnector: {
    width: 2,
    height: 24,
    marginTop: 6,
    borderRadius: 1,
  },
  activityContent: {
    flex: 1,
    paddingTop: 2,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activityTitle: {},
  activityTime: {},
  activityDetail: {},
});
