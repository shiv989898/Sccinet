import { useColorScheme } from 'react-native';
import { useThemeStore } from '../stores/useThemeStore';
import { getTheme } from '../theme';
import { ColorScheme, Theme } from '../types/theme';

export function useTheme(): Theme {
  const systemScheme = useColorScheme();
  const preference = useThemeStore((state) => state.preference);

  let activeScheme: ColorScheme = 'dark';
  if (preference === 'system') {
    activeScheme = systemScheme === 'light' ? 'light' : 'dark';
  } else {
    activeScheme = preference;
  }

  return getTheme(activeScheme);
}
