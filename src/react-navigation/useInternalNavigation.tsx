import { useNavigation, NavigationProp } from '@react-navigation/native';

import type { NavigationParams } from './types';

/**
 * Get properly typed navigation object from useNavigation hook
 *
 * @returns navigation object
 */
const useInternalNavigation = (): NavigationProp<NavigationParams> =>
  useNavigation<NavigationProp<NavigationParams>>();

export default useInternalNavigation;
