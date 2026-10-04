import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Standardized Central Motion System for Sccinet
 * Billion-dollar consumer product motion: short, tactile, calm, physically grounded.
 */

export const motionTokens = {
  // Timings (ms) - Short and crisp; no cartoon-like slow animations
  duration: {
    instant: 80,
    fast: 150,       // Tactile press, toggle switch, micro-transitions
    normal: 220,     // Screen enter, card expansion, tab switch
    deliberate: 300, // Modal presentation, sheet reveal, prominent state transition
    stagger: 40,     // Standard stagger interval between hierarchical elements
  },

  // Distance of movement (px) - Restrained travel distances
  distance: {
    subtle: 4,       // Micro elevation / focus shift
    normal: 8,       // Standard entrance translate
    card: 12,        // Prominent card entrance
    sheet: 24,       // Slide from bottom / sheet reveal
  },

  // Scale factors for tactile responses
  scale: {
    pressedButton: 0.975, // Physical compression on button press
    pressedCard: 0.988,   // Subtle physical depression on card press
    pressedChip: 0.96,    // Tactile pill / chip tap
    pressedTab: 0.92,     // Tab bar icon tap
    entranceStart: 0.99,  // Subtle scale-up on screen entrance
  },

  // TranslateY on press (px) - physically depresses the clay surface
  pressedTranslateY: 1,

  // Spring Physics configurations (for Animated.spring)
  spring: {
    tactile: {
      tension: 300,
      friction: 20,
    },
    gentle: {
      tension: 190,
      friction: 18,
    },
    snappy: {
      tension: 320,
      friction: 24,
    },
  },

  // Easing curves (for web CSS transitions and Animated.timing)
  easing: {
    standard: 'cubic-bezier(0.16, 1, 0.3, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    subtle: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  },
} as const;

/**
 * React hook to observe user preference for reduced motion.
 * Respects OS accessibility settings across iOS, Android, and Web.
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check initial state
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (isMounted) {
          setReducedMotion(enabled);
        }
      })
      .catch(() => {
        // Fallback: disabled
      });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => {
        if (isMounted) {
          setReducedMotion(enabled);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove();
    };
  }, []);

  return reducedMotion;
}

/**
 * Helper to determine if native driver is supported.
 * React Native on Web does not support native driver.
 */
export const isNativeDriverSupported = Platform.OS !== 'web';
