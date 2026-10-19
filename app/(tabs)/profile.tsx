import React from 'react';
import {
  ActivityIndicator,
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../src/features/auth/AuthContext';
import {
  useCurrentProfile,
  useRemoveAvatar,
  useUploadAvatar,
  useUserSkills,
} from '../../src/features/profiles/useProfile';
import { imageUploadService } from '../../src/services/storage/imageUploadService';
import { Card, Button, Avatar, AnimatedEntrance } from '../../src/components/ui';

export default function ProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuth();
  const { data: profile } = useCurrentProfile();
  const { data: userSkills = [] } = useUserSkills(user?.id);
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const { mutateAsync: removeAvatar, isPending: isRemovingAvatar } = useRemoveAvatar();
  const isAvatarBusy = isUploadingAvatar || isRemovingAvatar;

  const handleAvatarPress = async () => {
    if (isAvatarBusy) return;

    const selectNewPhoto = async () => {
      try {
        const result = await imageUploadService.pickAndOptimizeAvatar();
        if (result.canceled || !result.data) {
          if (result.error) {
            Alert.alert('Photo Access', result.error);
          }
          return;
        }

        await uploadAvatar({
          imageUri: result.data.uri,
          previousAvatarUrl: profile?.avatar_url,
        });
      } catch (err: any) {
        Alert.alert('Upload Failed', err?.message || 'Could not upload avatar image.');
      }
    };

    const confirmRemovePhoto = () => {
      Alert.alert(
        'Remove Avatar',
        'Are you sure you want to remove your profile photo?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: async () => {
              try {
                await removeAvatar(profile?.avatar_url);
              } catch (err: any) {
                Alert.alert('Error', err?.message || 'Failed to remove avatar.');
              }
            },
          },
        ]
      );
    };

    if (profile?.avatar_url) {
      if (Platform.OS === 'web') {
        const choice = window.confirm(
          'Choose OK to pick a new avatar, or Cancel to remove current avatar.'
        );
        if (choice) {
          await selectNewPhoto();
        } else {
          confirmRemovePhoto();
        }
      } else {
        Alert.alert('Profile Photo', 'Update or remove your avatar', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove Photo', style: 'destructive', onPress: confirmRemovePhoto },
          { text: 'Choose New Photo', onPress: selectNewPhoto },
        ]);
      }
    } else {
      await selectNewPhoto();
    }
  };

  const handleEditProfile = () => {
    router.push('/profiles/edit');
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

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Shiv';
  const username = profile?.username
    ? `@${profile.username}`
    : user?.email
    ? `@${user.email.split('@')[0]}`
    : '@shivgoyal9888';
  const headline = profile?.headline || 'Builder & Creator';
  const bio = profile?.bio || 'Building tools and open-source software on Sccinet.';
  const location = profile?.location || null;

  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top + 8, 16),
            paddingBottom: Math.max(insets.bottom + 96, 110),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar matching Screen 8 */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={[
              styles.themeSwitchButton,
              {
                backgroundColor: theme.glass.clear.fill,
                borderColor: theme.glass.clear.border,
              },
            ]}
          >
            <Ionicons name="chevron-back" size={20} color={theme.colors.text} />
          </TouchableOpacity>

          <Text
            style={[
              styles.brandTitle,
              { color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: '700' },
            ]}
          >
            Profile
          </Text>

          <TouchableOpacity
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Settings"
            style={[
              styles.themeSwitchButton,
              {
                backgroundColor: theme.glass.clear.fill,
                borderColor: theme.glass.clear.border,
              },
            ]}
          >
            <Ionicons
              name="settings-outline"
              size={18}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.centerContainer}>
          {/* Profile Identity Card - Primary */}
          <AnimatedEntrance staggerIndex={0}>
            <Card variant="clay" padding="xl" style={styles.identityCard}>
            <View style={styles.avatarRow}>
              <TouchableOpacity
                onPress={handleAvatarPress}
                activeOpacity={0.85}
                disabled={isAvatarBusy}
                accessibilityRole="button"
                accessibilityLabel="Change profile avatar"
                style={[
                  styles.avatarWrapper,
                  {
                    backgroundColor: theme.glass.clear.fill,
                    borderColor: theme.glass.clear.border,
                    ...Platform.select({
                      web: {
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
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

                <View
                  style={[
                    styles.avatarBadge,
                    {
                      backgroundColor: theme.glass.elevated.fill,
                      borderColor: theme.glass.elevated.border,
                      ...Platform.select({
                        web: {
                          backdropFilter: 'blur(12px)',
                          WebkitBackdropFilter: 'blur(12px)',
                          boxShadow: theme.clay.webChipShadow,
                        } as any,
                        default: {
                          ...theme.clay.shadowChip,
                        },
                      }),
                    },
                  ]}
                >
                  {isAvatarBusy ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <Ionicons
                      name="camera-outline"
                      size={14}
                      color={theme.colors.primary}
                    />
                  )}
                </View>

                {isAvatarBusy ? (
                  <View style={styles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  </View>
                ) : null}
              </TouchableOpacity>
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

            {/* Stats Row matching Screen 8 */}
            <View
              style={[
                styles.statsRowCard,
                {
                  backgroundColor: theme.clay.surfaceRecessed,
                  borderColor: theme.clay.borderCard,
                },
              ]}
            >
              <View style={styles.statColumn}>
                <Text
                  style={[
                    styles.statValue,
                    { color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: '700' },
                  ]}
                >
                  12
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.micro },
                  ]}
                >
                  Projects
                </Text>
              </View>

              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.clay.borderCard },
                ]}
              />

              <View style={styles.statColumn}>
                <Text
                  style={[
                    styles.statValue,
                    { color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: '700' },
                  ]}
                >
                  48
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.micro },
                  ]}
                >
                  Connections
                </Text>
              </View>

              <View
                style={[
                  styles.statDivider,
                  { backgroundColor: theme.clay.borderCard },
                ]}
              />

              <View style={styles.statColumn}>
                <Text
                  style={[
                    styles.statValue,
                    { color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: '700' },
                  ]}
                >
                  2.1K
                </Text>
                <Text
                  style={[
                    styles.statLabel,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.micro },
                  ]}
                >
                  Views
                </Text>
              </View>
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

                {/* Counter Badge from Stitch */}
                <View
                  style={[
                    styles.counterBadge,
                    {
                      backgroundColor: theme.clay.surfaceRecessed,
                      borderColor: theme.clay.borderCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.counterBadgeText,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.micro,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    {userSkills.length}
                  </Text>
                </View>
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

            <View style={styles.chipsRow}>
              {(userSkills.length > 0
                ? userSkills.map((s) => s.name)
                : ['Python', 'TypeScript', 'React Native', 'AI', 'Tailwind CSS', 'Docker']
              ).map((skillName) => (
                <View
                  key={skillName}
                  style={[
                    styles.skillChip,
                    {
                      backgroundColor: theme.clay.surfaceRecessed,
                      borderColor: theme.clay.borderCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.skillChipText,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.xs,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    {skillName}
                  </Text>
                </View>
              ))}
            </View>
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

            {/* Clean Tactile Empty State from Stitch */}
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

          {/* Bottom Sign Out Tactile Button from Stitch */}
          <AnimatedEntrance staggerIndex={1}>
            <View style={styles.signOutWrapper}>
              <Button
                title="Sign Out"
                variant="claySecondary"
                size="md"
                leftIcon={
                  <Ionicons
                    name="log-out-outline"
                    size={18}
                    color={theme.colors.error}
                  />
                }
                textStyle={{ color: theme.colors.error }}
                onPress={handleSignOut}
                style={styles.signOutButton}
              />
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
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 9999,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
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
  appearanceSection: {
    width: '100%',
    marginTop: 16,
    gap: 8,
  },
  appearanceLabel: {
    textTransform: 'uppercase',
  },
  counterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 9999,
    borderWidth: 1,
  },
  counterBadgeText: {},
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
  statsRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  statValue: {},
  statLabel: {
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 28,
  },
  signOutWrapper: {
    width: '100%',
    paddingVertical: 8,
  },
  signOutButton: {
    width: '100%',
  },
  signOutText: {},
});
