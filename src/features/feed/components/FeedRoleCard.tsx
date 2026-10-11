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
import { FeedRoleItem } from '../data/mockFeedData';
import { formatRelativeTime } from '../utils/formatRelativeTime';

interface Props {
  item: FeedRoleItem;
}

export function FeedRoleCard({ item }: Props) {
  const theme = useTheme();

  const handleApply = useCallback(() => {
    router.push({ pathname: '/projects/[id]', params: { id: item.project.id } });
  }, [item.project.id]);

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
      {/* Left accent bar */}
      <View
        style={[
          styles.accentBar,
          { backgroundColor: theme.colors.primary },
        ]}
      />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.projectRow}>
            {/* Avatar stack */}
            <View style={styles.avatarStack}>
              {item.project.members.slice(0, 3).map((m, i) => (
                <View
                  key={m.id}
                  style={[
                    styles.avatarWrap,
                    {
                      marginLeft: i > 0 ? -8 : 0,
                      borderColor: theme.clay.surface,
                    },
                  ]}
                >
                  <Avatar url={m.avatarUrl} name={m.name} size={24} />
                </View>
              ))}
            </View>
            <Text
              style={[
                styles.projectName,
                { color: theme.colors.textSecondary },
              ]}
            >
              {item.project.title}
            </Text>
            <Text style={[styles.dot, { color: theme.colors.textMuted }]}>·</Text>
            <Text style={[styles.postedAt, { color: theme.colors.textMuted }]}>
              {formatRelativeTime(item.postedAt)}
            </Text>
          </View>
        </View>

        {/* Role headline */}
        <Text
          style={[styles.roleHeadline, { color: theme.colors.text }]}
          numberOfLines={2}
        >
          Looking for a{'\n'}
          <Text style={{ color: theme.colors.primary }}>
            {item.role.title}
          </Text>
        </Text>

        {/* Commitment */}
        <View style={styles.commitmentRow}>
          <Ionicons
            name="time-outline"
            size={13}
            color={theme.colors.textMuted}
          />
          <Text
            style={[styles.commitmentText, { color: theme.colors.textMuted }]}
          >
            {item.role.commitment}
          </Text>
        </View>

        {/* Skills */}
        <View style={styles.skillsRow}>
          {item.role.skills.map((s) => (
            <View
              key={s.id}
              style={[
                styles.skillChip,
                {
                  backgroundColor: theme.colors.primaryMuted,
                  borderColor: theme.isDark
                    ? 'rgba(59,130,246,0.25)'
                    : 'rgba(59,130,246,0.2)',
                },
              ]}
            >
              <Text
                style={[
                  styles.skillText,
                  {
                    color: theme.isDark
                      ? theme.colors.primaryLight
                      : theme.colors.primaryDark,
                  },
                ]}
              >
                {s.name}
              </Text>
            </View>
          ))}
        </View>

        {/* Apply CTA */}
        <Pressable
          onPress={handleApply}
          accessibilityLabel={`Apply for ${item.role.title} at ${item.project.title}`}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.applyBtn,
            {
              backgroundColor: theme.colors.primary,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: pressed ? 0.98 : 1 }],
            },
          ]}
        >
          <Text style={styles.applyBtnText}>View role and apply</Text>
          <Ionicons name="arrow-forward" size={14} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  accentBar: {
    width: 3,
    alignSelf: 'stretch',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 10,
  },
  header: {
    gap: 4,
  },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrap: {
    borderWidth: 1.5,
    borderRadius: 999,
  },
  projectName: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  dot: {
    fontSize: 12,
  },
  postedAt: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  roleHeadline: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.6,
    lineHeight: 26,
  },
  commitmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  commitmentText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  skillsRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  skillChip: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: 6,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  applyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    minHeight: 44,
    marginTop: 2,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
