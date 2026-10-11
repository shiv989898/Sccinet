import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';
import { AnimatedEntrance, Avatar, Badge, Button, Card, Input } from '../../../components/ui';
import { ProjectWithDetails } from '../../../types/database';

interface ProjectMembersSectionProps {
  project: ProjectWithDetails;
  isOwner: boolean;
  currentUserId?: string;
  onAddMemberByUsername: (username: string, roleId: string | null) => Promise<void>;
  onChangeMemberRole: (profileId: string, roleId: string | null) => Promise<void>;
  onRemoveMember: (profileId: string, memberName: string) => Promise<void>;
  isAddingMemberMutationPending?: boolean;
  onProfilePress?: (profileId: string) => void;
}

export function ProjectMembersSection({
  project,
  isOwner,
  currentUserId,
  onAddMemberByUsername,
  onChangeMemberRole,
  onRemoveMember,
  isAddingMemberMutationPending = false,
  onProfilePress,
}: ProjectMembersSectionProps) {
  const theme = useTheme();

  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberUsername, setMemberUsername] = useState('');
  const [memberRoleId, setMemberRoleId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSearchingMember, setIsSearchingMember] = useState(false);
  const [editingMemberRoleFor, setEditingMemberRoleFor] = useState<string | null>(null);

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const handleProfileNavigation = (profileId: string) => {
    if (onProfilePress) {
      onProfilePress(profileId);
    } else {
      router.push({
        pathname: '/profiles/[id]' as any,
        params: { id: profileId },
      });
    }
  };

  const handleAddMember = async () => {
    setActionError(null);
    if (!memberUsername.trim()) {
      setActionError('Please enter a username');
      return;
    }

    try {
      setIsSearchingMember(true);
      await onAddMemberByUsername(memberUsername.trim(), memberRoleId);
      setIsSearchingMember(false);
      setIsAddingMember(false);
      setMemberUsername('');
      setMemberRoleId(null);
    } catch (err: any) {
      setIsSearchingMember(false);
      setActionError(err?.message || 'Failed to add member');
    }
  };

  const members = project.members || [];

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
          Project Team
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {members.length > 0 && (
            <Text
              style={[
                styles.sectionCountText,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {members.length} {members.length === 1 ? 'member' : 'members'}
            </Text>
          )}

          {isOwner && !isAddingMember && (
            <Button
              title="+ Add Member"
              variant="claySecondary"
              size="sm"
              onPress={() => {
                setIsAddingMember(true);
                setMemberUsername('');
                setMemberRoleId(null);
                setActionError(null);
              }}
            />
          )}
        </View>
      </View>

      {/* Add Member Form */}
      {isOwner && isAddingMember && (
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
              Add Member by Username
            </Text>

            {actionError && (
              <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                {actionError}
              </Text>
            )}

            <Input
              label="Username"
              placeholder="e.g. alexrivera"
              value={memberUsername}
              onChangeText={setMemberUsername}
              autoCapitalize="none"
              autoCorrect={false}
              leftAccessory={
                <Text style={{ color: theme.colors.textMuted, marginRight: 4 }}>@</Text>
              }
            />

            {project.roles && project.roles.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={[
                    styles.modalFieldLabel,
                    { color: theme.colors.textSecondary, fontSize: 12 },
                  ]}
                >
                  Assign to Role (Optional)
                </Text>
                <View style={styles.rolePickerRow}>
                  <Pressable
                    onPress={() => setMemberRoleId(null)}
                    style={[
                      styles.rolePickerPill,
                      !memberRoleId && {
                        backgroundColor: theme.clay.surfaceChipSelected,
                        borderColor: theme.clay.borderChipSelected,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: !memberRoleId
                          ? theme.clay.textChipSelected
                          : theme.colors.textSecondary,
                        fontWeight: !memberRoleId ? '600' : '400',
                      }}
                    >
                      None
                    </Text>
                  </Pressable>
                  {project.roles.map((r) => (
                    <Pressable
                      key={r.id}
                      onPress={() => setMemberRoleId(r.id)}
                      style={[
                        styles.rolePickerPill,
                        memberRoleId === r.id && {
                          backgroundColor: theme.clay.surfaceChipSelected,
                          borderColor: theme.clay.borderChipSelected,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color:
                            memberRoleId === r.id
                              ? theme.clay.textChipSelected
                              : theme.colors.textSecondary,
                          fontWeight: memberRoleId === r.id ? '600' : '400',
                        }}
                      >
                        {r.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <View style={styles.inlineFormActions}>
              <Button
                title="Cancel"
                variant="ghost"
                size="sm"
                onPress={() => setIsAddingMember(false)}
              />
              <Button
                title="Add Member"
                variant="clayPrimary"
                size="sm"
                loading={isSearchingMember || isAddingMemberMutationPending}
                onPress={handleAddMember}
              />
            </View>
          </View>
        </AnimatedEntrance>
      )}

      {/* Members List */}
      {members.length > 0 ? (
        <View style={styles.membersList}>
          {members.map((member) => {
            const isMemberOwner = member.profile_id === project.owner_id;
            const profile = member.profile;
            const isSelf = currentUserId === member.profile_id;
            const isEditingRole = editingMemberRoleFor === member.profile_id;

            return (
              <View
                key={member.profile_id}
                style={[
                  styles.memberRow,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <Pressable
                  onPress={() => handleProfileNavigation(member.profile_id)}
                  style={({ pressed }) => [
                    styles.avatarPressable,
                    { opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Avatar
                    url={profile?.avatar_url}
                    name={profile?.full_name || profile?.username || 'Member'}
                    size="md"
                  />
                </Pressable>

                <View style={styles.memberInfo}>
                  <View style={styles.memberNameRow}>
                    <Pressable
                      onPress={() => handleProfileNavigation(member.profile_id)}
                      hitSlop={4}
                    >
                      <Text
                        style={[
                          styles.memberName,
                          {
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.sm,
                            fontWeight: theme.typography.weights.semibold,
                          },
                        ]}
                      >
                        {profile?.full_name || profile?.username || 'Builder'}
                      </Text>
                    </Pressable>

                    {isMemberOwner ? (
                      <Badge label="Owner" variant="primary" size="sm" />
                    ) : member.role?.title ? (
                      <Badge label={member.role.title} variant="default" size="sm" />
                    ) : null}
                  </View>

                  {profile?.username ? (
                    <Text
                      style={[
                        styles.memberHandle,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      @{profile.username}
                    </Text>
                  ) : null}

                  {profile?.headline ? (
                    <Text
                      style={[
                        styles.memberHeadline,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                      numberOfLines={1}
                    >
                      {profile.headline}
                    </Text>
                  ) : null}

                  {member.joined_at ? (
                    <Text
                      style={[
                        styles.memberJoinedText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: 11,
                        },
                      ]}
                    >
                      Joined {formatJoinedDate(member.joined_at)}
                    </Text>
                  ) : null}

                  {/* Owner role assignment switcher */}
                  {isOwner && !isMemberOwner && isEditingRole && (
                    <View style={styles.roleAssignmentPicker}>
                      <Text
                        style={{
                          fontSize: 11,
                          color: theme.colors.textSecondary,
                          marginBottom: 4,
                        }}
                      >
                        Select role:
                      </Text>
                      <View style={styles.rolePickerRow}>
                        <Pressable
                          onPress={() =>
                            onChangeMemberRole(member.profile_id, null)
                          }
                          style={[
                            styles.rolePickerPill,
                            !member.role_id && {
                              backgroundColor: theme.clay.surfaceChipSelected,
                            },
                          ]}
                        >
                          <Text style={{ fontSize: 11 }}>No Role</Text>
                        </Pressable>
                        {(project.roles || []).map((r) => (
                          <Pressable
                            key={r.id}
                            onPress={() =>
                              onChangeMemberRole(member.profile_id, r.id)
                            }
                            style={[
                              styles.rolePickerPill,
                              member.role_id === r.id && {
                                backgroundColor: theme.clay.surfaceChipSelected,
                              },
                            ]}
                          >
                            <Text style={{ fontSize: 11 }}>{r.title}</Text>
                          </Pressable>
                        ))}
                      </View>
                    </View>
                  )}
                </View>

                {/* Member actions */}
                {!isMemberOwner && (
                  <View style={styles.memberActionColumn}>
                    {isOwner && (
                      <>
                        <Pressable
                          onPress={() =>
                            setEditingMemberRoleFor(
                              isEditingRole ? null : member.profile_id
                            )
                          }
                          style={styles.memberTextBtn}
                          hitSlop={6}
                        >
                          <Text
                            style={{
                              color: theme.colors.primary,
                              fontSize: 11,
                              fontWeight: '500',
                            }}
                          >
                            {isEditingRole ? 'Done' : 'Change Role'}
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() =>
                            onRemoveMember(
                              member.profile_id,
                              profile?.full_name || profile?.username || 'member'
                            )
                          }
                          style={styles.memberTextBtn}
                          hitSlop={6}
                        >
                          <Text
                            style={{
                              color: theme.colors.error,
                              fontSize: 11,
                              fontWeight: '500',
                            }}
                          >
                            Remove
                          </Text>
                        </Pressable>
                      </>
                    )}

                    {!isOwner && isSelf && (
                      <Pressable
                        onPress={() =>
                          onRemoveMember(member.profile_id, 'yourself')
                        }
                        style={styles.memberTextBtn}
                        hitSlop={6}
                      >
                        <Text
                          style={{
                            color: theme.colors.error,
                            fontSize: 11,
                            fontWeight: '500',
                          }}
                        >
                          Leave
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      ) : project.owner ? (
        <Pressable
          onPress={() => handleProfileNavigation(project.owner_id)}
          style={[
            styles.memberRow,
            {
              backgroundColor: theme.clay.surfaceRecessed,
              borderColor: theme.clay.borderCard,
            },
          ]}
        >
          <Avatar
            url={project.owner.avatar_url}
            name={project.owner.full_name || project.owner.username}
            size="md"
          />

          <View style={styles.memberInfo}>
            <View style={styles.memberNameRow}>
              <Text
                style={[
                  styles.memberName,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                {project.owner.full_name || project.owner.username}
              </Text>
              <Badge label="Owner" variant="primary" size="sm" />
            </View>
            <Text
              style={[
                styles.memberHandle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              @{project.owner.username}
            </Text>
          </View>
        </Pressable>
      ) : null}
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
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rolePickerPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inlineFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  membersList: {
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  avatarPressable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    marginBottom: 2,
  },
  memberName: {},
  memberHandle: {
    marginBottom: 2,
  },
  memberHeadline: {
    marginBottom: 4,
  },
  memberJoinedText: {
    marginTop: 2,
  },
  roleAssignmentPicker: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  memberActionColumn: {
    alignItems: 'flex-end',
    gap: 6,
    justifyContent: 'center',
  },
  memberTextBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
});
