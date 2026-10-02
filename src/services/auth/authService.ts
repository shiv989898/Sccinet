import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface AuthResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse<Session>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: data.session, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to sign in') };
    }
  },

  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { data: null, error: new Error(error.message) };
      }

      return { data: { user: data.user, session: data.session }, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to sign up') };
    }
  },

  async signOut(): Promise<AuthResponse<void>> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { data: null, error: new Error(error.message) };
      }
      return { data: undefined, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to sign out') };
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const { data } = await supabase.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  },
};
