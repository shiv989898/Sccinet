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
import { motionTokens, useReducedMotion } from '../../src/theme/motion';

export default function SignInScreen() {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isWeb = Platform.OS === 'web';
  const [tabAnim] = useState(() => new Animated.Value(mode === 'signup' ? 1 : 0));
  const [contentFadeAnim] = useState(() => new Animated.Value(1));
  const [contentSlideAnim] = useState(() => new Animated.Value(0));
  const [errorAnim] = useState(() => new Animated.Value(0));
  const [trackWidth, setTrackWidth] = useState(0);
  const isSignUp = mode === 'signup';

  React.useEffect(() => {
    if (errorMessage) {
      if (reducedMotion) {
        errorAnim.setValue(1);
        return;
      }
      Animated.timing(errorAnim, {
        toValue: 1,
        duration: motionTokens.duration.fast,
        useNativeDriver: !isWeb,
      }).start();
    } else {
      errorAnim.setValue(0);
    }
  }, [errorMessage, errorAnim, isWeb, reducedMotion]);

  const switchMode = (newMode: 'signin' | 'signup') => {
    if (newMode === mode) return;

    setMode(newMode);
    setErrorMessage(null);
    setFieldErrors({});

    // Critically damped spring for segmented pill thumb on native
    if (!isWeb) {
      if (reducedMotion) {
        tabAnim.setValue(newMode === 'signup' ? 1 : 0);
      } else {
        Animated.spring(tabAnim, {
          toValue: newMode === 'signup' ? 1 : 0,
          tension: motionTokens.spring.snappy.tension,
          friction: motionTokens.spring.snappy.friction,
          useNativeDriver: true,
        }).start();
      }
    }

    // Silky crossfade + micro drift for header title
    Animated.sequence([
      Animated.timing(contentFadeAnim, {
        toValue: 0.2,
        duration: 80,
        useNativeDriver: !isWeb,
      }),
      Animated.parallel([
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 160,
          useNativeDriver: !isWeb,
        }),
        Animated.spring(contentSlideAnim, {
          toValue: 0,
          tension: 220,
          friction: 20,
          useNativeDriver: !isWeb,
        }),
      ]),
    ]).start();
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
        <AnimatedEntrance duration={320}>
          <View style={styles.centerContainer}>
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

                <Animated.View
                  style={{
                    opacity: contentFadeAnim,
                    transform: [{ translateY: contentSlideAnim }],
                    alignItems: 'center',
                  }}
                >
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

              {/* Segmented Pill Track with Apple-level sliding thumb */}
              <View
                onLayout={(e) => setTrackWidth(e.nativeEvent.layout.width)}
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
                {/* Physical sliding clay thumb */}
                <Animated.View
                  style={[
                    styles.slidingThumb,
                    {
                      width: trackWidth > 0 ? (trackWidth - 6) / 2 : '48%',
                      backgroundColor: theme.clay.surfaceActivePill,
                      borderColor: theme.clay.borderCard,
                      transform: [
                        {
                          translateX: isWeb
                            ? (isSignUp ? (trackWidth > 0 ? (trackWidth - 6) / 2 : 185) : 0)
                            : tabAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0, trackWidth > 0 ? (trackWidth - 6) / 2 : 185],
                              }),
                        },
                      ],
                      ...Platform.select({
                        web: {
                          boxShadow: theme.clay.webPillShadow,
                          transition:
                            'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
                        } as any,
                        default: {
                          ...theme.clay.shadowPill,
                        },
                      }),
                    },
                  ]}
                />

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => switchMode('signin')}
                  style={styles.segmentTab}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: !isSignUp
                          ? (theme.isDark ? '#FFFFFF' : theme.colors.primary)
                          : (theme.isDark ? '#94A3B8' : theme.colors.textSecondary),
                        fontWeight: !isSignUp ? '600' : '500',
                        fontSize: theme.typography.sizes.sm,
                        ...Platform.select({
                          web: {
                            transition: 'color 0.2s ease',
                          } as any,
                        }),
                      },
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => switchMode('signup')}
                  style={styles.segmentTab}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color: isSignUp
                          ? (theme.isDark ? '#FFFFFF' : theme.colors.primary)
                          : (theme.isDark ? '#94A3B8' : theme.colors.textSecondary),
                        fontWeight: isSignUp ? '600' : '500',
                        fontSize: theme.typography.sizes.sm,
                        ...Platform.select({
                          web: {
                            transition: 'color 0.2s ease',
                          } as any,
                        }),
                      },
                    ]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Error Message */}
              {errorMessage && (
                <Animated.View
                  style={{
                    opacity: errorAnim,
                    transform: [
                      {
                        translateY: errorAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-6, 0],
                        }),
                      },
                    ],
                  }}
                >
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
                </Animated.View>
              )}

              {/* Form Fields with Apple-grade Liquid Accordion */}
              <View style={styles.form}>
                {/* Full Name smooth accordion unroll */}
                <Animated.View
                  style={[
                    styles.expandableField,
                    {
                      maxHeight: isSignUp ? 110 : 0,
                      opacity: isSignUp ? 1 : 0,
                      marginBottom: isSignUp ? 18 : 0,
                      transform: isSignUp
                        ? [{ translateY: 0 }, { scale: 1 }]
                        : [{ translateY: -10 }, { scale: 0.98 }],
                      overflow: 'hidden',
                      ...Platform.select({
                        web: {
                          transition:
                            'max-height 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), margin-bottom 0.32s cubic-bezier(0.16, 1, 0.3, 1)',
                          pointerEvents: isSignUp ? 'auto' : 'none',
                        } as any,
                      }),
                    },
                  ]}
                >
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
                </Animated.View>

                {/* Email Address */}
                <View style={styles.fieldWrapper}>
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
                </View>

                {/* Password */}
                <View style={[styles.fieldWrapper, { marginBottom: isSignUp ? 22 : 10 }]}>
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

                {/* Forgot Password Accordion */}
                <Animated.View
                  style={[
                    styles.forgotRow,
                    {
                      maxHeight: !isSignUp ? 32 : 0,
                      opacity: !isSignUp ? 1 : 0,
                      transform: !isSignUp ? [{ translateY: 0 }] : [{ translateY: -6 }],
                      marginBottom: !isSignUp ? 20 : 0,
                      overflow: 'hidden',
                      ...Platform.select({
                        web: {
                          transition:
                            'max-height 0.28s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.22s ease, transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), margin-bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
                          pointerEvents: !isSignUp ? 'auto' : 'none',
                        } as any,
                      }),
                    },
                  ]}
                >
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
                </Animated.View>

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
        </AnimatedEntrance>

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
    marginBottom: 24,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  segmentedTrack: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  slidingThumb: {
    position: 'absolute',
    top: 3,
    bottom: 3,
    left: 3,
    borderRadius: 11,
    borderWidth: 1,
    zIndex: 1,
  },
  segmentTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: 'transparent',
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
    width: '100%',
  },
  expandableField: {
    width: '100%',
  },
  fieldWrapper: {
    width: '100%',
    marginBottom: 18,
  },
  inputIcon: {
    marginRight: 10,
  },
  passwordWrapper: {
    width: '100%',
  },
  forgotRow: {
    alignItems: 'flex-end',
    width: '100%',
  },
  forgotText: {
    fontWeight: '500',
  },
  actionContainer: {
    width: '100%',
    marginTop: 0,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 22,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {},
  socialRow: {
    flexDirection: 'row',
    gap: 12,
  },
  socialButton: {
    flex: 1,
  },
  bottomSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    gap: 6,
  },
  bottomSwitchPrompt: {},
  bottomSwitchAction: {},
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  footerText: {},
});
