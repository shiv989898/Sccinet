import { supabase } from '../../services/supabase/client';
import {
  Connection,
  Profile,
  ProfileRelationship,
} from '../../types/database';

export interface NetworkConnectionItem {
  id: string;
  status: 'ACCEPTED';
  createdAt: string;
  updatedAt: string;
  partner: Profile;
}

export interface PendingRequestItem {
  id: string;
  status: 'PENDING';
  createdAt: string;
  profile: Profile;
}

export const networkService = {
  async getAcceptedConnections(): Promise<{
    data: NetworkConnectionItem[];
    error: Error | null;
  }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: [], error: new Error('User not authenticated') };
      }
      const userId = authData.user.id;

      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          recipient_id,
          status,
          created_at,
          updated_at,
          requester:profiles!connections_requester_id_fkey(id, username, full_name, avatar_url, headline, location),
          recipient:profiles!connections_recipient_id_fkey(id, username, full_name, avatar_url, headline, location)
        `)
        .eq('status', 'ACCEPTED')
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('updated_at', { ascending: false });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const items: NetworkConnectionItem[] = (data || [])
        .map((row: any) => {
          const partner =
            row.requester_id === userId
              ? (row.recipient as Profile)
              : (row.requester as Profile);

          if (!partner) return null;
          return {
            id: row.id,
            status: 'ACCEPTED' as const,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            partner,
          };
        })
        .filter((item): item is NetworkConnectionItem => item !== null);

      return { data: items, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch connections') };
    }
  },

  async getReceivedPendingRequests(): Promise<{
    data: PendingRequestItem[];
    error: Error | null;
  }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: [], error: new Error('User not authenticated') };
      }
      const userId = authData.user.id;

      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          recipient_id,
          status,
          created_at,
          requester:profiles!connections_requester_id_fkey(id, username, full_name, avatar_url, headline, location)
        `)
        .eq('recipient_id', userId)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const items: PendingRequestItem[] = (data || [])
        .map((row: any) => {
          if (!row.requester) return null;
          return {
            id: row.id,
            status: 'PENDING' as const,
            createdAt: row.created_at,
            profile: row.requester as Profile,
          };
        })
        .filter((item): item is PendingRequestItem => item !== null);

      return { data: items, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch received requests') };
    }
  },

  async getSentPendingRequests(): Promise<{
    data: PendingRequestItem[];
    error: Error | null;
  }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: [], error: new Error('User not authenticated') };
      }
      const userId = authData.user.id;

      const { data, error } = await supabase
        .from('connections')
        .select(`
          id,
          requester_id,
          recipient_id,
          status,
          created_at,
          recipient:profiles!connections_recipient_id_fkey(id, username, full_name, avatar_url, headline, location)
        `)
        .eq('requester_id', userId)
        .eq('status', 'PENDING')
        .order('created_at', { ascending: false });

      if (error) {
        return { data: [], error: new Error(error.message) };
      }

      const items: PendingRequestItem[] = (data || [])
        .map((row: any) => {
          if (!row.recipient) return null;
          return {
            id: row.id,
            status: 'PENDING' as const,
            createdAt: row.created_at,
            profile: row.recipient as Profile,
          };
        })
        .filter((item): item is PendingRequestItem => item !== null);

      return { data: items, error: null };
    } catch (err: any) {
      return { data: [], error: new Error(err.message || 'Failed to fetch sent requests') };
    }
  },

  async getRelationship(
    targetUserId: string
  ): Promise<{ data: ProfileRelationship; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return {
          data: { status: 'NOT_CONNECTED', connection: null },
          error: null,
        };
      }
      const userId = authData.user.id;

      if (userId === targetUserId) {
        return { data: { status: 'SELF', connection: null }, error: null };
      }

      const { data, error } = await supabase
        .from('connections')
        .select('*')
        .or(
          `and(requester_id.eq.${userId},recipient_id.eq.${targetUserId}),and(requester_id.eq.${targetUserId},recipient_id.eq.${userId})`
        )
        .maybeSingle();

      if (error) {
        return {
          data: { status: 'NOT_CONNECTED', connection: null },
          error: new Error(error.message),
        };
      }

      if (!data || data.status === 'REJECTED') {
        return { data: { status: 'NOT_CONNECTED', connection: null }, error: null };
      }

      if (data.status === 'ACCEPTED') {
        return { data: { status: 'CONNECTED', connection: data }, error: null };
      }

      if (data.status === 'PENDING') {
        if (data.requester_id === userId) {
          return { data: { status: 'OUTGOING_PENDING', connection: data }, error: null };
        } else {
          return { data: { status: 'INCOMING_PENDING', connection: data }, error: null };
        }
      }

      return { data: { status: 'NOT_CONNECTED', connection: null }, error: null };
    } catch (err: any) {
      return {
        data: { status: 'NOT_CONNECTED', connection: null },
        error: new Error(err.message || 'Failed to fetch relationship'),
      };
    }
  },

  async sendConnectionRequest(
    targetUserId: string
  ): Promise<{ data: Connection | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }
      const userId = authData.user.id;

      if (userId === targetUserId) {
        return { data: null, error: new Error('Cannot connect with yourself') };
      }

      const { data, error } = await supabase
        .from('connections')
        .insert({
          requester_id: userId,
          recipient_id: targetUserId,
          status: 'PENDING',
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to send connection request') };
    }
  },

  async acceptConnectionRequest(
    connectionId: string
  ): Promise<{ data: Connection | null; error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { data: null, error: new Error('User not authenticated') };
      }

      const { data, error } = await supabase
        .from('connections')
        .update({
          status: 'ACCEPTED',
        })
        .eq('id', connectionId)
        .eq('recipient_id', authData.user.id)
        .select()
        .single();

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to accept connection request') };
    }
  },

  async rejectConnectionRequest(
    connectionId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('connections')
        .update({
          status: 'REJECTED',
        })
        .eq('id', connectionId)
        .eq('recipient_id', authData.user.id);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to reject connection request') };
    }
  },

  async withdrawConnectionRequest(
    connectionId: string
  ): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }

      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId)
        .eq('requester_id', authData.user.id)
        .eq('status', 'PENDING');

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to withdraw connection request') };
    }
  },

  async removeConnection(connectionId: string): Promise<{ error: Error | null }> {
    try {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        return { error: new Error('User not authenticated') };
      }
      const userId = authData.user.id;

      const { error } = await supabase
        .from('connections')
        .delete()
        .eq('id', connectionId)
        .or(`requester_id.eq.${userId},recipient_id.eq.${userId}`);

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (err: any) {
      return { error: new Error(err.message || 'Failed to remove connection') };
    }
  },
};
