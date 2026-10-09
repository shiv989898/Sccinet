import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CreatePostInput, feedService } from './feedService';

export const feedQueryKeys = {
  all: ['feed'] as const,
  posts: (limit?: number) => [...feedQueryKeys.all, 'posts', limit || 25] as const,
};

export function useFeedPosts(limit: number = 25) {
  return useQuery({
    queryKey: feedQueryKeys.posts(limit),
    queryFn: async () => {
      const { data, error } = await feedService.getFeedPosts(limit);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreatePostInput) => {
      const { data, error } = await feedService.createPost(input);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await feedService.deletePost(postId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: feedQueryKeys.all });
    },
  });
}
