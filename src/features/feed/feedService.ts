import { supabase } from '../../services/supabase/client';
import { PostWithAuthor, Profile } from '../../types/database';

export interface CreatePostInput {
  content: string;
}

export const feedService = {
  async getFeedPosts(limit: number = 25): Promise<{ data: PostWithAuthor[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          author_id,
          content,
          created_at,
          updated_at,
          author:profiles!posts_author_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            headline
          )
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const mapped: PostWithAuthor[] = (data || []).map((p: any) => ({
        id: p.id,
        author_id: p.author_id,
        content: p.content,
        created_at: p.created_at,
        updated_at: p.updated_at,
        author: p.author as unknown as Profile | undefined,
      }));

      return { data: mapped, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch feed posts') };
    }
  },

  async createPost(input: CreatePostInput): Promise<{ data: PostWithAuthor | null; error: Error | null }> {
    try {
      const trimmed = input.content.trim();
      if (!trimmed) {
        return { data: null, error: new Error('Post content cannot be empty.') };
      }
      if (trimmed.length > 1000) {
        return { data: null, error: new Error('Post content cannot exceed 1000 characters.') };
      }

      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: authData.user.id,
          content: trimmed,
        })
        .select(`
          id,
          author_id,
          content,
          created_at,
          updated_at,
          author:profiles!posts_author_id_fkey(
            id,
            username,
            full_name,
            avatar_url,
            headline
          )
        `)
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      const mapped: PostWithAuthor = {
        ...data,
        author: data.author as unknown as Profile | undefined,
      };

      return { data: mapped, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to publish post') };
    }
  },

  async deletePost(postId: string): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('author_id', authData.user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to delete post') };
    }
  },
};
