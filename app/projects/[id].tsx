import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Button, Card, SkeletonLoader } from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useAvailableSkills } from '../../src/features/profiles/useProfile';
import { profileService } from '../../src/services/profiles/profileService';
import {
  CollaborationApplyModal,
  ProjectCollabRequestsSection,
  ProjectHeader,
  ProjectMembersSection,
  ProjectRolesSection,
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

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const isOwner = Boolean(user?.id && project?.owner_id && user.id === project.owner_id);
  const isMember = Boolean(
    user?.id && project?.members?.some((m) => m.profile_id === user.id)
  );
  const myPendingRequest = collabRequests.find(
    (r) => r.user_id === user?.id && r.status === 'PENDING'
  );

  // Role management
  const handleSaveRole = async (data: {
    id?: string | null;
    title: string;
    description: string;
    skillIds: string[];
  }) => {
    if (data.id) {
      await updateRoleMutation.mutateAsync({
        roleId: data.id,
        updates: {
          title: data.title,
          description: data.description || null,
        },
      });

      const existingRole = project?.roles?.find((r) => r.id === data.id);
      const currentSkillIds = (existingRole?.skills || []).map((s) => s.id);
      const toAdd = data.skillIds.filter((sid) => !currentSkillIds.includes(sid));
      const toRemove = currentSkillIds.filter((sid) => !data.skillIds.includes(sid));

      for (const sid of toAdd) {
        await addRoleSkillMutation.mutateAsync({ roleId: data.id, skillId: sid });
      }
      for (const sid of toRemove) {
        await removeRoleSkillMutation.mutateAsync({ roleId: data.id, skillId: sid });
      }
    } else {
      const createdRole = await createRoleMutation.mutateAsync({
        title: data.title,
        description: data.description || null,
      });
      if (createdRole && data.skillIds.length > 0) {
        for (const sid of data.skillIds) {
          await addRoleSkillMutation.mutateAsync({ roleId: createdRole.id, skillId: sid });
        }
      }
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    await deleteRoleMutation.mutateAsync(roleId);
  };

  // Member management
  const handleAddMemberByUsername = async (username: string, roleId: string | null) => {
    const cleanUsername = username.toLowerCase().replace(/^@/, '');
    const { data: foundProfile, error: searchError } =
      await profileService.getProfileByUsername(cleanUsername);

    if (searchError || !foundProfile) {
      throw new Error(`No user found with username @${cleanUsername}`);
    }
    if (project?.members?.some((m) => m.profile_id === foundProfile.id)) {
      throw new Error(`@${cleanUsername} is already a member of this project`);
    }

    await addMemberMutation.mutateAsync({
      profileId: foundProfile.id,
      roleId: roleId || null,
    });
  };

  const handleChangeMemberRole = async (profileId: string, roleId: string | null) => {
    await updateMemberRoleMutation.mutateAsync({ profileId, roleId });
  };

  const handleRemoveMember = async (profileId: string, memberName: string) => {
    const executeRemove = async () => {
      try {
        await removeMemberMutation.mutateAsync(profileId);
      } catch (err: any) {
        Alert.alert('Error', err?.message || 'Failed to remove member');
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

  // Collaboration requests
  const handleSubmitCollabRequest = async (roleId: string | null, message: string) => {
    await createRequestMutation.mutateAsync({
      roleId: roleId || null,
      message: message.trim() || null,
    });
  };

  const handleWithdrawRequest = async (requestId: string) => {
    await withdrawRequestMutation.mutateAsync(requestId);
  };

  const handleUpdateRequestStatus = async (
    requestId: string,
    status: 'ACCEPTED' | 'REJECTED'
  ) => {
    await updateRequestStatusMutation.mutateAsync({ requestId, status });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={[styles.centerContainer, { gap: 16, padding: 16 }]}>
            <Card variant="clay" padding="lg">
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <SkeletonLoader width={65} height={20} borderRadius={10} />
                  <SkeletonLoader width={120} height={14} borderRadius={4} />
                </View>
                <SkeletonLoader width="70%" height={26} borderRadius={6} />
                <SkeletonLoader width="95%" height={15} borderRadius={4} />
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
                  { color: theme.colors.text, fontSize: theme.typography.sizes.lg, fontWeight: theme.typography.weights.bold },
                ]}
              >
                Project Not Found
              </Text>
              <Text
                style={[
                  styles.errorSubtitle,
                  { color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm },
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
          <AnimatedEntrance duration={180}>
            <View style={styles.centerContainer}>
              {/* 1. Project Header & Identity */}
              <ProjectHeader
                project={project}
                isOwner={isOwner}
                onEditPress={() =>
                  router.push({
                    pathname: '/projects/edit',
                    params: { id: id! },
                  })
                }
              />

              {/* 2. Collaboration Bar for Non-Owners */}
              {!isOwner && user && (
                <View style={{ paddingHorizontal: 16, marginBottom: 16 }}>
                  <CollaborationApplyModal
                    isMember={isMember}
                    myPendingRequest={myPendingRequest}
                    roles={project.roles || []}
                    isRequestModalOpen={isRequestModalOpen}
                    onOpenModal={() => setIsRequestModalOpen(true)}
                    onCloseModal={() => setIsRequestModalOpen(false)}
                    onWithdrawRequest={handleWithdrawRequest}
                    onLeaveProject={() => handleRemoveMember(user.id, 'yourself')}
                    onSubmitRequest={handleSubmitCollabRequest}
                    isSubmitting={createRequestMutation.isPending}
                  />
                </View>
              )}

              <View style={{ paddingHorizontal: 16 }}>
                {/* 3. Owner Collab Requests Review */}
                {isOwner && (
                  <ProjectCollabRequestsSection
                    requests={collabRequests}
                    onUpdateStatus={handleUpdateRequestStatus}
                    isUpdatingStatus={updateRequestStatusMutation.isPending}
                  />
                )}

                {/* 4. Roles Section */}
                <ProjectRolesSection
                  roles={project.roles || []}
                  members={project.members || []}
                  allSkills={allSkills}
                  isOwner={isOwner}
                  onSaveRole={handleSaveRole}
                  onDeleteRole={handleDeleteRole}
                  isSavingRole={
                    createRoleMutation.isPending || updateRoleMutation.isPending
                  }
                />

                {/* 5. Team Members Section */}
                <ProjectMembersSection
                  project={project}
                  isOwner={isOwner}
                  currentUserId={user?.id}
                  onAddMemberByUsername={handleAddMemberByUsername}
                  onChangeMemberRole={handleChangeMemberRole}
                  onRemoveMember={handleRemoveMember}
                  isAddingMemberMutationPending={addMemberMutation.isPending}
                />
              </View>

              {/* Bottom Workspace CTA */}
              <View style={styles.footerContainer}>
                <Button
                  title="Return to Workspace"
                  variant="claySecondary"
                  size="md"
                  leftIcon={<Ionicons name="folder-outline" size={16} color={theme.colors.text} />}
                  onPress={() => router.replace('/(tabs)/workspace')}
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
    paddingBottom: 48,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 400,
  },
  errorCard: {
    alignItems: 'center',
    textAlign: 'center',
    width: '100%',
    maxWidth: 420,
    padding: 24,
    gap: 8,
  },
  errorTitle: {
    marginTop: 8,
  },
  errorSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  footerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
});
