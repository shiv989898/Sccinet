import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../../services/projects/projectService';
import {
  ProjectInsert,
  ProjectRoleInsert,
  ProjectRoleUpdate,
  ProjectStatus,
  ProjectUpdate,
} from '../../types/database';

export const projectQueryKeys = {
  all: ['projects'] as const,
  lists: () => [...projectQueryKeys.all, 'list'] as const,
  list: (filter?: { status?: ProjectStatus; ownerId?: string }) =>
    [...projectQueryKeys.lists(), filter] as const,
  details: () => [...projectQueryKeys.all, 'detail'] as const,
  detailById: (id: string) => [...projectQueryKeys.details(), 'id', id] as const,
  detailBySlug: (slug: string) => [...projectQueryKeys.details(), 'slug', slug] as const,
};

export function useProjects(filter?: { status?: ProjectStatus; ownerId?: string }) {
  return useQuery({
    queryKey: projectQueryKeys.list(filter),
    queryFn: async () => {
      const { data, error } = await projectService.listProjects(filter);
      if (error) throw error;
      return data;
    },
  });
}

export function useProject(id?: string) {
  return useQuery({
    queryKey: projectQueryKeys.detailById(id || ''),
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await projectService.getProjectById(id);
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useProjectBySlug(slug?: string) {
  return useQuery({
    queryKey: projectQueryKeys.detailBySlug(slug || ''),
    queryFn: async () => {
      if (!slug) return null;
      const { data, error } = await projectService.getProjectBySlug(slug);
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: Omit<ProjectInsert, 'owner_id'>) => {
      const { data, error } = await projectService.createProject(input);
      if (error) throw error;
      return data;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      if (newProject) {
        queryClient.setQueryData(projectQueryKeys.detailById(newProject.id), newProject);
        queryClient.setQueryData(projectQueryKeys.detailBySlug(newProject.slug), newProject);
      }
    },
  });
}

export function useUpdateProject(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: ProjectUpdate) => {
      const { data, error } = await projectService.updateProject(projectId, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
      if (updated?.slug) {
        queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailBySlug(updated.slug) });
      }
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await projectService.deleteProject(projectId);
      if (error) throw error;
      return projectId;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.lists() });
      queryClient.removeQueries({ queryKey: projectQueryKeys.detailById(deletedId) });
    },
  });
}

export function useAddProjectSkill(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await projectService.addProjectSkill(projectId, skillId);
      if (error) throw error;
      return skillId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useRemoveProjectSkill(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: string) => {
      const { error } = await projectService.removeProjectSkill(projectId, skillId);
      if (error) throw error;
      return skillId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useCreateProjectRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (role: Omit<ProjectRoleInsert, 'project_id'>) => {
      const { data, error } = await projectService.createProjectRole({
        ...role,
        project_id: projectId,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useUpdateProjectRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, updates }: { roleId: string; updates: ProjectRoleUpdate }) => {
      const { data, error } = await projectService.updateProjectRole(roleId, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useDeleteProjectRole(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (roleId: string) => {
      const { error } = await projectService.deleteProjectRole(roleId);
      if (error) throw error;
      return roleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useAddRoleSkill(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, skillId }: { roleId: string; skillId: string }) => {
      const { error } = await projectService.addRoleSkill(roleId, skillId);
      if (error) throw error;
      return { roleId, skillId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useRemoveRoleSkill(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ roleId, skillId }: { roleId: string; skillId: string }) => {
      const { error } = await projectService.removeRoleSkill(roleId, skillId);
      if (error) throw error;
      return { roleId, skillId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useAddProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ profileId, roleId }: { profileId: string; roleId?: string | null }) => {
      const { error } = await projectService.addProjectMember(projectId, profileId, roleId);
      if (error) throw error;
      return { profileId, roleId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}

export function useRemoveProjectMember(projectId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await projectService.removeProjectMember(projectId, profileId);
      if (error) throw error;
      return profileId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.detailById(projectId) });
    },
  });
}
