import React, { useCallback } from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { FeedLaunchCard } from '../../src/features/feed/components/FeedLaunchCard';
import { FeedRoleCard } from '../../src/features/feed/components/FeedRoleCard';
import { FeedMilestoneCard } from '../../src/features/feed/components/FeedMilestoneCard';
import { MOCK_FEED, FeedItem } from '../../src/features/feed/data/mockFeedData';

export default function FeedScreen() {
  const theme = useTheme();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // In production: invalidate feed query here
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const renderItem = useCallback(({ item }: { item: FeedItem }) => {
    switch (item.type) {
      case 'launch':
        return <FeedLaunchCard item={item} />;
      case 'role':
        return <FeedRoleCard item={item} />;
      case 'milestone':
        return <FeedMilestoneCard item={item} />;
    }
  }, []);

  const keyExtractor = useCallback((item: FeedItem) => item.id, []);

  const ListHeaderComponent = (
    <View style={styles.header}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View>
          <Text
            style={[
              styles.brandName,
              { color: theme.colors.text },
            ]}
          >
            Sccinet
          </Text>
          <Text
            style={[styles.brandSub, { color: theme.colors.textMuted }]}
          >
            What your network is building
          </Text>
        </View>

        <View style={styles.topActions}>
          {/* Notification bell */}
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.colors.borderSubtle,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={20}
              color={theme.colors.textSecondary}
            />
            {/* Unread dot */}
            <View
              style={[
                styles.notifDot,
                { backgroundColor: theme.colors.primary },
              ]}
            />
          </Pressable>

          {/* Start project shortcut */}
          <Pressable
            onPress={() => router.push('/projects/new')}
            accessibilityLabel="Start a new project"
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.newProjectBtn,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.85 : 1,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                ...Platform.select({
                  web: {
                    boxShadow: theme.clay.webButtonShadow,
                  } as never,
                  default: theme.clay.shadowButton,
                }),
              },
            ]}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.newProjectText}>New project</Text>
          </Pressable>
        </View>
      </View>

      {/* Divider */}
      <View
        style={[styles.divider, { backgroundColor: theme.colors.borderSubtle }]}
      />
    </View>
  );

  const ListEmptyComponent = (
    <View style={styles.empty}>
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        Nothing here yet
      </Text>
      <Text style={[styles.emptyBody, { color: theme.colors.textMuted }]}>
        Start a project or join a team — updates will appear here as your network ships things.
      </Text>
      <Pressable
        onPress={() => router.push('/projects/new')}
        style={[styles.emptyBtn, { backgroundColor: theme.colors.primary }]}
      >
        <Text style={styles.emptyBtnText}>Start building</Text>
      </Pressable>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlashList
        data={MOCK_FEED}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
          />
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  brandSub: {
    fontSize: 12,
    marginTop: 1,
    letterSpacing: -0.1,
  },
  topActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  newProjectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    minHeight: 40,
  },
  newProjectText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  divider: {
    height: 1,
  },
  separator: {
    height: 12,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
    textAlign: 'center',
  },
  emptyBody: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  emptyBtn: {
    marginTop: 8,
    paddingVertical: 11,
    paddingHorizontal: 24,
    borderRadius: 12,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
