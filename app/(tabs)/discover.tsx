import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { Card, Badge, Input, Button } from '../../src/components/ui';

export default function DiscoverScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'projects' | 'people'>('projects');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
    >
      {/* Search Bar */}
      <Input
        placeholder="Search projects, skills, or collaborators..."
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
            backgroundColor: theme.colors.surfaceSubtle,
            borderRadius: theme.borderRadius.md,
            padding: 4,
          },
        ]}
      >
        <Button
          title="Projects"
          size="sm"
          variant={activeTab === 'projects' ? 'primary' : 'ghost'}
          onPress={() => setActiveTab('projects')}
          style={{ flex: 1 }}
        />
        <Button
          title="People"
          size="sm"
          variant={activeTab === 'people' ? 'primary' : 'ghost'}
          onPress={() => setActiveTab('people')}
          style={{ flex: 1 }}
        />
      </View>

      {/* Filter Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        <Badge label="All Domains" variant="primary" size="md" />
        <Badge label="Engineering" variant="outline" size="md" />
        <Badge label="UI/UX Design" variant="outline" size="md" />
        <Badge label="AI / ML" variant="outline" size="md" />
        <Badge label="Mobile" variant="outline" size="md" />
      </ScrollView>

      {/* Featured Preview Card */}
      <Card variant="elevated" style={styles.previewCard}>
        <View style={styles.cardTopRow}>
          <Text
            style={[
              styles.projectTitle,
              {
                color: theme.colors.text,
                fontSize: theme.typography.sizes.lg,
                fontWeight: theme.typography.weights.bold,
              },
            ]}
          >
            Sccinet Platform
          </Text>
          <Badge label="In Development" variant="warning" size="sm" />
        </View>

        <Text
          style={[
            styles.projectTagline,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.sm,
              marginVertical: theme.spacing.sm,
            },
          ]}
        >
          A dedicated social collaboration platform connecting builders, showcasing projects,
          and organizing team partnerships.
        </Text>

        <View style={styles.rolesRow}>
          <Text
            style={[
              styles.rolesLabel,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
                fontWeight: theme.typography.weights.medium,
              },
            ]}
          >
            ROLES NEEDED:
          </Text>
          <View style={styles.roleBadges}>
            <Badge label="React Native" variant="default" size="sm" />
            <Badge label="Supabase Architect" variant="default" size="sm" />
          </View>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    gap: 16,
  },
  segmentContainer: {
    flexDirection: 'row',
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  previewCard: {},
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {},
  projectTagline: {
    lineHeight: 20,
  },
  rolesRow: {
    marginTop: 8,
  },
  rolesLabel: {
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  roleBadges: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
});
