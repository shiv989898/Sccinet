import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useThemeStore } from '../../src/stores/useThemeStore';
import { Card, Badge, Button, Avatar } from '../../src/components/ui';

export default function ProfileScreen() {
  const theme = useTheme();
  const { preference, setPreference } = useThemeStore();

  const cycleTheme = () => {
    if (preference === 'system') setPreference('dark');
    else if (preference === 'dark') setPreference('light');
    else setPreference('system');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
    >
      {/* Profile Header Card */}
      <Card variant="elevated" style={styles.headerCard}>
        <View style={styles.profileRow}>
          <Avatar name="Sccinet User" size="lg" />
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
              Builder Profile
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
              @builder
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
              Full-Stack Developer • Mobile Enthusiast
            </Text>
          </View>
        </View>

        {/* Skills Section */}
        <View style={styles.skillsSection}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
                fontWeight: theme.typography.weights.semibold,
                marginBottom: 8,
                letterSpacing: 0.5,
              },
            ]}
          >
            SKILLS
          </Text>
          <View style={styles.skillsGrid}>
            <Badge label="TypeScript" variant="primary" size="sm" />
            <Badge label="React Native" variant="primary" size="sm" />
            <Badge label="Supabase" variant="primary" size="sm" />
            <Badge label="PostgreSQL" variant="default" size="sm" />
            <Badge label="UI/UX" variant="default" size="sm" />
          </View>
        </View>
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

      {/* Showcase Projects Preview */}
      <Card variant="default">
        <View style={styles.showcaseHeader}>
          <Text
            style={[
              styles.showcaseTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
              },
            ]}
          >
            Project Portfolio
          </Text>
          <Badge label="0 Showcased" variant="default" size="sm" />
        </View>

        <Text
          style={[
            styles.showcaseDesc,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.xs,
              marginTop: 6,
            },
          ]}
        >
          Projects you lead or contribute to will be pinned here on your public profile.
        </Text>
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
  skillsSection: {
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(150, 150, 150, 0.2)',
  },
  sectionTitle: {},
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
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
  showcaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  showcaseTitle: {},
  showcaseDesc: {},
});
