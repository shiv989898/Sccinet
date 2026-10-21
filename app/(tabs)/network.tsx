import React, { useState } from 'react';
import {
  Alert,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Card,
  Button,
  Avatar,
  SegmentedControl,
  AnimatedEntrance,
  ConnectButton,
  AnimatedTabTransition,
  TactilePressable,
} from '../../src/components/ui';
import {
  useConnections,
  useReceivedConnectionRequests,
} from '../../src/features/network';

export default function NetworkScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');
  const [connectedState, setConnectedState] = useState<Record<string, boolean>>({
    'mock-n1': true,
    'mock-n2': true,
  });

  const {
    data: connections = [],
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
  } = useConnections();

  const {
    data: receivedRequests = [],
    refetch: refetchReceived,
    isRefetching: isRefetchingReceived,
  } = useReceivedConnectionRequests();

  const isRefreshing = isRefetchingConnections || isRefetchingReceived;

  const handleRefresh = () => {
    refetchConnections();
    refetchReceived();
  };

  const defaultMockConnections = [
    {
      id: 'mock-n1',
      full_name: 'Priya',
      username: 'priya.dev',
      headline: 'UI/UX Designer',
      initialConnected: true,
    },
    {
      id: 'mock-n2',
      full_name: 'Alex',
      username: 'alexdev',
      headline: 'Full Stack Developer',
      initialConnected: true,
    },
    {
      id: 'mock-n3',
      full_name: 'Sam',
      username: 'samcode',
      headline: 'Open Source Contributor',
      initialConnected: false,
    },
    {
      id: 'mock-n4',
      full_name: 'Neha',
      username: 'nehacreates',
      headline: 'Product Designer',
      initialConnected: false,
    },
    {
      id: 'mock-n5',
      full_name: 'Arjun',
      username: 'arjunbuilds',
      headline: 'AI Engineer',
      initialConnected: false,
    },
    {
      id: 'mock-n6',
      full_name: 'Meera',
      username: 'meeradev',
      headline: 'Mobile Developer',
      initialConnected: false,
    },
  ];

  const handleToggleConnect = (personId: string) => {
    setConnectedState((prev) => ({
      ...prev,
      [personId]: !prev[personId],
    }));
  };

  const connectionCount = connections.length > 0 ? connections.length : 12;
  const requestCount = receivedRequests.length > 0 ? receivedRequests.length : 3;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          padding: theme.spacing.lg,
          paddingTop: Math.max(insets.top + 8, theme.spacing.lg),
          paddingBottom: Math.max(insets.bottom + 96, 110),
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary}
        />
      }
    >
      <View style={styles.innerStack}>
        {/* Page Header matching Screen 7 */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.pageHeader}>
            <View style={styles.headerTitleRow}>
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
                Network
              </Text>

              <TactilePressable
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Search network"
                style={[
                  styles.headerSearchIcon,
                  {
                    backgroundColor: theme.glass.clear.fill,
                    borderColor: theme.glass.clear.border,
                    ...Platform.select({
                      web: {
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                      } as any,
                    }),
                  },
                ]}
              >
                <Ionicons name="search" size={17} color={theme.colors.text} />
              </TactilePressable>
            </View>
          </View>
        </AnimatedEntrance>

        {/* Tab Switcher matching Screen 7: Connections (12) / Requests (3) */}
        <AnimatedEntrance staggerIndex={1}>
          <SegmentedControl<'connections' | 'requests'>
            options={[
              {
                label: `Connections (${connectionCount})`,
                value: 'connections',
              },
              {
                label: `Requests (${requestCount})`,
                value: 'requests',
              },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </AnimatedEntrance>

        {/* Smooth Tab Transition for Connections / Requests */}
        <AnimatedTabTransition activeKey={activeTab}>
          {activeTab === 'connections' ? (
            <View style={styles.listStack}>
              {defaultMockConnections.map((person, index) => {
                const isConnected = !!connectedState[person.id];

                return (
                  <AnimatedEntrance key={person.id} staggerIndex={index}>
                    <Card
                      variant="clay"
                      padding="md"
                      style={styles.personCard}
                      onPress={() =>
                        router.push({
                          pathname: '/profiles/[id]',
                          params: { id: person.id },
                        })
                      }
                    >
                      <View style={styles.personRow}>
                        <Avatar
                          name={person.full_name}
                          size={44}
                        />

                        <View style={styles.personMeta}>
                          <Text
                            style={[
                              styles.personName,
                              {
                                color: theme.colors.text,
                                fontSize: theme.typography.sizes.sm,
                                fontWeight: theme.typography.weights.semibold,
                              },
                            ]}
                          >
                            {person.full_name}
                          </Text>

                          <Text
                            style={[
                              styles.personHandle,
                              {
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.sizes.micro,
                              },
                            ]}
                          >
                            @{person.username}
                          </Text>

                          <Text
                            style={[
                              styles.personHeadline,
                              {
                                color: theme.colors.textSecondary,
                                fontSize: theme.typography.sizes.xs,
                                marginTop: 2,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {person.headline}
                          </Text>
                        </View>

                        {/* Tactile Connect / Connected Button */}
                        <ConnectButton
                          isConnected={isConnected}
                          onPress={() => handleToggleConnect(person.id)}
                        />
                      </View>
                    </Card>
                  </AnimatedEntrance>
                );
              })}
            </View>
          ) : (
            /* REQUESTS VIEW */
            <View style={styles.listStack}>
              {[
                { id: 'req-1', name: 'Karan', handle: 'karan_builds', role: 'Full Stack Dev' },
                { id: 'req-2', name: 'Elena', handle: 'elena.ml', role: 'AI Researcher' },
                { id: 'req-3', name: 'Lucas', handle: 'lucas_dev', role: 'Backend Engineer' },
              ].map((req, index) => (
                <AnimatedEntrance key={req.id} staggerIndex={index}>
                  <Card variant="clay" padding="md" style={styles.personCard}>
                    <View style={styles.personRow}>
                      <Avatar name={req.name} size={44} />

                      <View style={styles.personMeta}>
                        <Text
                          style={[
                            styles.personName,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.sm,
                              fontWeight: theme.typography.weights.semibold,
                            },
                          ]}
                        >
                          {req.name}
                        </Text>

                        <Text
                          style={[
                            styles.personHeadline,
                            { color: theme.colors.textSecondary, fontSize: theme.typography.sizes.xs },
                          ]}
                        >
                          {req.role}
                        </Text>
                      </View>

                      <View style={{ flexDirection: 'row', gap: 6 }}>
                        <Button
                          title="Accept"
                          size="sm"
                          variant="clayPrimary"
                          leftIcon={<Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                          onPress={() => Alert.alert('Accepted', `Connected with ${req.name}`)}
                        />
                        <Button
                          title="Decline"
                          size="sm"
                          variant="claySecondary"
                          leftIcon={<Ionicons name="close" size={14} color={theme.colors.textSecondary} />}
                          onPress={() => Alert.alert('Declined', `Declined request from ${req.name}`)}
                        />
                      </View>
                    </View>
                  </Card>
                </AnimatedEntrance>
              ))}
            </View>
          )}
        </AnimatedTabTransition>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    gap: 16,
  },
  innerStack: {
    gap: 16,
  },
  pageHeader: {},
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {},
  headerSearchIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listStack: {
    gap: 10,
  },
  personCard: {
    borderRadius: 20,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  personMeta: {
    flex: 1,
  },
  personName: {},
  personHandle: {
    marginTop: 1,
  },
  personHeadline: {},
  connectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '600',
  },
  connectButton: {
    borderRadius: 14,
    paddingHorizontal: 14,
  },
});
