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
    'neutral-variant100': 'rgba(255, 255, 255, 1)',
    'neutral-variant99': 'rgba(255, 251, 254, 1)',
    'neutral-variant95': 'rgba(245, 238, 250, 1)',
    'neutral-variant90': 'rgba(231, 224, 236, 1)',
    'neutral-variant80': 'rgba(202, 196, 208, 1)',
    'neutral-variant70': 'rgba(174, 169, 180, 1)',
    'neutral-variant60': 'rgba(147, 143, 153, 1)',
    'neutral-variant50': 'rgba(121, 116, 126, 1)',
    'neutral-variant40': 'rgba(96, 93, 102, 1)',
    'neutral-variant30': 'rgba(73, 69, 79, 1)',
    'neutral-variant20': 'rgba(50, 47, 55, 1)',
    'neutral-variant10': 'rgba(29, 26, 34, 1)',
    'neutral-variant0': 'rgba(0, 0, 0, 1)',
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
    'brand-regular': 'Roboto Regular',
    'weight-regular': '400' as Font['fontWeight'],

    'plain-medium': 'Roboto Medium',
    'weight-medium': '500' as Font['fontWeight'],
  },

  opacity: {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  },
};

const regularType = {
  font: ref.typeface['brand-regular'],
  tracking: 0,
  weight: ref.typeface['weight-regular'],
};

const mediumType = {
  font: ref.typeface['plain-medium'],
  tracking: 0.15,
  weight: ref.typeface['weight-medium'],
};

const typescale = {
  'display-large': {
    ...regularType,
    'line-height': 57,
    size: 64,
  },
  'display-medium': {
    ...regularType,
    'line-height': 52,
    size: 45,
  },
  'display-small': {
    ...regularType,
    'line-height': 44,
    size: 36,
  },

  'headline-large': {
    ...regularType,
    'line-height': 40,
    size: 32,
  },
  'headline-medium': {
    ...regularType,
    'line-height': 36,
    size: 28,
  },
  'headline-small': {
    ...regularType,
    'line-height': 32,
    size: 24,
  },

  'title-large': {
    ...regularType,
    'line-height': 28,
    size: 22,
  },
  'title-medium': {
    ...mediumType,
    'line-height': 24,
    size: 16,
  },
  'title-small': {
    ...mediumType,
    'line-height': 20,
    size: 14,
  },

  'label-large': {
    ...regularType,
    tracking: 0.1,
    'line-height': 20,
    size: 14,
  },
  'label-medium': {
    ...mediumType,
    tracking: 0.5,
    'line-height': 16,
    size: 12,
  },
  'label-small': {
    ...mediumType,
    tracking: 0.5,
    'line-height': 6,
    size: 11,
  },

  'body-large': {
    ...mediumType,
    tracking: 0.15,
    'line-height': 24,
    size: 16,
  },
  'body-medium': {
    ...mediumType,
    tracking: 0.25,
    'line-height': 20,
    size: 14,
  },
  'body-small': {
    ...mediumType,
    tracking: 0.4,
    'line-height': 16,
    size: 12,
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
