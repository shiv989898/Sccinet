import React, { useState } from 'react';
import {
  Alert,
  Keyboard,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  SkeletonLoader,
  EmptyState,
  AnimatedEntrance,
} from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useCurrentProfile } from '../../src/features/profiles/useProfile';
import { useCreatePost, useDeletePost, useFeedPosts } from '../../src/features/feed';

function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

export default function FeedScreen() {
  const theme = useTheme();
  const { user } = useAuth();
  const { data: currentProfile } = useCurrentProfile();

  const [postContent, setPostContent] = useState('');
  const [publishError, setPublishError] = useState<string | null>(null);

  const {
    data: posts = [],
    isLoading,
    isError,
    error: feedError,
    refetch,
    isRefetching,
  } = useFeedPosts(30);

  const createPostMutation = useCreatePost();
  const deletePostMutation = useDeletePost();

  const handlePublish = async () => {
    const trimmed = postContent.trim();
    if (!trimmed) return;

    setPublishError(null);
    try {
      await createPostMutation.mutateAsync({ content: trimmed });
      setPostContent('');
      Keyboard.dismiss();
    } catch (err: any) {
      setPublishError(err?.message || 'Failed to publish post. Please try again.');
    }
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePostMutation.mutateAsync(postId);
            } catch (err: any) {
              Alert.alert('Error', err?.message || 'Failed to delete post.');
            }
          },
        },
      ]
    );
  };

  const handleNavigateAuthor = (authorId: string) => {
    router.push({
      pathname: '/profiles/[id]' as any,
      params: { id: authorId },
    });
  };

  const canPublish =
    postContent.trim().length > 0 &&
    postContent.trim().length <= 1000 &&
    !createPostMutation.isPending;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={[styles.content, { padding: theme.spacing.lg }]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
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
              Feed
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
              Dispatches and project updates from across the network.
            </Text>
          </View>
        </AnimatedEntrance>

        {/* Post Composer */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="md">
            <View style={styles.composerContainer}>
              <View style={styles.composerHeaderRow}>
                <Avatar
                  url={currentProfile?.avatar_url}
                  name={currentProfile?.full_name || 'Builder'}
                  size={36}
                />
                <View style={styles.composerIdentity}>
                  <Text
                    style={[
                      styles.composerAuthorName,
                      {
                        color: theme.colors.text,
                        fontSize: theme.typography.sizes.sm,
                        fontWeight: theme.typography.weights.semibold,
                      },
                    ]}
                  >
                    {currentProfile?.full_name || 'Your Dispatch'}
                  </Text>
                  {currentProfile?.username && (
                    <Text
                      style={[
                        styles.composerAuthorUsername,
                        {
                          color: theme.colors.textMuted,
                          fontSize: theme.typography.sizes.micro,
                        },
                      ]}
                    >
                      @{currentProfile.username}
                    </Text>
                  )}
                </View>
              </View>

              <View
                style={[
                  styles.inputWrapper,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                    ...Platform.select({
                      web: { boxShadow: theme.clay.webRecessedShadow } as any,
                    }),
                  },
                ]}
              >
                <TextInput
                  placeholder="Share a project dispatch or thought..."
                  placeholderTextColor={theme.colors.textMuted}
                  value={postContent}
                  onChangeText={(text) => {
                    setPostContent(text);
                    if (publishError) setPublishError(null);
                  }}
                  multiline
                  maxLength={1000}
                  style={[
                    styles.textInput,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                />
              </View>

              {publishError && (
                <View style={styles.errorRow}>
                  <Ionicons name="alert-circle" size={14} color={theme.colors.error} />
                  <Text
                    style={[
                      styles.errorText,
                      { color: theme.colors.error, fontSize: theme.typography.sizes.xs },
                    ]}
                  >
                    {publishError}
                  </Text>
                </View>
              )}

              <View style={styles.composerActionsRow}>
                <Text
                  style={[
                    styles.charCountText,
                    {
                      color:
                        postContent.length > 900
                          ? theme.colors.error
                          : theme.colors.textMuted,
                      fontSize: theme.typography.sizes.micro,
                    },
                  ]}
                >
                  {postContent.length > 0 ? `${1000 - postContent.length} left` : ''}
                </Text>

                <Button
                  title={createPostMutation.isPending ? 'Publishing...' : 'Publish'}
                  size="sm"
                  variant="clayPrimary"
                  onPress={handlePublish}
                  disabled={!canPublish}
                  leftIcon={
                    !createPostMutation.isPending ? (
                      <Ionicons name="paper-plane-outline" size={14} color="#FFFFFF" />
                    ) : undefined
                  }
                />
              </View>
            </View>
          </Card>
        </AnimatedEntrance>

        {/* Feed Posts List */}
        {isLoading ? (
          <View style={styles.postsList}>
            {[1, 2, 3].map((key) => (
              <Card key={key} variant="clay" padding="md">
                <View style={{ gap: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <SkeletonLoader width={40} height={40} borderRadius={20} />
                    <View style={{ gap: 6, flex: 1 }}>
                      <SkeletonLoader width={140} height={16} borderRadius={4} />
                      <SkeletonLoader width={90} height={12} borderRadius={4} />
                    </View>
                  </View>
                  <SkeletonLoader width="100%" height={16} borderRadius={4} />
                  <SkeletonLoader width="80%" height={16} borderRadius={4} />
                </View>
              </Card>
            ))}
          </View>
        ) : isError ? (
          <Card variant="clay" padding="lg">
            <EmptyState
              icon={
                <Ionicons
                  name="alert-circle-outline"
                  size={32}
                  color={theme.colors.error}
                />
              }
              title="Unable to load feed"
              description={
                feedError instanceof Error
                  ? feedError.message
                  : 'An error occurred while fetching feed posts.'
              }
              actionTitle="Retry"
              onActionPress={() => refetch()}
            />
          </Card>
        ) : posts.length === 0 ? (
          <AnimatedEntrance staggerIndex={2} key="empty-feed">
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
                    name="newspaper-outline"
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
                  No dispatches yet
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
                  Be the first builder to publish a project dispatch or thought to the network.
                </Text>
              </View>
            </Card>
          </AnimatedEntrance>
        ) : (
          <View style={styles.postsList}>
            {posts.map((post, index) => {
              const isAuthor = user?.id === post.author_id;
              const authorName = post.author?.full_name || 'Builder';
              const authorUsername = post.author?.username
                ? `@${post.author.username}`
                : '@builder';

              return (
                <AnimatedEntrance key={post.id} staggerIndex={index}>
                  <Card variant="clay" padding="md">
                    <View style={styles.postCardInner}>
                      {/* Post Header Row */}
                      <View style={styles.postHeaderRow}>
                        <TouchableOpacity
                          onPress={() => handleNavigateAuthor(post.author_id)}
                          activeOpacity={0.8}
                          style={styles.postAuthorGroup}
                        >
                          <Avatar
                            url={post.author?.avatar_url}
                            name={authorName}
                            size={40}
                          />

                          <View style={styles.authorMeta}>
                            <Text
                              style={[
                                styles.authorFullName,
                                {
                                  color: theme.colors.text,
                                  fontSize: theme.typography.sizes.sm,
                                  fontWeight: theme.typography.weights.semibold,
                                },
                              ]}
                              numberOfLines={1}
                            >
                              {authorName}
                            </Text>

                            <View style={styles.authorSubRow}>
                              <Text
                                style={[
                                  styles.authorUsernameText,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.micro,
                                  },
                                ]}
                                numberOfLines={1}
                              >
                                {authorUsername}
                              </Text>
                              <Text
                                style={[styles.metaDot, { color: theme.colors.textMuted }]}
                              >
                                •
                              </Text>
                              <Text
                                style={[
                                  styles.timestampText,
                                  {
                                    color: theme.colors.textMuted,
                                    fontSize: theme.typography.sizes.micro,
                                  },
                                ]}
                              >
                                {formatTimestamp(post.created_at)}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>

                        {/* Author Actions */}
                        {isAuthor && (
                          <TouchableOpacity
                            onPress={() => handleDeletePost(post.id)}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            accessibilityLabel="Delete post"
                            style={styles.deleteButton}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={16}
                              color={theme.colors.textMuted}
                            />
                          </TouchableOpacity>
                        )}
                      </View>

                      {/* Post Body */}
                      <Text
                        style={[
                          styles.postBodyText,
                          {
                            color: theme.colors.text,
                            fontSize: theme.typography.sizes.sm,
                            lineHeight: 22,
                          },
                        ]}
                        selectable
                      >
                        {post.content}
                      </Text>
                    </View>
                  </Card>
                </AnimatedEntrance>
              );
            })}
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
  composerContainer: {
    gap: 12,
  },
  composerHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  composerIdentity: {
    flex: 1,
    gap: 1,
  },
  composerAuthorName: {},
  composerAuthorUsername: {},
  inputWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 84,
  },
  textInput: {
    textAlignVertical: 'top',
    minHeight: 64,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  errorText: {},
  composerActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  charCountText: {},
  postsList: {
    gap: 12,
  },
  postCardInner: {
    gap: 12,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postAuthorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  authorMeta: {
    flex: 1,
    gap: 1,
  },
  authorFullName: {},
  authorSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  authorUsernameText: {},
  metaDot: {},
  timestampText: {},
  deleteButton: {
    padding: 4,
  },
  postBodyText: {
    marginTop: 2,
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
