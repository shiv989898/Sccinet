import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../hooks/useTheme';
import { Profile, Skill } from '../../../types/database';
import { Avatar } from '../../../components/ui/Avatar';

export interface DiscoverBuilderCardProps {
  builder: Profile & {
    skills?: Skill[] | { id: string; name: string }[];
  } | {
    id: string;
    username: string;
    full_name: string;
    headline?: string | null;
    avatar_url?: string | null;
    skills?: Skill[] | { id: string; name: string }[];
  };
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onConnectPress?: () => void;
}

export function DiscoverBuilderCard({
  builder,
  style,
  onPress,
  onConnectPress,
}: DiscoverBuilderCardProps) {
  const theme = useTheme();
  const [connected, setConnected] = useState(false);

  const skills = builder.skills || [];
  const headline =
    builder.headline ||
    'Builder & software engineer crafting innovative open tools.';

  const handleConnect = () => {
    setConnected((prev) => !prev);
    if (onConnectPress) {
      onConnectPress();
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardContainer,
        {
          backgroundColor: theme.clay.surfaceElevated,
          borderColor: theme.clay.borderCard,
          transform: [{ scale: pressed ? 0.985 : 1 }],
          ...Platform.select({
            web: {
              boxShadow: theme.clay.webCardShadow,
              transition: 'transform 0.18s ease, box-shadow 0.18s ease',
            } as any,
            default: {
              ...theme.clay.shadowCard,
            },
          }),
        },
        style,
      ]}
    >
      {/* Top Row: Avatar, Name & Handle, Connect Action */}
      <View style={styles.topRow}>
        <Avatar
          url={builder.avatar_url}
          name={builder.full_name}
          size={44}
          style={styles.avatar}
        />

        <View style={styles.infoCol}>
          <View style={styles.nameRow}>
            <Text
              style={[
                styles.fullName,
                {
                  color: theme.colors.text,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.semibold,
                },
              ]}
              numberOfLines={1}
            >
              {builder.full_name}
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={15}
              color={theme.colors.primary}
              style={styles.verifiedIcon}
            />
          </View>

          <Text
            style={[
              styles.username,
              {
                color: theme.colors.textMuted,
                fontSize: theme.typography.sizes.xs,
              },
            ]}
          >
            @{builder.username}
          </Text>
        </View>

        {/* Connect Action Button */}
        <Pressable
          onPress={handleConnect}
          style={({ pressed }) => [
            styles.connectButton,
            {
              backgroundColor: connected
                ? theme.clay.surfaceRecessed
                : theme.colors.primary,
              borderColor: connected
                ? theme.colors.borderSubtle
                : theme.colors.primary,
              opacity: pressed ? 0.88 : 1,
            },
          ]}
        >
          <Text
            style={[
              styles.connectButtonText,
              {
                color: connected ? theme.colors.textSecondary : '#FFFFFF',
              },
            ]}
          >
            {connected ? 'Requested' : 'Connect'}
          </Text>
        </Pressable>
      </View>

      {/* Headline Text */}
      <Text
        style={[
          styles.headline,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.sizes.sm,
          },
        ]}
        numberOfLines={2}
      >
        {headline}
      </Text>

      {/* Skill Chips */}
      {skills.length > 0 ? (
        <View style={styles.skillsRow}>
          {skills.slice(0, 4).map((skill, idx) => (
            <View
              key={'id' in skill ? skill.id : idx}
              style={[
                styles.skillChip,
                {
                  backgroundColor: theme.clay.surfaceRecessed,
                  borderColor: theme.colors.borderSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.skillChipText,
                  {
                    color: theme.colors.textSecondary,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                {skill.name}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fullName: {
    letterSpacing: -0.3,
  },
  verifiedIcon: {
    marginTop: 1,
  },
  username: {
    marginTop: 2,
    letterSpacing: -0.2,
  },
  connectButton: {
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    fontSize: 12.5,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headline: {
    marginTop: 12,
    lineHeight: 19,
    letterSpacing: -0.2,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  skillChip: {
    paddingVertical: 3.5,
    paddingHorizontal: 9,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillChipText: {
    letterSpacing: -0.1,
  },
});
