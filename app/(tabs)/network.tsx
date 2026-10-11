import React, { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { DiscoverBuilderCard } from '../../src/features/profiles/components/DiscoverBuilderCard';
import {
  useCurrentProfile,
  useProfiles,
} from '../../src/features/profiles/useProfile';

// Supplemental mock builders shown when DB is empty
const FEATURED_BUILDERS = [
  {
    id: 'alex-rivera',
    username: 'arivera',
    full_name: 'Alex Rivera',
    headline: 'Staff Mobile Architect · Building open-source audio engines and real-time DSP pipelines.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140',
    location: null,
    bio: null,
    created_at: '',
    updated_at: '',
    skills: [
      { id: 'b1', name: 'React Native' },
      { id: 'b2', name: 'WebAudio' },
      { id: 'b3', name: 'TypeScript' },
    ],
  },
  {
    id: 'maya-lin',
    username: 'mayalin',
    full_name: 'Maya Lin',
    headline: 'Founding Engineer at Synthetix · Rust, WebGPU, and graphics programming.',
    avatar_url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=140',
    location: null,
    bio: null,
    created_at: '',
    updated_at: '',
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
    headline: 'Distributed Systems · Database Reliability · ex-Cockroach Labs.',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=140',
    location: null,
    bio: null,
    created_at: '',
    updated_at: '',
    skills: [
      { id: 'b7', name: 'Go' },
      { id: 'b8', name: 'PostgreSQL' },
      { id: 'b9', name: 'Kubernetes' },
    ],
  },
  {
    id: 'aisha-patel',
    username: 'aisha',
    full_name: 'Aisha Patel',
    headline: 'UI Architect · Design Systems · Making dense data feel like poetry.',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=140',
    location: null,
    bio: null,
    created_at: '',
    updated_at: '',
    skills: [
      { id: 'b10', name: 'React Native' },
      { id: 'b11', name: 'Figma' },
      { id: 'b12', name: 'TypeScript' },
    ],
  },
  {
    id: 'david-kim',
    username: 'dkim',
    full_name: 'David Kim',
    headline: 'Full-Stack · Generalist · Building tools that get out of your way.',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140',
    location: null,
    bio: null,
    created_at: '',
    updated_at: '',
    skills: [
      { id: 'b13', name: 'Next.js' },
      { id: 'b14', name: 'Elixir' },
      { id: 'b15', name: 'Docker' },
    ],
  },
];

type Builder = (typeof FEATURED_BUILDERS)[number];

export default function NetworkScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: currentProfile } = useCurrentProfile();
  const { data: dbProfiles = [], refetch } = useProfiles(50);

  // Merge real + mock, de-duplicate by username
  const allBuilders = useMemo<Builder[]>(() => {
    const dbUsernames = new Set(dbProfiles.map((p) => p.username));
    const supplemental = FEATURED_BUILDERS.filter(
      (b) => !dbUsernames.has(b.username)
    );
    // Cast dbProfiles to same shape — extra fields won't cause issues
    return [
      ...(dbProfiles as unknown as Builder[]),
      ...supplemental,
    ].filter((b) => b.id !== currentProfile?.id);
  }, [dbProfiles, currentProfile?.id]);

  const filtered = useMemo<Builder[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allBuilders;
    return allBuilders.filter(
      (b) =>
        b.full_name.toLowerCase().includes(q) ||
        b.username.toLowerCase().includes(q) ||
        (b.headline?.toLowerCase().includes(q) ?? false) ||
        b.skills?.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [allBuilders, query]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  const renderItem = useCallback(
    ({ item }: { item: Builder }) => (
      <DiscoverBuilderCard
        builder={item}
        onPress={() =>
          router.push({
            pathname: '/profiles/[id]' as any,
            params: { id: item.id },
          })
        }
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Builder) => item.id, []);

  const ListHeaderComponent = (
    <View style={styles.listHeader}>
      {/* Page header */}
      <View style={styles.pageHeader}>
        <Text style={[styles.pageTitle, { color: theme.colors.text }]}>
          Network
        </Text>
        <Text style={[styles.pageSub, { color: theme.colors.textMuted }]}>
          {allBuilders.length} builder{allBuilders.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      <View
        style={[
          styles.searchWrap,
          {
            backgroundColor: theme.clay.surfaceRecessed,
            borderColor: theme.colors.borderSubtle,
            ...Platform.select({
              web: {
                boxShadow: theme.clay.webRecessedShadow,
              } as never,
              default: {},
            }),
          },
        ]}
      >
        <Ionicons
          name="search-outline"
          size={16}
          color={theme.colors.textMuted}
        />
        <TextInput
          placeholder="Search builders, skills…"
          placeholderTextColor={theme.colors.textMuted}
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Search builders"
          style={[styles.searchInput, { color: theme.colors.text }]}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="while-editing"
        />
        {query.length > 0 ? (
          <Ionicons
            name="close-circle"
            size={16}
            color={theme.colors.textMuted}
            onPress={() => setQuery('')}
          />
        ) : null}
      </View>

      {/* Section label */}
      <Text style={[styles.sectionLabel, { color: theme.colors.textMuted }]}>
        {query.length > 0
          ? `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`
          : 'All builders'}
      </Text>
    </View>
  );

  const ListEmptyComponent = (
    <View style={styles.empty}>
      <Ionicons
        name="search-outline"
        size={32}
        color={theme.colors.textMuted}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
        No builders found
      </Text>
      <Text style={[styles.emptySub, { color: theme.colors.textMuted }]}>
        Try a different name or skill.
      </Text>
    </View>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <FlashList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
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
  listHeader: {
    marginBottom: 4,
    gap: 12,
  },
  pageHeader: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.6,
  },
  pageSub: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: -0.1,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    letterSpacing: -0.2,
    // React Native TextInput doesn't support outline natively on mobile
    // On web, suppress browser outline
    ...Platform.select({
      web: { outlineStyle: 'none' } as never,
      default: {},
    }),
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
    marginTop: 4,
    marginBottom: 4,
  },
  empty: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 6,
  },
  emptySub: {
    fontSize: 13,
    letterSpacing: -0.1,
    textAlign: 'center',
  },
});
