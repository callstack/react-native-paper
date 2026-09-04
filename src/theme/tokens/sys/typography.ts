import type { Typescale } from '../../types';
import { typeface } from '../ref/typeface';

const brandRegularType = {
  fontFamily: typeface.brandRegular,
  letterSpacing: 0,
  fontWeight: typeface.weightRegular,
};

const brandMediumType = {
  fontFamily: typeface.brandMedium,
  letterSpacing: 0,
  fontWeight: typeface.weightMedium,
};

const plainRegularType = {
  fontFamily: typeface.plainRegular,
  letterSpacing: 0,
  fontWeight: typeface.weightRegular,
};

const plainMediumType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0.15,
  fontWeight: typeface.weightMedium,
};

const plainMediumEmphasizedType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0,
  fontWeight: typeface.weightMedium,
};

const plainBoldType = {
  fontFamily: typeface.plainRegular,
  letterSpacing: 0,
  fontWeight: typeface.weightBold,
};

/** md.sys.typescale.* */
export const typescale = {
  displayLarge: {
    ...brandRegularType,
    letterSpacing: -0.25,
    lineHeight: 64,
    fontSize: 57,
  },
  displayMedium: {
    ...brandRegularType,
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmall: {
    ...brandRegularType,
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLarge: {
    ...brandRegularType,
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMedium: {
    ...brandRegularType,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmall: {
    ...brandRegularType,
    lineHeight: 32,
    fontSize: 24,
  },

  titleLarge: {
    ...brandRegularType,
    lineHeight: 28,
    fontSize: 22,
  },
  titleMedium: {
    ...plainMediumType,
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmall: {
    ...plainMediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLarge: {
    ...plainMediumType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMedium: {
    ...plainMediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmall: {
    ...plainMediumType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLarge: {
    ...plainRegularType,
    letterSpacing: 0.5,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMedium: {
    ...plainRegularType,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    ...plainRegularType,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },

  displayLargeEmphasized: {
    ...brandMediumType,
    letterSpacing: -0.25,
    lineHeight: 64,
    fontSize: 57,
  },
  displayMediumEmphasized: {
    ...brandMediumType,
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmallEmphasized: {
    ...brandMediumType,
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLargeEmphasized: {
    ...brandMediumType,
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMediumEmphasized: {
    ...brandMediumType,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmallEmphasized: {
    ...brandMediumType,
    lineHeight: 32,
    fontSize: 24,
  },

  titleLargeEmphasized: {
    ...brandMediumType,
    lineHeight: 28,
    fontSize: 22,
  },
  titleMediumEmphasized: {
    ...plainBoldType,
    letterSpacing: 0.15,
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmallEmphasized: {
    ...plainBoldType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLargeEmphasized: {
    ...plainBoldType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMediumEmphasized: {
    ...plainBoldType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmallEmphasized: {
    ...plainBoldType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLargeEmphasized: {
    ...plainMediumEmphasizedType,
    letterSpacing: 0.5,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMediumEmphasized: {
    ...plainMediumEmphasizedType,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmallEmphasized: {
    ...plainMediumEmphasizedType,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },

  default: {
    ...brandRegularType,
  },
};

export const defaultFonts: Typescale = typescale;
