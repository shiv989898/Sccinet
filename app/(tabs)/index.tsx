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
import { Image } from 'expo-image';
import { useTheme } from '../../src/hooks/useTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Card,
  Button,
  Avatar,
  SkeletonLoader,
  AnimatedEntrance,
  SccinetLogo,
} from '../../src/components/ui';
import { useAuth } from '../../src/features/auth/AuthContext';
import { useCurrentProfile } from '../../src/features/profiles/useProfile';
import { useCreatePost, useDeletePost, useFeedPosts } from '../../src/features/feed';

const sampleLandscape = require('../../../assets/images/sample-landscape.jpg');

function formatTimestamp(dateString?: string): string {
  if (!dateString) return '2h';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m`;
    const diffHours = Math.floor(diffMinutes / (1000 * 60 * 60));
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '2h';
  }
}

const DEFAULT_POSTS = [
  {
    id: 'mock-1',
    author_id: 'shiv-1',
    author: {
      full_name: 'Shiv',
      username: 'shivgoyal9888',
      avatar_url: null,
    },
    content:
      'Just shipped a new AI tool for content generation. Really excited about how it turned out! 🚀',
    created_at: '2026-10-15T15:00:00.000Z',
    hasImage: true,
    likes: 24,
    comments: 6,
  },
  {
    id: 'mock-2',
    author_id: 'alex-1',
    author: {
      full_name: 'Alex',
      username: 'alexdev',
      avatar_url: null,
    },
    content:
      'Working on a distributed system for real-time collaboration across mesh nodes. Looking for feedback on the sync protocol.',
    created_at: '2026-10-15T13:00:00.000Z',
    hasImage: false,
    likes: 12,
    comments: 3,
  },
];

export default function FeedScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data: currentProfile } = useCurrentProfile();

  const [filter, setFilter] = useState<'all' | 'following' | 'projects'>('all');
  const [postContent, setPostContent] = useState('');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [isComposerFocused, setIsComposerFocused] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const {
    data: posts = [],
    isLoading,
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
      setIsComposerFocused(false);
      Keyboard.dismiss();
    } catch (err: any) {
      setPublishError(err?.message || 'Failed to publish post. Please try again.');
    }
  };

  const toggleLike = (postId: string) => {
    setLikedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleDeletePost = (postId: string) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
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

  const displayPosts = posts.length > 0 ? posts : DEFAULT_POSTS;

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
        {/* Top Header Bar matching Screen 4 */}
        <AnimatedEntrance staggerIndex={0}>
          <View style={styles.topHeaderBar}>
            <SccinetLogo size="sm" showWordmark />

            <View style={styles.topRightActions}>
              <TouchableOpacity
                onPress={() => router.push('/settings')}
                activeOpacity={0.7}
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={19}
                  color={theme.colors.text}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(tabs)/profile')}
                activeOpacity={0.8}
              >
                <Avatar
                  url={currentProfile?.avatar_url}
                  name={currentProfile?.full_name || 'Builder'}
                  size={34}
                />
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedEntrance>

        {/* Quick Composer Card matching Screen 4 */}
        <AnimatedEntrance staggerIndex={1}>
          <Card variant="clay" padding="md" style={styles.composerCard}>
            <View style={styles.composerRow}>
              <Avatar
                url={currentProfile?.avatar_url}
                name={currentProfile?.full_name || 'Builder'}
                size={36}
              />

              <View
                style={[
                  styles.composerInputWell,
                  {
                    backgroundColor: theme.clay.surfaceRecessed,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <TextInput
                  placeholder="What's on your mind?"
                  placeholderTextColor={theme.colors.textMuted}
                  value={postContent}
                  onChangeText={(text) => {
                    setPostContent(text);
                    if (publishError) setPublishError(null);
                  }}
                  onFocus={() => setIsComposerFocused(true)}
                  multiline={isComposerFocused}
                  style={[
                    styles.composerInput,
                    {
                      color: theme.colors.text,
                      fontSize: theme.typography.sizes.sm,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Composer Footer (shown when active or has text) */}
            {(isComposerFocused || postContent.length > 0) && (
              <View style={styles.composerExpandedFooter}>
                <Text
                  style={[
                    styles.charCount,
                    { color: theme.colors.textMuted, fontSize: theme.typography.sizes.micro },
                  ]}
                >
                  {1000 - postContent.length} left
                </Text>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button
                    title="Cancel"
                    size="sm"
                    variant="claySecondary"
                    onPress={() => {
                      setIsComposerFocused(false);
                      setPostContent('');
                      Keyboard.dismiss();
                    }}
                  />
                  <Button
                    title={createPostMutation.isPending ? 'Posting...' : 'Post'}
                    size="sm"
                    variant="clayPrimary"
                    disabled={postContent.trim().length === 0 || createPostMutation.isPending}
                    onPress={handlePublish}
                  />
                </View>
              </View>
            )}

            {publishError && (
              <Text style={[styles.errorText, { color: theme.colors.error }]}>
                {publishError}
              </Text>
            )}
          </Card>
        </AnimatedEntrance>

        {/* Filter Pills Row matching Screen 4 */}
        <AnimatedEntrance staggerIndex={2}>
          <View style={styles.filterPillsRow}>
            {(['all', 'following', 'projects'] as const).map((tab) => {
              const isActive = filter === tab;
              const label =
                tab === 'all' ? 'All' : tab === 'following' ? 'Following' : 'Projects';
              return (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setFilter(tab)}
                  activeOpacity={0.7}
                  style={[
                    styles.filterPill,
                    {
                      backgroundColor: isActive
                        ? 'rgba(0, 102, 255, 0.28)'
                        : theme.clay.surfaceRecessed,
                      borderColor: isActive
                        ? 'rgba(0, 102, 255, 0.50)'
                        : theme.clay.borderCard,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterPillText,
                      {
                        color: isActive ? '#FFFFFF' : theme.colors.textSecondary,
                        fontWeight: isActive ? '600' : '500',
                        fontSize: theme.typography.sizes.sm,
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </AnimatedEntrance>

        {/* Feed Posts List */}
        {isLoading ? (
          <View style={styles.postsList}>
            {[1, 2].map((i) => (
              <Card key={i} variant="clay" padding="md">
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
        ) : (
          <View style={styles.postsList}>
            {displayPosts.map((post: any, index: number) => {
              const isAuthor = user?.id === post.author_id;
              const authorName = post.author?.full_name || 'Shiv';
              const authorUsername = post.author?.username
                ? `@${post.author.username}`
                : '@shivgoyal9888';
              const hasImage = post.hasImage || post.image_url;
              const isLiked = !!likedPosts[post.id];
              const likeCount = (post.likes || 24) + (isLiked ? 1 : 0);
              const commentCount = post.comments || 6;

              return (
                <AnimatedEntrance key={post.id} staggerIndex={index}>
                  <Card variant="clay" padding="md" style={styles.postCard}>
                    {/* Post Header Row */}
                    <View style={styles.postHeaderRow}>
                      <TouchableOpacity
                        onPress={() =>
                          post.author_id &&
                          router.push({
                            pathname: '/profiles/[id]',
                            params: { id: post.author_id },
                          })
                        }
                        activeOpacity={0.8}
                        style={styles.postAuthorGroup}
                      >
                        <Avatar
                          url={post.author?.avatar_url}
                          name={authorName}
                          size={40}
                        />

                        <View style={styles.authorMeta}>
                          <View style={styles.authorNameRow}>
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

                            <Text
                              style={[
                                styles.authorUsernameText,
                                {
                                  color: theme.colors.textMuted,
                                  fontSize: theme.typography.sizes.xs,
                                },
                              ]}
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
                                  fontSize: theme.typography.sizes.xs,
                                },
                              ]}
                            >
                              {formatTimestamp(post.created_at)}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      {/* Options / Delete Button */}
                      <TouchableOpacity
                        onPress={() => {
                          if (isAuthor) {
                            handleDeletePost(post.id);
                          } else {
                            Alert.alert('Dispatch Options', 'Options for this post', [
                              { text: 'Cancel', style: 'cancel' },
                              { text: 'Copy Link' },
                            ]);
                          }
                        }}
                        activeOpacity={0.7}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Ionicons
                          name="ellipsis-horizontal"
                          size={18}
                          color={theme.colors.textMuted}
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Post Content */}
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

                    {/* Attached Image Preview matching Screen 4 */}
                    {hasImage && (
                      <View style={styles.postImageContainer}>
                        <Image
                          source={post.image_url ? { uri: post.image_url } : sampleLandscape}
                          style={styles.postImage}
                          contentFit="cover"
                          priority="normal"
                        />
                      </View>
                    )}

                    {/* Post Bottom Action Bar matching Screen 4 */}
                    <View
                      style={[
                        styles.postActionsRow,
                        { borderTopColor: theme.clay.borderRecessed },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => toggleLike(post.id)}
                        activeOpacity={0.7}
                        style={styles.actionItem}
                      >
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={18}
                          color={isLiked ? '#EF4444' : theme.colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.actionCount,
                            {
                              color: isLiked ? '#EF4444' : theme.colors.textMuted,
                              fontSize: theme.typography.sizes.xs,
                            },
                          ]}
                        >
                          {likeCount}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => Alert.alert('Comments', '6 comments on this dispatch.')}
                        activeOpacity={0.7}
                        style={styles.actionItem}
                      >
                        <Ionicons
                          name="chatbubble-outline"
                          size={17}
                          color={theme.colors.textMuted}
                        />
                        <Text
                          style={[
                            styles.actionCount,
                            {
                              color: theme.colors.textMuted,
                              fontSize: theme.typography.sizes.xs,
                            },
                          ]}
                        >
                          {commentCount}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => Alert.alert('Share', 'Link copied to clipboard.')}
                        activeOpacity={0.7}
                        style={styles.actionItem}
                      >
                        <Ionicons
                          name="paper-plane-outline"
                          size={17}
                          color={theme.colors.textMuted}
                        />
                      </TouchableOpacity>
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
    backgroundColor: 'transparent',
  },
  content: {
    gap: 16,
  },
  innerStack: {
    gap: 16,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  composerCard: {
    borderRadius: 22,
  },
  composerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  composerInputWell: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    minHeight: 40,
    justifyContent: 'center',
  },
  composerInput: {
    padding: 0,
    margin: 0,
  },
  composerExpandedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  charCount: {},
  errorText: {
    marginTop: 6,
    fontSize: 12,
  },
  filterPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterPill: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterPillText: {},
  postsList: {
    gap: 14,
  },
  postCard: {
    borderRadius: 22,
  },
  postHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  postAuthorGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  authorMeta: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  authorFullName: {},
  authorUsernameText: {},
  metaDot: {},
  timestampText: {},
  postBodyText: {
    marginBottom: 12,
  },
  postImageContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    height: 180,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionCount: {
    fontWeight: '500',
  },
});
