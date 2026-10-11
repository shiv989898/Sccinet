# Sccinet Design & Stitch Integration Guide

This document tracks design specs, design system tokens, and the end-to-end checklist for translating **Stitch** design explorations into production-grade React Native code.

---

## 🎨 Visual Identity & Design Language

Sccinet utilizes a **Tactile Claymorphism** aesthetic tailored for modern mobile devices.

### 1. Palette & Surface Rules
* **Light Theme**:
  * Canvas: Soft porcelain clay (`#EEF1F7`)
  * Cards / Surfaces: Crisp white clay (`#FFFFFF`) with subtle soft perimeter borders (`rgba(218, 226, 239, 0.6)`)
  * Primary Accent: Royal Blue (`#2563EB`)
  * Recessed Inputs / Tracks: Soft slate track (`#EFF2F8`)
* **Dark Theme**:
  * Canvas: Matte slate clay (`#131722`)
  * Cards / Surfaces: Elevated matte clay (`#1B2230`)
  * Accent: Electric Blue (`#3B82F6`)
  * Recessed Inputs: Sub-surface slate (`#161B26`)
* **Geometry**:
  * Large radii for cards (`borderRadius.xl` = 20px, `borderRadius.xxl` = 24px)
  * Fully rounded pill badges (`borderRadius.full` = 9999px)
  * Diffuse, multi-layered shadows without harsh hard edges

---

## 📋 End-to-End Design & Implementation Checklist

### Phase 1: Discover Experience (`app/(tabs)/discover.tsx`)
- [x] **Stitch Design**:
  - [x] Search input with clay inset styling & clear action.
  - [x] Segmented tab pill ("Projects" vs "Builders") with spring slider thumb.
  - [x] Horizontal skill filter pills carousel (*React Native, TypeScript, Rust, Python, UI/UX*).
  - [x] Project Card anatomy: cover banner, status badge, open roles indicator, skill tags, team avatar stack.
  - [x] Builder Card anatomy: avatar with clay ring, full name, headline, top skill chips, connect CTA.
  - [x] Contextual empty state and skeleton loading states.
- [x] **Artifact Export**:
  - [x] Export Stitch mockup/screenshot to `designs/discover/discover-screen.png`.
- [x] **Code Implementation**:
  - [x] Build `FilterChip` horizontal carousel.
  - [x] Build `DiscoverProjectCard` with interactive press states.
  - [x] Build `DiscoverBuilderCard`.
  - [x] Wire up real filtering queries via TanStack Query and search.
- [ ] **Review**:
  - [ ] Verify light & dark theme contrast.
  - [ ] Verify 60fps scrolling and spring micro-interactions.

---

### Phase 2: Social Activity Feed (`app/(tabs)/index.tsx`)
- [x] **Code Implementation**:
  - [x] `FeedLaunchCard` — dark cover band, builder byline, skill chips, Explore CTA.
  - [x] `FeedRoleCard` — left accent bar, team avatar stack, full-width Apply CTA.
  - [x] `FeedMilestoneCard` — terminal image band, expandable body, like/comment reactions with local state.
  - [x] `src/features/feed/data/mockFeedData.ts` — 6 realistic mixed items.
  - [x] `src/features/feed/utils/formatRelativeTime.ts` — relative timestamps.
  - [x] Feed screen uses `FlashList` + `RefreshControl`, top bar with brand/bell/new-project shortcut.
- [ ] **Review**:
  - [ ] Verify responsive layout across phone and web viewports.
  - [ ] Wire to real Supabase feed query once backend table exists.

---

### Phase 3: Public Profile Route (`app/profiles/[id].tsx`) — NEW
- [x] **Code Implementation**:
  - [x] New route at `app/profiles/[id].tsx`.
  - [x] Avatar, name, username, location, headline, bio, skill chips.
  - [x] Connect + Message CTAs.
  - [x] Owned projects list via `DiscoverProjectCard`.
  - [x] Loading skeleton, not-found state, pull-to-refresh.
  - [x] Fallback mock profiles pre-backend.
  - [x] Discover builder card taps → this route.
  - [x] Network screen card taps → this route.
- [x] **Review**:
  - [x] Wire project member avatar taps in `[id].tsx` → profile route.

---

### Phase 4: Project Detail Decomposition (`app/projects/[id].tsx`)
- [x] **Code Implementation**:
  - [x] Extract `ProjectHeader.tsx`.
  - [x] Extract `ProjectRolesSection.tsx`.
  - [x] Extract `ProjectMembersSection.tsx`.
  - [x] Extract `CollaborationApplyModal.tsx`.
  - [x] Extract `ProjectCollabRequestsSection.tsx`.
  - [x] Refactor `[id].tsx` to under 250 lines of orchestration logic.
- [x] **Review**:
  - [x] Validate non-owner vs owner permission states.

---

### Phase 5: Network Screen (`app/(tabs)/network.tsx`)
- [x] **Code Implementation**:
  - [x] Rebuilt as real builder directory using `FlashList` + `DiscoverBuilderCard`.
  - [x] Live search input filters by name, username, headline, and skills.
  - [x] Merges real DB profiles with supplemental mock data, de-duplicates.
  - [x] Pull-to-refresh, empty state, live result count.
  - [x] Card taps navigate to `app/profiles/[id].tsx`.
- [ ] **Review**:
  - [ ] Accessibility and touch target verification.

---

## 🛠️ Folder Conventions for Stitch Artifacts

Save your exported screenshots and specs here:

```text
Sccinet/
  ├── designs/
  │    ├── discover/
  │    │    └── discover-screen.png
  │    ├── feed/
  │    │    └── feed-screen.png
  │    └── projects/
  │         └── project-detail.png
```
