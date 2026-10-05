import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Avatar, Badge, Button, Card, Input, SkeletonLoader } from '../../src/components/ui';
import { BadgeVariant } from '../../src/components/ui/Badge';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useAvailableSkills } from '../../src/features/profiles/useProfile';
import { profileService } from '../../src/services/profiles/profileService';
import {
  useAddProjectMember,
  useAddRoleSkill,
  useCreateCollaborationRequest,
  useCreateProjectRole,
  useDeleteProjectRole,
  useProject,
  useProjectCollaborationRequests,
  useRemoveProjectMember,
  useRemoveRoleSkill,
  useUpdateCollaborationRequestStatus,
  useUpdateProjectMemberRole,
  useUpdateProjectRole,
  useWithdrawCollaborationRequest,
} from '../../src/features/projects';
import { ProjectRole, Skill } from '../../src/types/database';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const { user } = useAuth();

  const { data: project, isLoading, error } = useProject(id);
  const { data: allSkills = [] } = useAvailableSkills();
  const { data: collabRequests = [] } = useProjectCollaborationRequests(id);

  // Mutations
  const createRoleMutation = useCreateProjectRole(id || '');
  const updateRoleMutation = useUpdateProjectRole(id || '');
  const deleteRoleMutation = useDeleteProjectRole(id || '');
  const addRoleSkillMutation = useAddRoleSkill(id || '');
  const removeRoleSkillMutation = useRemoveRoleSkill(id || '');
  const addMemberMutation = useAddProjectMember(id || '');
  const removeMemberMutation = useRemoveProjectMember(id || '');
  const updateMemberRoleMutation = useUpdateProjectMemberRole(id || '');
  const createRequestMutation = useCreateCollaborationRequest(id || '');
  const updateRequestStatusMutation = useUpdateCollaborationRequestStatus(id || '');
  const withdrawRequestMutation = useWithdrawCollaborationRequest(id || '');

  // UI state for Role creation/editing
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [roleSkillIds, setRoleSkillIds] = useState<string[]>([]);
  const [roleSkillSearch, setRoleSkillSearch] = useState('');
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [roleActionError, setRoleActionError] = useState<string | null>(null);

  // UI state for Member management
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberUsername, setMemberUsername] = useState('');
  const [memberRoleId, setMemberRoleId] = useState<string | null>(null);
  const [memberActionError, setMemberActionError] = useState<string | null>(null);
  const [isSearchingMember, setIsSearchingMember] = useState(false);
  const [editingMemberRoleFor, setEditingMemberRoleFor] = useState<string | null>(null);

  // UI state for Collaboration Request (non-owner)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requestedRoleId, setRequestedRoleId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestError, setRequestError] = useState<string | null>(null);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const isOwner = Boolean(user?.id && project?.owner_id && user.id === project.owner_id);
  const isMember = Boolean(
    user?.id && project?.members?.some((m) => m.profile_id === user.id)
  );

  // Pending request for current user
  const myPendingRequest = collabRequests.find(
    (r) => r.user_id === user?.id && r.status === 'PENDING'
  );

  // Pending requests for project owner
  const pendingRequests = collabRequests.filter((r) => r.status === 'PENDING');

  const getStatusBadgeVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'ARCHIVED':
      default:
        return 'default';
    }
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Gracefully handle invalid or unopenable link
    }
  };

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

  // Role actions
  const handleToggleRoleSkill = (skillId: string) => {
    if (roleSkillIds.includes(skillId)) {
      setRoleSkillIds(roleSkillIds.filter((sid) => sid !== skillId));
    } else {
      setRoleSkillIds([...roleSkillIds, skillId]);
    }
  };

  const handleSaveRole = async () => {
    setRoleActionError(null);
    if (roleTitle.trim().length < 2) {
      setRoleActionError('Role title must be at least 2 characters');
      return;
    }

    try {
      if (editingRoleId) {
        // Update existing role
        await updateRoleMutation.mutateAsync({
          roleId: editingRoleId,
          updates: {
            title: roleTitle.trim(),
            description: roleDescription.trim() || null,
          },
        });

        // Sync role skills
        const existingRole = project?.roles?.find((r) => r.id === editingRoleId);
        const currentSkillIds = (existingRole?.skills || []).map((s) => s.id);
        const toAdd = roleSkillIds.filter((sid) => !currentSkillIds.includes(sid));
        const toRemove = currentSkillIds.filter((sid) => !roleSkillIds.includes(sid));

        for (const sid of toAdd) {
          await addRoleSkillMutation.mutateAsync({ roleId: editingRoleId, skillId: sid });
        }
        for (const sid of toRemove) {
          await removeRoleSkillMutation.mutateAsync({ roleId: editingRoleId, skillId: sid });
        }
      } else {
        // Create new role
        const createdRole = await createRoleMutation.mutateAsync({
          title: roleTitle.trim(),
          description: roleDescription.trim() || null,
        });

        if (createdRole && roleSkillIds.length > 0) {
          for (const sid of roleSkillIds) {
            await addRoleSkillMutation.mutateAsync({ roleId: createdRole.id, skillId: sid });
          }
        }
      }

      setIsAddingRole(false);
      setEditingRoleId(null);
      setRoleTitle('');
      setRoleDescription('');
      setRoleSkillIds([]);
    } catch (err: any) {
      setRoleActionError(err.message || 'Failed to save role');
    }
  };

  const handleStartEditRole = (role: ProjectRole & { skills?: Skill[] }) => {
    setEditingRoleId(role.id);
    setRoleTitle(role.title);
    setRoleDescription(role.description || '');
    setRoleSkillIds((role.skills || []).map((s) => s.id));
    setIsAddingRole(true);
    setRoleActionError(null);
  };

  const handleDeleteRole = async (roleId: string) => {
    const executeDelete = async () => {
      try {
        await deleteRoleMutation.mutateAsync(roleId);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to delete role');
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

  // Member actions
  const handleAddMemberByUsername = async () => {
    setMemberActionError(null);
    if (!memberUsername.trim()) {
      setMemberActionError('Please enter a username');
      return;
    }

    try {
      setIsSearchingMember(true);
      const cleanUsername = memberUsername.trim().toLowerCase().replace(/^@/, '');
      const { data: foundProfile, error: searchError } =
        await profileService.getProfileByUsername(cleanUsername);

      if (searchError || !foundProfile) {
        setMemberActionError(`No user found with username @${cleanUsername}`);
        setIsSearchingMember(false);
        return;
      }

      // Check if already a member
      if (project?.members?.some((m) => m.profile_id === foundProfile.id)) {
        setMemberActionError(`@${cleanUsername} is already a member of this project`);
        setIsSearchingMember(false);
        return;
      }

      await addMemberMutation.mutateAsync({
        profileId: foundProfile.id,
        roleId: memberRoleId || null,
      });

      setIsSearchingMember(false);
      setIsAddingMember(false);
      setMemberUsername('');
      setMemberRoleId(null);
    } catch (err: any) {
      setIsSearchingMember(false);
      setMemberActionError(err.message || 'Failed to add member');
    }
  };

  const handleChangeMemberRole = async (profileId: string, roleId: string | null) => {
    try {
      await updateMemberRoleMutation.mutateAsync({ profileId, roleId });
      setEditingMemberRoleFor(null);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update member role');
    }
  };

  const handleRemoveMember = async (profileId: string, memberName: string) => {
    const executeRemove = async () => {
      try {
        await removeMemberMutation.mutateAsync(profileId);
      } catch (err: any) {
        Alert.alert('Error', err.message || 'Failed to remove member');
      }
    };

    const confirmMsg =
      profileId === user?.id
        ? 'Are you sure you want to leave this project?'
        : `Remove ${memberName} from this project?`;

    if (Platform.OS === 'web') {
      if (window.confirm(confirmMsg)) {
        executeRemove();
      }
    } else {
      Alert.alert('Remove Member', confirmMsg, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', style: 'destructive', onPress: executeRemove },
      ]);
    }
  };

  // Collaboration request actions
  const handleSubmitCollabRequest = async () => {
    setRequestError(null);
    try {
      await createRequestMutation.mutateAsync({
        roleId: requestedRoleId || null,
        message: requestMessage.trim() || null,
      });

      setRequestSuccess(true);
      setTimeout(() => {
        setIsRequestModalOpen(false);
        setRequestSuccess(false);
        setRequestMessage('');
        setRequestedRoleId(null);
      }, 1000);
    } catch (err: any) {
      setRequestError(err.message || 'Failed to send collaboration request');
    }
  };

  const handleWithdrawRequest = async (requestId: string) => {
    try {
      await withdrawRequestMutation.mutateAsync(requestId);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to withdraw request');
    }
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      await updateRequestStatusMutation.mutateAsync({ requestId, status });
    } catch (err: any) {
      Alert.alert('Error', err.message || `Failed to ${status.toLowerCase()} request`);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Top Bar - Anchored and instantly interactive */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/workspace');
            }
          }}
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
            Project Details
          </Text>
        </View>

        {isOwner ? (
          <Pressable
            onPress={() =>
              router.push({
                pathname: '/projects/edit',
                params: { id: id! },
              })
            }
            style={({ pressed }) => [
              styles.editButtonPill,
              {
                backgroundColor: theme.clay.surface,
                borderColor: theme.clay.borderCard,
                opacity: pressed ? 0.85 : 1,
                transform: pressed ? [{ scale: 0.96 }] : [],
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
            <Ionicons name="pencil" size={14} color={theme.colors.primary} />
            <Text
              style={[
                styles.editButtonText,
                { color: theme.colors.primary, fontSize: theme.typography.sizes.xs },
              ]}
            >
              Edit
            </Text>
          </Pressable>
        ) : (
          <View style={styles.topBarRightSlot} />
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={[styles.centerContainer, { gap: 16 }]}>
            <Card variant="clay" padding="lg">
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <SkeletonLoader width={65} height={20} borderRadius={10} />
                  <SkeletonLoader width={120} height={14} borderRadius={4} />
                </View>
                <SkeletonLoader width="70%" height={26} borderRadius={6} />
                <SkeletonLoader width="95%" height={15} borderRadius={4} />
                <SkeletonLoader width="80%" height={15} borderRadius={4} />
              </View>
            </Card>

            <Card variant="clay" padding="lg">
              <View style={{ gap: 12 }}>
                <SkeletonLoader width={80} height={18} borderRadius={6} />
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  <SkeletonLoader width={70} height={24} borderRadius={12} />
                  <SkeletonLoader width={90} height={24} borderRadius={12} />
                  <SkeletonLoader width={60} height={24} borderRadius={12} />
                </View>
              </View>
            </Card>

            <Card variant="clay" padding="lg">
              <View style={{ gap: 12 }}>
                <SkeletonLoader width={100} height={18} borderRadius={6} />
                <SkeletonLoader width="100%" height={40} borderRadius={10} />
              </View>
            </Card>
          </View>
        ) : error || !project ? (
          <View style={styles.errorContainer}>
            <Card variant="clay" padding="lg" style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={44} color={theme.colors.error} />
              <Text
                style={[
                  styles.errorTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Project Not Found
              </Text>
              <Text
                style={[
                  styles.errorSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                The requested project could not be located or may have been removed.
              </Text>

              <Button
                title="Return to Workspace"
                variant="clayPrimary"
                size="md"
                onPress={() => router.replace('/(tabs)/workspace')}
                style={{ marginTop: 14 }}
              />
            </Card>
          </View>
        ) : (
          <AnimatedEntrance duration={180} distance={motionTokens.distance.subtle}>
            <View style={styles.centerContainer}>
              {/* 1. Project Identity Card */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.headerMetaRow}>
                  <Badge
                    label={project.status}
                    variant={getStatusBadgeVariant(project.status)}
                    size="sm"
                  />
                  <Text
                    style={[
                      styles.slugText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    /{project.slug}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.projectTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xxl,
                      fontWeight: theme.typography.weights.bold,
                    },
                  ]}
                >
                  {project.title}
                </Text>

                {project.description ? (
                  <Text
                    style={[
                      styles.projectDescription,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {project.description}
                  </Text>
                ) : null}

                {/* External Links */}
                {(project.repository_url || project.live_url) && (
                  <View style={styles.linksRow}>
                    {project.repository_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.repository_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.85 : 1,
                            transform: pressed ? [{ scale: 0.98 }, { translateY: 0.5 }] : [],
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipShadow,
                                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Ionicons
                          name="logo-github"
                          size={16}
                          color={theme.colors.text}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Repository
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}

                    {project.live_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.live_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.85 : 1,
                            transform: pressed ? [{ scale: 0.98 }, { translateY: 0.5 }] : [],
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipShadow,
                                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                                cursor: 'pointer',
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Ionicons
                          name="globe-outline"
                          size={16}
                          color={theme.colors.primary}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Live Platform
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                )}

                {/* Collaboration Bar for Non-Owners */}
                {!isOwner && user && (
                  <View style={styles.collabActionBar}>
                    {isMember ? (
                      <View style={styles.memberStatusRow}>
                        <Badge label="You are a Team Member" variant="success" size="md" />
                        <Button
                          title="Leave Project"
                          variant="ghost"
                          size="sm"
                          onPress={() => handleRemoveMember(user.id, 'yourself')}
                        />
                      </View>
                    ) : myPendingRequest ? (
                      <View style={styles.pendingRequestRow}>
                        <View style={{ flex: 1 }}>
                          <Badge label="Collaboration Request Pending" variant="warning" size="sm" />
                          {myPendingRequest.message && (
                            <Text
                              style={[
                                styles.myRequestNote,
                                { color: theme.colors.textMuted, fontSize: 11 },
                              ]}
                              numberOfLines={1}
                            >
                              Note: {myPendingRequest.message}
                            </Text>
                          )}
                        </View>
                        <Button
                          title="Withdraw"
                          variant="outline"
                          size="sm"
                          onPress={() => handleWithdrawRequest(myPendingRequest.id)}
                        />
                      </View>
                    ) : (
                      <Button
                        title="Request to Collaborate"
                        variant="clayPrimary"
                        size="md"
                        leftIcon={<Ionicons name="people" size={16} color="#FFFFFF" />}
                        onPress={() => {
                          setIsRequestModalOpen(true);
                          setRequestError(null);
                        }}
                      />
                    )}
                  </View>
                )}

                {/* Collaboration Request Dialog/Card */}
                {isRequestModalOpen && (
                  <AnimatedEntrance duration={200}>
                    <View
                      style={[
                        styles.requestModalBox,
                        {
                          backgroundColor: theme.clay.surfaceRecessed,
                          borderColor: theme.clay.borderCard,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.requestModalTitle,
                          {
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.sm,
                            fontWeight: theme.typography.weights.semibold,
                          },
                        ]}
                      >
                        Request to Join Project
                      </Text>

                      {requestError && (
                        <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                          {requestError}
                        </Text>
                      )}

                      {requestSuccess && (
                        <Text style={[styles.inlineSuccess, { color: theme.colors.success }]}>
                          Request sent successfully!
                        </Text>
                      )}

                      {project.roles && project.roles.length > 0 && (
                        <View style={{ marginBottom: 12 }}>
                          <Text
                            style={[
                              styles.modalFieldLabel,
                              { color: theme.colors.textSecondary, fontSize: 12 },
                            ]}
                          >
                            Preferred Role (Optional)
                          </Text>
                          <View style={styles.rolePickerRow}>
                            <Pressable
                              onPress={() => setRequestedRoleId(null)}
                              style={[
                                styles.rolePickerPill,
                                !requestedRoleId && {
                                  backgroundColor: theme.clay.surfaceChipSelected,
                                  borderColor: theme.clay.borderChipSelected,
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  fontSize: 12,
                                  color: !requestedRoleId
                                    ? theme.clay.textChipSelected
                                    : theme.colors.textSecondary,
                                  fontWeight: !requestedRoleId ? '600' : '400',
                                }}
                              >
                                Any Role
                              </Text>
                            </Pressable>
                            {project.roles.map((r) => (
                              <Pressable
                                key={r.id}
                                onPress={() => setRequestedRoleId(r.id)}
                                style={[
                                  styles.rolePickerPill,
                                  requestedRoleId === r.id && {
                                    backgroundColor: theme.clay.surfaceChipSelected,
                                    borderColor: theme.clay.borderChipSelected,
                                  },
                                ]}
                              >
                                <Text
                                  style={{
                                    fontSize: 12,
                                    color:
                                      requestedRoleId === r.id
                                        ? theme.clay.textChipSelected
                                        : theme.colors.textSecondary,
                                    fontWeight: requestedRoleId === r.id ? '600' : '400',
                                  }}
                                >
                                  {r.title}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        </View>
                      )}

                      <Input
                        label="Intro / Note (Optional)"
                        placeholder="Briefly state how you'd like to contribute..."
                        value={requestMessage}
                        onChangeText={setRequestMessage}
                        maxLength={500}
                        multiline
                        numberOfLines={2}
                      />

                      <View style={styles.requestModalActions}>
                        <Button
                          title="Cancel"
                          variant="ghost"
                          size="sm"
                          onPress={() => setIsRequestModalOpen(false)}
                        />
                        <Button
                          title="Send Request"
                          variant="clayPrimary"
                          size="sm"
                          loading={createRequestMutation.isPending}
                          onPress={handleSubmitCollabRequest}
                        />
                      </View>
                    </View>
                  </AnimatedEntrance>
                )}
              </Card>

              {/* 2. Collaboration Requests (Owner Only) */}
              {isOwner && (
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
                      Collaboration Requests
                    </Text>
                    <Badge
                      label={`${pendingRequests.length} pending`}
                      variant={pendingRequests.length > 0 ? 'warning' : 'outline'}
                      size="sm"
                    />
                  </View>

                  {pendingRequests.length > 0 ? (
                    <View style={styles.requestsList}>
                      {pendingRequests.map((req) => (
                        <View
                          key={req.id}
                          style={[
                            styles.requestItemCard,
                            {
                              backgroundColor: theme.clay.surfaceRecessed,
                              borderColor: theme.clay.borderCard,
                            },
                          ]}
                        >
                          <View style={styles.requestItemHeader}>
                            <Avatar
                              url={req.user?.avatar_url}
                              name={req.user?.full_name || req.user?.username || 'Requester'}
                              size="md"
                            />
                            <View style={{ flex: 1, marginLeft: 10 }}>
                              <View style={styles.requesterNameRow}>
                                <Text
                                  style={[
                                    styles.requesterName,
                                    {
                                      color: theme.colors.text,
                                      fontSize: theme.typography.sizes.sm,
                                      fontWeight: theme.typography.weights.semibold,
                                    },
                                  ]}
                                >
                                  {req.user?.full_name || req.user?.username}
                                </Text>
                                {req.role?.title && (
                                  <Badge
                                    label={`Role: ${req.role.title}`}
                                    variant="primary"
                                    size="sm"
                                  />
                                )}
                              </View>
                              <Text
                                style={{
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.xs,
                                }}
                              >
                                @{req.user?.username}
                              </Text>
                              {req.user?.headline && (
                                <Text
                                  style={{
                                    color: theme.colors.textSecondary,
                                    fontSize: theme.typography.sizes.xs,
                                    marginTop: 2,
                                  }}
                                  numberOfLines={1}
                                >
                                  {req.user.headline}
                                </Text>
                              )}
                            </View>
                          </View>

                          {req.message && (
                            <View
                              style={[
                                styles.requestMessageBox,
                                {
                                  backgroundColor: theme.clay.surface,
                                  borderColor: theme.clay.borderCard,
                                },
                              ]}
                            >
                              <Text
                                style={{
                                  color: theme.colors.textSecondary,
                                  fontSize: 12,
                                  fontStyle: 'italic',
                                }}
                              >
                                &ldquo;{req.message}&rdquo;
                              </Text>
                            </View>
                          )}

                          <View style={styles.requestItemActions}>
                            <Button
                              title="Reject"
                              variant="claySecondary"
                              size="sm"
                              onPress={() => handleUpdateRequestStatus(req.id, 'REJECTED')}
                              style={{ flex: 1 }}
                            />
                            <Button
                              title="Accept"
                              variant="clayPrimary"
                              size="sm"
                              onPress={() => handleUpdateRequestStatus(req.id, 'ACCEPTED')}
                              style={{ flex: 1 }}
                            />
                          </View>
                        </View>
                      ))}
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
                      No pending requests. Builders can request to participate in this project.
                    </Text>
                  )}
                </Card>
              )}

              {/* 3. Project Skills Section */}
              <Card variant="clay" padding="lg" style={styles.sectionCard}>
                <View style={styles.sectionTitleRow}>
                  <Text
                    style={[
                      styles.sectionHeading,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.semibold,
                        letterSpacing: -0.2,
                      },
                    ]}
                  >
                    Project Skills
                  </Text>
                  {project.skills && project.skills.length > 0 && (
                    <Text
                      style={[
                        styles.sectionCountText,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      {project.skills.length} skills
                    </Text>
                  )}
                </View>

                {project.skills && project.skills.length > 0 ? (
                  <View style={styles.skillsCluster}>
                    {project.skills.map((skill) => (
                      <View
                        key={skill.id}
                        style={[
                          styles.skillBadge,
                          {
                            backgroundColor: theme.clay.surfaceChipSelected,
                            borderColor: theme.clay.borderChipSelected,
                            ...Platform.select({
                              web: {
                                boxShadow: theme.clay.webChipSelectedShadow,
                              } as any,
                              default: theme.clay.shadowChip,
                            }),
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.skillBadgeText,
                            {
                              color: theme.clay.textChipSelected,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          {skill.name}
                        </Text>
                      </View>
                    ))}
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
                    No specific skills attached to this project.
                  </Text>
                )}
              </Card>

              {/* 4. Roles Section */}
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
                    {project.roles && project.roles.length > 0 && (
                      <Text
                        style={[
                          styles.sectionCountText,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        {project.roles.length} roles
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

                      {roleActionError && (
                        <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                          {roleActionError}
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
                                onPress={() => handleToggleRoleSkill(skill.id)}
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
                          onPress={() => {
                            setIsAddingRole(false);
                            setEditingRoleId(null);
                          }}
                        />
                        <Button
                          title={editingRoleId ? 'Save Changes' : 'Create Role'}
                          variant="clayPrimary"
                          size="sm"
                          loading={
                            createRoleMutation.isPending || updateRoleMutation.isPending
                          }
                          onPress={handleSaveRole}
                        />
                      </View>
                    </View>
                  </AnimatedEntrance>
                )}

                {/* Roles List */}
                {project.roles && project.roles.length > 0 ? (
                  <View style={styles.rolesList}>
                    {project.roles.map((role) => {
                      const assignedMember = (project.members || []).find(
                        (m) => m.role_id === role.id
                      );

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
                                    onPress={() => handleStartEditRole(role)}
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
                                    onPress={() => handleDeleteRole(role.id)}
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
                            <View style={styles.assignedMemberRow}>
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
                                    color: theme.colors.text,
                                    fontWeight: theme.typography.weights.medium,
                                  }}
                                >
                                  {assignedMember.profile.full_name ||
                                    assignedMember.profile.username}
                                </Text>
                              </Text>
                            </View>
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

              {/* 5. Members & Owner Section */}
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
                    {project.members && project.members.length > 0 && (
                      <Text
                        style={[
                          styles.sectionCountText,
                          {
                            color: theme.colors.textMuted,
                            fontSize: theme.typography.sizes.xs,
                          },
                        ]}
                      >
                        {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
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
                          setMemberActionError(null);
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

                      {memberActionError && (
                        <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                          {memberActionError}
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
                          loading={isSearchingMember || addMemberMutation.isPending}
                          onPress={handleAddMemberByUsername}
                        />
                      </View>
                    </View>
                  </AnimatedEntrance>
                )}

                {/* Members List */}
                {project.members && project.members.length > 0 ? (
                  <View style={styles.membersList}>
                    {project.members.map((member) => {
                      const isMemberOwner = member.profile_id === project.owner_id;
                      const profile = member.profile;
                      const isSelf = user?.id === member.profile_id;
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
                          <Avatar
                            url={profile?.avatar_url}
                            name={profile?.full_name || profile?.username || 'Member'}
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
                                {profile?.full_name || profile?.username || 'Builder'}
                              </Text>

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
                                      handleChangeMemberRole(member.profile_id, null)
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
                                        handleChangeMemberRole(member.profile_id, r.id)
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
                                      handleRemoveMember(
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
                                    handleRemoveMember(member.profile_id, 'yourself')
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
                  <View
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
                  </View>
                ) : null}
              </Card>

              {/* Back to Workspace CTA */}
              <View style={styles.footerContainer}>
                <Button
                  title="Back to Workspace"
                  variant="clayPrimary"
                  size="md"
                  onPress={() => router.replace('/(tabs)/workspace')}
                  leftIcon={<Ionicons name="briefcase-outline" size={16} color="#FFFFFF" />}
                />
              </View>
            </View>
          </AnimatedEntrance>
        )}
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
  },
  topBar: {
    width: '100%',
    maxWidth: 620,
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
  editButtonPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
    gap: 4,
  },
  editButtonText: {
    fontWeight: '600',
  },
  centerContainer: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    gap: 16,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  errorCard: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 420,
    padding: 24,
  },
  errorTitle: {
    marginTop: 12,
    marginBottom: 6,
  },
  errorSubtitle: {
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 18,
  },
  sectionCard: {
    width: '100%',
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slugText: {
    fontFamily: Platform.select({ ios: 'Menlo', default: 'monospace' }),
    fontWeight: '500',
  },
  projectTitle: {
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  projectDescription: {
    lineHeight: 22,
    marginBottom: 16,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkChipText: {},
  collabActionBar: {
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.06)',
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  myRequestNote: {
    marginTop: 4,
    fontStyle: 'italic',
  },
  requestModalBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  requestModalTitle: {
    marginBottom: 10,
  },
  requestModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 10,
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  rolePickerPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  modalFieldLabel: {
    fontWeight: '500',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeading: {
    letterSpacing: -0.2,
  },
  sectionCountText: {},
  skillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 9999,
    borderWidth: 1,
  },
  skillBadgeText: {},
  emptySectionText: {},
  requestsList: {
    gap: 10,
  },
  requestItemCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  requestItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requesterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  requesterName: {},
  requestMessageBox: {
    marginTop: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  requestItemActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  rolesList: {
    gap: 12,
  },
  roleItem: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  roleItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  roleTitle: {
    letterSpacing: -0.1,
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
    marginBottom: 10,
  },
  roleSkillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  roleSkillTag: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
  },
  roleSkillTagText: {},
  assignedMemberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(15, 23, 42, 0.05)',
  },
  assignedMemberName: {},
  inlineFormCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  inlineFormTitle: {
    marginBottom: 10,
  },
  inlineFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 12,
  },
  inlineError: {
    fontSize: 12,
    marginBottom: 8,
  },
  inlineSuccess: {
    fontSize: 12,
    marginBottom: 8,
  },
  searchBoxSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    height: 32,
    marginBottom: 8,
    marginTop: 4,
    gap: 6,
  },
  searchInputSmall: {
    flex: 1,
    fontSize: 12,
    paddingVertical: 0,
  },
  roleSkillsSelectRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  roleSkillSelectPill: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 9999,
    borderWidth: 1,
  },
  membersList: {
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  memberName: {
    letterSpacing: -0.1,
  },
  memberHandle: {
    marginBottom: 2,
  },
  memberHeadline: {
    marginBottom: 2,
  },
  memberJoinedText: {},
  roleAssignmentPicker: {
    marginTop: 8,
    padding: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.03)',
    borderRadius: 8,
  },
  memberActionColumn: {
    alignItems: 'flex-end',
    gap: 6,
  },
  memberTextBtn: {
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
});
