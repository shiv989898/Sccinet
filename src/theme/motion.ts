import { useEffect, useState } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

/**
 * Standardized Central Motion System for Sccinet
 * Billion-dollar consumer product motion: short, tactile, calm, physically grounded.
 */

export const motionTokens = {
  // Timings (ms) - Apple mobile interaction standards
  duration: {
    instant: 80,
    fast: 160,       // Tactile press, toggle switch, micro-transitions
    normal: 280,     // Screen enter, card expansion, tab switch
    deliberate: 360, // Modal presentation, sheet reveal, prominent state transition
    stagger: 45,     // Natural cascade interval between hierarchical elements
  },

  // Distance of movement (px) - Clearly visible travel distances on mobile
  distance: {
    subtle: 4,       // Micro elevation / focus shift
    normal: 16,      // Standard entrance translate (smooth, visible)
    card: 20,        // Prominent card entrance
    sheet: 36,       // Slide from bottom / sheet reveal
  },

  // Scale factors for tactile responses - calibrated for real human thumbs
  scale: {
    pressedButton: 0.95, // Visible 5% physical compression on button press
    pressedCard: 0.965,  // Visible 3.5% physical depression on card press
    pressedChip: 0.93,   // Tactile pill / chip tap
    pressedTab: 0.88,    // Tab bar icon micro-nudge
    entranceStart: 0.98, // Gentle scale-in matching Apple modal/card reveal
  },

  // TranslateY on press (px) - physically depresses the surface
  pressedTranslateY: 2,

  // Spring Physics configurations (for Animated.spring)
  // Tuned for real devices: responsive touch-down, smooth settling, subtle physical rebound
  spring: {
    tactile: {
      tension: 280,
      friction: 22, // Crisp tactile feedback with energetic return
    },
    gentle: {
      tension: 160,
      friction: 20, // Smooth settling for entrances and transitions
    },
    snappy: {
      tension: 300,
      friction: 26, // Swift glide for segmented controls & tab indicators
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
