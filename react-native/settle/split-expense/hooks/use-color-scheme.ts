import { useTheme } from '@/components/providers';

export function useColorScheme() {
  const { colorScheme } = useTheme();
  return colorScheme;
}
