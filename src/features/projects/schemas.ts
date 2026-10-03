import { z } from 'zod';
import { ProjectStatus } from '../../types/database';

const optionalUrl = z
  .string()
  .trim()
  .url('Must be a valid URL (e.g. https://example.com)')
  .optional()
  .nullable()
  .or(z.literal(''));

export const projectCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Project title cannot exceed 100 characters'),
  slug: z
    .string()
    .trim()
    .min(2, 'Slug must be at least 2 characters')
    .max(80, 'Slug cannot exceed 80 characters')
    .regex(/^[a-z0-9_-]+$/, 'Slug can only contain lowercase letters, numbers, hyphens, and underscores'),
  description: z.string().trim().max(1000, 'Description cannot exceed 1000 characters').optional().nullable(),
  cover_image_url: optionalUrl,
  repository_url: optionalUrl,
  live_url: optionalUrl,
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const satisfies readonly [ProjectStatus, ...ProjectStatus[]]).default('ACTIVE'),
});

export const projectUpdateSchema = projectCreateSchema.partial();

export const projectRoleCreateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Role title must be at least 2 characters')
    .max(80, 'Role title cannot exceed 80 characters'),
  description: z.string().trim().max(500, 'Description cannot exceed 500 characters').optional().nullable(),
});

export const projectRoleUpdateSchema = projectRoleCreateSchema.partial();

export const projectMemberAddSchema = z.object({
  profile_id: z.string().uuid('Invalid profile ID'),
  role_id: z.string().uuid('Invalid role ID').optional().nullable(),
});

export const projectMemberUpdateSchema = z.object({
  role_id: z.string().uuid('Invalid role ID').optional().nullable(),
});

export const collaborationRequestCreateSchema = z.object({
  role_id: z.string().uuid('Invalid role ID').optional().nullable(),
  message: z.string().trim().max(500, 'Message cannot exceed 500 characters').optional().nullable(),
});

export const collaborationRequestStatusUpdateSchema = z.object({
  status: z.enum(['ACCEPTED', 'REJECTED'] as const),
});

export function generateSlug(title: string): string {
  const sanitized = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (sanitized.length < 2) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    return sanitized.length === 1 ? `${sanitized}-${randomSuffix}` : `project-${randomSuffix}`;
  }

  const trimmed = sanitized.slice(0, 80).replace(/-+$/, '');
  return trimmed.length < 2 ? `${trimmed}-${Math.random().toString(36).substring(2, 6)}` : trimmed;
}

export const projectFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, 'Project title must be at least 2 characters')
    .max(100, 'Project title cannot exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(1000, 'Description cannot exceed 1000 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['ACTIVE', 'COMPLETED', 'ARCHIVED'] as const).default('ACTIVE'),
  repository_url: optionalUrl,
  live_url: optionalUrl,
  skillIds: z.array(z.string().uuid()).default([]),
});

export const projectEditFormSchema = projectFormSchema;

export type ProjectCreateInput = z.infer<typeof projectCreateSchema>;
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>;
export type ProjectRoleCreateInput = z.infer<typeof projectRoleCreateSchema>;
export type ProjectRoleUpdateInput = z.infer<typeof projectRoleUpdateSchema>;
export type ProjectMemberAddInput = z.infer<typeof projectMemberAddSchema>;
export type ProjectMemberUpdateInput = z.infer<typeof projectMemberUpdateSchema>;
export type CollaborationRequestCreateInput = z.infer<typeof collaborationRequestCreateSchema>;
export type CollaborationRequestStatusUpdateInput = z.infer<typeof collaborationRequestStatusUpdateSchema>;
export type ProjectFormInput = z.infer<typeof projectFormSchema>;
export type ProjectEditFormInput = z.infer<typeof projectEditFormSchema>;

