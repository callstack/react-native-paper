import { Palette } from './tokens';
import { shadow as _shadow } from './tokens/sys/elevation';

/**
 * @deprecated Pass `theme.colors.shadow` as the second argument and import
 * `shadow` from `react-native-paper/theme/tokens/sys/elevation`. Will be removed in a future version.
 */
export default function shadow(elevation: Parameters<typeof _shadow>[0]) {
  return _shadow(elevation, Palette.primary0);
}
