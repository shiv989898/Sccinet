import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { useAuth } from '../../src/features/auth/AuthContext';
import { profileUpdateSchema } from '../../src/features/profiles/schemas';
import {
  useCurrentProfile,
  useUpdateProfile,
  useAvailableSkills,
  useUserSkills,
  useAddSkill,
  useRemoveSkill,
} from '../../src/features/profiles/useProfile';
import { Card, Button, Input, Badge } from '../../src/components/ui';

export default function OnboardingScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useCurrentProfile();
  const { mutateAsync: updateProfile, isPending: isUpdating } = useUpdateProfile();
  const { data: availableSkills = [] } = useAvailableSkills();
  const { data: userSkills = [] } = useUserSkills(user?.id);
  const { mutateAsync: addSkill } = useAddSkill(user?.id);
  const { mutateAsync: removeSkill } = useRemoveSkill(user?.id);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile && !user) return;
    const timer = setTimeout(() => {
      if (profile) {
        setFullName(profile.full_name || '');
        setUsername(profile.username || '');
        setHeadline(profile.headline || '');
        setBio(profile.bio || '');
        setLocation(profile.location || '');
      } else if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [profile, user]);

  const handleSaveProfile = async () => {
    setGeneralError(null);
    setFieldErrors({});

    const validation = profileUpdateSchema.safeParse({
      fullName,
      username,
      headline: headline || null,
      bio: bio || null,
      location: location || null,
    });

    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    try {
      await updateProfile({
        full_name: fullName,
        username,
        headline: headline || null,
        bio: bio || null,
        location: location || null,
      });

      router.replace('/(tabs)');
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to save profile. Username may already be in use.');
    }
  };

  const handleToggleSkill = async (skillId: string) => {
    const isSelected = userSkills.some((s) => s.id === skillId);
    try {
      if (isSelected) {
        await removeSkill(skillId);
      } else {
        await addSkill(skillId);
      }
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to update skills');
    }
  };

  const filteredSkills = availableSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Onboarding Header */}
        <View style={styles.headerSection}>
          <Badge label="Step 1 of 1 • Identity" variant="primary" size="sm" />
          <Text
            style={[
              styles.headerTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
                marginTop: 8,
              },
            ]}
          >
            Build Your Profile
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.sm,
                marginTop: 4,
              },
            ]}
          >
            Tell the community who you are, what you build, and your core technical skills.
          </Text>
        </View>

        {generalError && (
          <View
            style={[
              styles.errorBanner,
              {
                backgroundColor: theme.colors.errorMuted,
                borderColor: theme.colors.error,
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={18}
              color={theme.colors.error}
              style={{ marginRight: 8 }}
            />
            <Text
              style={[
                styles.errorText,
                { color: theme.colors.error, fontSize: theme.typography.sizes.xs },
              ]}
            >
              {generalError}
            </Text>
          </View>
        )}

        {/* Profile Details Card */}
        <Card variant="elevated" style={styles.card}>
          <Text
            style={[
              styles.cardSectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
                marginBottom: 16,
              },
            ]}
          >
            Personal Information
          </Text>

          <View style={styles.inputsStack}>
            <Input
              label="Full Name *"
              placeholder="Alex Rivera"
              value={fullName}
              onChangeText={setFullName}
              error={fieldErrors.fullName}
              leftAccessory={
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
            />

            <Input
              label="Username (@handle) *"
              placeholder="alex_rivera"
              value={username}
              onChangeText={setUsername}
              error={fieldErrors.username}
              autoCapitalize="none"
              hint="Letters, numbers, and underscores (3-30 characters)"
              leftAccessory={
                <Ionicons
                  name="at-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
            />

            <Input
              label="Headline / Role"
              placeholder="Full-Stack Developer • Mobile Enthusiast"
              value={headline}
              onChangeText={setHeadline}
              error={fieldErrors.headline}
              leftAccessory={
                <Ionicons
                  name="briefcase-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
            />

            <Input
              label="Location"
              placeholder="San Francisco, CA / Remote"
              value={location}
              onChangeText={setLocation}
              error={fieldErrors.location}
              leftAccessory={
                <Ionicons
                  name="location-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
            />

            <Input
              label="Bio"
              placeholder="Passionate about building performant apps, open source tools, and scalable distributed systems."
              value={bio}
              onChangeText={setBio}
              error={fieldErrors.bio}
              multiline
              numberOfLines={3}
              inputStyle={{ height: 72, textAlignVertical: 'top', paddingTop: 8 }}
            />
          </View>
        </Card>

        {/* Skill Selection Card */}
        <Card variant="default" style={styles.skillsCard}>
          <Text
            style={[
              styles.cardSectionTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
              },
            ]}
          >
            Your Technical & Creative Skills
          </Text>
          <Text
            style={[
              styles.skillsSubtitle,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.xs,
                marginTop: 4,
                marginBottom: 12,
              },
            ]}
          >
            Tap skills to link them to your profile. These help collaborators find you for projects.
          </Text>

          {/* Selected Skills Pills */}
          {userSkills.length > 0 && (
            <View style={styles.selectedSkillsWrapper}>
              <Text
                style={[
                  styles.selectedLabel,
                  {
                    color: theme.colors.textMuted,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.semibold,
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  },
                ]}
              >
                SELECTED ({userSkills.length})
              </Text>
              <View style={styles.chipsRow}>
                {userSkills.map((skill) => (
                  <TouchableOpacity
                    key={skill.id}
                    onPress={() => handleToggleSkill(skill.id)}
                  >
                    <Badge
                      label={`${skill.name}  ✕`}
                      variant="primary"
                      size="sm"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Search Skills */}
          <Input
            placeholder="Search skills (e.g. React, Python, UI/UX)..."
            value={skillSearch}
            onChangeText={setSkillSearch}
            containerStyle={{ marginBottom: 12 }}
            leftAccessory={
              <Ionicons
                name="search"
                size={16}
                color={theme.colors.textMuted}
                style={{ marginRight: 8 }}
              />
            }
          />

          {/* Available Skills Grid */}
          <View style={styles.chipsRow}>
            {filteredSkills.map((skill) => {
              const isSelected = userSkills.some((s) => s.id === skill.id);
              return (
                <TouchableOpacity
                  key={skill.id}
                  onPress={() => handleToggleSkill(skill.id)}
                >
                  <Badge
                    label={isSelected ? `✓ ${skill.name}` : `+ ${skill.name}`}
                    variant={isSelected ? 'primary' : 'outline'}
                    size="sm"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Action Button */}
        <Button
          title={isUpdating ? 'Saving Profile...' : 'Complete Profile & Enter'}
          onPress={handleSaveProfile}
          loading={isUpdating || profileLoading}
          variant="primary"
          size="lg"
          style={styles.submitBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingVertical: 32,
    gap: 18,
  },
  headerSection: {
    marginBottom: 6,
  },
  headerTitle: {
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    flex: 1,
  },
  card: {
    padding: 18,
  },
  cardSectionTitle: {},
  inputsStack: {
    gap: 14,
  },
  skillsCard: {
    padding: 18,
  },
  skillsSubtitle: {
    lineHeight: 18,
  },
  selectedSkillsWrapper: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(150, 150, 150, 0.2)',
  },
  selectedLabel: {},
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
});
