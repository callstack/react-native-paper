import { useDark } from '@rspress/core/runtime';

export const useColorMode = () => {
  const isDark = useDark();

  return {
    colorMode: isDark ? 'dark' : 'light',
  };
};
