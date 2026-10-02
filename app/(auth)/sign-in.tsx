import React, { useState } from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { authService } from '../../src/services/auth/authService';
import { signInSchema, signUpSchema } from '../../src/features/auth/schemas';
import { Card, Button, Input, AnimatedEntrance } from '../../src/components/ui';

export default function SignInScreen() {
  const theme = useTheme();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [fadeAnim] = useState(() => new Animated.Value(1));
  const isSignUp = mode === 'signup';

  const switchMode = (newMode: 'signin' | 'signup') => {
    if (newMode === mode) return;
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.15,
        duration: 90,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      setMode(newMode);
      setErrorMessage(null);
      setFieldErrors({});
    }, 90);
  };

  const handleAuth = async () => {
    setErrorMessage(null);
    setFieldErrors({});

    if (isSignUp) {
      const validation = signUpSchema.safeParse({ fullName, email, password });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message;
          }
        }
        setFieldErrors(errors);
        return;
      }

      setLoading(true);
      const { data, error } = await authService.signUp(email, password, fullName);
      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      if (data?.session) {
        router.replace('/(auth)/onboarding');
      } else {
        setErrorMessage(
          'Registration initiated! If email confirmation is enabled, please check your inbox.'
        );
      }
    } else {
      const validation = signInSchema.safeParse({ email, password });
      if (!validation.success) {
        const errors: Record<string, string> = {};
        for (const issue of validation.error.issues) {
          if (issue.path[0]) {
            errors[issue.path[0].toString()] = issue.message;
          }
        }
        setFieldErrors(errors);
        return;
      }

      setLoading(true);
      const { error } = await authService.signIn(email, password);
      setLoading(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.replace('/(tabs)');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Minimal App Bar */}
        <View style={styles.topBar}>
          <View style={styles.brandRow}>
            <View
              style={[
                styles.brandLogoSmall,
                {
                  backgroundColor: theme.colors.primary,
                },
              ]}
            >
              <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
            </View>
            <Text
              style={[
                styles.brandTitle,
                { color: theme.colors.text, fontSize: theme.typography.sizes.lg },
              ]}
            >
              Sccinet
            </Text>
          </View>
        </View>

        {/* Main Minimal Clay Container */}
        <View style={styles.centerContainer}>
          <AnimatedEntrance duration={280}>
            <Card variant="clay" padding="xl" style={styles.authCard}>
              {/* Header / Identity */}
              <View style={styles.header}>
                <View
                  style={[
                    styles.logoBadge,
                    {
                      backgroundColor: theme.clay.surface,
                      borderColor: theme.clay.borderCard,
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webChipShadow,
                        } as any,
                        default: {
                          ...theme.clay.shadowChip,
                        },
                      }),
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.logoInner,
                      {
                        backgroundColor: theme.colors.primary,
                      },
                    ]}
                  >
                    <Ionicons name="shield-checkmark" size={18} color="#FFFFFF" />
                  </View>
                </View>

                <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.xxl,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    {isSignUp ? 'Create account' : 'Welcome back'}
                  </Text>
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {isSignUp
                      ? 'Start building and collaborating'
                      : 'Sign in to your builder workspace'}
                  </Text>
                </Animated.View>
              </View>

            {/* Segmented Pill Track */}
            <View
              style={[
                styles.segmentedTrack,
                {
                  backgroundColor: theme.clay.surfaceTrack,
                  borderColor: theme.clay.borderRecessed,
                  ...Platform.select({
                    web: {
                      boxShadow: theme.clay.webRecessedTrackShadow,
                    } as any,
                  }),
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => switchMode('signin')}
                style={[
                  styles.segmentTab,
                  !isSignUp && [
                    styles.segmentTabActive,
                    {
                      backgroundColor: theme.clay.surfaceActivePill,
                      borderColor: theme.clay.borderCard,
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webPillShadow,
                        } as any,
                        default: {
                          ...theme.clay.shadowPill,
                        },
                      }),
                    },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: !isSignUp ? theme.colors.primary : theme.colors.textSecondary,
                      fontWeight: !isSignUp
                        ? theme.typography.weights.semibold
                        : theme.typography.weights.medium,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => switchMode('signup')}
                style={[
                  styles.segmentTab,
                  isSignUp && [
                    styles.segmentTabActive,
                    {
                      backgroundColor: theme.clay.surfaceActivePill,
                      borderColor: theme.clay.borderCard,
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webPillShadow,
                        } as any,
                        default: {
                          ...theme.clay.shadowPill,
                        },
                      }),
                    },
                  ],
                ]}
              >
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: isSignUp ? theme.colors.primary : theme.colors.textSecondary,
                      fontWeight: isSignUp
                        ? theme.typography.weights.semibold
                        : theme.typography.weights.medium,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Error Message */}
            {errorMessage && (
              <View
                style={[
                  styles.errorBanner,
                  {
                    backgroundColor: theme.colors.errorMuted,
                    borderColor: theme.colors.error,
                  },
                ]}
              >
                <Ionicons name="alert-circle" size={16} color={theme.colors.error} />
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errorMessage}
                </Text>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.form}>
              {isSignUp && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Rivera"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                  error={fieldErrors.fullName}
                  leftAccessory={
                    <Ionicons
                      name="person-outline"
                      size={18}
                      color={theme.colors.textMuted}
                      style={styles.inputIcon}
                    />
                  }
                />
              )}

              <Input
                label="Email address"
                placeholder="name@work.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={fieldErrors.email}
                leftAccessory={
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={theme.colors.textMuted}
                    style={styles.inputIcon}
                  />
                }
              />

              <View style={styles.passwordWrapper}>
                <Input
                  label="Password"
                  placeholder="••••••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  error={fieldErrors.password}
                  leftAccessory={
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={theme.colors.textMuted}
                      style={styles.inputIcon}
                    />
                  }
                  rightAccessory={
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={18}
                        color={theme.colors.textMuted}
                      />
                    </TouchableOpacity>
                  }
                />
              </View>

              {!isSignUp && (
                <View style={styles.forgotRow}>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.forgotText,
                        {
                          color: theme.colors.primary,
                          fontSize: theme.typography.sizes.xs,
                        },
                      ]}
                    >
                      Forgot password?
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Primary Action Button */}
              <View style={styles.actionContainer}>
                <Button
                  title={isSignUp ? 'Create account' : 'Sign in'}
                  variant="clayPrimary"
                  size="lg"
                  loading={loading}
                  onPress={handleAuth}
                />
              </View>
            </View>

            {/* Subtle Divider */}
            <View style={styles.dividerRow}>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.clay.borderCard },
                ]}
              />
              <Text
                style={[
                  styles.dividerText,
                  {
                    color: theme.colors.textMuted,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                or continue with
              </Text>
              <View
                style={[
                  styles.dividerLine,
                  { backgroundColor: theme.clay.borderCard },
                ]}
              />
            </View>

            {/* Tactile Secondary / Social Buttons */}
            <View style={styles.socialRow}>
              <Button
                title="Google"
                variant="claySecondary"
                style={styles.socialButton}
                leftIcon={
                  <Ionicons name="logo-google" size={16} color={theme.colors.text} />
                }
                onPress={() => {
                  setErrorMessage('Google OAuth integration configured via Supabase provider.');
                }}
              />
              <Button
                title="GitHub"
                variant="claySecondary"
                style={styles.socialButton}
                leftIcon={
                  <Ionicons name="logo-github" size={16} color={theme.colors.text} />
                }
                onPress={() => {
                  setErrorMessage('GitHub OAuth integration configured via Supabase provider.');
                }}
              />
            </View>
          </Card>
        </AnimatedEntrance>

          {/* Minimal Bottom Switch Link */}
          <View style={styles.bottomSwitchRow}>
            <Text
              style={[
                styles.bottomSwitchPrompt,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                },
              ]}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() => switchMode(isSignUp ? 'signin' : 'signup')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.bottomSwitchAction,
                  {
                    color: theme.colors.primary,
                    fontWeight: theme.typography.weights.semibold,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                {isSignUp ? 'Sign in' : 'Sign up'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Minimal Quiet Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            Sccinet • Professional Network for Builders
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  topBar: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandLogoSmall: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
  },
  authCard: {
    width: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoInner: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    letterSpacing: -0.3,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  segmentedTrack: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 20,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentTabActive: {
    borderWidth: 1,
  },
  segmentText: {},
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
  },
  form: {
    gap: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordWrapper: {},
  forgotRow: {
    alignItems: 'flex-end',
    marginTop: -4,
  },
  forgotText: {
    fontWeight: '500',
  },
  actionContainer: {
    marginTop: 6,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {},
  socialRow: {
    flexDirection: 'row',
    gap: 10,
  },
  socialButton: {
    flex: 1,
  },
  bottomSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    gap: 6,
  },
  bottomSwitchPrompt: {},
  bottomSwitchAction: {},
  footer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  footerText: {},
});
