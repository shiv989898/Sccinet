import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { imageUploadService } from '../../services/storage/imageUploadService';

export interface CoverImagePickerProps {
  value?: string | null;
  onChange: (uri: string | null) => void;
  disabled?: boolean;
  isUploading?: boolean;
}

export function CoverImagePicker({
  value,
  onChange,
  disabled = false,
  isUploading = false,
}: CoverImagePickerProps) {
  const theme = useTheme();
  const [isOptimizing, setIsOptimizing] = useState(false);
  const isBusy = disabled || isUploading || isOptimizing;

  const handlePickImage = async () => {
    if (isBusy) return;

    try {
      setIsOptimizing(true);
      const result = await imageUploadService.pickAndOptimizeProjectCover();

      if (result.canceled || !result.data) {
        if (result.error) {
          Alert.alert('Cover Photo', result.error);
        }
        return;
      }

      onChange(result.data.uri);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to select and optimize cover image.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleRemove = () => {
    if (isBusy) return;
    onChange(null);
  };

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.textSecondary,
            fontSize: theme.typography.sizes.xs,
            fontWeight: theme.typography.weights.medium,
          },
        ]}
      >
        Project Cover Image (Optional)
      </Text>

      {value ? (
        <View
          style={[
            styles.previewContainer,
            {
              backgroundColor: theme.clay.surfaceRecessed,
              borderColor: theme.clay.borderCard,
              ...Platform.select({
                web: {
                  boxShadow: theme.clay.webCardShadow,
                } as any,
                default: {
                  ...theme.clay.shadowCard,
                },
              }),
            },
          ]}
        >
          <Image
            source={{ uri: value }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Action Overlay Row */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              onPress={handlePickImage}
              disabled={isBusy}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Change cover image"
              hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.glass.regular.fill,
                  borderColor: theme.glass.regular.border,
                },
              ]}
            >
              <Ionicons
                name="camera-outline"
                size={14}
                color={theme.colors.primary}
              />
              <Text
                style={[
                  styles.actionText,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                Change
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRemove}
              disabled={isBusy}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Remove cover image"
              hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
              style={[
                styles.actionButton,
                {
                  backgroundColor: theme.isDark ? 'rgba(38, 42, 52, 0.88)' : 'rgba(255, 255, 255, 0.92)',
                  borderColor: theme.clay.borderCard,
                },
              ]}
            >
              <Ionicons name="trash-outline" size={14} color={theme.colors.error} />
              <Text
                style={[
                  styles.actionText,
                  {
                    color: theme.colors.error,
                    fontSize: theme.typography.sizes.xs,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>

          {/* Loading Overlay */}
          {isBusy ? (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color="#FFFFFF" />
              <Text style={styles.loadingText}>
                {isUploading ? 'Uploading cover...' : 'Optimizing image...'}
              </Text>
            </View>
          ) : null}
        </View>
      ) : (
        <TouchableOpacity
          onPress={handlePickImage}
          disabled={isBusy}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Add cover image"
          style={[
            styles.placeholderContainer,
            {
              backgroundColor: theme.clay.surfaceRecessed,
              borderColor: theme.clay.borderCard,
            },
          ]}
        >
          {isBusy ? (
            <View style={styles.centerBlock}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text
                style={[
                  styles.placeholderSubtext,
                  { color: theme.colors.textSecondary, marginTop: 8 },
                ]}
              >
                Optimizing image...
              </Text>
            </View>
          ) : (
            <View style={styles.centerBlock}>
              <View
                style={[
                  styles.iconWrap,
                  {
                    backgroundColor: theme.clay.surfaceTrack,
                    borderColor: theme.clay.borderCard,
                  },
                ]}
              >
                <Ionicons
                  name="image-outline"
                  size={22}
                  color={theme.colors.primary}
                />
              </View>

              <Text
                style={[
                  styles.placeholderTitle,
                  {
                    color: theme.colors.text,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.semibold,
                  },
                ]}
              >
                Choose Project Cover
              </Text>
              <Text
                style={[
                  styles.placeholderSubtext,
                  {
                    color: theme.colors.textMuted,
                    fontSize: theme.typography.sizes.micro,
                  },
                ]}
              >
                16:9 landscape recommended • Max 5MB
              </Text>
            </View>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 8,
  },
  label: {
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  previewContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: 200,
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  actionRow: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minHeight: 34,
    minWidth: 64,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionText: {
    letterSpacing: -0.1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  placeholderContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    maxHeight: 140,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  placeholderTitle: {
    letterSpacing: -0.2,
  },
  placeholderSubtext: {
    letterSpacing: -0.1,
  },
});
