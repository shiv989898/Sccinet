export type FeedItemType = 'launch' | 'role' | 'milestone';

export interface FeedBuilder {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
  headline: string;
}

export interface FeedSkill {
  id: string;
  name: string;
}

export interface FeedLaunchItem {
  type: 'launch';
  id: string;
  project: {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverGradient: [string, string];
    skills: FeedSkill[];
  };
  builder: FeedBuilder;
  postedAt: string; // ISO string
}

export interface FeedRoleItem {
  type: 'role';
  id: string;
  project: {
    id: string;
    title: string;
    slug: string;
    memberCount: number;
    members: { id: string; name: string; avatarUrl: string | null }[];
  };
  role: {
    title: string;
    commitment: string; // e.g. "Part-time · Remote"
    skills: FeedSkill[];
  };
  postedAt: string;
}

export interface FeedMilestoneItem {
  type: 'milestone';
  id: string;
  project: {
    id: string;
    title: string;
    slug: string;
  };
  builder: FeedBuilder;
  milestone: {
    title: string;
    body: string;
    imageGradient: [string, string];
    likeCount: number;
    commentCount: number;
  };
  postedAt: string;
}

export type FeedItem = FeedLaunchItem | FeedRoleItem | FeedMilestoneItem;

export const MOCK_FEED: FeedItem[] = [
  {
    type: 'launch',
    id: 'feed-1',
    project: {
      id: 'hyperscale-db',
      title: 'HyperScale DB',
      slug: 'hyperscale-db',
      description:
        'Next-gen distributed SQLite engine built for edge compute. Multi-region sync in under 12ms with zero-config replication.',
      coverGradient: ['#1E3A5F', '#0F2640'],
      skills: [
        { id: 's1', name: 'Rust' },
        { id: 's2', name: 'PostgreSQL' },
        { id: 's3', name: 'WASM' },
      ],
    },
    builder: {
      id: 'b1',
      name: 'Elena Rostova',
      username: 'elrostova',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120',
      headline: 'Systems Engineer · ex-PlanetScale',
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 47).toISOString(),
  },
  {
    type: 'role',
    id: 'feed-2',
    project: {
      id: 'suno-canvas',
      title: 'Suno Canvas',
      slug: 'suno-canvas',
      memberCount: 3,
      members: [
        { id: 'm1', name: 'David Kim', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120' },
        { id: 'm2', name: 'Aisha Patel', avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120' },
        { id: 'm3', name: 'Jordan Vance', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120' },
      ],
    },
    role: {
      title: 'Lead WebGL Renderer',
      commitment: 'Part-time · Remote',
      skills: [
        { id: 's4', name: 'WebGL' },
        { id: 's5', name: 'TypeScript' },
        { id: 's6', name: 'GLSL' },
      ],
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    type: 'milestone',
    id: 'feed-3',
    project: {
      id: 'hyperscale-db',
      title: 'HyperScale DB',
      slug: 'hyperscale-db',
    },
    builder: {
      id: 'b2',
      name: 'Marcus Chen',
      username: 'mchen',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120',
      headline: 'Database Internals · Rust',
    },
    milestone: {
      title: 'WAL compression down 40%',
      body: 'Shipped a custom ZSTD dictionary trained on our workload. Write-ahead log size dropped from 2.1GB to 1.26GB in prod. Replication lag cut in half as a side effect.',
      imageGradient: ['#0F2640', '#162032'],
      likeCount: 24,
      commentCount: 7,
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    type: 'role',
    id: 'feed-4',
    project: {
      id: 'lumen-os',
      title: 'Lumen OS',
      slug: 'lumen-os',
      memberCount: 2,
      members: [
        { id: 'm4', name: 'Maya Lin', avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=140' },
        { id: 'm5', name: 'Alex Rivera', avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=140' },
      ],
    },
    role: {
      title: 'Kernel Systems Contributor',
      commitment: 'Open-source · Flexible',
      skills: [
        { id: 's7', name: 'Rust' },
        { id: 's8', name: 'C' },
        { id: 's9', name: 'ARM' },
      ],
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
  },
  {
    type: 'launch',
    id: 'feed-5',
    project: {
      id: 'drift-api',
      title: 'Drift API',
      slug: 'drift-api',
      description:
        'Schema-first REST gateway that infers your database schema and generates fully typed SDK clients — Go, TypeScript, Python — in one command.',
      coverGradient: ['#1A1040', '#0E0A2A'],
      skills: [
        { id: 's10', name: 'Go' },
        { id: 's11', name: 'TypeScript' },
        { id: 's12', name: 'GraphQL' },
      ],
    },
    builder: {
      id: 'b3',
      name: 'Jordan Vance',
      username: 'jvance',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120',
      headline: 'Distributed Systems · ex-Cockroach Labs',
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22).toISOString(),
  },
  {
    type: 'milestone',
    id: 'feed-6',
    project: {
      id: 'suno-canvas',
      title: 'Suno Canvas',
      slug: 'suno-canvas',
    },
    builder: {
      id: 'b4',
      name: 'Aisha Patel',
      username: 'aisha',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120',
      headline: 'UI Architect · Design Systems',
    },
    milestone: {
      title: 'Infinite canvas rendering at 120fps',
      body: 'Moved all transform math off the JS thread into a Reanimated worklet. Canvas now renders at native 120fps on ProMotion displays. No more jank on zoom gestures.',
      imageGradient: ['#1A2035', '#0F1525'],
      likeCount: 41,
      commentCount: 12,
    },
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
  },
];
