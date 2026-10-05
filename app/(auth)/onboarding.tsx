import React, { useEffect, useState } from 'react';
import {
  Animated,
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
import { Card, Button, Input, AnimatedEntrance } from '../../src/components/ui';
import { motionTokens, useReducedMotion } from '../../src/theme/motion';

export default function OnboardingScreen() {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();
  const { user } = useAuth();
  const { data: profile } = useCurrentProfile();
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
  const [errorAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (generalError) {
      if (reducedMotion) {
        errorAnim.setValue(1);
        return;
      }
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: motionTokens.duration.fast,
        useNativeDriver: !isWeb,
      }).start();
    } else {
      errorAnim.setValue(0);
    }
  }, [generalError, errorAnim, isWeb, reducedMotion]);

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

  // Filter skills based on search
  const filteredSkills = availableSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase().trim())
  );

  const selectedSkillIds = new Set(userSkills.map((s) => s.id));
  const suggestedSkills = filteredSkills.filter((s) => !selectedSkillIds.has(s.id));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Minimal Bar - Anchored and immediate */}
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
        </View>

        {/* Main Content Area */}
        <View style={styles.centerContainer}>
          {/* Header */}
          <AnimatedEntrance staggerIndex={0}>
            <View style={styles.header}>
              <View
                style={[
                  styles.avatarContainer,
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
                <View
                  style={[
                    styles.avatarInner,
                    {
                      backgroundColor: theme.colors.primaryMuted,
                    },
                  ]}
                >
                  <Ionicons name="person" size={26} color={theme.colors.primary} />
                </View>
              </View>

              <Text
                style={[
                  styles.title,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xxl,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Set up your profile
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                Tell the community what you build
              </Text>
            </View>
          </AnimatedEntrance>

          {/* Form Card */}
          <AnimatedEntrance staggerIndex={1}>
            <Card variant="clay" padding="xl" style={styles.formCard}>
              {generalError && (
                <Animated.View
                  style={{
                    opacity: errorAnim,
                    transform: [
                      {
                        translateY: errorAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-4, 0],
                        }),
                      },
                    ],
                  }}
                >
                  <View
                    style={[
                      styles.errorBanner,
                      {
                        backgroundColor: theme.colors.errorMuted,
                        borderColor: theme.colors.error,
                      },
                    ]}
                  >
                    <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {generalError}
                    </Text>
                  </View>
                </Animated.View>
              )}

            <View style={styles.fieldGroup}>
              {/* Full Name */}
              <Input
                label="Full Name"
                placeholder="e.g. Alex Rivera"
                value={fullName}
                onChangeText={setFullName}
                error={fieldErrors.fullName}
              />

              {/* Username */}
              <Input
                label="Username"
                placeholder="username"
                value={username}
                onChangeText={(text) => setUsername(text.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldErrors.username}
                leftAccessory={
                  <Text
                    style={[
                      styles.prefixText,
                      { color: theme.colors.textMuted, fontSize: theme.typography.sizes.md },
                    ]}
                  >
                    @
                  </Text>
                }
                rightAccessory={
                  username.length >= 3 ? (
                    <View style={styles.availableBadge}>
                      <Ionicons name="checkmark-circle" size={15} color={theme.colors.success} />
                      <Text
                        style={[
                          styles.availableText,
                          { color: theme.colors.success, fontSize: theme.typography.sizes.micro },
                        ]}
                      >
                        Available
                      </Text>
                    </View>
                  ) : null
                }
              />

              {/* Headline */}
              <Input
                label="Headline"
                placeholder="e.g. Software Engineer or Product Designer"
                value={headline}
                onChangeText={setHeadline}
                error={fieldErrors.headline}
              />

              {/* Location */}
              <Input
                label="Location"
                placeholder="e.g. San Francisco, CA or Remote"
                value={location}
                onChangeText={setLocation}
                error={fieldErrors.location}
                leftAccessory={
                  <Ionicons
                    name="location-outline"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                }
              />

              {/* Bio */}
              <View style={styles.bioWrapper}>
                <View style={styles.bioHeader}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    Bio
                  </Text>
                  <Text
                    style={[
                      styles.charCount,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    {bio.length}/160
                  </Text>
                </View>
                <View
                  style={[
                    styles.textareaContainer,
                    {
                      backgroundColor: theme.clay.surfaceRecessed,
                      borderColor: fieldErrors.bio
                        ? theme.colors.error
                        : theme.clay.borderRecessed,
                      borderRadius: theme.borderRadius.md,
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webRecessedShadow,
                        } as any,
                      }),
                    },
                  ]}
                >
                  <Input
                    multiline
                    numberOfLines={3}
                    maxLength={160}
                    placeholder="A brief summary of what you're working on and looking to build..."
                    value={bio}
                    onChangeText={setBio}
                    containerStyle={styles.borderlessInputContainer}
                    inputContainerStyle={styles.borderlessInput}
                    inputStyle={styles.textareaInput}
                  />
                </View>
                {fieldErrors.bio && (
                  <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                    {fieldErrors.bio}
                  </Text>
                )}
              </View>
            </View>

            {/* Core Skills Section */}
            <View style={styles.skillsSection}>
              <View style={styles.skillsHeader}>
                <Text
                  style={[
                    styles.skillsTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.semibold,
                    },
                  ]}
                >
                  Core Skills & Tech
                </Text>
                <Text
                  style={[
                    styles.skillsSubtitle,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.xs,
                      marginTop: 2,
                    },
                  ]}
                >
                  Add the technologies you work with
                </Text>
              </View>

              {/* Skill Search Input */}
              <Input
                placeholder="Search skills (e.g. React, Python, Rust)..."
                value={skillSearch}
                onChangeText={setSkillSearch}
                leftAccessory={
                  <Ionicons
                    name="search-outline"
                    size={17}
                    color={theme.colors.textMuted}
                    style={styles.fieldIcon}
                  />
                }
              />

              {/* Active Selected Skills */}
              {userSkills.length > 0 && (
                <View style={styles.selectedSkillsWrapper}>
                  <Text
                    style={[
                      styles.sectionSublabel,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.xs,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    Selected ({userSkills.length})
                  </Text>
                  <View style={styles.chipsRow}>
                    {userSkills.map((skill) => (
                      <TouchableOpacity
                        key={skill.id}
                        activeOpacity={0.7}
                        onPress={() => handleToggleSkill(skill.id)}
                        style={[
                          styles.chipSelected,
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
                            styles.chipSelectedText,
                            {
                              color: theme.clay.textChipSelected,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          {skill.name}
                        </Text>
                        <Ionicons
                          name="close-outline"
                          size={14}
                          color={theme.clay.textChipSelected}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Suggested Skills */}
              {suggestedSkills.length > 0 && (
                <View style={styles.suggestedSkillsWrapper}>
                  <Text
                    style={[
                      styles.sectionSublabel,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    {skillSearch ? 'Matching' : 'Suggested'}
                  </Text>
                  <View style={styles.chipsRow}>
                    {suggestedSkills.slice(0, 12).map((skill) => (
                      <TouchableOpacity
                        key={skill.id}
                        activeOpacity={0.7}
                        onPress={() => handleToggleSkill(skill.id)}
                        style={[
                          styles.chipSuggested,
                          {
                            backgroundColor: theme.clay.surfaceChipSuggested,
                            borderColor: theme.clay.borderChipSuggested,
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
                          name="add-outline"
                          size={14}
                          color={theme.colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.chipSuggestedText,
                            {
                              color: theme.clay.textChipSuggested,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          {skill.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.actionsWrapper}>
              <Button
                title="Continue to Workspace"
                variant="clayPrimary"
                size="lg"
                loading={isUpdating}
                onPress={handleSaveProfile}
              />

              <TouchableOpacity
                onPress={() => router.replace('/(tabs)')}
                activeOpacity={0.7}
                style={styles.skipButton}
              >
                <Text
                  style={[
                    styles.skipText,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                    },
                  ]}
                >
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </Card>
          </AnimatedEntrance>
        </View>

        {/* Minimal Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            Sccinet • Professional Network for Builders
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
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
  centerContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
  },
  fieldGroup: {
    gap: 14,
  },
  prefixText: {
    marginRight: 2,
    fontWeight: '500',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableText: {
    fontWeight: '600',
  },
  fieldIcon: {
    marginRight: 8,
  },
  bioWrapper: {
    gap: 6,
  },
  bioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {},
  charCount: {},
  textareaContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  borderlessInputContainer: {
    width: '100%',
  },
  borderlessInput: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    height: 'auto',
    minHeight: 80,
    paddingVertical: 8,
  },
  textareaInput: {
    height: 72,
    textAlignVertical: 'top',
  },
  inlineError: {
    fontSize: 12,
    marginTop: 2,
  },
  skillsSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    gap: 12,
  },
  skillsHeader: {
    marginBottom: 4,
  },
  skillsTitle: {
    letterSpacing: -0.2,
  },
  skillsSubtitle: {},
  selectedSkillsWrapper: {
    gap: 8,
    marginTop: 4,
  },
  suggestedSkillsWrapper: {
    gap: 8,
    marginTop: 4,
  },
  sectionSublabel: {},
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipSelectedText: {},
  chipSuggested: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipSuggestedText: {},
  actionsWrapper: {
    marginTop: 24,
    gap: 12,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {},
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {},
});
