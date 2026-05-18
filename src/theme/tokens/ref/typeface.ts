import { Platform } from 'react-native';

import type { Font } from '../../types';

/** md.ref.typeface.* — font families and weights. */
export const typeface = {
  brandRegular: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  weightRegular: '400' as Font['fontWeight'],

  plainMedium: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }),
  weightMedium: '500' as Font['fontWeight'],

  weightBold: '700' as Font['fontWeight'],
};
