import { supabase } from '../supabase/client';
import { Profile, ProfileUpdate, Skill } from '../../types/database';

export const profileService = {
  async getProfileById(userId: string): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to fetch profile') };
    }
  },

  async getProfileByUsername(username: string): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.trim().toLowerCase())
        .maybeSingle();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to fetch profile by username') };
    }
  },

  async getCurrentProfile(): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      return this.getProfileById(authData.user.id);
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to fetch current profile') };
    }
  },

  async updateCurrentProfile(
    updates: ProfileUpdate
  ): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', authData.user.id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to update profile') };
    }
  },

  async uploadAndSetAvatar(
    userId: string,
    imageUri: string,
    previousAvatarUrl?: string | null
  ): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || authData.user.id !== userId) {
        return { data: null, error: new Error('Unauthorized to update this avatar') };
      }

      // Dynamic import or direct call to imageUploadService
      const { imageUploadService } = await import('../storage/imageUploadService');
      const uploadResult = await imageUploadService.uploadAvatar(userId, imageUri);

      if (uploadResult.error || !uploadResult.data) {
        return { data: null, error: uploadResult.error || new Error('Upload failed') };
      }

      const { publicUrl, storagePath } = uploadResult.data;

      // Update database profile
      const { data: updatedProfile, error: dbError } = await this.updateCurrentProfile({
        avatar_url: publicUrl,
      });

      if (dbError || !updatedProfile) {
        // Rollback: delete newly uploaded file to avoid orphaned storage object
        await imageUploadService.deleteFromStorage('avatars', storagePath);
        return { data: null, error: dbError || new Error('Failed to update avatar in database') };
      }

      // Success: clean up previous avatar if it was in storage and different
      if (previousAvatarUrl && previousAvatarUrl !== publicUrl) {
        await imageUploadService.deleteFromStorage('avatars', previousAvatarUrl);
      }

      return { data: updatedProfile, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to update avatar') };
    }
  },

  async removeAvatar(
    userId: string,
    currentAvatarUrl?: string | null
  ): Promise<{ data: Profile | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || authData.user.id !== userId) {
        return { data: null, error: new Error('Unauthorized to remove this avatar') };
      }

      const { data: updatedProfile, error: dbError } = await this.updateCurrentProfile({
        avatar_url: null,
      });

      if (dbError || !updatedProfile) {
        return { data: null, error: dbError || new Error('Failed to remove avatar from database') };
      }

      if (currentAvatarUrl) {
        const { imageUploadService } = await import('../storage/imageUploadService');
        await imageUploadService.deleteFromStorage('avatars', currentAvatarUrl);
      }

      return { data: updatedProfile, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to remove avatar') };
    }
  },

  async getAvailableSkills(): Promise<{ data: Skill[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch skills') };
    }
  },

  async getUserSkills(userId: string): Promise<{ data: Skill[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('profile_skills')
        .select('skill_id, skills (*)')
        .eq('profile_id', userId);

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const skills: Skill[] = (data || [])
        .map((row: any) => row.skills)
        .filter(Boolean);

      return { data: skills, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch user skills') };
    }
  },

  async addSkillToProfile(
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('profile_skills')
        .insert({
          profile_id: authData.user.id,
          skill_id: skillId,
        });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to add skill') };
    }
  },

  async removeSkillFromProfile(
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('profile_skills')
        .delete()
        .eq('profile_id', authData.user.id)
        .eq('skill_id', skillId);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to remove skill') };
    }
  },
};
