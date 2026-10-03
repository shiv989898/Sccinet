import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Input, Button, AnimatedEntrance } from '../../src/components/ui';

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
      <AnimatedEntrance duration={240}>
        <View style={styles.innerStack}>
          {/* Page Header */}
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

          {/* Search Bar */}
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

          {/* Segmented Control */}
          <View
            style={[
              styles.segmentContainer,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.clay.borderCard,
                borderWidth: 1,
                borderRadius: 14,
                padding: 4,
                gap: 4,
              },
            ]}
          >
            <Button
              title="Projects"
              size="sm"
              variant={activeTab === 'projects' ? 'clayPrimary' : 'ghost'}
              onPress={() => setActiveTab('projects')}
              style={{ flex: 1 }}
            />
            <Button
              title="People"
              size="sm"
              variant={activeTab === 'people' ? 'clayPrimary' : 'ghost'}
              onPress={() => setActiveTab('people')}
              style={{ flex: 1 }}
            />
          </View>

          {/* Empty State */}
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
  segmentContainer: {
    flexDirection: 'row',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 8,
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
