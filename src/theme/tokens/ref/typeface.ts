import { Platform } from 'react-native';

import type { Font } from '../../types';

/** md.ref.typeface.* — font families and weights. */
export const typeface = {
  brandRegular: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  weightRegular: '400',

  plainMedium: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }),
  weightMedium: '500',

  weightBold: '700',
} satisfies {
  brandRegular?: string;
  weightRegular: Font['fontWeight'];
  plainMedium?: string;
  weightMedium: Font['fontWeight'];
  weightBold: Font['fontWeight'];
};
