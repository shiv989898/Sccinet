---
name: rn-modern-ui
description: Use when creating or editing any React Native screen or component in this project, to enforce the design system, folder structure, and quality rules.
---

# Rules
- Use tokens from src/theme only; never hardcode colors, spacing, or font sizes
- Build screens from components in src/components/ui; add new primitives there
- Every screen handles loading, empty, and error states
- TypeScript strict, no `any`
- Touch targets >= 44px, add accessibilityLabel to interactive elements
- Use FlashList/FlatList for lists, Reanimated for animation
- Feature-based folders under src/features