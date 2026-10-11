import React, { useCallback } from 'react';
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
import { FeedLaunchItem } from '../data/mockFeedData';
import { formatRelativeTime } from '../utils/formatRelativeTime';

interface Props {
  item: FeedLaunchItem;
}

export function FeedLaunchCard({ item }: Props) {
  const theme = useTheme();

  const handlePress = useCallback(() => {
    router.push({ pathname: '/projects/[id]', params: { id: item.project.id } });
  }, [item.project.id]);

  return (
    <Pressable
      onPress={handlePress}
      accessibilityLabel={`${item.project.title} launched by ${item.builder.name}`}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: theme.clay.surface,
          borderColor: theme.clay.borderCard,
          transform: [{ scale: pressed ? 0.987 : 1 }],
          ...Platform.select({
            web: {
              boxShadow: pressed
                ? theme.clay.webCardPressedShadow
                : theme.clay.webCardShadow,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              cursor: 'pointer',
            } as never,
            default: theme.clay.shadowCard,
          }),
        },
      ]}
    >
      {/* Cover band */}
      <View
        style={[
          styles.cover,
          {
            backgroundColor: item.project.coverGradient[0],
          },
        ]}
      >
        {/* Subtle inner grid texture */}
        <View style={styles.coverInner} pointerEvents="none">
          <View style={[styles.gridLine, styles.gridLineH, { top: '33%', backgroundColor: 'rgba(255,255,255,0.04)' }]} />
          <View style={[styles.gridLine, styles.gridLineH, { top: '66%', backgroundColor: 'rgba(255,255,255,0.04)' }]} />
          <View style={[styles.gridLine, styles.gridLineV, { left: '33%', backgroundColor: 'rgba(255,255,255,0.04)' }]} />
          <View style={[styles.gridLine, styles.gridLineV, { left: '66%', backgroundColor: 'rgba(255,255,255,0.04)' }]} />
        </View>

        {/* Launch label */}
        <View
          style={[
            styles.coverBadge,
            { backgroundColor: 'rgba(16,185,129,0.18)', borderColor: 'rgba(16,185,129,0.35)' },
          ]}
        >
          <View style={styles.launchDot} />
          <Text style={styles.coverBadgeText}>Launched</Text>
        </View>

        {/* Project name large in cover */}
        <Text
          style={[styles.coverTitle, { color: 'rgba(255,255,255,0.92)' }]}
          numberOfLines={1}
        >
          {item.project.title}
        </Text>
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Builder row */}
        <View style={styles.bylineRow}>
          <Avatar url={item.builder.avatarUrl} name={item.builder.name} size={30} />
          <View style={styles.bylineText}>
            <Text style={[styles.builderName, { color: theme.colors.text }]}>
              {item.builder.name}
            </Text>
            <Text style={[styles.bylineTime, { color: theme.colors.textMuted }]}>
              {formatRelativeTime(item.postedAt)}
            </Text>
          </View>
        </View>

        {/* Description */}
        <Text
          style={[styles.description, { color: theme.colors.textSecondary }]}
          numberOfLines={3}
        >
          {item.project.description}
        </Text>

        {/* Skills + action row */}
        <View style={styles.footer}>
          <View style={styles.skillsRow}>
            {item.project.skills.slice(0, 3).map((s) => (
              <View
                key={s.id}
                style={[
                  styles.skillChip,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.colors.borderSubtle,
                  },
                ]}
              >
                <Text style={[styles.skillText, { color: theme.colors.textSecondary }]}>
                  {s.name}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            onPress={handlePress}
            accessibilityLabel={`Explore ${item.project.title}`}
            style={({ pressed }) => [
              styles.exploreBtn,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={styles.exploreBtnText}>Explore</Text>
            <Ionicons name="arrow-forward" size={13} color="#fff" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cover: {
    height: 110,
    justifyContent: 'flex-end',
    padding: 14,
    position: 'relative',
    overflow: 'hidden',
  },
  coverInner: {
    ...StyleSheet.absoluteFill,
  },
  gridLine: {
    position: 'absolute',
  },
  gridLineH: {
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    top: 0,
    bottom: 0,
    width: 1,
  },
  coverBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  launchDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  coverBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    letterSpacing: -0.1,
  },
  coverTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.8,
    marginTop: 4,
  },
  body: {
    padding: 16,
    gap: 12,
  },
  bylineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bylineText: {
    flex: 1,
  },
  builderName: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  bylineTime: {
    fontSize: 12,
    marginTop: 1,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  skillsRow: {
    flexDirection: 'row',
    gap: 5,
    flex: 1,
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    minHeight: 34,
  },
  exploreBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
