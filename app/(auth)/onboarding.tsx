import React, { useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../src/hooks/useTheme';
import { Button, AnimatedEntrance, TactilePressable } from '../../src/components/ui';

export default function OnboardingScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeSlide, setActiveSlide] = useState(0);

  const handleFinishOnboarding = () => {
    router.replace('/(auth)/sign-in');
  };

  return (
    <View style={styles.container}>
      {/* Top Bar with Skip Button */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 24),
          },
        ]}
      >
        <View style={{ flex: 1 }} />
        <TactilePressable
          onPress={handleFinishOnboarding}
          scaleTo={0.92}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
          style={[
            styles.skipButton,
            {
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderColor: 'rgba(255, 255, 255, 0.14)',
            },
          ]}
        >
          <Text
            style={[
              styles.skipText,
              { color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm },
            ]}
          >
            Skip
          </Text>
        </TactilePressable>
      </View>

      {/* Main Content */}
      <View style={styles.centerContainer}>
        {/* Title & Subtitle */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.titleGroup}>
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontSize: 28,
                  fontWeight: '700',
                  letterSpacing: -0.6,
                  textAlign: 'center',
                },
              ]}
            >
              Find your people{'\n'}Build amazing things
            </Text>

            <Text
              style={[
                styles.subtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginTop: 10,
                  maxWidth: 320,
                },
              ]}
            >
              Join a community of builders, creators and open-source enthusiasts.
            </Text>
          </View>
        </AnimatedEntrance>

        {/* 3D Frosted Glass Floating Tiles Cluster */}
        <AnimatedEntrance staggerIndex={1}>
          <View style={styles.tilesClusterContainer}>
            {/* Center / Top Blue People Tile */}
            <View
              style={[
                styles.tileLarge,
                {
                  backgroundColor: 'rgba(0, 102, 255, 0.35)',
                  borderColor: 'rgba(255, 255, 255, 0.35)',
                  ...Platform.select({
                    web: {
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      boxShadow:
                        '0 12px 32px rgba(0, 102, 255, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.45)',
                    } as any,
                    default: {
                      shadowColor: '#0066FF',
                      shadowOffset: { width: 0, height: 8 },
                      shadowOpacity: 0.45,
                      shadowRadius: 18,
                      elevation: 6,
                    },
                  }),
                },
              ]}
            >
              <Ionicons name="people" size={42} color="#FFFFFF" />
            </View>

            {/* Left Dark Code Bracket Tile */}
            <View
              style={[
                styles.tileMedium,
                styles.tileLeft,
                {
                  backgroundColor: 'rgba(16, 24, 40, 0.75)',
                  borderColor: 'rgba(255, 255, 255, 0.20)',
                  ...Platform.select({
                    web: {
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      boxShadow:
                        '0 8px 24px rgba(0, 0, 0, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
                    } as any,
                    default: {
                      shadowColor: '#000000',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.4,
                      shadowRadius: 14,
                      elevation: 5,
                    },
                  }),
                },
              ]}
            >
              <Ionicons name="code-slash" size={32} color="#60A5FA" />
            </View>

            {/* Right Amber Lightning Bolt Tile */}
            <View
              style={[
                styles.tileSmall,
                styles.tileRight,
                {
                  backgroundColor: 'rgba(245, 158, 11, 0.25)',
                  borderColor: 'rgba(255, 255, 255, 0.28)',
                  ...Platform.select({
                    web: {
                      backdropFilter: 'blur(20px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                      boxShadow:
                        '0 8px 24px rgba(245, 158, 11, 0.30), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
                    } as any,
                    default: {
                      shadowColor: '#F59E0B',
                      shadowOffset: { width: 0, height: 6 },
                      shadowOpacity: 0.35,
                      shadowRadius: 14,
                      elevation: 5,
                    },
                  }),
                },
              ]}
            >
              <Ionicons name="flash" size={28} color="#FBBF24" />
            </View>
          </View>
        </AnimatedEntrance>

        {/* 4 Pagination Dots */}
        <AnimatedEntrance staggerIndex={2}>
          <View style={styles.dotsRow}>
            {[0, 1, 2, 3].map((index) => {
              const isActive = index === activeSlide;
              return (
                <TactilePressable
                  key={index}
                  onPress={() => setActiveSlide(index)}
                  scaleTo={0.85}
                  hitSlop={{ top: 8, bottom: 8, left: 6, right: 6 }}
                  accessibilityRole="button"
                  accessibilityLabel={`Slide ${index + 1}`}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isActive
                        ? '#0066FF'
                        : 'rgba(255, 255, 255, 0.20)',
                      width: isActive ? 18 : 6,
                    },
                  ]}
                />
              );
            })}
          </View>
        </AnimatedEntrance>
      </View>

      {/* Bottom CTA Button */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(insets.bottom + 24, 32),
            paddingHorizontal: theme.spacing.xl,
          },
        ]}
      >
        <Button
          title="Get Started"
          variant="clayPrimary"
          size="lg"
          rightIcon={<Ionicons name="arrow-forward" size={18} color="#FFFFFF" />}
          onPress={handleFinishOnboarding}
          style={styles.getStartedButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  skipText: {
    fontWeight: '500',
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  titleGroup: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {},
  subtitle: {},
  tilesClusterContainer: {
    width: 240,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
  },
  tileLarge: {
    width: 96,
    height: 96,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  tileMedium: {
    width: 74,
    height: 74,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  tileLeft: {
    left: 12,
    top: 55,
    zIndex: 2,
    transform: [{ rotate: '-8deg' }],
  },
  tileSmall: {
    width: 68,
    height: 68,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  tileRight: {
    right: 14,
    top: 60,
    zIndex: 2,
    transform: [{ rotate: '10deg' }],
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 36,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  bottomBar: {},
  getStartedButton: {
    width: '100%',
    borderRadius: 16,
  },
});
