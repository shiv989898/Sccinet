import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Input, AnimatedEntrance, SegmentedControl } from '../../src/components/ui';

export default function DiscoverScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.innerStack}>
        {/* Page Header */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.pageHeader}>
            <Text
              style={[
                styles.pageTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.xxl,
                  fontWeight: theme.typography.weights.bold,
                  letterSpacing: -0.5,
                },
              ]}
            >
              Discover
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: theme.colors.textMuted,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: 2,
                },
              ]}
            >
              Find projects and collaborators
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Search Bar */}
        <AnimatedEntrance staggerIndex={1}>
          <Input
            placeholder="Search projects, skills, or people..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftAccessory={
              <Ionicons
                name="search"
                size={18}
                color={theme.colors.textMuted}
                style={{ marginRight: 8 }}
              />
            }
          />
        </AnimatedEntrance>

        {/* Segmented Control */}
        <AnimatedEntrance staggerIndex={2}>
          <SegmentedControl<'projects' | 'people'>
            options={[
              { label: 'Projects', value: 'projects' },
              { label: 'People', value: 'people' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </AnimatedEntrance>

        {/* Empty State */}
        <AnimatedEntrance staggerIndex={3} key={activeTab}>
          <Card variant="clay" padding="lg">
            <View style={styles.emptyContent}>
              <View
                style={[
                  styles.emptyIconWrap,
                  { backgroundColor: theme.colors.primaryMuted },
                ]}
              >
                <Ionicons
                  name={activeTab === 'projects' ? 'folder-open-outline' : 'people-outline'}
                  size={26}
                  color={theme.colors.primary}
                />
              </View>
              <Text
                style={[
                  styles.emptyTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.lg,
                    fontWeight: theme.typography.weights.semibold,
                    letterSpacing: -0.3,
                    marginTop: 16,
                  },
                ]}
              >
                {activeTab === 'projects' ? 'No projects yet' : 'No people yet'}
              </Text>
              <Text
                style={[
                  styles.emptyDesc,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.sm,
                    lineHeight: 20,
                    marginTop: 6,
                    textAlign: 'center',
                  },
                ]}
              >
                {activeTab === 'projects'
                  ? 'Published projects will appear here when builders share their work.'
                  : 'Builders will appear here as the community grows.'}
              </Text>
            </View>
          </Card>
        </AnimatedEntrance>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  innerStack: {
    gap: 16,
  },
  pageHeader: {
    paddingTop: 4,
  },
  pageTitle: {},
  pageSubtitle: {},
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  emptyIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    textAlign: 'center',
  },
  emptyDesc: {},
});
