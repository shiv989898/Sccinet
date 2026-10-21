import React from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../src/hooks/useTheme';
import { useThemeStore } from '../src/stores/useThemeStore';
import { useAuth } from '../src/features/auth/AuthContext';
import { Card, AnimatedEntrance, SegmentedControl, TactilePressable } from '../src/components/ui';

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
}

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { preference, setPreference } = useThemeStore();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of Sccinet?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/sign-in');
          },
        },
      ]
    );
  };

  const navItems: SettingItem[] = [
    {
      icon: 'notifications-outline',
      label: 'Notifications',
      onPress: () => Alert.alert('Notifications', 'Push notification preferences are up to date.'),
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacy & Security',
      onPress: () => Alert.alert('Privacy & Security', 'End-to-end security and privacy settings.'),
    },
    {
      icon: 'person-outline',
      label: 'Account',
      onPress: () => router.push('/profiles/edit'),
    },
    {
      icon: 'server-outline',
      label: 'Data & Storage',
      onPress: () => Alert.alert('Data & Storage', 'Cache and persistent sync management.'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Help & Support',
      onPress: () => Alert.alert('Support', 'Community Discord and support docs at docs.sccinet.dev'),
    },
    {
      icon: 'information-circle-outline',
      label: 'About Sccinet',
      onPress: () =>
        Alert.alert(
          'Sccinet Mobile',
          'Version 1.0.0 (Build 57)\nA network for builders creating a better tomorrow.'
        ),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Top Header Bar */}
      <View
        style={[
          styles.topBar,
          {
            paddingTop: Math.max(insets.top + 8, 20),
            borderBottomColor: theme.clay.borderCard,
          },
        ]}
      >
        <TactilePressable
          onPress={() => router.back()}
          style={[
            styles.backButton,
            {
              backgroundColor: theme.glass.clear.fill,
              borderColor: theme.glass.clear.border,
              borderWidth: 1,
            },
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color={theme.colors.text} />
        </TactilePressable>

        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.text, fontSize: theme.typography.sizes.xl },
          ]}
        >
          Settings
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            padding: theme.spacing.lg,
            paddingBottom: Math.max(insets.bottom + 40, 60),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section */}
        <AnimatedEntrance staggerIndex={0}>
          <Card variant="clay" padding="lg" style={styles.sectionCard}>
            <View style={styles.sectionHeaderRow}>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: theme.colors.primaryMuted },
                ]}
              >
                <Ionicons
                  name="color-palette-outline"
                  size={18}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.sectionLabel,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Appearance
              </Text>
            </View>

            <View style={{ marginTop: 14 }}>
              <SegmentedControl<'light' | 'dark' | 'system'>
                size="md"
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Auto', value: 'system' },
                ]}
                value={preference}
                onChange={setPreference}
              />
            </View>
          </Card>
        </AnimatedEntrance>

        {/* Navigation List Items */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="none" style={styles.menuCard}>
            {navItems.map((item, index) => {
              const isLast = index === navItems.length - 1;
              return (
                <TactilePressable
                  key={item.label}
                  onPress={item.onPress}
                  scaleTo={0.98}
                  style={[
                    styles.menuRow,
                    !isLast && {
                      borderBottomWidth: StyleSheet.hairlineWidth,
                      borderBottomColor: theme.clay.borderRecessed,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <View style={styles.menuLeft}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        {
                          color: theme.colors.text,
                          fontSize: theme.typography.sizes.md,
                        },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </TactilePressable>
              );
            })}
          </Card>
        </AnimatedEntrance>

        {/* Sign Out Button */}
        <AnimatedEntrance staggerIndex={2}>
          <TactilePressable
            onPress={handleSignOut}
            scaleTo={0.96}
            style={[
              styles.signOutButton,
              {
                borderColor: theme.isDark
                  ? 'rgba(239, 68, 68, 0.35)'
                  : 'rgba(239, 68, 68, 0.25)',
                backgroundColor: theme.isDark
                  ? 'rgba(239, 68, 68, 0.12)'
                  : 'rgba(239, 68, 68, 0.08)',
                ...Platform.select({
                  web: {
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                  } as any,
                }),
              },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Sign out"
          >
            <Ionicons name="log-out-outline" size={18} color={theme.colors.error} />
            <Text
              style={[
                styles.signOutText,
                {
                  color: theme.colors.error,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
            >
              Sign Out
            </Text>
          </TactilePressable>
        </AnimatedEntrance>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  content: {
    gap: 16,
  },
  sectionCard: {
    borderRadius: 22,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {},
  menuCard: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuText: {
    fontWeight: '500',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  signOutText: {},
});

