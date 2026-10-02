# Sccinet

A social collaboration platform connecting builders, showcasing projects, and forming meaningful team partnerships.

> **People + Projects + Community + Collaboration**

---

## Overview

Sccinet combines ideas from:
- **Project Discovery & Team Collaboration** (inspired by open collaboration models): Discover what is being built, explore open roles, and join project teams.
- **Showcase & Visual Milestones** (inspired by creator showcases): Rich media feeds highlighting architecture, UI screens, release logs, and dev progress.
- **Professional Identity & Verified Skill Graph**: Showcase projects you lead or contribute to, connect with builders, and grow your collaborative network.

---

## Tech Stack

- **Frontend**: React Native, Expo (SDK 57), TypeScript, Expo Router
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **State Management**: TanStack Query (v5) for server cache + Zustand for client state
- **List Virtualization**: `@shopify/flash-list`
- **Media Pipeline**: `expo-image` + `expo-image-manipulator`
- **Validation**: Zod + React Hook Form

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- npm or bun

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/shiv989898/Sccinet.git
cd Sccinet

# Install dependencies
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Configure your Supabase credentials:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Running Locally
```bash
# Start the Expo development server
npm start

# Run on web
npm run web

# Run on Android
npm run android

# Run on iOS (macOS required)
npm run ios
```

### 5. Quality & Checks
```bash
# Typecheck
npx tsc --noEmit

# Lint
npm run lint

# Dependency & config diagnostics
npx expo-doctor
```

---

## License
MIT
