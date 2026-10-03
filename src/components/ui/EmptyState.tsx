import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionTitle?: string;
  onActionPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function EmptyState({
  icon,
  title,
  description,
  actionTitle,
  onActionPress,
  style,
}: EmptyStateProps) {
  const theme = useTheme();

  return (
    <View style={[styles.container, { padding: theme.spacing.xxl }, style]}>
      {icon && (
        <View
          style={[
            styles.iconWrapper,
            {
              backgroundColor: theme.clay.surfaceRecessed,
              borderColor: theme.clay.borderCard,
              borderWidth: 1,
              borderRadius: 24,
              marginBottom: theme.spacing.lg,
              ...Platform.select({
                web: {
                  boxShadow: theme.clay.webRecessedShadow,
                } as any,
              }),
            },
          ]}
        >
          {icon}
        </View>
      )}

      <Text
        style={[
          styles.title,
          {
            color: theme.colors.text,
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.semibold,
            letterSpacing: -0.2,
            marginBottom: description ? theme.spacing.xs : 0,
          },
        ]}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={[
            styles.description,
            {
              color: theme.colors.textSecondary,
              fontSize: theme.typography.sizes.sm,
              lineHeight: 22,
              marginBottom: actionTitle ? theme.spacing.xl : 0,
            },
          ]}
        >
          {description}
        </Text>
      )}

      {actionTitle && onActionPress && (
        <Button
          title={actionTitle}
          onPress={onActionPress}
          variant="clayPrimary"
          size="sm"
          style={styles.actionButton}
        />
      )}
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 20,
  },
  actionButton: {
    minWidth: 140,
  },
});
