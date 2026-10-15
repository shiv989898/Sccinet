import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { useAuth } from '../../src/features/auth/AuthContext';
import { profileUpdateSchema } from '../../src/features/profiles/schemas';
import {
  useCurrentProfile,
  useUpdateProfile,
  useUserSkills,
  useAddSkill,
  useRemoveSkill,
  useUploadAvatar,
} from '../../src/features/profiles/useProfile';
import { imageUploadService } from '../../src/services/storage/imageUploadService';
import { Card, Button, Input, Avatar, AnimatedEntrance } from '../../src/components/ui';

export default function EditProfileScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: profile } = useCurrentProfile();
  const { mutateAsync: updateProfile, isPending: isSaving } = useUpdateProfile();
  const { mutateAsync: uploadAvatar, isPending: isUploadingAvatar } = useUploadAvatar();
  const { data: userSkills = [] } = useUserSkills(user?.id);
  const { mutateAsync: addSkill } = useAddSkill(user?.id);
  const { mutateAsync: removeSkill } = useRemoveSkill(user?.id);

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [newSkillText, setNewSkillText] = useState('');
  const [showAddSkillInput, setShowAddSkillInput] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const timer = setTimeout(() => {
      if (profile) {
        setFullName(profile.full_name || '');
        setUsername(profile.username || '');
        setHeadline(profile.headline || '');
        setBio(profile.bio || '');
      } else if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [profile, user]);

  const handlePickPhoto = async () => {
    try {
      const result = await imageUploadService.pickAndOptimizeAvatar();
      if (result.canceled || !result.data) {
        if (result.error) Alert.alert('Photo Access', result.error);
        return;
      }
      await uploadAvatar({
        imageUri: result.data.uri,
        previousAvatarUrl: profile?.avatar_url,
      });
    } catch (err: any) {
      Alert.alert('Upload Failed', err?.message || 'Could not update profile photo.');
    }
  };

  const handleSave = async () => {
    setFieldErrors({});

    const validation = profileUpdateSchema.safeParse({
      fullName,
      username,
      headline: headline || null,
      bio: bio || null,
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
      });
      router.back();
    } catch (err: any) {
      Alert.alert('Save Failed', err?.message || 'Could not update profile.');
    }
  };

  const handleAddCustomSkill = async () => {
    const trimmed = newSkillText.trim();
    if (!trimmed) return;
    try {
      await addSkill(trimmed);
      setNewSkillText('');
      setShowAddSkillInput(false);
    } catch (err: any) {
      Alert.alert('Skill Error', err?.message || 'Could not add skill.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 20),
            borderBottomColor: theme.clay.borderCard,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text, fontSize: theme.typography.sizes.xl },
          ]}
        >
          Edit Profile
        </Text>

        <TouchableOpacity
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.7}
          style={styles.saveHeaderButton}
        >
          <Text
            style={[
              styles.saveHeaderText,
              { color: theme.colors.primary, fontSize: theme.typography.sizes.md },
            ]}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            padding: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Section */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Avatar
                url={profile?.avatar_url}
                name={fullName || 'Builder'}
                size={88}
              />
              {isUploadingAvatar && (
                <View style={styles.avatarLoadingOverlay}>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                </View>
              )}
            </View>

            <TouchableOpacity
              onPress={handlePickPhoto}
              disabled={isUploadingAvatar}
              activeOpacity={0.7}
              style={styles.changePhotoButton}
            >
              <Text
                style={[
                  styles.changePhotoText,
                  { color: theme.colors.primary, fontSize: theme.typography.sizes.sm },
                ]}
              >
                Change Photo
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedEntrance>

        {/* Inputs Card */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="lg" style={styles.formCard}>
            <View style={{ gap: 14 }}>
              <Input
                label="Name"
                placeholder="e.g. Shiv"
                value={fullName}
                onChangeText={setFullName}
                error={fieldErrors.fullName}
              />

              <Input
                label="Username"
                placeholder="e.g. shivgoyal9888"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldErrors.username}
                leftAccessory={
                  <Text style={{ color: theme.colors.textMuted, fontSize: 15, marginRight: 2 }}>
                    @
                  </Text>
                }
              />

              <Input
                label="Bio"
                placeholder="Building tools and open-source software on Sccinet."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                error={fieldErrors.bio}
              />
            </View>
          </Card>
        </AnimatedEntrance>

        {/* Skills Section */}
        <AnimatedEntrance staggerIndex={2}>
          <Card variant="clay" padding="lg" style={styles.skillsCard}>
            <View style={styles.skillsHeaderRow}>
              <Text
                style={[
                  styles.skillsTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Skills
              </Text>

              {!showAddSkillInput && (
                <TouchableOpacity
                  onPress={() => setShowAddSkillInput(true)}
                  activeOpacity={0.7}
                  style={styles.addSkillTrigger}
                >
                  <Ionicons name="add" size={16} color={theme.colors.primary} />
                  <Text
                    style={[
                      styles.addSkillTriggerText,
                      { color: theme.colors.primary, fontSize: theme.typography.sizes.sm },
                    ]}
                  >
                    Add Skill
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {showAddSkillInput && (
              <View style={styles.addSkillInputRow}>
                <View style={{ flex: 1 }}>
                  <Input
                    placeholder="e.g. React Native, Python, AI"
                    value={newSkillText}
                    onChangeText={setNewSkillText}
                    autoCapitalize="words"
                    returnKeyType="done"
                    onSubmitEditing={handleAddCustomSkill}
                  />
                </View>
                <Button
                  title="Add"
                  size="sm"
                  variant="clayPrimary"
                  onPress={handleAddCustomSkill}
                />
                <Button
                  title="Cancel"
                  size="sm"
                  variant="claySecondary"
                  onPress={() => {
                    setShowAddSkillInput(false);
                    setNewSkillText('');
                  }}
                />
              </View>
            )}

            {/* Chips Container */}
            <View style={styles.chipsWrap}>
              {userSkills.map((us: any) => {
                const skillName = us.skill?.name || us.name || us;
                const skillId = us.skill?.id || us.id;
                return (
                  <View
                    key={skillId || skillName}
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
                        { color: theme.colors.text, fontSize: theme.typography.sizes.xs },
                      ]}
                    >
                      {skillName}
                    </Text>
                    <TouchableOpacity
                      onPress={() => skillId && removeSkill(skillId)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={styles.chipRemoveIcon}
                    >
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color={theme.colors.textMuted}
                      />
                    </TouchableOpacity>
                  </View>
                );
              })}

              {userSkills.length === 0 && !showAddSkillInput && (
                <Text
                  style={[
                    styles.noSkillsText,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
                  ]}
                >
                  No skills added yet. Tap Add Skill above.
                </Text>
              )}
            </View>
          </Card>
        </AnimatedEntrance>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  saveHeaderButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  saveHeaderText: {
    fontWeight: '600',
  },
  content: {
    gap: 18,
  },
  avatarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarLoadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changePhotoButton: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  changePhotoText: {
    fontWeight: '600',
  },
  formCard: {
    borderRadius: 22,
  },
  skillsCard: {
    borderRadius: 22,
  },
  skillsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  skillsTitle: {},
  addSkillTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  addSkillTriggerText: {
    fontWeight: '600',
  },
  addSkillInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  skillChipText: {
    fontWeight: '500',
  },
  chipRemoveIcon: {
    marginLeft: 2,
  },
  noSkillsText: {
    fontStyle: 'italic',
  },
});
