export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          headline: string | null;
          bio: string | null;
          avatar_url: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          headline?: string | null;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profile_skills: {
        Row: {
          profile_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          profile_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          profile_id?: string;
          skill_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profile_skills_profile_id_fkey';
            columns: ['profile_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'profile_skills_skill_id_fkey';
            columns: ['skill_id'];
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      projects: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          slug: string;
          description: string | null;
          cover_image_url: string | null;
          repository_url: string | null;
          live_url: string | null;
          status: ProjectStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          slug: string;
          description?: string | null;
          cover_image_url?: string | null;
          repository_url?: string | null;
          live_url?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          slug?: string;
          description?: string | null;
          cover_image_url?: string | null;
          repository_url?: string | null;
          live_url?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'projects_owner_id_fkey';
            columns: ['owner_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      project_skills: {
        Row: {
          project_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          project_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          project_id?: string;
          skill_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_skills_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_skills_skill_id_fkey';
            columns: ['skill_id'];
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      project_roles: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          title?: string;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_roles_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
        ];
      };
      project_role_skills: {
        Row: {
          role_id: string;
          skill_id: string;
          created_at: string;
        };
        Insert: {
          role_id: string;
          skill_id: string;
          created_at?: string;
        };
        Update: {
          role_id?: string;
          skill_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_role_skills_role_id_fkey';
            columns: ['role_id'];
            referencedRelation: 'project_roles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_role_skills_skill_id_fkey';
            columns: ['skill_id'];
            referencedRelation: 'skills';
            referencedColumns: ['id'];
          },
        ];
      };
      project_members: {
        Row: {
          project_id: string;
          profile_id: string;
          role_id: string | null;
          joined_at: string;
        };
        Insert: {
          project_id: string;
          profile_id: string;
          role_id?: string | null;
          joined_at?: string;
        };
        Update: {
          project_id?: string;
          profile_id?: string;
          role_id?: string | null;
          joined_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'project_members_project_id_fkey';
            columns: ['project_id'];
            referencedRelation: 'projects';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_members_profile_id_fkey';
            columns: ['profile_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'project_members_role_id_fkey';
            columns: ['role_id'];
            referencedRelation: 'project_roles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
      handle_new_project_owner_member: {
        Args: Record<PropertyKey, never>;
        Returns: unknown;
      };
    };
    Enums: {
      project_status: ProjectStatus;
    };
  };
}

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type ProfileSkill = Database['public']['Tables']['profile_skills']['Row'];

export type Project = Database['public']['Tables']['projects']['Row'];
export type ProjectInsert = Database['public']['Tables']['projects']['Insert'];
export type ProjectUpdate = Database['public']['Tables']['projects']['Update'];

export type ProjectSkill = Database['public']['Tables']['project_skills']['Row'];
export type ProjectRole = Database['public']['Tables']['project_roles']['Row'];
export type ProjectRoleInsert = Database['public']['Tables']['project_roles']['Insert'];
export type ProjectRoleUpdate = Database['public']['Tables']['project_roles']['Update'];

export type ProjectRoleSkill = Database['public']['Tables']['project_role_skills']['Row'];
export type ProjectMember = Database['public']['Tables']['project_members']['Row'];
export type ProjectMemberInsert = Database['public']['Tables']['project_members']['Insert'];

export interface ProjectWithDetails extends Project {
  owner?: Profile;
  skills?: Skill[];
  roles?: (ProjectRole & { skills?: Skill[] })[];
  members?: (ProjectMember & { profile?: Profile; role?: ProjectRole | null })[];
}
