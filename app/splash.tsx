import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { AnimatedEntrance, SccinetLogo } from '../src/components/ui';

export default function SplashScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const handleProceed = () => {
    router.replace('/(tabs)');
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleProceed}
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top + 20, 40),
          paddingBottom: Math.max(insets.bottom + 24, 40),
        },
      ]}
    >
      <View style={{ flex: 1 }} />

      {/* Centered Brand Vessel matching Screen 1 */}
      <AnimatedEntrance duration={450}>
        <View style={styles.centerVessel}>
          <SccinetLogo size="xl" />

          <Text
            style={[
              styles.brandTitle,
              {
                color: theme.colors.text,
                fontSize: 34,
                fontWeight: '700',
                letterSpacing: -0.6,
                marginTop: 20,
              },
            ]}
          >
            Sccinet
          </Text>

          <Text
            style={[
              styles.brandMotto,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.md,
                letterSpacing: 0.2,
                marginTop: 6,
              },
            ]}
          >
            Build • Collaborate • Grow
          </Text>
        </View>
      </AnimatedEntrance>

      <View style={{ flex: 1 }} />

      {/* Bottom Quiet Manifesto matching Screen 1 */}
      <AnimatedEntrance duration={500} staggerIndex={1}>
        <View style={styles.bottomFooter}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.sm,
                textAlign: 'center',
                lineHeight: 20,
              },
            ]}
          >
            A network for builders{'\n'}creating a better tomorrow.
          </Text>
        </View>
      </AnimatedEntrance>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  centerVessel: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {},
  brandMotto: {
    fontWeight: '500',
  },
  bottomFooter: {
    alignItems: 'center',
  },
  footerText: {},
});
