import { supabase } from '../supabase/client';
import {
  Project,
  ProjectInsert,
  ProjectUpdate,
  ProjectRole,
  ProjectRoleInsert,
  ProjectRoleUpdate,
  ProjectWithDetails,
  ProjectStatus,
  Skill,
  Profile,
} from '../../types/database';

export const projectService = {
  async createProject(
    input: Omit<ProjectInsert, 'owner_id'>
  ): Promise<{ data: Project | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...input,
          owner_id: authData.user.id,
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to create project') };
    }
  },

  async createProjectWithSkills(
    input: Omit<ProjectInsert, 'owner_id'> & { skillIds?: string[] }
  ): Promise<{ data: Project | null; error: Error | null }> {
    try {
      const { skillIds = [], ...projectInput } = input;
      let result = await this.createProject(projectInput);

      // Handle duplicate slug collision gracefully
      if (
        result.error &&
        (result.error.message.includes('projects_slug_key') ||
          result.error.message.includes('duplicate key'))
      ) {
        const uniqueSlug = `${projectInput.slug.slice(0, 72)}-${Math.random().toString(36).substring(2, 6)}`;
        result = await this.createProject({
          ...projectInput,
          slug: uniqueSlug,
        });
      }

      if (result.error || !result.data) {
        return result;
      }

      const createdProject = result.data;

      // Associate skills if provided
      if (skillIds.length > 0) {
        const skillInserts = skillIds.map((skillId) =>
          this.addProjectSkill(createdProject.id, skillId)
        );
        await Promise.allSettled(skillInserts);
      }

      // Fetch complete project with skills and details
      const { data: fullProject } = await this.getProjectById(createdProject.id);

      return { data: fullProject || (createdProject as any), error: null };
    } catch (err: any) {
      return {
        data: null,
        error: new Error(err.message || 'Failed to create project with skills'),
      };
    }
  },

  async getProjectById(
    id: string
  ): Promise<{ data: ProjectWithDetails | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:profiles!projects_owner_id_fkey(*),
          project_skills(skills(*)),
          roles:project_roles(
            *,
            project_role_skills(skills(*))
          ),
          members:project_members(
            joined_at,
            profile:profiles(*),
            role:project_roles(*)
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: null };
      }

      // Map relation structures safely
      const projectWithDetails: ProjectWithDetails = {
        ...data,
        owner: data.owner as unknown as Profile | undefined,
        skills: (data.project_skills || [])
          .map((ps: any) => ps.skills as Skill)
          .filter(Boolean),
        roles: (data.roles || []).map((r: any) => ({
          ...r,
          skills: (r.project_role_skills || [])
            .map((rs: any) => rs.skills as Skill)
            .filter(Boolean),
        })),
        members: (data.members || []).map((m: any) => ({
          project_id: data.id,
          profile_id: m.profile?.id || '',
          role_id: m.role?.id || null,
          joined_at: m.joined_at,
          profile: m.profile as unknown as Profile | undefined,
          role: m.role as unknown as ProjectRole | null | undefined,
        })),
      };

      return { data: projectWithDetails, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to fetch project') };
    }
  },

  async getProjectBySlug(
    slug: string
  ): Promise<{ data: ProjectWithDetails | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          owner:profiles!projects_owner_id_fkey(*),
          project_skills(skills(*)),
          roles:project_roles(
            *,
            project_role_skills(skills(*))
          ),
          members:project_members(
            joined_at,
            profile:profiles(*),
            role:project_roles(*)
          )
        `)
        .eq('slug', slug)
        .maybeSingle();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      if (!data) {
        return { data: null, error: null };
      }

      const projectWithDetails: ProjectWithDetails = {
        ...data,
        owner: data.owner as unknown as Profile | undefined,
        skills: (data.project_skills || [])
          .map((ps: any) => ps.skills as Skill)
          .filter(Boolean),
        roles: (data.roles || []).map((r: any) => ({
          ...r,
          skills: (r.project_role_skills || [])
            .map((rs: any) => rs.skills as Skill)
            .filter(Boolean),
        })),
        members: (data.members || []).map((m: any) => ({
          project_id: data.id,
          profile_id: m.profile?.id || '',
          role_id: m.role?.id || null,
          joined_at: m.joined_at,
          profile: m.profile as unknown as Profile | undefined,
          role: m.role as unknown as ProjectRole | null | undefined,
        })),
      };

      return { data: projectWithDetails, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to fetch project by slug') };
    }
  },

  async updateProject(
    id: string,
    updates: ProjectUpdate
  ): Promise<{ data: Project | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to update project') };
    }
  },

  async deleteProject(id: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to delete project') };
    }
  },

  async listProjects(filter?: {
    status?: ProjectStatus;
    ownerId?: string;
  }): Promise<{ data: Project[]; error: Error | null }> {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }

      if (filter?.ownerId) {
        query = query.eq('owner_id', filter.ownerId);
      }

      const { data, error } = await query;

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      return { data: data || [], error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to list projects') };
    }
  },

  async addProjectSkill(
    projectId: string,
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_skills')
        .insert({
          project_id: projectId,
          skill_id: skillId,
        });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to add project skill') };
    }
  },

  async removeProjectSkill(
    projectId: string,
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_skills')
        .delete()
        .eq('project_id', projectId)
        .eq('skill_id', skillId);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to remove project skill') };
    }
  },

  async createProjectRole(
    role: ProjectRoleInsert
  ): Promise<{ data: ProjectRole | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('project_roles')
        .insert(role)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to create project role') };
    }
  },

  async updateProjectRole(
    roleId: string,
    updates: ProjectRoleUpdate
  ): Promise<{ data: ProjectRole | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('project_roles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', roleId)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to update project role') };
    }
  },

  async deleteProjectRole(roleId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_roles')
        .delete()
        .eq('id', roleId);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to delete project role') };
    }
  },

  async addRoleSkill(
    roleId: string,
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_role_skills')
        .insert({
          role_id: roleId,
          skill_id: skillId,
        });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to add role skill') };
    }
  },

  async removeRoleSkill(
    roleId: string,
    skillId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_role_skills')
        .delete()
        .eq('role_id', roleId)
        .eq('skill_id', skillId);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to remove role skill') };
    }
  },

  async addProjectMember(
    projectId: string,
    profileId: string,
    roleId?: string | null
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          profile_id: profileId,
          role_id: roleId || null,
        });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to add project member') };
    }
  },

  async removeProjectMember(
    projectId: string,
    profileId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('profile_id', profileId);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to remove project member') };
    }
  },
};
