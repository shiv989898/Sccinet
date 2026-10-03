import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { AnimatedEntrance, Badge, Button, Card } from '../../src/components/ui';
import { useProject } from '../../src/features/projects';

export default function ProjectDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const { data: project, isLoading, error } = useProject(id);

  const getStatusBadgeVariant = (status: string): 'success' | 'primary' | 'default' => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'COMPLETED':
        return 'primary';
      case 'ARCHIVED':
      default:
        return 'default';
    }
  };

  const handleOpenUrl = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    } catch {
      // Gracefully handle invalid or unopenable link
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Minimal Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          onPress={() => router.replace('/(tabs)/workspace')}
          style={({ pressed }) => [
            styles.backButton,
            {
              backgroundColor: theme.clay.surface,
              borderColor: theme.clay.borderCard,
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
              ...Platform.select({
                web: {
                  boxShadow: theme.clay.webCardShadow,
                } as any,
                default: theme.clay.shadowPill,
              }),
            },
          ]}
        >
          <Ionicons name="arrow-back" size={18} color={theme.colors.text} />
        </Pressable>

        <View style={styles.topBarTitleContainer}>
          <Text
            style={[
              styles.topBarTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.md,
                fontWeight: theme.typography.weights.semibold,
              },
            ]}
          >
            Project
          </Text>
        </View>

        <View style={styles.topBarRightSlot} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text
              style={[
                styles.loadingText,
                { color: theme.colors.textMuted, fontSize: theme.typography.sizes.sm },
              ]}
            >
              Loading project details...
            </Text>
          </View>
        ) : error || !project ? (
          <View style={styles.errorContainer}>
            <Card variant="clay" padding="lg" style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={42} color={theme.colors.error} />
              <Text
                style={[
                  styles.errorTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.bold,
                  },
                ]}
              >
                Project Not Found
              </Text>
              <Text
                style={[
                  styles.errorSubtitle,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                  },
                ]}
              >
                The requested project could not be located or has been archived.
              </Text>

              <Button
                title="Return to Workspace"
                variant="clayPrimary"
                size="md"
                onPress={() => router.replace('/(tabs)/workspace')}
                style={{ marginTop: 16 }}
              />
            </Card>
          </View>
        ) : (
          <AnimatedEntrance duration={280}>
            <View style={styles.centerContainer}>
              {/* Project Main Card */}
              <Card variant="clay" padding="lg" style={styles.projectCard}>
                {/* Header Row: Status & Timestamp */}
                <View style={styles.headerRow}>
                  <Badge
                    label={project.status}
                    variant={getStatusBadgeVariant(project.status)}
                    size="sm"
                  />
                  <Text
                    style={[
                      styles.slugText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      },
                    ]}
                  >
                    /{project.slug}
                  </Text>
                </View>

                {/* Project Title */}
                <Text
                  style={[
                    styles.projectTitle,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.xxl,
                      fontWeight: theme.typography.weights.bold,
                    },
                  ]}
                >
                  {project.title}
                </Text>

                {/* Description */}
                {project.description ? (
                  <Text
                    style={[
                      styles.projectDescription,
                      {
                        color: theme.colors.textSecondary,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {project.description}
                  </Text>
                ) : null}

                {/* External Action Links */}
                {(project.repository_url || project.live_url) && (
                  <View style={styles.linksRow}>
                    {project.repository_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.repository_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          },
                        ]}
                      >
                        <Ionicons
                          name="logo-github"
                          size={16}
                          color={theme.colors.text}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Repository
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}

                    {project.live_url ? (
                      <Pressable
                        onPress={() => handleOpenUrl(project.live_url!)}
                        style={({ pressed }) => [
                          styles.linkChip,
                          {
                            backgroundColor: theme.clay.surfaceRecessed,
                            borderColor: theme.clay.borderCard,
                            opacity: pressed ? 0.8 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }],
                          },
                        ]}
                      >
                        <Ionicons
                          name="globe-outline"
                          size={16}
                          color={theme.colors.primary}
                          style={{ marginRight: 6 }}
                        />
                        <Text
                          style={[
                            styles.linkChipText,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.xs,
                              fontWeight: theme.typography.weights.medium,
                            },
                          ]}
                        >
                          Live Platform
                        </Text>
                        <Ionicons
                          name="open-outline"
                          size={12}
                          color={theme.colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ) : null}
                  </View>
                )}

                {/* Skills Section */}
                {project.skills && project.skills.length > 0 && (
                  <View style={styles.skillsSection}>
                    <Text
                      style={[
                        styles.sectionHeading,
                        {
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.sizes.xs,
                          fontWeight: theme.typography.weights.semibold,
                        },
                      ]}
                    >
                      REQUIRED SKILLS ({project.skills.length})
                    </Text>

                    <View style={styles.skillsCluster}>
                      {project.skills.map((skill) => (
                        <View
                          key={skill.id}
                          style={[
                            styles.skillBadge,
                            {
                              backgroundColor: theme.clay.surfaceChipSelected,
                              borderColor: theme.clay.borderChipSelected,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.skillBadgeText,
                              {
                                color: theme.clay.textChipSelected,
                                fontSize: theme.typography.sizes.xs,
                                fontWeight: theme.typography.weights.medium,
                              },
                            ]}
                          >
                            {skill.name}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Return button */}
                <View style={styles.footerContainer}>
                  <Button
                    title="Back to Workspace"
                    variant="clayPrimary"
                    size="md"
                    onPress={() => router.replace('/(tabs)/workspace')}
                    leftIcon={<Ionicons name="briefcase-outline" size={16} color="#FFFFFF" />}
                  />
                </View>
              </Card>
            </View>
          </AnimatedEntrance>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 16 : 24,
    paddingBottom: 16,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  topBarTitleContainer: {
    alignItems: 'center',
  },
  topBarTitle: {},
  topBarRightSlot: {
    width: 38,
  },
  centerContainer: {
    width: '100%',
    maxWidth: 620,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
  },
  errorContainer: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  errorCard: {
    alignItems: 'center',
    textAlign: 'center',
    borderRadius: 24,
    gap: 12,
  },
  errorTitle: {},
  errorSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
  projectCard: {
    borderRadius: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  slugText: {
    fontFamily: Platform.select({ ios: 'Courier', default: 'monospace' }),
  },
  projectTitle: {
    marginBottom: 12,
    lineHeight: 32,
  },
  projectDescription: {
    lineHeight: 22,
    marginBottom: 18,
  },
  linksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  linkChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkChipText: {},
  skillsSection: {
    marginTop: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 165, 185, 0.15)',
  },
  sectionHeading: {
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  skillsCluster: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 9999,
    borderWidth: 1,
  },
  skillBadgeText: {},
  footerContainer: {
    marginTop: 28,
  },
});
