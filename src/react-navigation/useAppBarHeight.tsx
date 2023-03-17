import { useRoute, RouteProp } from '@react-navigation/native';

import type { NavigationParams } from './types';

/**
 * Gets app bar height for current screen
 *
 * @returns app bar height of parent screen
 */
const useAppBarHeight = (): number => {
  const { params } = useRoute<RouteProp<NavigationParams>>();

  return params?.headerHeight ?? 0;
};

export default useAppBarHeight;
