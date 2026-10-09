import { supabase } from '../../services/supabase/client';
import { Skill } from '../../types/database';

export interface DiscoverProjectOwner {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

export interface DiscoverProject {
  id: string;
  owner_id: string;
  title: string;
  slug: string;
  description: string | null;
  cover_image_url: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  created_at: string;
  skills: Pick<Skill, 'id' | 'name' | 'slug'>[];
  owner: DiscoverProjectOwner | null;
}

export interface DiscoverBuilder {
  id: string;
  username: string;
  full_name: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  created_at: string;
  skills: Pick<Skill, 'id' | 'name' | 'slug'>[];
}

export const discoverService = {
  async searchProjects(
    search?: string
  ): Promise<{ data: DiscoverProject[]; error: Error | null }> {
    try {
      let query = supabase
        .from('projects')
        .select(`
          id,
          owner_id,
          title,
          slug,
          description,
          cover_image_url,
          status,
          created_at,
          project_skills(skills(id, name, slug)),
          owner:profiles!projects_owner_id_fkey(id, username, full_name, avatar_url)
        `)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(25);

      const trimmed = search?.trim();
      if (trimmed) {
        // Sanitize string to prevent malformed PostgREST query expressions
        const sanitized = trimmed.replace(/[,().%_]/g, ' ').trim();
        if (sanitized) {
          query = query.or(`title.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
        }
      }

      const { data, error } = await query;

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const mapped: DiscoverProject[] = (data || []).map((p: any) => ({
        id: p.id,
        owner_id: p.owner_id,
        title: p.title,
        slug: p.slug,
        description: p.description,
        cover_image_url: p.cover_image_url,
        status: p.status,
        created_at: p.created_at,
        skills: (p.project_skills || [])
          .map((ps: any) => ps.skills)
          .filter(Boolean),
        owner: p.owner || null,
      }));

      return { data: mapped, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to search projects') };
    }
  },

  async searchBuilders(
    search?: string
  ): Promise<{ data: DiscoverBuilder[]; error: Error | null }> {
    try {
      let query = supabase
        .from('profiles')
        .select(`
          id,
          username,
          full_name,
          headline,
          bio,
          avatar_url,
          location,
          created_at,
          profile_skills(skills(id, name, slug))
        `)
        .order('created_at', { ascending: false })
        .limit(25);

      const trimmed = search?.trim();
      if (trimmed) {
        const sanitized = trimmed.replace(/[,().%_]/g, ' ').trim();
        if (sanitized) {
          query = query.or(
            `full_name.ilike.%${sanitized}%,headline.ilike.%${sanitized}%,username.ilike.%${sanitized}%`
          );
        }
      }

      const { data, error } = await query;

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const mapped: DiscoverBuilder[] = (data || []).map((b: any) => ({
        id: b.id,
        username: b.username,
        full_name: b.full_name,
        headline: b.headline,
        bio: b.bio,
        avatar_url: b.avatar_url,
        location: b.location,
        created_at: b.created_at,
        skills: (b.profile_skills || [])
          .map((ps: any) => ps.skills)
          .filter(Boolean),
      }));

      return { data: mapped, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to search builders') };
    }
  },
};
