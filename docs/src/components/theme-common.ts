import { useDark } from '@rspress/core/dist/runtime/index.js';

export const useColorMode = () => {
  const isDark = useDark();

  return {
    colorMode: isDark ? 'dark' : 'light',
  };
};
