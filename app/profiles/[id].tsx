import React from 'react';
import {
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Avatar } from '../../src/components/ui/Avatar';
import { SkeletonLoader } from '../../src/components/ui/SkeletonLoader';
import {
  useProfiles,
  useUserSkills,
} from '../../src/features/profiles/useProfile';
import { useProjectsWithDetails } from '../../src/features/projects';
import { DiscoverProjectCard } from '../../src/features/projects/components/DiscoverProjectCard';

// Fallback mock data so the screen always has content pre-backend
const MOCK_PROFILES: Record<string, {
  id: string;
  username: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  skills: { id: string; name: string }[];
}> = {
  'alex-rivera': {
    id: 'alex-rivera',
    username: 'arivera',
    full_name: 'Alex Rivera',
    headline: 'Staff Mobile Architect · Building open-source audio engines and real-time DSP pipelines.',
    bio: 'I work on the intersection of audio DSP, React Native, and WebAudio. Previously built the streaming layer at Spotify. Open to advisory roles in audio-tech startups.',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=280',
    location: 'San Francisco, CA',
    skills: [
      { id: 'b1', name: 'React Native' },
      { id: 'b2', name: 'WebAudio' },
      { id: 'b3', name: 'TypeScript' },
      { id: 'b4', name: 'C++' },
    ],
  },
  'elena-rostova': {
    id: 'elena-rostova',
    username: 'elrostova',
    full_name: 'Elena Rostova',
    headline: 'Systems Engineer · Building the next generation of distributed storage engines.',
    bio: 'I work at the bottom of the stack. Distributed consensus, WAL compression, B-tree variants. ex-PlanetScale. Now building HyperScale DB in the open.',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=280',
    location: 'Berlin, Germany',
    skills: [
      { id: 's1', name: 'Rust' },
      { id: 's2', name: 'PostgreSQL' },
      { id: 's3', name: 'WASM' },
      { id: 's4', name: 'Linux' },
    ],
  },
};

