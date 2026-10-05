import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useCurrentProfile, useUserSkills } from '../../src/features/profiles/useProfile';
import { Card, Button, Avatar, AnimatedEntrance } from '../../src/components/ui';

export default function ProfileScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemeStore();
  const { user, signOut } = useAuth();
  const { data: profile } = useCurrentProfile();
  const { data: userSkills = [] } = useUserSkills(user?.id);

  const handleEditProfile = () => {
    router.push('/(auth)/onboarding');
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Sccinet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Builder Profile';
  const username = profile?.username
    ? `@${profile.username}`
    : user?.email
    ? `@${user.email.split('@')[0]}`
    : '@builder';
  const headline = profile?.headline || 'Builder & Creator';
  const bio = profile?.bio || 'Building tools and open-source software on Sccinet.';
  const location = profile?.location || null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar - Anchored and immediately interactive */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View
              style={[
                styles.brandLogoSmall,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text
              style={[
                styles.brandTitle,
                { color: theme.colors.text, fontSize: theme.typography.sizes.lg },
              ]}
            >
              Sccinet
            </Text>
          </View>

          {/* Discreet theme toggle */}
          <TouchableOpacity
            onPress={() => setPreference(preference === 'dark' ? 'light' : 'dark')}
            activeOpacity={0.8}
            accessibilityLabel="Toggle appearance"
            style={[
              styles.themeSwitchButton,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
                ...Platform.select({
                  web: {
                    boxShadow: theme.clay.webChipShadow,
                  } as any,
                  default: {
                    ...theme.clay.shadowChip,
                  },
                }),
              },
            ]}
          >
            <Ionicons
              name={preference === 'dark' ? 'sunny-outline' : 'moon-outline'}
              size={16}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          {/* Profile Identity Card - Primary */}
          <AnimatedEntrance staggerIndex={0}>
            <Card variant="clay" padding="xl" style={styles.identityCard}>
            <View style={styles.avatarRow}>
              <View
                style={[
                  styles.avatarWrapper,
                  {
                    backgroundColor: theme.clay.surface,
                    borderColor: theme.clay.borderCard,
                    ...Platform.select({
                      web: {
                        boxShadow: theme.clay.webCardShadow,
                      } as any,
                      default: {
                        ...theme.clay.shadowCard,
                      },
                    }),
                  },
                ]}
              >
                <Avatar name={displayName} url={profile?.avatar_url} size="xl" />
              </View>
            </View>

            <View style={styles.identityInfo}>
              <Text
                style={[
                  styles.displayName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xxl,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                {displayName}
              </Text>
              <Text
                style={[
                  styles.handleText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {username}
              </Text>

              {headline ? (
                <Text
                  style={[
                    styles.headlineText,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                    },
                  ]}
                >
                  {headline}
                </Text>
              ) : null}

              {location ? (
                <View style={styles.locationRow}>
                  <Ionicons
                    name="location-outline"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.locationText,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {location}
                  </Text>
                </View>
              ) : null}

              {bio ? (
                <Text
                  style={[
                    styles.bioText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  {bio}
                </Text>
              ) : null}
            </View>

            {/* Primary Action: Edit Profile */}
            <View style={styles.editActionWrapper}>
              <Button
                title="Edit Profile"
                variant="clayPrimary"
                size="md"
                leftIcon={
                  <Ionicons name="create-outline" size={17} color="#FFFFFF" />
                }
                onPress={handleEditProfile}
              />
            </View>
          </Card>
          </AnimatedEntrance>

          {/* Skills Section */}
          <AnimatedEntrance staggerIndex={1}>
            <Card variant="clay" padding="lg" style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderTitle}>
                <Ionicons
                  name="code-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.semibold,
                    },
                  ]}
                >
                  Skills
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleEditProfile}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.editLink,
                    {
                      color: theme.colors.primary,
                      fontSize: theme.typography.sizes.xs,
                      fontWeight: theme.typography.weights.medium,
                    },
                  ]}
                >
                  {userSkills.length > 0 ? 'Edit' : 'Add Skills'}
                </Text>
              </TouchableOpacity>
            </View>

            {userSkills.length > 0 ? (
              <View style={styles.chipsRow}>
                {userSkills.map((skill) => (
                  <View
                    key={skill.id}
                    style={[
                      styles.skillChip,
                      {
                        backgroundColor: theme.clay.surfaceChipSelected,
                        borderColor: theme.clay.borderChipSelected,
                        ...Platform.select({
                          web: {
                            boxShadow: theme.clay.webChipSelectedShadow,
                          } as any,
                          default: {
                            ...theme.clay.shadowChip,
                          },
                        }),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.skillChipText,
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
              <View style={styles.emptySkillsContainer}>
                <Text
                  style={[
                    styles.emptySkillsText,
                    {
                      color: theme.colors.textMuted,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  No skills selected yet.
                </Text>
              </View>
            )}
          </Card>
          </AnimatedEntrance>

          {/* Projects Section */}
          <AnimatedEntrance staggerIndex={1}>
            <Card variant="clay" padding="lg" style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderTitle}>
                <Ionicons
                  name="folder-outline"
                  size={18}
                  color={theme.colors.primary}
                />
                <Text
                  style={[
                    styles.sectionTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.semibold,
                    },
                  ]}
                >
                  Projects
                </Text>
              </View>
            </View>

            {/* Clean Tactile Empty State */}
            <View
              style={[
                styles.emptyProjectsSlot,
                {
                  backgroundColor: theme.clay.surfaceRecessed,
                  borderColor: theme.clay.borderRecessed,
                  borderRadius: theme.borderRadius.lg,
                  ...Platform.select({
                    web: {
                      boxShadow: theme.clay.webRecessedShadow,
                    } as any,
                  }),
                },
              ]}
            >
              <View
                style={[
                  styles.emptyProjectsIcon,
                  {
                    backgroundColor: theme.clay.surface,
                    borderColor: theme.clay.borderCard,
                    ...Platform.select({
                      web: {
                        boxShadow: theme.clay.webPillShadow,
                      } as any,
                      default: {
                        ...theme.clay.shadowChip,
                      },
                    }),
                  },
                ]}
              >
                <Ionicons
                  name="folder-open-outline"
                  size={24}
                  color={theme.colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.emptyProjectsText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                No projects yet. Projects you create or collaborate on will appear here.
              </Text>
              <Button
                title="+ Create Project"
                variant="claySecondary"
                size="sm"
                onPress={() => router.push('/projects/new')}
              />
            </View>
          </Card>
          </AnimatedEntrance>

          {/* Bottom Sign Out Button */}
          <AnimatedEntrance staggerIndex={1}>
            <View style={styles.signOutWrapper}>
            <TouchableOpacity
              onPress={handleSignOut}
              activeOpacity={0.7}
              style={styles.signOutButton}
            >
              <Ionicons
                name="log-out-outline"
                size={16}
                color={theme.colors.error}
              />
              <Text
                style={[
                  styles.signOutText,
                  {
                    color: theme.colors.error,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
          </AnimatedEntrance>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  topBar: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoSmall: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  themeSwitchButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    gap: 16,
  },
  identityCard: {
    width: '100%',
    alignItems: 'center',
  },
  avatarRow: {
    marginBottom: 12,
  },
  avatarWrapper: {
    padding: 3,
    borderRadius: 9999,
    borderWidth: 1,
  },
  identityInfo: {
    alignItems: 'center',
    width: '100%',
  },
  displayName: {
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  handleText: {
    marginTop: 2,
    textAlign: 'center',
  },
  headlineText: {
    marginTop: 6,
    textAlign: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {},
  bioText: {
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  editActionWrapper: {
    width: '100%',
    marginTop: 18,
  },
  sectionCard: {
    width: '100%',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeaderTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    letterSpacing: -0.2,
  },
  editLink: {},
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skillChipText: {},
  emptySkillsContainer: {
    paddingVertical: 8,
  },
  emptySkillsText: {},
  emptyProjectsSlot: {
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyProjectsIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyProjectsText: {
    textAlign: 'center',
    maxWidth: 260,
    lineHeight: 18,
  },
  signOutWrapper: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  signOutText: {},
});
