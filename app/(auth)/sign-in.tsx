import React, { useState } from 'react';
import {
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
import { Card, Button, Input, Badge } from '../../src/components/ui';

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

  const isSignUp = mode === 'signup';

  const switchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setErrorMessage(null);
    setFieldErrors({});
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
        // Confirmation email sent or awaiting confirmation
        setErrorMessage(
          'Registration initiated! If email confirmation is enabled on your Supabase instance, please check your inbox.'
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
      >
        {/* Brand Header */}
        <View style={styles.brandSection}>
          <View
            style={[
              styles.logoBadge,
              {
                backgroundColor: theme.colors.primaryMuted,
                borderColor: theme.colors.primary,
              },
            ]}
          >
            <Ionicons name="sparkles" size={28} color={theme.colors.primary} />
          </View>
          <Text
            style={[
              styles.brandTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.xxxl,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            Sccinet
          </Text>
          <Text
            style={[
              styles.brandTagline,
              {
                color: theme.colors.textSecondary,
                fontSize: theme.typography.sizes.sm,
              },
            ]}
          >
            Where builders connect, showcase, and collaborate
          </Text>
        </View>

        {/* Auth Card */}
        <Card variant="elevated" style={styles.card}>
          {/* Segmented Mode Toggle */}
          <View
            style={[
              styles.toggleContainer,
              {
                backgroundColor: theme.colors.surfaceSubtle,
                borderRadius: theme.borderRadius.md,
              },
            ]}
          >
            <TouchableOpacity
              onPress={() => switchMode('signin')}
              style={[
                styles.toggleBtn,
                !isSignUp && {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.sm,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: !isSignUp ? theme.colors.text : theme.colors.textMuted,
                    fontWeight: !isSignUp ? '600' : '400',
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => switchMode('signup')}
              style={[
                styles.toggleBtn,
                isSignUp && {
                  backgroundColor: theme.colors.surface,
                  borderRadius: theme.borderRadius.sm,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.toggleText,
                  {
                    color: isSignUp ? theme.colors.text : theme.colors.textMuted,
                    fontWeight: isSignUp ? '600' : '400',
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
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
              <Ionicons
                name="alert-circle-outline"
                size={18}
                color={theme.colors.error}
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.errorBannerText,
                  {
                    color: theme.colors.error,
                    fontSize: theme.typography.sizes.xs,
                  },
                ]}
              >
                {errorMessage}
              </Text>
            </View>
          )}

          {/* Form Fields */}
          <View style={styles.formGroup}>
            {isSignUp && (
              <Input
                label="Full Name"
                placeholder="Alex Rivera"
                value={fullName}
                onChangeText={setFullName}
                error={fieldErrors.fullName}
                autoCapitalize="words"
                leftAccessory={
                  <Ionicons
                    name="person-outline"
                    size={18}
                    color={theme.colors.textMuted}
                    style={{ marginRight: 8 }}
                  />
                }
              />
            )}

            <Input
              label="Email Address"
              placeholder="you@domain.com"
              value={email}
              onChangeText={setEmail}
              error={fieldErrors.email}
              autoCapitalize="none"
              keyboardType="email-address"
              leftAccessory={
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
            />

            <Input
              label="Password"
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              error={fieldErrors.password}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              leftAccessory={
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={theme.colors.textMuted}
                  style={{ marginRight: 8 }}
                />
              }
              rightAccessory={
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={theme.colors.textMuted}
                  />
                </TouchableOpacity>
              }
            />

            <Button
              title={isSignUp ? 'Create Account' : 'Sign In'}
              onPress={handleAuth}
              loading={loading}
              variant="primary"
              size="lg"
              style={styles.submitBtn}
            />
          </View>

          {/* Mode Switch Helper */}
          <View style={styles.switchRow}>
            <Text
              style={[
                styles.switchPrompt,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.xs,
                },
              ]}
            >
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity
              onPress={() => switchMode(isSignUp ? 'signin' : 'signup')}
              style={styles.switchLinkBtn}
            >
              <Text
                style={[
                  styles.switchLink,
                  {
                    color: theme.colors.primary,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* Footer info pill */}
        <View style={styles.footerPill}>
          <Badge
            label="Built for engineers, designers & builders"
            variant="default"
            size="sm"
          />
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
    justifyContent: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  brandSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandTitle: {
    letterSpacing: -0.5,
  },
  brandTagline: {
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    padding: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    padding: 4,
    marginBottom: 20,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {},
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    lineHeight: 18,
  },
  formGroup: {
    gap: 16,
  },
  submitBtn: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchPrompt: {},
  switchLinkBtn: {
    marginLeft: 6,
  },
  switchLink: {},
  footerPill: {
    alignItems: 'center',
    marginTop: 28,
  },
});
