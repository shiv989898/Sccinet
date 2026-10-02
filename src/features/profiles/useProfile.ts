import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../../services/profiles/profileService';
import { ProfileUpdate } from '../../types/database';
import { useAuth } from '../auth/AuthContext';

export const profileQueryKeys = {
  currentProfile: ['profile', 'current'] as const,
  profileById: (id: string) => ['profile', id] as const,
  availableSkills: ['skills', 'available'] as const,
  userSkills: (userId: string) => ['skills', 'user', userId] as const,
};

export function useCurrentProfile() {
  const { user } = useAuth();

  return useQuery({
    queryKey: profileQueryKeys.currentProfile,
    queryFn: async () => {
      const { data, error } = await profileService.getCurrentProfile();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProfileUpdate) => {
      const { data, error } = await profileService.updateCurrentProfile(updates);
      if (error) throw error;
      return data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(profileQueryKeys.currentProfile, updatedProfile);
      if (updatedProfile?.id) {
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.profileById(updatedProfile.id),
        });
      }
    },
  });
}

export function useAvailableSkills() {
  return useQuery({
    queryKey: profileQueryKeys.availableSkills,
    queryFn: async () => {
      const { data, error } = await profileService.getAvailableSkills();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useUserSkills(userId?: string) {
  return useQuery({
    queryKey: profileQueryKeys.userSkills(userId || ''),
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await profileService.getUserSkills(userId);
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useAddSkill(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await profileService.addSkillToProfile(skillId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.userSkills(userId),
        });
      }
    },
  });
}

export function useRemoveSkill(userId?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await profileService.removeSkillFromProfile(skillId);
      if (error) throw error;
    },
    onSuccess: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: profileQueryKeys.userSkills(userId),
        });
      }
    },
  });
}
