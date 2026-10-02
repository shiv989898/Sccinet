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
