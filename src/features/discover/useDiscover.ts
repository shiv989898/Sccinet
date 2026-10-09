import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { discoverService } from './discoverService';

export const discoverQueryKeys = {
  all: ['discover'] as const,
  projects: (search?: string) =>
    [...discoverQueryKeys.all, 'projects', search?.trim() || ''] as const,
  builders: (search?: string) =>
    [...discoverQueryKeys.all, 'builders', search?.trim() || ''] as const,
};

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDiscoverProjects(search?: string) {
  return useQuery({
    queryKey: discoverQueryKeys.projects(search),
    queryFn: async () => {
      const { data, error } = await discoverService.searchProjects(search);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}

export function useDiscoverBuilders(search?: string) {
  return useQuery({
    queryKey: discoverQueryKeys.builders(search),
    queryFn: async () => {
      const { data, error } = await discoverService.searchBuilders(search);
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 30,
  });
}
