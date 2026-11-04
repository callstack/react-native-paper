import { Platform } from 'react-native';

import type { Font } from '../../types';

/** md.ref.typeface.* — font families and weights. */
export const typeface = {
  brandRegular: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  brandMedium: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }),
  weightRegular: '400',

  plainRegular: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif',
  }),
  plainMedium: Platform.select({
    web: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
    ios: 'System',
    default: 'sans-serif-medium',
  }),
  weightMedium: '500',

  weightBold: '700',
} satisfies {
  brandRegular?: string;
  brandMedium?: string;
  weightRegular: Font['fontWeight'];
  plainRegular?: string;
  plainMedium?: string;
  weightMedium: Font['fontWeight'];
  weightBold: Font['fontWeight'];
};
