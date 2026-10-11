import React, { useCallback, useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Avatar } from '../../../components/ui/Avatar';
import { FeedMilestoneItem } from '../data/mockFeedData';
import { formatRelativeTime } from '../utils/formatRelativeTime';

interface Props {
  item: FeedMilestoneItem;
}

export function FeedMilestoneCard({ item }: Props) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.milestone.likeCount);

  const handlePress = useCallback(() => {
    router.push({ pathname: '/projects/[id]', params: { id: item.project.id } });
  }, [item.project.id]);

  const handleLike = useCallback(() => {
    setLiked((prev) => {
      setLikeCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
  }, []);

  const BODY_COLLAPSED_LINES = 3;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.clay.surface,
          borderColor: theme.clay.borderCard,
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webCardShadow,
            } as never,
            default: theme.clay.shadowCard,
          }),
        },
      ]}
    >
      {/* Byline */}
      <View style={styles.byline}>
        <Avatar
          url={item.builder.avatarUrl}
          name={item.builder.name}
          size={36}
        />
        <View style={styles.bylineText}>
          <Text style={[styles.builderName, { color: theme.colors.text }]}>
            {item.builder.name}
          </Text>
          <View style={styles.bylineSubRow}>
            <Pressable
              onPress={handlePress}
              accessibilityLabel={`Go to ${item.project.title}`}
            >
              <Text
                style={[styles.projectLink, { color: theme.colors.primary }]}
              >
                {item.project.title}
              </Text>
            </Pressable>
            <Text style={[styles.bylineSep, { color: theme.colors.textMuted }]}>
              ·
            </Text>
            <Text style={[styles.timeText, { color: theme.colors.textMuted }]}>
              {formatRelativeTime(item.postedAt)}
            </Text>
          </View>
        </View>

        {/* Dev update pill */}
        <View
          style={[
            styles.updatePill,
            {
              backgroundColor: theme.isDark
                ? 'rgba(245,158,11,0.12)'
                : 'rgba(245,158,11,0.1)',
              borderColor: theme.isDark
                ? 'rgba(245,158,11,0.25)'
                : 'rgba(245,158,11,0.2)',
            },
          ]}
        >
          <Text style={styles.updatePillText}>Update</Text>
        </View>
      </View>

      {/* Milestone image band */}
      <View
        style={[
          styles.imageBand,
          { backgroundColor: item.milestone.imageGradient[0] },
        ]}
      >
        {/* Terminal-style decoration */}
        <View style={styles.terminalRow}>
          {['#EF4444', '#F59E0B', '#10B981'].map((c, i) => (
            <View
              key={i}
              style={[styles.terminalDot, { backgroundColor: c }]}
            />
          ))}
        </View>
        <Text
          style={styles.imageBandTitle}
          numberOfLines={1}
        >
          {item.milestone.title}
        </Text>
        <View style={styles.imageBandCode}>
          <Text style={styles.codeText}>
            {'> cargo build --release\n  Compiling hyperscale v0.9.1\n  Finished in 8.4s'}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.body}>
        <Text
          style={[styles.milestoneTitle, { color: theme.colors.text }]}
        >
          {item.milestone.title}
        </Text>

        <Pressable onPress={() => setExpanded((e) => !e)}>
          <Text
            style={[styles.bodyText, { color: theme.colors.textSecondary }]}
            numberOfLines={expanded ? undefined : BODY_COLLAPSED_LINES}
          >
            {item.milestone.body}
          </Text>
          {!expanded && (
            <Text style={[styles.readMore, { color: theme.colors.primary }]}>
              Read more
            </Text>
          )}
        </Pressable>

        {/* Reactions row */}
        <View style={styles.reactionsRow}>
          <Pressable
            onPress={handleLike}
            accessibilityLabel={liked ? 'Unlike' : 'Like this milestone'}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.reactionBtn,
              {
                backgroundColor: liked
                  ? theme.isDark
                    ? 'rgba(239,68,68,0.12)'
                    : 'rgba(239,68,68,0.08)'
                  : theme.clay.surfaceRecessed,
                borderColor: liked
                  ? 'rgba(239,68,68,0.3)'
                  : theme.colors.borderSubtle,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={15}
              color={liked ? '#EF4444' : theme.colors.textMuted}
            />
            <Text
              style={[
                styles.reactionCount,
                {
                  color: liked ? '#EF4444' : theme.colors.textMuted,
                },
              ]}
            >
              {likeCount}
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePress}
            accessibilityLabel="View comments"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.reactionBtn,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.colors.borderSubtle,
                opacity: pressed ? 0.75 : 1,
              },
            ]}
          >
            <Ionicons
              name="chatbubble-outline"
              size={14}
              color={theme.colors.textMuted}
            />
            <Text
              style={[styles.reactionCount, { color: theme.colors.textMuted }]}
            >
              {item.milestone.commentCount}
            </Text>
          </Pressable>

          <View style={styles.spacer} />

          <Pressable
            onPress={handlePress}
            accessibilityLabel={`Go to ${item.project.title}`}
            style={({ pressed }) => [styles.projectLink2, { opacity: pressed ? 0.65 : 1 }]}
          >
            <Text style={[styles.projectLinkText, { color: theme.colors.textMuted }]}>
              {item.project.title}
            </Text>
            <Ionicons name="arrow-forward" size={12} color={theme.colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  byline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    paddingBottom: 0,
  },
  bylineText: {
    flex: 1,
    gap: 2,
  },
  builderName: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bylineSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  projectLink: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  bylineSep: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  updatePill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  updatePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
    letterSpacing: -0.1,
  },
  imageBand: {
    marginTop: 12,
    height: 100,
    padding: 12,
    gap: 6,
    overflow: 'hidden',
  },
  terminalRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 2,
  },
  terminalDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  imageBandTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: -0.3,
  },
  imageBandCode: {
    marginTop: 2,
  },
  codeText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    color: 'rgba(255,255,255,0.45)',
    lineHeight: 15,
  },
  body: {
    padding: 14,
    gap: 10,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  bodyText: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  readMore: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: -0.1,
  },
  reactionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 2,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 30,
  },
  reactionCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  spacer: {
    flex: 1,
  },
  projectLink2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  projectLinkText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
});
