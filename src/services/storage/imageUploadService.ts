import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat, Action } from 'expo-image-manipulator';
import { supabase } from '../supabase/client';

export interface OptimizedImageResult {
  uri: string;
  width: number;
  height: number;
  fileSize?: number;
}

export interface PickAndOptimizeResult {
  canceled: boolean;
  data?: OptimizedImageResult;
  error?: string;
}

export interface StorageUploadResult {
  publicUrl: string;
  storagePath: string;
}

const MAX_AVATAR_DIMENSION = 512;
const MAX_COVER_WIDTH = 1600;
const COMPRESSION_QUALITY = 0.8;
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_COVER_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Extracts storage path from a full public Supabase URL or relative path.
 */
export function extractStoragePath(
  bucket: 'avatars' | 'project-covers',
  urlOrPath: string | null | undefined
): string | null {
  if (!urlOrPath) return null;
  if (!urlOrPath.startsWith('http://') && !urlOrPath.startsWith('https://')) {
    return urlOrPath;
  }
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = urlOrPath.indexOf(marker);
  if (idx !== -1) {
    return decodeURIComponent(urlOrPath.slice(idx + marker.length).split('?')[0]);
  }
  return null;
}

/**
 * Image upload and optimization service for profiles and projects.
 */
export const imageUploadService = {
  /**
   * Request media library permission and pick an image.
   */
  async pickAndOptimizeAvatar(): Promise<PickAndOptimizeResult> {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return {
          canceled: true,
          error: 'Permission to access photos was denied. Please allow access in settings.',
        };
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        return { canceled: true };
      }

      const asset = pickerResult.assets[0];

      // Check whether resizing is needed
      const actions: Action[] = [];
      const isAlreadyWithinLimits =
        asset.width <= MAX_AVATAR_DIMENSION &&
        asset.height <= MAX_AVATAR_DIMENSION &&
        asset.mimeType === 'image/jpeg';

      if (!isAlreadyWithinLimits) {
        // Resize square avatar to max 512x512
        actions.push({
          resize: {
            width: Math.min(asset.width, MAX_AVATAR_DIMENSION),
            height: Math.min(asset.height, MAX_AVATAR_DIMENSION),
          },
        });
      }

      const manipulated = await manipulateAsync(
        asset.uri,
        actions,
        {
          format: SaveFormat.JPEG,
          compress: COMPRESSION_QUALITY,
        }
      );

      // Validate output
      return {
        canceled: false,
        data: {
          uri: manipulated.uri,
          width: manipulated.width,
          height: manipulated.height,
        },
      };
    } catch (err: any) {
      return {
        canceled: true,
        error: err.message || 'Failed to select or optimize avatar.',
      };
    }
  },

  /**
   * Request media library permission and pick a project cover image.
   */
  async pickAndOptimizeProjectCover(): Promise<PickAndOptimizeResult> {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        return {
          canceled: true,
          error: 'Permission to access photos was denied. Please allow access in settings.',
        };
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (pickerResult.canceled || !pickerResult.assets || pickerResult.assets.length === 0) {
        return { canceled: true };
      }

      const asset = pickerResult.assets[0];

      const actions: Action[] = [];
      // Resize to max 1600 width while maintaining aspect ratio
      if (asset.width > MAX_COVER_WIDTH) {
        actions.push({
          resize: {
            width: MAX_COVER_WIDTH,
          },
        });
      }

      const manipulated = await manipulateAsync(
        asset.uri,
        actions,
        {
          format: SaveFormat.JPEG,
          compress: COMPRESSION_QUALITY,
        }
      );

      return {
        canceled: false,
        data: {
          uri: manipulated.uri,
          width: manipulated.width,
          height: manipulated.height,
        },
      };
    } catch (err: any) {
      return {
        canceled: true,
        error: err.message || 'Failed to select or optimize project cover.',
      };
    }
  },

  /**
   * Upload an optimized avatar to Supabase Storage under `avatars/{userId}/...`
   */
  async uploadAvatar(
    userId: string,
    imageUri: string
  ): Promise<{ data: StorageUploadResult | null; error: Error | null }> {
    try {
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength > MAX_AVATAR_SIZE_BYTES) {
        return {
          data: null,
          error: new Error('Avatar image exceeds maximum file size (2MB).'),
        };
      }

      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const storagePath = `${userId}/avatar-${Date.now()}-${randomSuffix}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(storagePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        return { data: null, error: new Error(uploadError.message) };
      }

      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(storagePath);

      return {
        data: {
          publicUrl: publicUrlData.publicUrl,
          storagePath,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: new Error(err.message || 'Failed to upload avatar image.'),
      };
    }
  },

  /**
   * Upload an optimized project cover to Supabase Storage under `project-covers/{ownerId}/{projectId}/...`
   */
  async uploadProjectCover(
    ownerId: string,
    projectId: string,
    imageUri: string
  ): Promise<{ data: StorageUploadResult | null; error: Error | null }> {
    try {
      const response = await fetch(imageUri);
      const arrayBuffer = await response.arrayBuffer();

      if (arrayBuffer.byteLength > MAX_COVER_SIZE_BYTES) {
        return {
          data: null,
          error: new Error('Project cover image exceeds maximum file size (5MB).'),
        };
      }

      const randomSuffix = Math.random().toString(36).substring(2, 8);
      const storagePath = `${ownerId}/${projectId}/cover-${Date.now()}-${randomSuffix}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('project-covers')
        .upload(storagePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        return { data: null, error: new Error(uploadError.message) };
      }

      const { data: publicUrlData } = supabase.storage
        .from('project-covers')
        .getPublicUrl(storagePath);

      return {
        data: {
          publicUrl: publicUrlData.publicUrl,
          storagePath,
        },
        error: null,
      };
    } catch (err: any) {
      return {
        data: null,
        error: new Error(err.message || 'Failed to upload project cover image.'),
      };
    }
  },

  /**
   * Safely deletes a file from the specified storage bucket.
   */
  async deleteFromStorage(
    bucket: 'avatars' | 'project-covers',
    urlOrPath: string | null | undefined
  ): Promise<void> {
    try {
      const path = extractStoragePath(bucket, urlOrPath);
      if (!path) return;
      await supabase.storage.from(bucket).remove([path]);
    } catch {
      // Best-effort cleanup: do not throw if delete fails or file not found
    }
  },
};