export default function PublicProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  // Try real DB first; fall back to mock
  const { data: profiles = [], isLoading, refetch } = useProfiles(50);
  const realProfile = profiles.find((p) => p.id === id || p.username === id);
  const mockProfile = MOCK_PROFILES[id ?? ''] ?? null;
  const profile = realProfile ?? mockProfile;

  const { data: skills = [] } = useUserSkills(realProfile?.id);
  const { data: allProjects = [] } = useProjectsWithDetails();

  const displaySkills = realProfile
    ? skills
    : (profile as (typeof MOCK_PROFILES)[string] | null)?.skills ?? [];

  const ownedProjects = allProjects.filter(
    (p) => p.owner_id === realProfile?.id
  );

  const [refreshing, setRefreshing] = React.useState(false);
  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  }, [refetch]);

  if (isLoading && !profile) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Stack.Screen options={{ title: '', headerShown: true }} />
        <View style={styles.skeletonWrap}>
          <SkeletonLoader width={72} height={72} borderRadius={36} />
          <SkeletonLoader width={180} height={20} borderRadius={6} style={{ marginTop: 16 }} />
          <SkeletonLoader width={240} height={14} borderRadius={6} style={{ marginTop: 8 }} />
          <SkeletonLoader width="100%" height={60} borderRadius={12} style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  if (!profile) {
    return (
      <View
        style={[
          styles.container,
          styles.center,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Stack.Screen options={{ title: 'Profile', headerShown: true }} />
        <Ionicons
          name="person-outline"
          size={40}
          color={theme.colors.textMuted}
        />
        <Text style={[styles.notFoundTitle, { color: theme.colors.text }]}>
          Profile not found
        </Text>
        <Text style={[styles.notFoundSub, { color: theme.colors.textMuted }]}>
          This builder may not exist or hasn&apos;t joined yet.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: theme.clay.surfaceRecessed, borderColor: theme.colors.borderSubtle }]}
        >
          <Ionicons name="arrow-back" size={16} color={theme.colors.textSecondary} />
          <Text style={[styles.backBtnText, { color: theme.colors.textSecondary }]}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Stack.Screen
        options={{
          title: profile.full_name,
          headerShown: true,
          headerTransparent: false,
          headerBackTitle: 'Back',
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* ── Identity block ─────────────────────── */}
        <View
          style={[
            styles.identityCard,
            {
              backgroundColor: theme.clay.surface,
              borderColor: theme.clay.borderCard,
              ...Platform.select({
                web: { boxShadow: theme.clay.webCardShadow } as never,
                default: theme.clay.shadowCard,
              }),
            },
          ]}
        >
          <View style={styles.avatarRow}>
            <Avatar
              url={profile.avatar_url}
              name={profile.full_name}
              size={72}
            />
            <View style={styles.identityText}>
              <View style={styles.nameRow}>
                <Text
                  style={[styles.fullName, { color: theme.colors.text }]}
                  numberOfLines={1}
                >
                  {profile.full_name}
                </Text>
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={[styles.username, { color: theme.colors.textMuted }]}
              >
                @{profile.username}
              </Text>
              {profile.location ? (
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={12}
                    color={theme.colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    {profile.location}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {profile.headline ? (
            <Text
              style={[styles.headline, { color: theme.colors.textSecondary }]}
            >
              {profile.headline}
            </Text>
          ) : null}

          {profile.bio ? (
            <Text style={[styles.bio, { color: theme.colors.textSecondary }]}>
              {profile.bio}
            </Text>
          ) : null}

          {/* Skills */}
          {displaySkills.length > 0 ? (
            <View style={styles.skillsRow}>
              {displaySkills.map((s) => (
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
                  <Text
                    style={[
                      styles.skillText,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {s.name}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          {/* Actions */}
          <View style={styles.actionsRow}>
            <Pressable
              accessibilityLabel={`Request to connect with ${profile.full_name}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.connectBtn,
                {
                  backgroundColor: theme.colors.primary,
                  opacity: pressed ? 0.85 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                  ...Platform.select({
                    web: { boxShadow: theme.clay.webButtonShadow } as never,
                    default: theme.clay.shadowButton,
                  }),
                },
              ]}
            >
              <Ionicons name="person-add-outline" size={16} color="#fff" />
              <Text style={styles.connectBtnText}>Connect</Text>
            </Pressable>

            <Pressable
              accessibilityLabel={`Send message to ${profile.full_name}`}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.msgBtn,
                {
                  backgroundColor: theme.clay.surfaceRecessed,
                  borderColor: theme.colors.borderSubtle,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Ionicons
                name="chatbubble-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[styles.msgBtnText, { color: theme.colors.textSecondary }]}
              >
                Message
              </Text>
            </Pressable>
          </View>
        </View>

        {/* ── Projects ───────────────────────────── */}
        {ownedProjects.length > 0 ? (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.text }]}
            >
              Projects
            </Text>
            {ownedProjects.map((project) => (
              <DiscoverProjectCard key={project.id} project={project} />
            ))}
          </View>
        ) : (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, { color: theme.colors.text }]}
            >
              Projects
            </Text>
            <View
              style={[
                styles.emptyProjectsCard,
                {
                  backgroundColor: theme.clay.surface,
                  borderColor: theme.clay.borderCard,
                  ...Platform.select({
                    web: { boxShadow: theme.clay.webCardShadow } as never,
                    default: theme.clay.shadowCard,
                  }),
                },
              ]}
            >
              <Ionicons
                name="cube-outline"
                size={28}
                color={theme.colors.textMuted}
              />
              <Text
                style={[
                  styles.emptyProjectsText,
                  { color: theme.colors.textMuted },
                ]}
              >
                No public projects yet
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 32,
  },
  scroll: {
    padding: 16,
    paddingBottom: 48,
    gap: 16,
  },
  skeletonWrap: {
    padding: 24,
    alignItems: 'flex-start',
    gap: 8,
  },
  identityCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 14,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  identityText: {
    flex: 1,
    gap: 3,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
  },
  fullName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  username: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 12,
    letterSpacing: -0.1,
  },
  headline: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.2,
    fontWeight: '500',
  },
  bio: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: -0.2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillChip: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  connectBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    borderRadius: 12,
    minHeight: 44,
  },
  connectBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  msgBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 11,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1,
    minHeight: 44,
  },
  msgBtnText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  emptyProjectsCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyProjectsText: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.4,
    marginTop: 12,
    textAlign: 'center',
  },
  notFoundSub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 44,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});
