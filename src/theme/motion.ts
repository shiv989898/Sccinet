import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Standardized Central Motion System for Sccinet
 * Billion-dollar consumer product motion: short, tactile, calm, physically grounded.
 */

export const motionTokens = {
  // Timings (ms) - Restrained, fast, and responsive for real devices
  duration: {
    instant: 80,
    fast: 140,       // Tactile press, toggle switch, micro-transitions
    normal: 200,     // Screen enter, card expansion, tab switch
    deliberate: 260, // Modal presentation, sheet reveal, prominent state transition
    stagger: 25,     // Restrained stagger interval between hierarchical elements
  },

  // Distance of movement (px) - Restrained travel distances
  distance: {
    subtle: 3,       // Micro elevation / focus shift
    normal: 6,       // Standard entrance translate (calm, subtle)
    card: 8,         // Prominent card entrance
    sheet: 20,       // Slide from bottom / sheet reveal
  },

  // Scale factors for tactile responses
  scale: {
    pressedButton: 0.98, // Physical compression on button press (calm, restrained)
    pressedCard: 0.99,   // Subtle physical depression on card press
    pressedChip: 0.97,   // Tactile pill / chip tap
    pressedTab: 0.96,    // Tab bar icon micro-nudge
    entranceStart: 1.0,  // Pure opacity + subtle translate for entrances, zero text scale flutter
  },

  // TranslateY on press (px) - physically depresses the clay surface
  pressedTranslateY: 1,

  // Spring Physics configurations (for Animated.spring)
  // Tuned for real devices: critically damped, NO bounce, zero oscillation
  spring: {
    tactile: {
      tension: 320,
      friction: 28, // Fast return, crisp tactile feedback with zero rubbery overshoot
    },
    gentle: {
      tension: 180,
      friction: 26, // Damping ratio ~0.97, critically damped, smooth settling, ZERO bounce
    },
    snappy: {
      tension: 340,
      friction: 34, // Damping ratio ~0.92, swift glide for segmented controls & indicators, zero overshoot
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
