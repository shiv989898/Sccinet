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

#### Option A: Run in Web Browser (Fastest)
```bash
npm run web
```
This opens the application directly in your default browser at `http://localhost:8081`.

---

#### Option B: Run on Android Phone (via Expo Go App)

1. **Install Expo Go on your phone:**
   * Download and install **Expo Go** from the [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent).

2. **Connect to the same Wi-Fi:**
   * Make sure your computer and your Android phone are connected to the **same Wi-Fi network**.

3. **Start the Expo server:**
   ```bash
   npm start
   ```
   *(Make sure not to add any extra characters or backslashes at the end of the command).*

4. **Open on your phone:**
   * Open the **Expo Go** app on your Android phone.
   * Tap **"Scan QR code"** and point your camera at the QR code displayed in your computer's terminal.
   * Metro bundler will load the project, and Sccinet will open natively on your phone!

> **Note on Wi-Fi Isolation / Mobile Hotspot:**
> If your phone cannot connect to your PC's IP, use tunnel mode:
> ```bash
> npx expo start --tunnel
> ```

---

#### Option C: Run on Emulators
```bash
# Android Emulator (requires Android Studio)
npm run android

# iOS Simulator (requires macOS + Xcode)
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
