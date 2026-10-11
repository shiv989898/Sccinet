import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';

export interface AuthResponse<T = unknown> {
  data: T | null;
  error: Error | null;
}

const isPlaceholderSupabase =
  !process.env.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL.includes('placeholder');

const DEMO_STORAGE_KEY = '@sccinet_demo_session';

const createDemoUser = (
  email: string = 'builder@sccinet.dev',
  fullName: string = 'Demo Builder'
): User =>
  ({
    id: '00000000-0000-0000-0000-000000000001',
    app_metadata: { provider: 'email' },
    user_metadata: {
      full_name: fullName,
      username: email.split('@')[0] || 'builder',
    },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
    email,
    role: 'authenticated',
    updated_at: new Date().toISOString(),
  }) as User;

const createDemoSession = (user: User): Session => ({
  access_token: 'demo-access-token-sccinet',
  refresh_token: 'demo-refresh-token-sccinet',
  expires_in: 3600 * 24 * 7,
  token_type: 'bearer',
  user,
});

export const authService = {
  async signIn(email: string, password: string): Promise<AuthResponse<Session>> {
    // If Supabase backend is not configured or demo credentials used, provide immediate offline demo login
    if (isPlaceholderSupabase || email.toLowerCase().includes('demo')) {
      const demoUser = createDemoUser(email, email.split('@')[0] || 'Demo Builder');
      const demoSession = createDemoSession(demoUser);
      await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
      return { data: demoSession, error: null };
    }

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
      // Graceful fallback if network to Supabase fails
      if (isPlaceholderSupabase) {
        const demoUser = createDemoUser(email, 'Demo Builder');
        const demoSession = createDemoSession(demoUser);
        await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
        return { data: demoSession, error: null };
      }
      return { data: null, error: new Error(err.message || 'Failed to sign in') };
    }
  },

  async signUp(
    email: string,
    password: string,
    fullName: string
  ): Promise<AuthResponse<{ user: User | null; session: Session | null }>> {
    // If Supabase backend is not configured or demo credentials used, provide immediate registration
    if (isPlaceholderSupabase || email.toLowerCase().includes('demo')) {
      const demoUser = createDemoUser(email, fullName);
      const demoSession = createDemoSession(demoUser);
      await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
      return { data: { user: demoUser, session: demoSession }, error: null };
    }

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
      // Graceful fallback if network to Supabase fails
      if (isPlaceholderSupabase) {
        const demoUser = createDemoUser(email, fullName);
        const demoSession = createDemoSession(demoUser);
        await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
        return { data: { user: demoUser, session: demoSession }, error: null };
      }
      return { data: null, error: new Error(err.message || 'Failed to sign up') };
    }
  },

  async signInWithDemo(): Promise<AuthResponse<Session>> {
    try {
      const demoUser = createDemoUser('builder@sccinet.dev', 'Piyush Builder');
      const demoSession = createDemoSession(demoUser);
      await AsyncStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoSession));
      return { data: demoSession, error: null };
    } catch {
      return { data: null, error: new Error('Failed to initiate demo session') };
    }
  },

  async signOut(): Promise<AuthResponse<void>> {
    try {
      await AsyncStorage.removeItem(DEMO_STORAGE_KEY);
      const { error } = await supabase.auth.signOut();
      if (error && !isPlaceholderSupabase) {
        return { data: null, error: new Error(error.message) };
      }
      return { data: undefined, error: null };
    } catch (err: any) {
      return { data: null, error: new Error(err.message || 'Failed to sign out') };
    }
  },

  async getSession(): Promise<Session | null> {
    try {
      const demoRaw = await AsyncStorage.getItem(DEMO_STORAGE_KEY);
      if (demoRaw) {
        return JSON.parse(demoRaw);
      }
      const { data } = await supabase.auth.getSession();
      return data.session;
    } catch {
      return null;
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const session = await this.getSession();
      return session?.user ?? null;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    const { data } = supabase.auth.onAuthStateChange(callback);
    return data.subscription;
  },
};
