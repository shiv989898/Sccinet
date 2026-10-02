import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useCurrentProfile, useUserSkills } from '../../src/features/profiles/useProfile';
import { Card, Badge, Button, Avatar } from '../../src/components/ui';

export default function ProfileScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemeStore();
  const { user, signOut } = useAuth();
  const { data: profile } = useCurrentProfile();
  const { data: userSkills = [] } = useUserSkills(user?.id);

  const cycleTheme = () => {
    if (preference === 'system') setPreference('dark');
    else if (preference === 'dark') setPreference('light');
    else setPreference('system');
  };

  const handleEditProfile = () => {
    router.push('/(auth)/onboarding');
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/sign-in');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'Builder Profile';
  const username = profile?.username ? `@${profile.username}` : (user?.email ? `@${user.email.split('@')[0]}` : '@builder');
  const headline = profile?.headline || 'Builder • Collaborator';
  const bio = profile?.bio || 'No bio provided yet. Tap Edit Profile to add your story.';
  const location = profile?.location || null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
    >
      {/* Profile Header Card */}
      <Card variant="elevated" style={styles.headerCard}>
        <View style={styles.profileRow}>
          <Avatar name={displayName} url={profile?.avatar_url} size="lg" />
          <View style={styles.profileInfo}>
            <Text
              style={[
                styles.displayName,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              {displayName}
            </Text>
            <Text
              style={[
                styles.handle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: 2,
                },
              ]}
            >
              {username}
            </Text>
            <Text
              style={[
                styles.headline,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.xs,
                  marginTop: 6,
                },
              ]}
            >
              {headline}
            </Text>
            {location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={13} color={theme.colors.textMuted} />
                <Text
                  style={[
                    styles.locationText,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs },
                  ]}
                >
                  {location}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Bio */}
        <Text
          style={[
            styles.bioText,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.xs,
              marginTop: 14,
              lineHeight: 18,
            },
          ]}
        >
          {bio}
        </Text>

        {/* Skills Section */}
        <View style={styles.skillsSection}>
          <View style={styles.skillsHeader}>
            <Text
              style={[
                styles.sectionTitle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                  fontWeight: theme.typography.weights.semibold,
                  letterSpacing: 0.5,
                },
              ]}
            >
              SKILLS ({userSkills.length})
            </Text>
          </View>
          <View style={styles.skillsGrid}>
            {userSkills.length > 0 ? (
              userSkills.map((skill) => (
                <Badge key={skill.id} label={skill.name} variant="primary" size="sm" />
              ))
            ) : (
              <Text style={{ color: theme.colors.textMuted, fontSize: theme.typography.sizes.xs }}>
                No skills linked yet. Tap Edit Profile to add skills.
              </Text>
            )}
          </View>
        </View>

        {/* Action Button */}
        <Button
          title="Edit Profile & Skills"
          onPress={handleEditProfile}
          variant="outline"
          size="sm"
          style={styles.editBtn}
          leftIcon={<Ionicons name="create-outline" size={16} color={theme.colors.text} />}
        />
      </Card>

      {/* Theme & Settings Card */}
      <Card variant="default">
        <View style={styles.settingsHeader}>
          <View style={styles.settingsTitleRow}>
            <Ionicons
              name={theme.isDark ? 'moon-outline' : 'sunny-outline'}
              size={20}
              color={theme.colors.primary}
            />
            <Text
              style={[
                styles.settingsTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  marginLeft: 8,
                },
              ]}
            >
              Appearance & Theme
            </Text>
          </View>
          <Badge
            label={preference.toUpperCase()}
            variant="outline"
            size="sm"
          />
        </View>

        <Text
          style={[
            styles.settingsDesc,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.xs,
              marginTop: 6,
              marginBottom: 14,
            },
          ]}
        >
          Toggle between system, dark, and light themes to test responsive styling tokens.
        </Text>

        <Button
          title={`Switch Theme (Current: ${preference})`}
          size="sm"
          variant="secondary"
          onPress={cycleTheme}
          leftIcon={<Ionicons name="color-palette-outline" size={16} color={theme.colors.text} />}
        />
      </Card>

      {/* Account & Session Card */}
      <Card variant="default">
        <View style={styles.settingsHeader}>
          <View style={styles.settingsTitleRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.primary} />
            <Text
              style={[
                styles.settingsTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                  marginLeft: 8,
                },
              ]}
            >
              Account Session
            </Text>
          </View>
          <Badge label={user ? 'Active' : 'Guest'} variant="success" size="sm" />
        </View>

        <Text
          style={[
            styles.settingsDesc,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.xs,
              marginTop: 6,
              marginBottom: 14,
            },
          ]}
        >
          {user ? `Signed in as ${user.email}` : 'Not signed in'}
        </Text>

        <Button
          title="Sign Out"
          onPress={handleSignOut}
          size="sm"
          variant="danger"
          leftIcon={<Ionicons name="log-out-outline" size={16} color="#FFFFFF" />}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  headerCard: {},
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  displayName: {},
  handle: {},
  headline: {},
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  locationText: {},
  bioText: {},
  skillsSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  skillsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {},
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  editBtn: {
    marginTop: 18,
  },
  settingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingsTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsTitle: {},
  settingsDesc: {},
});
