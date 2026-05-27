import type { Typescale } from '../../types';
import { typeface } from '../ref/typeface';

const regularType = {
  fontFamily: typeface.brandRegular,
  letterSpacing: 0,
  fontWeight: typeface.weightRegular,
};

const mediumType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0.15,
  fontWeight: typeface.weightMedium,
};

const emphasizedMediumType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0,
  fontWeight: typeface.weightMedium,
};

const emphasizedBoldType = {
  fontFamily: typeface.plainMedium,
  letterSpacing: 0,
  fontWeight: typeface.weightBold,
};

/** md.sys.typescale.* */
export const typescale = {
  displayLarge: {
    ...regularType,
    letterSpacing: -0.25,
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
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    letterSpacing: 0.5,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMedium: {
    ...mediumType,
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmall: {
    ...mediumType,
    fontWeight: typeface.weightRegular,
    fontFamily: typeface.brandRegular,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },

  displayLargeEmphasized: {
    ...emphasizedMediumType,
    letterSpacing: -0.25,
    lineHeight: 64,
    fontSize: 57,
  },
  displayMediumEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 52,
    fontSize: 45,
  },
  displaySmallEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 44,
    fontSize: 36,
  },

  headlineLargeEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 40,
    fontSize: 32,
  },
  headlineMediumEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 36,
    fontSize: 28,
  },
  headlineSmallEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 32,
    fontSize: 24,
  },

  titleLargeEmphasized: {
    ...emphasizedMediumType,
    lineHeight: 28,
    fontSize: 22,
  },
  titleMediumEmphasized: {
    ...emphasizedBoldType,
    letterSpacing: 0.15,
    lineHeight: 24,
    fontSize: 16,
  },
  titleSmallEmphasized: {
    ...emphasizedBoldType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },

  labelLargeEmphasized: {
    ...emphasizedBoldType,
    letterSpacing: 0.1,
    lineHeight: 20,
    fontSize: 14,
  },
  labelMediumEmphasized: {
    ...emphasizedBoldType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 12,
  },
  labelSmallEmphasized: {
    ...emphasizedBoldType,
    letterSpacing: 0.5,
    lineHeight: 16,
    fontSize: 11,
  },

  bodyLargeEmphasized: {
    ...emphasizedMediumType,
    letterSpacing: 0.5,
    lineHeight: 24,
    fontSize: 16,
  },
  bodyMediumEmphasized: {
    ...emphasizedMediumType,
    letterSpacing: 0.25,
    lineHeight: 20,
    fontSize: 14,
  },
  bodySmallEmphasized: {
    ...emphasizedMediumType,
    letterSpacing: 0.4,
    lineHeight: 16,
    fontSize: 12,
  },

  default: {
    ...regularType,
  },
};

export const defaultFonts: Typescale = typescale;
