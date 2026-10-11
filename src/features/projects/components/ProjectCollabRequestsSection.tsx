import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../../hooks/useTheme';
import { Avatar, Badge, Button, Card } from '../../../components/ui';
import { CollaborationRequestWithDetails } from '../../../types/database';

interface ProjectCollabRequestsSectionProps {
  requests: CollaborationRequestWithDetails[];
  onUpdateStatus: (requestId: string, status: 'ACCEPTED' | 'REJECTED') => Promise<void>;
  isUpdatingStatus?: boolean;
  onProfilePress?: (profileId: string) => void;
}

export function ProjectCollabRequestsSection({
  requests,
  onUpdateStatus,
  isUpdatingStatus = false,
  onProfilePress,
}: ProjectCollabRequestsSectionProps) {
  const theme = useTheme();

  const pendingRequests = requests.filter((r) => r.status === 'PENDING');

  const handleProfileNavigation = (profileId: string) => {
    if (onProfilePress) {
      onProfilePress(profileId);
    } else {
      router.push({
        pathname: '/profiles/[id]' as any,
        params: { id: profileId },
      });
    }
  };

  return (
    <Card variant="clay" padding="lg" style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <Text
          style={[
            styles.sectionHeading,
            {
              color: theme.colors.text,
              fontSize: theme.typography.sizes.md,
              fontWeight: theme.typography.weights.semibold,
            },
          ]}
        >
          Collaboration Requests
        </Text>
        <Badge
          label={`${pendingRequests.length} pending`}
          variant={pendingRequests.length > 0 ? 'warning' : 'outline'}
          size="sm"
        />
      </View>

      {pendingRequests.length > 0 ? (
        <View style={styles.requestsList}>
          {pendingRequests.map((req) => {
            const requester = req.user;
            return (
              <View
                key={req.id}
                style={[
                  styles.requestItemCard,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <View style={styles.requestItemHeader}>
                  <Pressable
                    onPress={() => requester && handleProfileNavigation(requester.id)}
                    style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                  >
                    <Avatar
                      url={requester?.avatar_url}
                      name={requester?.full_name || requester?.username || 'Requester'}
                      size="md"
                    />
                  </Pressable>

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={styles.requesterNameRow}>
                      <Pressable
                        onPress={() => requester && handleProfileNavigation(requester.id)}
                      >
                        <Text
                          style={[
                            styles.requesterName,
                            {
                              color: theme.colors.text,
                              fontSize: theme.typography.sizes.sm,
                              fontWeight: theme.typography.weights.semibold,
                            },
                          ]}
                        >
                          {requester?.full_name || requester?.username}
                        </Text>
                      </Pressable>
                      {req.role?.title && (
                        <Badge
                          label={`Role: ${req.role.title}`}
                          variant="primary"
                          size="sm"
                        />
                      )}
                    </View>
                    <Text
                      style={{
                        color: theme.colors.textMuted,
                        fontSize: theme.typography.sizes.xs,
                      }}
                    >
                      @{requester?.username}
                    </Text>
                    {requester?.headline && (
                      <Text
                        style={{
                          color: theme.colors.textSecondary,
                          fontSize: theme.typography.sizes.xs,
                          marginTop: 2,
                        }}
                        numberOfLines={1}
                      >
                        {requester.headline}
                      </Text>
                    )}
                  </View>
                </View>

                {req.message && (
                  <View
                    style={[
                      styles.requestMessageBox,
                      {
                        backgroundColor: theme.clay.surface,
                        borderColor: theme.clay.borderCard,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: theme.colors.textSecondary,
                        fontSize: 12,
                        fontStyle: 'italic',
                      }}
                    >
                      &ldquo;{req.message}&rdquo;
                    </Text>
                  </View>
                )}

                <View style={styles.requestItemActions}>
                  <Button
                    title="Reject"
                    variant="claySecondary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onPress={() => onUpdateStatus(req.id, 'REJECTED')}
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Accept"
                    variant="clayPrimary"
                    size="sm"
                    disabled={isUpdatingStatus}
                    onPress={() => onUpdateStatus(req.id, 'ACCEPTED')}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <Text
          style={[
            styles.emptySectionText,
            {
              color: theme.colors.textMuted,
              fontSize: theme.typography.sizes.xs,
            },
          ]}
        >
          No pending requests. Builders can request to participate in this project.
        </Text>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionCard: {
    marginBottom: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeading: {
    letterSpacing: -0.2,
  },
  requestsList: {
    gap: 12,
  },
  requestItemCard: {
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  requestItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  requesterNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  requesterName: {},
  requestMessageBox: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  requestItemActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  emptySectionText: {
    fontStyle: 'italic',
    paddingVertical: 6,
  },
});
