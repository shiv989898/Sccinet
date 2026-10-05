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
import { router } from 'expo-router';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Button, Card, Input, SegmentedControl } from '../../src/components/ui';
import { motionTokens, useReducedMotion } from '../../src/theme/motion';
import { useAvailableSkills } from '../../src/features/profiles/useProfile';
import {
  generateSlug,
  projectFormSchema,
  ProjectFormInput,
  useCreateProjectWithSkills,
} from '../../src/features/projects';
import { ProjectStatus } from '../../src/types/database';

const STATUS_OPTIONS: { label: string; value: ProjectStatus }[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export default function CreateProjectScreen() {
  const theme = useTheme();
  const isWeb = Platform.OS === 'web';
  const reducedMotion = useReducedMotion();
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

  // Global skills query
  const { data: allSkills = [], isLoading: isLoadingSkills } = useAvailableSkills();

  // Project creation mutation
  const createProjectMutation = useCreateProjectWithSkills();

  // React Hook Form with Zod resolver logic
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormInput>({
    defaultValues: {
      title: '',
      description: '',
      status: 'ACTIVE',
      repository_url: '',
      live_url: '',
      skillIds: [],
    },
    resolver: async (values) => {
      const result = projectFormSchema.safeParse(values);
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

  const titleValue = useWatch({ control, name: 'title' }) || '';
  const selectedSkillIds = useWatch({ control, name: 'skillIds' }) || [];
  const selectedStatus = useWatch({ control, name: 'status' }) || 'ACTIVE';
  const liveSlugPreview = titleValue.trim() ? generateSlug(titleValue) : '';

  const handleToggleSkill = (skillId: string) => {
    if (selectedSkillIds.includes(skillId)) {
      setValue(
        'skillIds',
        selectedSkillIds.filter((id) => id !== skillId),
        { shouldValidate: true }
      );
    } else {
      setValue('skillIds', [...selectedSkillIds, skillId], { shouldValidate: true });
    }
  };

  const onSubmit = async (formData: ProjectFormInput) => {
    setGeneralError(null);
    try {
      const slug = generateSlug(formData.title);

      const createdProject = await createProjectMutation.mutateAsync({
        title: formData.title.trim(),
        slug,
        description: formData.description?.trim() || null,
        status: formData.status,
        repository_url: formData.repository_url?.trim() || null,
        live_url: formData.live_url?.trim() || null,
        skillIds: formData.skillIds,
      });

      if (!createdProject) {
        throw new Error('Project could not be created');
      }

      setIsSuccess(true);
      // Seamless transition to newly created project
      setTimeout(() => {
        router.replace({
          pathname: '/projects/[id]',
          params: { id: createdProject.id },
        });
      }, 350);
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to create project. Please try again.');
    }
  };

  // Filter skills based on search
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
        {/* Minimal Clay Top Bar - Anchored and immediate */}
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
              New Project
            </Text>
          </View>

          <View style={styles.topBarRightSlot} />
        </View>

        {/* Content Container */}
        <AnimatedEntrance duration={180}>
          <View style={styles.centerContainer}>
            {/* Main Form Clay Vessel */}
            <Card variant="clay" padding="lg" style={styles.cardContainer}>
              {/* Header Title */}
              <View style={styles.formHeader}>
                <Text
                  style={[
                    styles.formTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xl,
                      fontWeight: theme.typography.weights.bold,
                    },
                  ]}
                >
                  Create Project
                </Text>
                <Text
                  style={[
                    styles.formSubtitle,
                    {
                      color: theme.colors.textSecondary,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  Establish a collaborative project foundation to attract builders and showcase technical progress.
                </Text>
              </View>

              {/* General Error Banner */}
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
                        backgroundColor: theme.isDark
                          ? 'rgba(239, 68, 68, 0.15)'
                          : 'rgba(239, 68, 68, 0.08)',
                        borderColor: theme.isDark
                          ? 'rgba(239, 68, 68, 0.3)'
                          : 'rgba(239, 68, 68, 0.2)',
                      },
                    ]}
                  >
                    <Ionicons name="alert-circle" size={18} color={theme.colors.error} />
                    <Text
                      style={[
                        styles.errorBannerText,
                        { color: theme.colors.error, fontSize: theme.typography.sizes.xs },
                      ]}
                    >
                      {generalError}
                    </Text>
                  </View>
                </Animated.View>
              )}

              {/* Form Fields */}
              <View style={styles.fieldsContainer}>
                {/* 1. Title */}
                <View>
                  <Controller
                    control={control}
                    name="title"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        label="Project Title"
                        placeholder="e.g. Distributed Mesh Protocol"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={errors.title?.message}
                        autoCapitalize="words"
                        maxLength={100}
                      />
                    )}
                  />

                  {/* Slug Live Helper */}
                  {liveSlugPreview ? (
                    <View style={styles.slugPreviewRow}>
                      <Ionicons
                        name="link-outline"
                        size={12}
                        color={theme.colors.textMuted}
                        style={{ marginRight: 4 }}
                      />
                      <Text
                        style={[
                          styles.slugPreviewText,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        Slug: {liveSlugPreview}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* 2. Description */}
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Description (Optional)"
                      placeholder="Describe the technical architecture, goals, and collaboration scope..."
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.description?.message}
                      multiline
                      numberOfLines={4}
                      inputContainerStyle={styles.descriptionContainer}
                      inputStyle={styles.descriptionInput}
                      maxLength={1000}
                    />
                  )}
                />

                {/* 3. Status Selector */}
                <View style={styles.statusSection}>
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
                    Project Status
                  </Text>

                  <SegmentedControl<ProjectStatus>
                    options={STATUS_OPTIONS}
                    value={selectedStatus}
                    onChange={(val) => setValue('status', val, { shouldValidate: true })}
                    size="sm"
                  />
                </View>

                {/* 4. Repository URL */}
                <Controller
                  control={control}
                  name="repository_url"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Repository URL (Optional)"
                      placeholder="https://github.com/organization/repository"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.repository_url?.message}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
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

                {/* 5. Live Project URL */}
                <Controller
                  control={control}
                  name="live_url"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Live Project URL (Optional)"
                      placeholder="https://yourproject.dev"
                      value={value || ''}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.live_url?.message}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="url"
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

                {/* 6. Skills Selection */}
                <View style={styles.skillsSection}>
                  <View style={styles.skillsHeaderRow}>
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
                      Project Skills
                    </Text>
                    <Text
                      style={[
                        styles.skillsCounter,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {selectedSkillIds.length} selected
                    </Text>
                  </View>

                  <Text
                    style={[
                      styles.skillsNotice,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                        marginBottom: theme.spacing.sm,
                      },
                    ]}
                  >
                    Select relevant skills from the global directory to help collaborators discover this project.
                  </Text>

                  {/* Selected Skills Chips */}
                  {selectedSkills.length > 0 && (
                    <View style={styles.chipCluster}>
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
                              transform: [{ scale: pressed ? 0.97 : 1 }],
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webChipSelectedShadow,
                                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                } as any,
                                default: theme.clay.shadowChip,
                              }),
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipTextSelected,
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
                            name="close"
                            size={14}
                            color={theme.clay.textChipSelected}
                            style={{ marginLeft: 4 }}
                          />
                        </Pressable>
                      ))}
                    </View>
                  )}

                  {/* Skill Search Input */}
                  <View
                    style={[
                      styles.skillSearchContainer,
                      {
                        backgroundColor: theme.clay.surfaceRecessed,
                        borderColor: theme.clay.borderCard,
                        ...Platform.select({
                          web: {
                            boxShadow: theme.clay.webRecessedShadow,
                            transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                          } as any,
                        }),
                      },
                    ]}
                  >
                    <Ionicons
                      name="search-outline"
                      size={16}
                      color={theme.colors.textMuted}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      style={[
                        styles.skillSearchInput,
                        {
                          color: theme.colors.text,
                          fontSize: theme.typography.sizes.sm,
                        },
                        Platform.OS === 'web' && ({ outlineStyle: 'none' } as any),
                      ]}
                      placeholder="Filter skills..."
                      placeholderTextColor={theme.colors.textMuted}
                      value={skillSearch}
                      onChangeText={setSkillSearch}
                    />
                    {skillSearch.length > 0 && (
                      <Pressable onPress={() => setSkillSearch('')}>
                        <Ionicons name="close-circle" size={16} color={theme.colors.textMuted} />
                      </Pressable>
                    )}
                  </View>

                  {/* Available Suggested Skills */}
                  {isLoadingSkills ? (
                    <View style={styles.skillsLoadingRow}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text
                        style={[
                          styles.skillsLoadingText,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                            marginLeft: 8,
                          },
                        ]}
                      >
                        Loading skills directory...
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.chipCluster}>
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
                              transform: [{ scale: pressed ? 0.97 : 1 }],
                              ...Platform.select({
                                web: {
                                  boxShadow: theme.clay.webChipShadow,
                                  transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                } as any,
                                default: theme.clay.shadowChip,
                              }),
                            },
                          ]}
                        >
                          <Ionicons
                            name="add"
                            size={12}
                            color={theme.clay.textChipSuggested}
                            style={{ marginRight: 3 }}
                          />

                          <Text
                            style={[
                              styles.chipTextSuggested,
                              {
                                color: theme.clay.textChipSuggested,
                                fontSize: theme.typography.sizes.xs,
                              },
                            ]}
                          >
                            {skill.name}
                          </Text>
                        </Pressable>
                      ))}
                      {suggestedSkills.length === 0 && skillSearch.trim().length > 0 && (
                        <Text
                          style={[
                            styles.noSkillsNotice,
                            {
                              color: theme.colors.textMuted,
                              fontSize: theme.typography.sizes.xs,
                            },
                          ]}
                        >
                          No matching skills found in directory.
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>

              {/* Form Action Controls */}
              <View style={styles.buttonContainer}>
                <Button
                  title={
                    isSuccess
                      ? 'Project Created!'
                      : createProjectMutation.isPending
                      ? 'Creating Project...'
                      : 'Create Project'
                  }
                  variant="clayPrimary"
                  size="lg"
                  loading={createProjectMutation.isPending || isSuccess}
                  disabled={createProjectMutation.isPending || isSuccess || !titleValue.trim()}
                  onPress={handleSubmit(onSubmit)}
                  leftIcon={
                    !createProjectMutation.isPending && !isSuccess ? (
                      <Ionicons name="add" size={18} color="#FFFFFF" />
                    ) : undefined
                  }
                />

                <Button
                  title="Cancel"
                  variant="ghost"
                  size="md"
                  disabled={createProjectMutation.isPending || isSuccess}
                  onPress={() => router.back()}
                  style={{ marginTop: 6 }}
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
  scrollContent: {
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topBarTitleContainer: {
    alignItems: 'center',
  },
  topBarTitle: {},
  topBarRightSlot: {
    width: 38,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  cardContainer: {
    borderRadius: 24,
  },
  formHeader: {
    marginBottom: 20,
  },
  formTitle: {
    marginBottom: 6,
  },
  formSubtitle: {
    lineHeight: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 18,
    gap: 8,
  },
  errorBannerText: {
    flex: 1,
  },
  fieldsContainer: {
    gap: 18,
  },
  slugPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    marginLeft: 2,
  },
  slugPreviewText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
  },
  descriptionContainer: {
    height: 104,
    alignItems: 'flex-start',
    paddingVertical: 10,
  },
  descriptionInput: {
    height: 84,
    textAlignVertical: 'top',
  },
  fieldLabel: {
    marginBottom: 6,
  },
  statusSection: {},
  statusTrack: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    padding: 4,
    gap: 4,
  },
  statusPill: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  statusPillText: {},
  skillsSection: {
    marginTop: 4,
  },
  skillsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsCounter: {},
  skillsNotice: {},
  chipCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 6,
  },
  chipSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipTextSelected: {},
  chipSuggested: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
  },
  chipTextSuggested: {},
  noSkillsNotice: {
    fontStyle: 'italic',
    paddingVertical: 4,
  },
  skillSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 40,
    marginVertical: 6,
  },
  skillSearchInput: {
    flex: 1,
    height: '100%',
    padding: 0,
  },
  skillsLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  skillsLoadingText: {},
  buttonContainer: {
    marginTop: 28,
    gap: 8,
  },
});
