import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Button, Avatar, AnimatedEntrance } from '../../src/components/ui';

export default function FeedScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <AnimatedEntrance duration={240}>
        <View style={styles.innerStack}>
          {/* Welcome Banner Card */}
          <Card variant="clay" padding="lg" style={styles.bannerCard}>
            <View style={styles.headerRow}>
              <Avatar name="Sccinet Team" size="md" />
              <View style={styles.headerTextCol}>
                <View style={styles.titleRow}>
                  <Text
                    style={[
                      styles.authorName,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.md,
                        fontWeight: theme.typography.weights.semibold,
                        letterSpacing: -0.2,
                      },
                    ]}
                  >
                    Welcome to Sccinet
                  </Text>
                  <Badge label="Foundation" variant="primary" size="sm" />
                </View>
                <Text
                  style={[
                    styles.authorSub,
                    {
                      color: theme.colors.textMuted,
                      fontSize: theme.typography.sizes.xs,
                    },
                  ]}
                >
                  People • Projects • Community • Collaboration
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.postBody,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  lineHeight: 22,
                  marginVertical: theme.spacing.md,
                },
              ]}
            >
              Phase 0 architecture initialized successfully. Discover projects, connect with
              builders, and form meaningful team collaborations.
            </Text>

            <View style={styles.tagsRow}>
              <Badge label="#React" variant="default" size="sm" />
              <Badge label="#TypeScript" variant="default" size="sm" />
              <Badge label="#Supabase" variant="default" size="sm" />
              <Badge label="#Expo" variant="default" size="sm" />
            </View>
          </Card>

          {/* Quick Status / Milestone Card */}
          <Card variant="clay" padding="lg" style={styles.statusCard}>
            <View style={styles.statusHeader}>
              <Ionicons name="git-branch-outline" size={20} color={theme.colors.primary} />
              <Text
                style={[
                  styles.statusTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.semibold,
                    letterSpacing: -0.2,
                    marginLeft: theme.spacing.sm,
                  },
                ]}
              >
                Community Activity Stream
              </Text>
            </View>
            <Text
              style={[
                styles.statusDescription,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  lineHeight: 20,
                  marginTop: theme.spacing.xs,
                  marginBottom: theme.spacing.md,
                },
              ]}
            >
              Project updates, release milestones, and builder spotlights will stream here once
              creators publish their work.
            </Text>
            <Button
              title="Create First Project"
              size="sm"
              variant="clayPrimary"
              leftIcon={<Ionicons name="add" size={16} color="#FFFFFF" />}
              onPress={() => router.push('/projects/new')}
            />
          </Card>
        </View>
      </AnimatedEntrance>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  innerStack: {
    gap: 16,
  },

  bannerCard: {},
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTextCol: {
    marginLeft: 12,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorName: {},
  authorSub: {
    marginTop: 2,
  },
  postBody: {},
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusCard: {},
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusTitle: {},
  statusDescription: {},
});
