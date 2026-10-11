import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { AnimatedEntrance, Badge, Button, Input } from '../../../components/ui';
import { CollaborationRequestWithDetails, ProjectRole, Skill } from '../../../types/database';

interface CollaborationApplyModalProps {
  isMember: boolean;
  myPendingRequest?: CollaborationRequestWithDetails | null;
  roles?: (ProjectRole & { skills?: Skill[] })[];
  isRequestModalOpen: boolean;
  onOpenModal: () => void;
  onCloseModal: () => void;
  onWithdrawRequest: (requestId: string) => void;
  onLeaveProject: () => void;
  onSubmitRequest: (roleId: string | null, message: string) => Promise<void>;
  isSubmitting?: boolean;
}

export function CollaborationApplyModal({
  isMember,
  myPendingRequest,
  roles = [],
  isRequestModalOpen,
  onOpenModal,
  onCloseModal,
  onWithdrawRequest,
  onLeaveProject,
  onSubmitRequest,
  isSubmitting = false,
}: CollaborationApplyModalProps) {
  const theme = useTheme();

  const [requestedRoleId, setRequestedRoleId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    try {
      await onSubmitRequest(requestedRoleId, requestMessage);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setRequestMessage('');
        setRequestedRoleId(null);
        onCloseModal();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to send collaboration request');
    }
  };

  return (
    <View style={styles.container}>
      {/* Collaboration Bar for Non-Owners */}
      <View style={styles.collabActionBar}>
        {isMember ? (
          <View style={styles.memberStatusRow}>
            <Badge label="You are a Team Member" variant="success" size="md" />
            <Button
              title="Leave Project"
              variant="ghost"
              size="sm"
              onPress={onLeaveProject}
            />
          </View>
        ) : myPendingRequest ? (
          <View style={styles.pendingRequestRow}>
            <View style={{ flex: 1 }}>
              <Badge label="Collaboration Request Pending" variant="warning" size="sm" />
              {myPendingRequest.message && (
                <Text
                  style={[
                    styles.myRequestNote,
                    { color: theme.colors.textMuted, fontSize: 11 },
                  ]}
                  numberOfLines={1}
                >
                  Note: {myPendingRequest.message}
                </Text>
              )}
            </View>
            <Button
              title="Withdraw"
              variant="outline"
              size="sm"
              onPress={() => onWithdrawRequest(myPendingRequest.id)}
            />
          </View>
        ) : (
          <Button
            title="Request to Collaborate"
            variant="clayPrimary"
            size="md"
            leftIcon={<Ionicons name="people" size={16} color="#FFFFFF" />}
            onPress={() => {
              setError(null);
              onOpenModal();
            }}
          />
        )}
      </View>

      {/* Collaboration Request Dialog/Card */}
      {isRequestModalOpen && (
        <AnimatedEntrance duration={200}>
          <View
            style={[
              styles.requestModalBox,
              {
                backgroundColor: theme.clay.surfaceRecessed,
                borderColor: theme.clay.borderCard,
              },
            ]}
          >
            <Text
              style={[
                styles.requestModalTitle,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.sm,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
            >
              Request to Join Project
            </Text>

            {error && (
              <Text style={[styles.inlineError, { color: theme.colors.error }]}>
                {error}
              </Text>
            )}

            {success && (
              <Text style={[styles.inlineSuccess, { color: theme.colors.success }]}>
                Request sent successfully!
              </Text>
            )}

            {roles && roles.length > 0 && (
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={[
                    styles.modalFieldLabel,
                    { color: theme.colors.textSecondary, fontSize: 12 },
                  ]}
                >
                  Preferred Role (Optional)
                </Text>
                <View style={styles.rolePickerRow}>
                  <Pressable
                    onPress={() => setRequestedRoleId(null)}
                    style={[
                      styles.rolePickerPill,
                      !requestedRoleId && {
                        backgroundColor: theme.clay.surfaceChipSelected,
                        borderColor: theme.clay.borderChipSelected,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: !requestedRoleId
                          ? theme.clay.textChipSelected
                          : theme.colors.textSecondary,
                        fontWeight: !requestedRoleId ? '600' : '400',
                      }}
                    >
                      Any Role
                    </Text>
                  </Pressable>
                  {roles.map((r) => (
                    <Pressable
                      key={r.id}
                      onPress={() => setRequestedRoleId(r.id)}
                      style={[
                        styles.rolePickerPill,
                        requestedRoleId === r.id && {
                          backgroundColor: theme.clay.surfaceChipSelected,
                          borderColor: theme.clay.borderChipSelected,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color:
                            requestedRoleId === r.id
                              ? theme.clay.textChipSelected
                              : theme.colors.textSecondary,
                          fontWeight: requestedRoleId === r.id ? '600' : '400',
                        }}
                      >
                        {r.title}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            <Input
              label="Intro / Note (Optional)"
              placeholder="Briefly state how you'd like to contribute..."
              value={requestMessage}
              onChangeText={setRequestMessage}
              maxLength={500}
              multiline
              numberOfLines={2}
            />

            <View style={styles.requestModalActions}>
              <Button
                title="Cancel"
                variant="ghost"
                size="sm"
                onPress={onCloseModal}
              />
              <Button
                title="Send Request"
                variant="clayPrimary"
                size="sm"
                loading={isSubmitting}
                onPress={handleSubmit}
              />
            </View>
          </View>
        </AnimatedEntrance>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
  },
  collabActionBar: {
    marginTop: 8,
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pendingRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  myRequestNote: {
    marginTop: 4,
  },
  requestModalBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  requestModalTitle: {
    marginBottom: 10,
  },
  inlineError: {
    fontSize: 12,
    marginBottom: 8,
  },
  inlineSuccess: {
    fontSize: 12,
    marginBottom: 8,
    fontWeight: '600',
  },
  modalFieldLabel: {
    marginBottom: 6,
    fontWeight: '500',
  },
  rolePickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  rolePickerPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  requestModalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
});
