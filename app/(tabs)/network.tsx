import React, { useState } from 'react';
import {
  Alert,
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
import {
  Card,
  Button,
  Avatar,
  Badge,
  SegmentedControl,
  SkeletonLoader,
  EmptyState,
  AnimatedEntrance,
} from '../../src/components/ui';
import {
  useAcceptConnectionRequest,
  useConnections,
  useReceivedConnectionRequests,
  useRejectConnectionRequest,
  useRemoveConnection,
  useSentConnectionRequests,
  useWithdrawConnectionRequest,
} from '../../src/features/network';

export default function NetworkScreen() {
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState<'connections' | 'requests'>('connections');

  const {
    data: connections = [],
    isLoading: isLoadingConnections,
    isError: isConnectionsError,
    error: connectionsError,
    refetch: refetchConnections,
    isRefetching: isRefetchingConnections,
  } = useConnections();

  const {
    data: receivedRequests = [],
    isLoading: isLoadingReceived,
    refetch: refetchReceived,
    isRefetching: isRefetchingReceived,
  } = useReceivedConnectionRequests();

  const {
    data: sentRequests = [],
    isLoading: isLoadingSent,
    refetch: refetchSent,
    isRefetching: isRefetchingSent,
  } = useSentConnectionRequests();

  const acceptMutation = useAcceptConnectionRequest();
  const rejectMutation = useRejectConnectionRequest();
  const withdrawMutation = useWithdrawConnectionRequest();
  const removeMutation = useRemoveConnection();

  const isRefreshing =
    isRefetchingConnections || isRefetchingReceived || isRefetchingSent;

  const handleRefresh = () => {
    refetchConnections();
    refetchReceived();
    refetchSent();
  };

  const handleNavigateProfile = (profileId: string) => {
    router.push({
      pathname: '/profiles/[id]' as any,
      params: { id: profileId },
    });
  };

  const handleRemoveConnection = (connectionId: string, partnerName: string) => {
    Alert.alert(
      'Remove Connection',
      `Are you sure you want to remove your connection with ${partnerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeMutation.mutateAsync(connectionId);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to remove connection.');
            }
          },
        },
      ]
    );
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptMutation.mutateAsync(requestId);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to accept connection request.');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    try {
      await rejectMutation.mutateAsync(requestId);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to decline request.');
    }
  };

  const handleWithdrawRequest = async (requestId: string) => {
    try {
      await withdrawMutation.mutateAsync(requestId);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to withdraw request.');
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
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
              Network
            </Text>
            <Text
              style={[
                styles.pageSubtitle,
                {
                  color: theme.colors.textSecondary,
                  fontSize: theme.typography.sizes.sm,
                  marginTop: 2,
                },
              ]}
            >
              Builders and collaborators connected to your node.
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Tab Switcher */}
        <AnimatedEntrance staggerIndex={1}>
          <SegmentedControl<'connections' | 'requests'>
            options={[
              {
                label: `Connections (${connections.length})`,
                value: 'connections',
              },
              {
                label:
                  receivedRequests.length > 0
                    ? `Requests (${receivedRequests.length})`
                    : 'Requests',
                value: 'requests',
              },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </AnimatedEntrance>

        {/* Tab Content */}
        {activeTab === 'connections' ? (
          /* CONNECTIONS VIEW */
          isLoadingConnections ? (
            <View style={styles.listStack}>
              {[1, 2, 3].map((key) => (
                <Card key={key} variant="clay" padding="md">
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <SkeletonLoader width={48} height={48} borderRadius={24} />
                    <View style={{ gap: 6, flex: 1 }}>
                      <SkeletonLoader width={140} height={16} borderRadius={4} />
                      <SkeletonLoader width={90} height={12} borderRadius={4} />
                    </View>
                  </View>
                </Card>
              ))}
            </View>
          ) : isConnectionsError ? (
            <Card variant="clay" padding="lg">
              <EmptyState
                icon={
                  <Ionicons
                    name="alert-circle-outline"
                    size={32}
                    color={theme.colors.error}
                  />
                }
                title="Failed to load connections"
                description={
                  connectionsError instanceof Error
                    ? connectionsError.message
                    : 'An error occurred while fetching your network.'
                }
                actionTitle="Retry"
                onActionPress={() => refetchConnections()}
              />
            </Card>
          ) : connections.length === 0 ? (
            <AnimatedEntrance staggerIndex={2} key="connections-empty">
              <Card variant="clay" padding="lg">
                <View style={styles.emptyContent}>
                  <View
                    style={[
                      styles.emptyIconWrap,
                      {
                        backgroundColor: theme.isDark
                          ? '#262A34'
                          : theme.clay.surfaceRecessed,
                        borderColor: theme.clay.borderCard,
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <Ionicons
                      name="people-outline"
                      size={26}
                      color={theme.isDark ? '#4CD7F6' : theme.colors.primary}
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
                    Your network is empty
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
                    Connect with other builders to grow your circle. Discover peers across
                    the network in the Discover tab.
                  </Text>
                  <Button
                    title="Discover Builders"
                    size="sm"
                    variant="clayPrimary"
                    onPress={() => router.push('/(tabs)/discover')}
                    style={{ marginTop: 16 }}
                    leftIcon={
                      <Ionicons name="compass-outline" size={16} color="#FFFFFF" />
                    }
                  />
                </View>
              </Card>
            </AnimatedEntrance>
          ) : (
            <View style={styles.listStack}>
              {connections.map((conn, index) => (
                <AnimatedEntrance key={conn.id} staggerIndex={index}>
                  <Card
                    variant="clay"
                    padding="md"
                    onPress={() => handleNavigateProfile(conn.partner.id)}
                  >
                    <View style={styles.connectionCardInner}>
                      <View style={styles.partnerInfoRow}>
                        <Avatar
                          url={conn.partner.avatar_url}
                          name={conn.partner.full_name}
                          size={46}
                        />

                        <View style={styles.partnerTextStack}>
                          <Text
                            style={[
                              styles.partnerName,
                              {
                                color: theme.colors.text,
                                fontSize: theme.typography.sizes.md,
                                fontWeight: theme.typography.weights.semibold,
                                letterSpacing: -0.2,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            {conn.partner.full_name}
                          </Text>

                          <Text
                            style={[
                              styles.partnerUsername,
                              {
                                color: theme.colors.textMuted,
                                fontSize: theme.typography.sizes.micro,
                              },
                            ]}
                            numberOfLines={1}
                          >
                            @{conn.partner.username}
                          </Text>

                          {conn.partner.headline ? (
                            <Text
                              style={[
                                styles.partnerHeadline,
                                {
                                  color: theme.isDark
                                    ? '#4CD7F6'
                                    : theme.colors.primary,
                                  fontSize: theme.typography.sizes.xs,
                                  fontWeight: theme.typography.weights.medium,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {conn.partner.headline}
                            </Text>
                          ) : null}
                        </View>

                        <TouchableOpacity
                          onPress={() =>
                            handleRemoveConnection(conn.id, conn.partner.full_name)
                          }
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          accessibilityLabel="Remove connection"
                          style={styles.disconnectButton}
                        >
                          <Ionicons
                            name="person-remove-outline"
                            size={16}
                            color={theme.colors.textMuted}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Card>
                </AnimatedEntrance>
              ))}
            </View>
          )
        ) : (
          /* REQUESTS VIEW */
          <View style={styles.requestsContainer}>
            {/* INCOMING REQUESTS SECTION */}
            <View style={styles.requestSection}>
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Incoming Requests ({receivedRequests.length})
              </Text>

              {isLoadingReceived ? (
                <View style={styles.listStack}>
                  <Card variant="clay" padding="md">
                    <SkeletonLoader width="100%" height={56} borderRadius={8} />
                  </Card>
                </View>
              ) : receivedRequests.length === 0 ? (
                <Card variant="clay" padding="md">
                  <Text
                    style={[
                      styles.sectionEmptyText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    No incoming connection requests.
                  </Text>
                </Card>
              ) : (
                <View style={styles.listStack}>
                  {receivedRequests.map((req, index) => (
                    <AnimatedEntrance key={req.id} staggerIndex={index}>
                      <Card variant="clay" padding="md">
                        <View style={styles.requestCardInner}>
                          <TouchableOpacity
                            onPress={() => handleNavigateProfile(req.profile.id)}
                            activeOpacity={0.8}
                            style={styles.requestProfileRow}
                          >
                            <Avatar
                              url={req.profile.avatar_url}
                              name={req.profile.full_name}
                              size={42}
                            />
                            <View style={styles.partnerTextStack}>
                              <Text
                                style={[
                                  styles.partnerName,
                                  {
                                    color: theme.colors.text,
                                    fontSize: theme.typography.sizes.sm,
                                    fontWeight: theme.typography.weights.semibold,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {req.profile.full_name}
                              </Text>
                              <Text
                                style={[
                                  styles.partnerUsername,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.micro,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                @{req.profile.username}
                              </Text>
                            </View>
                          </TouchableOpacity>

                          <View style={styles.requestActionsRow}>
                            <Button
                              title="Accept"
                              size="sm"
                              variant="clayPrimary"
                              onPress={() => handleAcceptRequest(req.id)}
                              loading={acceptMutation.isPending}
                              style={{ flex: 1 }}
                            />
                            <Button
                              title="Decline"
                              size="sm"
                              variant="claySecondary"
                              onPress={() => handleDeclineRequest(req.id)}
                              loading={rejectMutation.isPending}
                              style={{ flex: 1 }}
                            />
                          </View>
                        </View>
                      </Card>
                    </AnimatedEntrance>
                  ))}
                </View>
              )}
            </View>

            {/* OUTGOING REQUESTS SECTION */}
            <View style={styles.requestSection}>
              <Text
                style={[
                  styles.sectionHeaderTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Sent Requests ({sentRequests.length})
              </Text>

              {isLoadingSent ? (
                <View style={styles.listStack}>
                  <Card variant="clay" padding="md">
                    <SkeletonLoader width="100%" height={56} borderRadius={8} />
                  </Card>
                </View>
              ) : sentRequests.length === 0 ? (
                <Card variant="clay" padding="md">
                  <Text
                    style={[
                      styles.sectionEmptyText,
                      {
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    No outgoing pending requests.
                  </Text>
                </Card>
              ) : (
                <View style={styles.listStack}>
                  {sentRequests.map((req, index) => (
                    <AnimatedEntrance key={req.id} staggerIndex={index}>
                      <Card variant="clay" padding="md">
                        <View style={styles.requestCardInner}>
                          <TouchableOpacity
                            onPress={() => handleNavigateProfile(req.profile.id)}
                            activeOpacity={0.8}
                            style={styles.requestProfileRow}
                          >
                            <Avatar
                              url={req.profile.avatar_url}
                              name={req.profile.full_name}
                              size={42}
                            />
                            <View style={styles.partnerTextStack}>
                              <Text
                                style={[
                                  styles.partnerName,
                                  {
                                    color: theme.colors.text,
                                    fontSize: theme.typography.sizes.sm,
                                    fontWeight: theme.typography.weights.semibold,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {req.profile.full_name}
                              </Text>
                              <Text
                                style={[
                                  styles.partnerUsername,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.micro,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                @{req.profile.username}
                              </Text>
                            </View>

                            <Badge label="Pending" variant="default" size="sm" />
                          </TouchableOpacity>

                          <Button
                            title="Withdraw"
                            size="sm"
                            variant="claySecondary"
                            onPress={() => handleWithdrawRequest(req.id)}
                            loading={withdrawMutation.isPending}
                          />
                        </View>
                      </Card>
                    </AnimatedEntrance>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
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
  listStack: {
    gap: 12,
  },
  connectionCardInner: {
    gap: 8,
  },
  partnerInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  partnerTextStack: {
    flex: 1,
    gap: 1,
  },
  partnerName: {},
  partnerUsername: {},
  partnerHeadline: {
    marginTop: 2,
  },
  disconnectButton: {
    padding: 6,
  },
  requestsContainer: {
    gap: 20,
  },
  requestSection: {
    gap: 10,
  },
  sectionHeaderTitle: {
    paddingHorizontal: 2,
  },
  sectionEmptyText: {
    textAlign: 'center',
    paddingVertical: 8,
  },
  requestCardInner: {
    gap: 12,
  },
  requestProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requestActionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
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
