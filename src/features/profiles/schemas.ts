import { z } from 'zod';

export const profileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(60),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username cannot exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  headline: z.string().trim().max(100, 'Headline cannot exceed 100 characters').optional().nullable(),
  bio: z.string().trim().max(300, 'Bio cannot exceed 300 characters').optional().nullable(),
  location: z.string().trim().max(60, 'Location cannot exceed 60 characters').optional().nullable(),
});

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
