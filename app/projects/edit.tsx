import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Button, Card, Input, SegmentedControl, SkeletonLoader } from '../../src/components/ui';
import { motionTokens, useReducedMotion } from '../../src/theme/motion';
import { useAvailableSkills } from '../../src/features/profiles/useProfile';
import { useAuth } from '../../src/features/auth/AuthContext';
import {
  projectEditFormSchema,
  ProjectEditFormInput,
  useProject,
  useUpdateProjectWithSkills,
} from '../../src/features/projects';
import { ProjectStatus } from '../../src/types/database';

const STATUS_OPTIONS: { label: string; value: ProjectStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export default function EditProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();
  const { user } = useAuth();
  const [skillSearch, setSkillSearch] = useState('');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errorAnim] = useState(() => new Animated.Value(0));
  const [isSuccess, setIsSuccess] = useState(false);

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

  const { data: project, isLoading: isLoadingProject, error: projectError } = useProject(id);
  const { data: allSkills = [], isLoading: isLoadingSkills } = useAvailableSkills();
  const updateProjectMutation = useUpdateProjectWithSkills(id || '');

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectEditFormInput>({
    defaultValues: {
      title: '',
      description: '',
      status: 'ACTIVE',
      repository_url: '',
      live_url: '',
      skillIds: [],
    },
    resolver: async (values) => {
      const result = projectEditFormSchema.safeParse(values);
      if (result.success) {
        return { values: result.data, errors: {} };
      }
      const fieldErrors: Record<string, { type: string; message: string }> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0]?.toString() || 'root';
        if (!fieldErrors[key]) {
          fieldErrors[key] = { type: issue.code, message: issue.message };
        }
      }
      return { values: {}, errors: fieldErrors };
    },
  });

  useEffect(() => {
    if (project) {
      reset({
        title: project.title,
        description: project.description || '',
        status: project.status,
        repository_url: project.repository_url || '',
        live_url: project.live_url || '',
        skillIds: (project.skills || []).map((s) => s.id),
      });
    }
  }, [project, reset]);

  const selectedSkillIds = useWatch({ control, name: 'skillIds' }) || [];
  const selectedStatus = useWatch({ control, name: 'status' }) || 'ACTIVE';

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      setValue(
        'skillIds',
        selectedSkillIds.filter((item) => item !== skillId),
        { shouldValidate: true }
      );
    } else {
      setValue('skillIds', [...selectedSkillIds, skillId], { shouldValidate: true });
    }
  };

  const onSubmit = async (formData: ProjectEditFormInput) => {
    setGeneralError(null);
    try {
      await updateProjectMutation.mutateAsync({
        title: formData.title.trim(),
        description: formData.description?.trim() || null,
        status: formData.status,
        repository_url: formData.repository_url?.trim() || null,
        live_url: formData.live_url?.trim() || null,
        skillIds: formData.skillIds,
      });

      setIsSuccess(true);
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace({
            pathname: '/projects/[id]',
            params: { id: id! },
          });
        }
      }, 300);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to update project. Please try again.');
    }
  };

  const isOwner = user?.id && project?.owner_id && user.id === project.owner_id;

  if (isLoadingProject) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, padding: 16 }]}>
        <View style={{ gap: 16, maxWidth: 480, width: '100%', alignSelf: 'center', marginTop: 40 }}>
          <Card variant="clay" padding="lg">
            <View style={{ gap: 14 }}>
              <SkeletonLoader width={140} height={22} borderRadius={6} />
              <SkeletonLoader width="100%" height={44} borderRadius={10} />
              <SkeletonLoader width="100%" height={80} borderRadius={10} />
              <SkeletonLoader width="100%" height={44} borderRadius={10} />
            </View>
          </Card>
        </View>
      </View>
    );
  }

  if (projectError || !project) {
    return (
      <View style={[styles.container, styles.centerFlex, { backgroundColor: theme.colors.background }]}>
        <Card variant="clay" padding="lg" style={styles.errorCard}>
          <Ionicons name="alert-circle-outline" size={40} color={theme.colors.error} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Project Not Found</Text>
          <Button
            title="Return to Workspace"
            variant="clayPrimary"
            size="md"
            onPress={() => router.replace('/(tabs)/workspace')}
            style={{ marginTop: 12 }}
          />
        </Card>
      </View>
    );
  }

  if (!isOwner) {
    return (
      <View style={[styles.container, styles.centerFlex, { backgroundColor: theme.colors.background }]}>
        <Card variant="clay" padding="lg" style={styles.errorCard}>
          <Ionicons name="lock-closed-outline" size={40} color={theme.colors.warning} />
          <Text style={[styles.errorTitle, { color: theme.colors.text }]}>Unauthorized</Text>
          <Text style={[styles.unauthorizedSubtitle, { color: theme.colors.textSecondary }]}>
            Only the project owner can edit this project.
          </Text>
          <Button
            title="Return to Project"
            variant="clayPrimary"
            size="md"
            onPress={() => router.back()}
            style={{ marginTop: 12 }}
          />
        </Card>
      </View>
    );
  }

  const filteredSkills = allSkills.filter((s) =>
    s.name.toLowerCase().includes(skillSearch.toLowerCase().trim())
  );
  const selectedSkills = allSkills.filter((s) => selectedSkillIds.includes(s.id));
  const suggestedSkills = filteredSkills.filter((s) => !selectedSkillIds.includes(s.id));

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
        {/* Top Bar - Anchored and immediately interactive */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backButton,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
                opacity: pressed ? 0.85 : 1,
                transform: pressed ? [{ scale: 0.96 }, { translateY: 0.5 }] : [],
                ...Platform.select({
                  web: {
                    boxShadow: pressed ? theme.clay.webChipShadow : theme.clay.webPillShadow,
                    transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  } as any,
                  default: theme.clay.shadowPill,
                }),
              },
            ]}
          >
            <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
          </Pressable>

          <View style={styles.topBarTitleContainer}>
            <Text
              style={[
                styles.topBarTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
            >
              Edit Project
            </Text>
          </View>

          <View style={styles.topBarRightSlot} />
        </View>

        <AnimatedEntrance duration={180}>
          <View style={styles.centerContainer}>
            {/* Header info */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCapsule,
                  {
                    backgroundColor: theme.clay.surface,
                    borderColor: theme.clay.borderCard,
                    ...Platform.select({
                      web: {
                        boxShadow: theme.clay.webChipShadow,
                      } as any,
                      default: theme.clay.shadowChip,
                    }),
                  },
                ]}
              >
                <Ionicons name="create-outline" size={24} color={theme.colors.primary} />
              </View>

              <Text
                style={[
                  styles.headingTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xxl,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Project Settings
              </Text>
              <Text
                style={[
                  styles.headingSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                Update project metadata, links, status, and required skills
              </Text>
            </View>

            {generalError && (
              <Animated.View
                style={{
                  opacity: errorAnim,
                  transform: [
                    {
                      translateY: errorAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-6, 0],
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
                  <Ionicons name="alert-circle" size={18} color={theme.colors.error} />
                  <Text style={[styles.errorBannerText, { color: theme.colors.error }]}>
                    {generalError}
                  </Text>
                </View>
              </Animated.View>
            )}

            {isSuccess && (
              <View
                style={[
                  styles.successBanner,
                  {
                    backgroundColor: theme.colors.successMuted,
                    borderColor: theme.colors.success,
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.success} />
                <Text style={[styles.successBannerText, { color: theme.colors.success }]}>
                  Project updated successfully! Returning to project...
                </Text>
              </View>
            )}

            {/* Form Card */}
            <Card variant="clay" padding="lg" style={styles.formCard}>
              {/* Title Input */}
              <View style={styles.inputGroup}>
                <Controller
                  control={control}
                  name="title"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Project Title"
                      placeholder="e.g. Distributed Mesh Network"
                      value={value}
                      onChangeText={onChange}
                      error={errors.title?.message}
                      autoCapitalize="words"
                      leftAccessory={
                        <Ionicons
                          name="briefcase-outline"
                          size={18}
                          color={theme.colors.textMuted}
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  )}
                />
              </View>

              {/* Status Selection */}
              <View style={styles.inputGroup}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                      marginBottom: 8,
                    },
                  ]}
                >
                  Project Status
                </Text>
                <SegmentedControl<ProjectStatus>
                  options={STATUS_OPTIONS}
                  value={selectedStatus}
                  onChange={(val) => setValue('status', val, { shouldValidate: true })}
                  size="sm"
                />
              </View>

              {/* Description Input */}
              <View style={styles.inputGroup}>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Description"
                      placeholder="Explain what problem this project solves..."
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.description?.message}
                      multiline
                      numberOfLines={4}
                      containerStyle={{ marginBottom: 0 }}
                    />
                  )}
                />
              </View>

              {/* Repository URL */}
              <View style={styles.inputGroup}>
                <Controller
                  control={control}
                  name="repository_url"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Code Repository (Optional)"
                      placeholder="https://github.com/org/repo"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.repository_url?.message}
                      autoCapitalize="none"
                      keyboardType="url"
                      autoCorrect={false}
                      leftAccessory={
                        <Ionicons
                          name="logo-github"
                          size={18}
                          color={theme.colors.textMuted}
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  )}
                />
              </View>

              {/* Live URL */}
              <View style={styles.inputGroup}>
                <Controller
                  control={control}
                  name="live_url"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      label="Live Project URL (Optional)"
                      placeholder="https://myproject.app"
                      value={value || ''}
                      onChangeText={onChange}
                      error={errors.live_url?.message}
                      autoCapitalize="none"
                      keyboardType="url"
                      autoCorrect={false}
                      leftAccessory={
                        <Ionicons
                          name="globe-outline"
                          size={18}
                          color={theme.colors.textMuted}
                          style={{ marginRight: 8 }}
                        />
                      }
                    />
                  )}
                />
              </View>

              {/* Skills Section */}
              <View style={styles.skillsSection}>
                <Text
                  style={[
                    styles.inputLabel,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                      fontWeight: theme.typography.weights.medium,
                      marginBottom: 4,
                    },
                  ]}
                >
                  Technologies & Skills
                </Text>
                <Text
                  style={[
                    styles.skillsSubtitle,
                    {
                      color: theme.colors.textMuted,
                      fontSize: theme.typography.sizes.xs,
                      marginBottom: 10,
                    },
                  ]}
                >
                  Select skills associated with this project
                </Text>

                {/* Skill Search Input */}
                <View
                  style={[
                    styles.searchBoxContainer,
                    {
                      backgroundColor: theme.clay.surfaceRecessed,
                      borderColor: theme.clay.borderRecessed,
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webRecessedShadow,
                        } as any,
                      }),
                    },
                  ]}
                >
                  <Ionicons name="search" size={16} color={theme.colors.textMuted} />
                  <TextInput
                    placeholder="Search global skills..."
                    placeholderTextColor={theme.colors.textMuted}
                    value={skillSearch}
                    onChangeText={setSkillSearch}
                    style={[styles.searchInput, { color: theme.colors.text }]}
                  />
                  {skillSearch.length > 0 && (
                    <Pressable onPress={() => setSkillSearch('')} hitSlop={8}>
                      <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                    </Pressable>
                  )}
                </View>

                {/* Selected Skills Chips */}
                {selectedSkills.length > 0 && (
                  <View style={styles.selectedSkillsWrapper}>
                    <Text style={[styles.chipsHeading, { color: theme.colors.textSecondary }]}>
                      Selected ({selectedSkills.length})
                    </Text>
                    <View style={styles.chipsRow}>
                      {selectedSkills.map((skill) => (
                        <Pressable
                          key={skill.id}
                          onPress={() => handleToggleSkill(skill.id)}
                          style={({ pressed }) => [
                            styles.chipSelected,
                            {
                              backgroundColor: theme.clay.surfaceChipSelected,
                              borderColor: theme.clay.borderChipSelected,
                              opacity: pressed ? 0.85 : 1,
                              transform: pressed ? [{ scale: 0.97 }] : [],
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webChipSelectedShadow,
                                  cursor: 'pointer',
                                } as any,
                                default: theme.clay.shadowChip,
                              }),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipSelectedText,
                              { color: theme.clay.textChipSelected },
                            ]}
                          >
                            {skill.name}
                          </Text>
                          <Ionicons
                            name="close"
                            size={14}
                            color={theme.clay.textChipSelected}
                            style={{ marginLeft: 4 }}
                          />
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                {/* Suggested / Filtered Skills */}
                {isLoadingSkills ? (
                  <ActivityIndicator
                    size="small"
                    color={theme.colors.primary}
                    style={{ marginVertical: 12 }}
                  />
                ) : (
                  <View style={styles.suggestedSkillsWrapper}>
                    <Text style={[styles.chipsHeading, { color: theme.colors.textMuted }]}>
                      {skillSearch ? 'Matching Skills' : 'Available Skills'}
                    </Text>
                    <View style={styles.chipsRow}>
                      {suggestedSkills.slice(0, 16).map((skill) => (
                        <Pressable
                          key={skill.id}
                          onPress={() => handleToggleSkill(skill.id)}
                          style={({ pressed }) => [
                            styles.chipSuggested,
                            {
                              backgroundColor: theme.clay.surfaceChipSuggested,
                              borderColor: theme.clay.borderChipSuggested,
                              opacity: pressed ? 0.85 : 1,
                              transform: pressed ? [{ scale: 0.97 }] : [],
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webChipShadow,
                                  cursor: 'pointer',
                                } as any,
                                default: theme.clay.shadowChip,
                              }),
                            },
                          ]}
                        >
                          <Ionicons
                            name="add"
                            size={13}
                            color={theme.colors.textSecondary}
                            style={{ marginRight: 3 }}
                          />
                          <Text
                            style={[
                              styles.chipSuggestedText,
                              { color: theme.clay.textChipSuggested },
                            ]}
                          >
                            {skill.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              {/* Submit Buttons */}
              <View style={styles.actionButtonsRow}>
                <Button
                  title="Cancel"
                  variant="claySecondary"
                  size="lg"
                  onPress={() => router.back()}
                  style={styles.cancelButton}
                />
                <Button
                  title="Save Changes"
                  variant="clayPrimary"
                  size="lg"
                  loading={updateProjectMutation.isPending}
                  onPress={handleSubmit(onSubmit)}
                  style={styles.saveButton}
                />
              </View>
            </Card>
          </View>
        </AnimatedEntrance>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerFlex: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  scrollContent: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topBar: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  topBarTitle: {
    letterSpacing: -0.2,
  },
  topBarRightSlot: {
    width: 38,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCapsule: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headingTitle: {
    letterSpacing: -0.4,
    marginBottom: 4,
    textAlign: 'center',
  },
  headingSubtitle: {
    textAlign: 'center',
    maxWidth: 380,
  },
  formCard: {
    width: '100%',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    letterSpacing: -0.1,
  },
  statusPillsRow: {
    flexDirection: 'row',
    borderRadius: 13,
    padding: 3,
    borderWidth: 1,
    gap: 4,
  },
  statusPillItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  statusPillItemSelected: {
    borderWidth: 1,
  },
  statusPillText: {},
  skillsSection: {
    marginTop: 6,
    marginBottom: 24,
  },
  skillsSubtitle: {},
  searchBoxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 42,
    marginBottom: 14,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  selectedSkillsWrapper: {
    marginBottom: 14,
  },
  suggestedSkillsWrapper: {
    marginBottom: 8,
  },
  chipsHeading: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipSelectedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  chipSuggested: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipSuggestedText: {
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 2,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
    fontSize: 13,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  successBannerText: {
    flex: 1,
    fontSize: 13,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorCard: {
    alignItems: 'center',
    padding: 24,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  unauthorizedSubtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
  },
});
