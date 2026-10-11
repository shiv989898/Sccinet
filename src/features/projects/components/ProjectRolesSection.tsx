import React, { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { AnimatedEntrance, Avatar, Badge, Button, Card, Input } from '../../../components/ui';
import { Profile, ProjectMember, ProjectRole, Skill } from '../../../types/database';

interface ProjectRolesSectionProps {
  roles?: (ProjectRole & { skills?: Skill[] })[];
  members?: (ProjectMember & { profile?: Profile; role?: ProjectRole | null })[];
  allSkills?: Skill[];
  isOwner: boolean;
  onSaveRole: (data: {
    id?: string | null;
    title: string;
    description: string;
    skillIds: string[];
  }) => Promise<void>;
  onDeleteRole: (roleId: string) => Promise<void>;
  isSavingRole?: boolean;
  onProfilePress?: (profileId: string) => void;
}

export function ProjectRolesSection({
  roles = [],
  members = [],
  allSkills = [],
  isOwner,
  onSaveRole,
  onDeleteRole,
  isSavingRole = false,
  onProfilePress,
}: ProjectRolesSectionProps) {
  const theme = useTheme();

  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleSkillIds, setRoleSkillIds] = useState<string[]>([]);
  const [roleSkillSearch, setRoleSkillSearch] = useState('');
  const [actionError, setActionError] = useState<string | null>(null);

  const handleToggleSkill = (skillId: string) => {
    if (roleSkillIds.includes(skillId)) {
      setRoleSkillIds(roleSkillIds.filter((sid) => sid !== skillId));
    } else {
      setRoleSkillIds([...roleSkillIds, skillId]);
    }
  };

  const handleStartEdit = (role: ProjectRole & { skills?: Skill[] }) => {
    setEditingRoleId(role.id);
    setRoleTitle(role.title);
    setRoleDescription(role.description || '');
    setRoleSkillIds((role.skills || []).map((s) => s.id));
    setIsAddingRole(true);
    setActionError(null);
  };

  const handleCloseForm = () => {
    setIsAddingRole(false);
    setEditingRoleId(null);
    setRoleTitle('');
    setRoleDescription('');
    setRoleSkillIds([]);
    setActionError(null);
  };

  const handleSave = async () => {
    setActionError(null);
    if (roleTitle.trim().length < 2) {
      setActionError('Role title must be at least 2 characters');
      return;
    }

    try {
      await onSaveRole({
        id: editingRoleId,
        title: roleTitle.trim(),
        description: roleDescription.trim(),
        skillIds: roleSkillIds,
      });
      handleCloseForm();
    } catch (err: any) {
      setActionError(err?.message || 'Failed to save role');
    }
  };

  const handleDelete = (roleId: string) => {
    const executeDelete = async () => {
      try {
        await onDeleteRole(roleId);
      } catch (err: any) {
        Alert.alert('Error', err?.message || 'Failed to delete role');
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to remove this project role?')) {
        executeDelete();
      }
    } else {
      Alert.alert('Delete Role', 'Are you sure you want to remove this project role?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: executeDelete },
      ]);
    }
  };

  const handleMemberPress = (profileId: string) => {
    if (onProfilePress) {
      onProfilePress(profileId);
    } else {
      router.push({
        pathname: '/profiles/[id]' as any,
        params: { id: profileId },
      });
    }
  };

  return (
    <Card variant="clay" padding="lg" style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <Text
          style={[
            styles.sectionHeading,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.semibold,
            },
          ]}
        >
          Project Roles
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {roles.length > 0 && (
            <Text
              style={[
                styles.sectionCountText,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {roles.length} roles
            </Text>
          )}

          {isOwner && !isAddingRole && (
            <Button
              title="+ Add Role"
              variant="claySecondary"
              size="sm"
              onPress={() => {
                setIsAddingRole(true);
                setEditingRoleId(null);
                setRoleTitle('');
                setRoleDescription('');
                setRoleSkillIds([]);
              }}
            />
          )}
        </View>
      </View>

      {/* Role Creation / Editing Form */}
      {isOwner && isAddingRole && (
        <AnimatedEntrance duration={200}>
          <View
            style={[
              styles.inlineFormCard,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.clay.borderCard,
              },
            ]}
          >
            <Text
              style={[
                styles.inlineFormTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
            >
              {editingRoleId ? 'Edit Project Role' : 'Create New Project Role'}
            </Text>

            {actionError && (
              <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                {actionError}
              </Text>
            )}

            <Input
              label="Role Title"
              placeholder="e.g. Lead Frontend Architect"
              value={roleTitle}
              onChangeText={setRoleTitle}
            />

            <Input
              label="Role Description"
              placeholder="Responsibilities and expectations for this role..."
              value={roleDescription}
              onChangeText={setRoleDescription}
              multiline
              numberOfLines={2}
            />

            {/* Required Skills for Role */}
            <Text
              style={[
                styles.modalFieldLabel,
                { color: theme.colors.textSecondary, fontSize: 12, marginTop: 4 },
              ]}
            >
              Required Skills
            </Text>

            <View
              style={[
                styles.searchBoxSmall,
                {
                  backgroundColor: theme.clay.surface,
                  borderColor: theme.clay.borderRecessed,
                },
              ]}
            >
              <Ionicons name="search" size={14} color={theme.colors.textMuted} />
              <TextInput
                placeholder="Filter skills..."
                placeholderTextColor={theme.colors.textMuted}
                value={roleSkillSearch}
                onChangeText={setRoleSkillSearch}
                style={[styles.searchInputSmall, { color: theme.colors.text }]}
              />
            </View>

            <View style={styles.roleSkillsSelectRow}>
              {allSkills
                .filter((s) =>
                  s.name.toLowerCase().includes(roleSkillSearch.toLowerCase().trim())
                )
                .slice(0, 12)
                .map((skill) => {
                  const isSelected = roleSkillIds.includes(skill.id);
                  return (
                    <Pressable
                      key={skill.id}
                      onPress={() => handleToggleSkill(skill.id)}
                      style={[
                        styles.roleSkillSelectPill,
                        isSelected
                          ? {
                              backgroundColor: theme.clay.surfaceChipSelected,
                              borderColor: theme.clay.borderChipSelected,
                            }
                          : {
                              backgroundColor: theme.clay.surfaceChipSuggested,
                              borderColor: theme.clay.borderChipSuggested,
                            },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 11,
                          color: isSelected
                            ? theme.clay.textChipSelected
                            : theme.clay.textChipSuggested,
                          fontWeight: isSelected ? '600' : '400',
                        }}
                      >
                        {skill.name}
                      </Text>
                    </Pressable>
                  );
                })}
            </View>

            <View style={styles.inlineFormActions}>
              <Button
                title="Cancel"
                variant="ghost"
                size="sm"
                onPress={handleCloseForm}
              />
              <Button
                title={editingRoleId ? 'Save Changes' : 'Create Role'}
                variant="clayPrimary"
                size="sm"
                loading={isSavingRole}
                onPress={handleSave}
              />
            </View>
          </View>
        </AnimatedEntrance>
      )}

      {/* Roles List */}
      {roles.length > 0 ? (
        <View style={styles.rolesList}>
          {roles.map((role) => {
            const assignedMember = members.find((m) => m.role_id === role.id);

            return (
              <View
                key={role.id}
                style={[
                  styles.roleItem,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                    ...Platform.select({
                      web: {
                        boxShadow: theme.clay.webRecessedShadow,
                      } as any,
                    }),
                  },
                ]}
              >
                <View style={styles.roleItemHeader}>
                  <Text
                    style={[
                      styles.roleTitle,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    {role.title}
                  </Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {assignedMember ? (
                      <Badge label="Assigned" variant="success" size="sm" />
                    ) : (
                      <Badge label="Open" variant="outline" size="sm" />
                    )}

                    {isOwner && (
                      <View style={styles.roleOwnerActions}>
                        <Pressable
                          onPress={() => handleStartEdit(role)}
                          style={styles.iconActionBtn}
                          hitSlop={6}
                        >
                          <Ionicons
                            name="pencil-outline"
                            size={15}
                            color={theme.colors.textSecondary}
                          />
                        </Pressable>
                        <Pressable
                          onPress={() => handleDelete(role.id)}
                          style={styles.iconActionBtn}
                          hitSlop={6}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={15}
                            color={theme.colors.error}
                          />
                        </Pressable>
                      </View>
                    )}
                  </View>
                </View>

                {role.description ? (
                  <Text
                    style={[
                      styles.roleDescription,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    {role.description}
                  </Text>
                ) : null}

                {role.skills && role.skills.length > 0 && (
                  <View style={styles.roleSkillsCluster}>
                    {role.skills.map((s) => (
                      <View
                        key={s.id}
                        style={[
                          styles.roleSkillTag,
                          {
                            backgroundColor: theme.clay.surface,
                            borderColor: theme.clay.borderCard,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.roleSkillTagText,
                            {
                              color: theme.colors.textSecondary,
                              fontSize: 11,
                            },
                          ]}
                        >
                          {s.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}

                {assignedMember?.profile && (
                  <Pressable
                    onPress={() => handleMemberPress(assignedMember.profile_id)}
                    style={styles.assignedMemberRow}
                  >
                    <Avatar
                      url={assignedMember.profile.avatar_url}
                      name={
                        assignedMember.profile.full_name ||
                        assignedMember.profile.username
                      }
                      size="sm"
                    />
                    <Text
                      style={[
                        styles.assignedMemberName,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      Assigned to{' '}
                      <Text
                        style={{
                          color: theme.colors.primary,
                          fontWeight: theme.typography.weights.medium,
                        }}
                      >
                        {assignedMember.profile.full_name ||
                          assignedMember.profile.username}
                      </Text>
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      ) : (
        <Text
          style={[
            styles.emptySectionText,
            {
              color: theme.colors.textMuted,
              fontSize: theme.typography.sizes.xs,
            },
          ]}
        >
          No specific roles defined for this project.
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    letterSpacing: -0.2,
  },
  sectionCountText: {
    fontWeight: '500',
  },
  inlineFormCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  inlineFormTitle: {
    marginBottom: 10,
  },
  inlineError: {
    fontSize: 12,
    marginBottom: 8,
  },
  modalFieldLabel: {
    marginBottom: 6,
    fontWeight: '500',
  },
  searchBoxSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    gap: 6,
  },
  searchInputSmall: {
    flex: 1,
    fontSize: 12,
    padding: 0,
  },
  roleSkillsSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  roleSkillSelectPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  inlineFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  rolesList: {
    gap: 10,
  },
  roleItem: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  roleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleTitle: {
    flex: 1,
    marginRight: 8,
  },
  roleOwnerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 6,
  },
  iconActionBtn: {
    padding: 4,
  },
  roleDescription: {
    lineHeight: 18,
    marginBottom: 8,
  },
  roleSkillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  roleSkillTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleSkillTagText: {},
  assignedMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  assignedMemberName: {},
  emptySectionText: {
    fontStyle: 'italic',
    paddingVertical: 6,
  },
});
