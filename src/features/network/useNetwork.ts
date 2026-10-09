import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { networkService } from './networkService';

export const networkQueryKeys = {
  all: ['network'] as const,
  connections: () => [...networkQueryKeys.all, 'connections'] as const,
  receivedRequests: () => [...networkQueryKeys.all, 'requests', 'received'] as const,
  sentRequests: () => [...networkQueryKeys.all, 'requests', 'sent'] as const,
  relationship: (targetUserId: string) =>
    [...networkQueryKeys.all, 'relationship', targetUserId] as const,
};

export function useConnections() {
  return useQuery({
    queryKey: networkQueryKeys.connections(),
    queryFn: async () => {
      const { data, error } = await networkService.getAcceptedConnections();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useReceivedConnectionRequests() {
  return useQuery({
    queryKey: networkQueryKeys.receivedRequests(),
    queryFn: async () => {
      const { data, error } = await networkService.getReceivedPendingRequests();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useSentConnectionRequests() {
  return useQuery({
    queryKey: networkQueryKeys.sentRequests(),
    queryFn: async () => {
      const { data, error } = await networkService.getSentPendingRequests();
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useProfileRelationship(targetUserId?: string) {
  return useQuery({
    queryKey: networkQueryKeys.relationship(targetUserId || ''),
    queryFn: async () => {
      if (!targetUserId) {
        return { status: 'NOT_CONNECTED' as const, connection: null };
      }
      const { data, error } = await networkService.getRelationship(targetUserId);
      if (error) throw error;
      return data;
    },
    enabled: !!targetUserId,
    staleTime: 1000 * 15,
  });
}

export function useSendConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      const { data, error } = await networkService.sendConnectionRequest(targetUserId);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: networkQueryKeys.all });
      queryClient.invalidateQueries({
        queryKey: networkQueryKeys.relationship(targetUserId),
      });
    },
  });
}

export function useAcceptConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const { data, error } = await networkService.acceptConnectionRequest(connectionId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkQueryKeys.all });
    },
  });
}

export function useRejectConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await networkService.rejectConnectionRequest(connectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkQueryKeys.all });
    },
  });
}

export function useWithdrawConnectionRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await networkService.withdrawConnectionRequest(connectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkQueryKeys.all });
    },
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (connectionId: string) => {
      const { error } = await networkService.removeConnection(connectionId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: networkQueryKeys.all });
    },
  });
}
