import { Platform } from 'react-native';

import type { Font } from '../../../types';

const ref = {
  palette: {
    primary100: 'rgba(255, 255, 255, 1)',
    primary99: 'rgba(255, 251, 254, 1)',
    primary95: 'rgba(246, 237, 255, 1)',
    primary90: 'rgba(234, 221, 255, 1)',
    primary80: 'rgba(208, 188, 255, 1)',
    primary70: 'rgba(182, 157, 248, 1)',
    primary60: 'rgba(154, 130, 219, 1)',
    primary50: 'rgba(127, 103, 190, 1)',
    primary40: 'rgba(103, 80, 164, 1)',
    primary30: 'rgba(79, 55, 139, 1)',
    primary20: 'rgba(56, 30, 114, 1)',
    primary10: 'rgba(33, 0, 93, 1)',
    primary0: 'rgba(0, 0, 0, 1)',
    secondary100: 'rgba(255, 255, 255, 1)',
    secondary99: 'rgba(255, 251, 254, 1)',
    secondary95: 'rgba(246, 237, 255, 1)',
    secondary90: 'rgba(232, 222, 248, 1)',
    secondary80: 'rgba(204, 194, 220, 1)',
    secondary70: 'rgba(176, 167, 192, 1)',
    secondary60: 'rgba(149, 141, 165, 1)',
    secondary50: 'rgba(122, 114, 137, 1)',
    secondary40: 'rgba(98, 91, 113, 1)',
    secondary30: 'rgba(74, 68, 88, 1)',
    secondary20: 'rgba(51, 45, 65, 1)',
    secondary10: 'rgba(29, 25, 43, 1)',
    secondary0: 'rgba(0, 0, 0, 1)',
    tertiary100: 'rgba(255, 255, 255, 1)',
    tertiary99: 'rgba(255, 251, 250, 1)',
    tertiary95: 'rgba(255, 236, 241, 1)',
    tertiary90: 'rgba(255, 216, 228, 1)',
    tertiary80: 'rgba(239, 184, 200, 1)',
    tertiary70: 'rgba(210, 157, 172, 1)',
    tertiary60: 'rgba(181, 131, 146, 1)',
    tertiary50: 'rgba(152, 105, 119, 1)',
    tertiary40: 'rgba(125, 82, 96, 1)',
    tertiary30: 'rgba(99, 59, 72, 1)',
    tertiary20: 'rgba(73, 37, 50, 1)',
    tertiary10: 'rgba(49, 17, 29, 1)',
    tertiary0: 'rgba(0, 0, 0, 1)',
    neutral100: 'rgba(255, 255, 255, 1)',
    neutral99: 'rgba(255, 251, 254, 1)',
    neutral95: 'rgba(244, 239, 244, 1)',
    neutral90: 'rgba(230, 225, 229, 1)',
    neutral80: 'rgba(201, 197, 202, 1)',
    neutral70: 'rgba(174, 170, 174, 1)',
    neutral60: 'rgba(147, 144, 148, 1)',
    neutral50: 'rgba(120, 117, 121, 1)',
    neutral40: 'rgba(96, 93, 98, 1)',
    neutral30: 'rgba(72, 70, 73, 1)',
    neutral20: 'rgba(49, 48, 51, 1)',
    neutral10: 'rgba(28, 27, 31, 1)',
    neutral0: 'rgba(0, 0, 0, 1)',
    neutralVariant100: 'rgba(255, 255, 255, 1)',
    neutralVariant99: 'rgba(255, 251, 254, 1)',
    neutralVariant95: 'rgba(245, 238, 250, 1)',
    neutralVariant90: 'rgba(231, 224, 236, 1)',
    neutralVariant80: 'rgba(202, 196, 208, 1)',
    neutralVariant70: 'rgba(174, 169, 180, 1)',
    neutralVariant60: 'rgba(147, 143, 153, 1)',
    neutralVariant50: 'rgba(121, 116, 126, 1)',
    neutralVariant40: 'rgba(96, 93, 102, 1)',
    neutralVariant30: 'rgba(73, 69, 79, 1)',
    neutralVariant20: 'rgba(50, 47, 55, 1)',
    neutralVariant10: 'rgba(29, 26, 34, 1)',
    neutralVariant0: 'rgba(0, 0, 0, 1)',
    error100: 'rgba(255, 255, 255, 1)',
    error99: 'rgba(255, 251, 249, 1)',
    error95: 'rgba(252, 238, 238, 1)',
    error90: 'rgba(249, 222, 220, 1)',
    error80: 'rgba(242, 184, 181, 1)',
    error70: 'rgba(236, 146, 142, 1)',
    error60: 'rgba(228, 105, 98, 1)',
    error50: 'rgba(220, 54, 46, 1)',
    error40: 'rgba(179, 38, 30, 1)',
    error30: 'rgba(140, 29, 24, 1)',
    error20: 'rgba(96, 20, 16, 1)',
    error10: 'rgba(65, 14, 11, 1)',
    error0: 'rgba(0, 0, 0, 1)',
  },

  typeface: {
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
  },

  opacity: {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  },
};

const regularType = {
  fontFamily: ref.typeface.brandRegular,
  letterSpacing: 0,
  fontWeight: ref.typeface.weightRegular,
};

const mediumType = {
  fontFamily: ref.typeface.plainMedium,
  letterSpacing: 0.15,
  fontWeight: ref.typeface.weightMedium,
};

export const typescale = {
  displayLarge: {
    ...regularType,
    lineHeight: 64,
    fontSize: 57,
  },
  displayMedium: {
    ...regularType,
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmall: {
    ...regularType,
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLarge: {
    ...regularType,
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMedium: {
    ...regularType,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmall: {
    ...regularType,
    lineHeight: 32,
    fontSize: 24,
  },

  titleLarge: {
    ...regularType,
    lineHeight: 28,
    fontSize: 22,
  },
  titleMedium: {
    ...mediumType,
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmall: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLarge: {
    ...mediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMedium: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmall: {
    ...mediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLarge: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMedium: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    ...mediumType,
    fontWeight: ref.typeface.weightRegular,
    fontFamily: ref.typeface.brandRegular,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },
};

export const tokens = {
  md: {
    ref,
    sys: {
      typescale,
    },
  },
};

export const MD3Colors = ref.palette;
