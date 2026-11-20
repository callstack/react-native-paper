import {
  argbFromHex,
  Hct,
  hexFromArgb,
  MaterialDynamicColors as roles,
  SchemeFidelity,
  SchemeTonalSpot,
} from '@material/material-color-utilities';
import type {
  DynamicColor,
  DynamicScheme,
} from '@material/material-color-utilities';
import camelCase from 'camelcase';
import Color from 'color';
import type { Theme } from 'react-native-paper';

type Mode = 'light' | 'dark';

type ColorRole = Exclude<
  keyof Theme['colors'],
  'stateLayerPressed' | 'elevation'
>;

type SchemeColors = Record<ColorRole, string>;

export type ThemeColors = SchemeColors & {
  stateLayerPressed: string;
  elevation: Record<keyof Theme['colors']['elevation'], string>;
  [customColor: string]: string | Record<string, string>;
};

export type ThemeOptions = {
  primary: string;
  secondary?: string;
  tertiary?: string;
  custom?: [string, string][];
  /**
   * Keep the generated colors close to the input colors, like Material's
   * color match mode. Otherwise the colors follow the default tonal spot
   * scheme.
   */
  matchInputColors: boolean;
};

// md.sys.state.pressed, the opacity of 6.x `stateLayerPressed`
const pressedStateOpacity = 0.1;

const createScheme = (color: string, mode: Mode, matchInputColors: boolean) => {
  const sourceColor = Hct.fromInt(argbFromHex(color));
  const isDark = mode === 'dark';

  return matchInputColors
    ? new SchemeFidelity(sourceColor, isDark, 0)
    : new SchemeTonalSpot(sourceColor, isDark, 0);
};

const getSchemeColors = (scheme: DynamicScheme): SchemeColors => {
  const hex = (role: DynamicColor) => hexFromArgb(role.getArgb(scheme));

  return {
    primary: hex(roles.primary),
    onPrimary: hex(roles.onPrimary),
    primaryContainer: hex(roles.primaryContainer),
    onPrimaryContainer: hex(roles.onPrimaryContainer),
    secondary: hex(roles.secondary),
    onSecondary: hex(roles.onSecondary),
    secondaryContainer: hex(roles.secondaryContainer),
    onSecondaryContainer: hex(roles.onSecondaryContainer),
    tertiary: hex(roles.tertiary),
    onTertiary: hex(roles.onTertiary),
    tertiaryContainer: hex(roles.tertiaryContainer),
    onTertiaryContainer: hex(roles.onTertiaryContainer),
    error: hex(roles.error),
    onError: hex(roles.onError),
    errorContainer: hex(roles.errorContainer),
    onErrorContainer: hex(roles.onErrorContainer),
    surface: hex(roles.surface),
    surfaceDim: hex(roles.surfaceDim),
    surfaceBright: hex(roles.surfaceBright),
    surfaceContainerLowest: hex(roles.surfaceContainerLowest),
    surfaceContainerLow: hex(roles.surfaceContainerLow),
    surfaceContainer: hex(roles.surfaceContainer),
    surfaceContainerHigh: hex(roles.surfaceContainerHigh),
    surfaceContainerHighest: hex(roles.surfaceContainerHighest),
    surfaceVariant: hex(roles.surfaceVariant),
    background: hex(roles.background),
    onSurface: hex(roles.onSurface),
    onSurfaceVariant: hex(roles.onSurfaceVariant),
    onBackground: hex(roles.onBackground),
    outline: hex(roles.outline),
    outlineVariant: hex(roles.outlineVariant),
    inverseSurface: hex(roles.inverseSurface),
    inverseOnSurface: hex(roles.inverseOnSurface),
    inversePrimary: hex(roles.inversePrimary),
    primaryFixed: hex(roles.primaryFixed),
    primaryFixedDim: hex(roles.primaryFixedDim),
    onPrimaryFixed: hex(roles.onPrimaryFixed),
    onPrimaryFixedVariant: hex(roles.onPrimaryFixedVariant),
    secondaryFixed: hex(roles.secondaryFixed),
    secondaryFixedDim: hex(roles.secondaryFixedDim),
    onSecondaryFixed: hex(roles.onSecondaryFixed),
    onSecondaryFixedVariant: hex(roles.onSecondaryFixedVariant),
    tertiaryFixed: hex(roles.tertiaryFixed),
    tertiaryFixedDim: hex(roles.tertiaryFixedDim),
    onTertiaryFixed: hex(roles.onTertiaryFixed),
    onTertiaryFixedVariant: hex(roles.onTertiaryFixedVariant),
    shadow: hex(roles.shadow),
    scrim: hex(roles.scrim),
  };
};

const getColors = (
  color: string,
  mode: Mode,
  matchInputColors: boolean
): SchemeColors => getSchemeColors(createScheme(color, mode, matchInputColors));

/**
 * Returns the colors a custom secondary or tertiary color gets: the primary
 * roles of a scheme built from that color.
 */
const getAccentColors = (
  color: string,
  mode: Mode,
  matchInputColors: boolean
) => {
  const colors = getColors(color, mode, matchInputColors);

  return {
    color: colors.primary,
    onColor: colors.onPrimary,
    container: colors.primaryContainer,
    onContainer: colors.onPrimaryContainer,
    fixed: colors.primaryFixed,
    fixedDim: colors.primaryFixedDim,
    onFixed: colors.onPrimaryFixed,
    onFixedVariant: colors.onPrimaryFixedVariant,
  };
};

const getSecondaryColors = (
  color: string,
  mode: Mode,
  matchInputColors: boolean
): Partial<SchemeColors> => {
  const accent = getAccentColors(color, mode, matchInputColors);

  return {
    secondary: accent.color,
    onSecondary: accent.onColor,
    secondaryContainer: accent.container,
    onSecondaryContainer: accent.onContainer,
    secondaryFixed: accent.fixed,
    secondaryFixedDim: accent.fixedDim,
    onSecondaryFixed: accent.onFixed,
    onSecondaryFixedVariant: accent.onFixedVariant,
  };
};

const getTertiaryColors = (
  color: string,
  mode: Mode,
  matchInputColors: boolean
): Partial<SchemeColors> => {
  const accent = getAccentColors(color, mode, matchInputColors);

  return {
    tertiary: accent.color,
    onTertiary: accent.onColor,
    tertiaryContainer: accent.container,
    onTertiaryContainer: accent.onContainer,
    tertiaryFixed: accent.fixed,
    tertiaryFixedDim: accent.fixedDim,
    onTertiaryFixed: accent.onFixed,
    onTertiaryFixedVariant: accent.onFixedVariant,
  };
};

const getCustomColors = (
  mode: Mode,
  matchInputColors: boolean,
  custom: [string, string][] = []
) => {
  const customColors: Record<string, string> = {};

  for (const [name, value] of custom) {
    if (name) {
      const accent = getAccentColors(value, mode, matchInputColors);
      const camelName = camelCase(name);
      const pascalName = camelCase(name, { pascalCase: true });

      customColors[camelName] = accent.color;
      customColors[`on${pascalName}`] = accent.onColor;
      customColors[`${camelName}Container`] = accent.container;
      customColors[`on${pascalName}Container`] = accent.onContainer;
    }
  }

  return customColors;
};

const prepareVariant = (
  { primary, secondary, tertiary, custom, matchInputColors }: ThemeOptions,
  mode: Mode
): ThemeColors => {
  const colors: SchemeColors = {
    ...getColors(primary, mode, matchInputColors),
    ...(secondary ? getSecondaryColors(secondary, mode, matchInputColors) : {}),
    ...(tertiary ? getTertiaryColors(tertiary, mode, matchInputColors) : {}),
  };

  return {
    ...colors,
    stateLayerPressed: Color(colors.onSurface)
      .alpha(pressedStateOpacity)
      .rgb()
      .string(),
    // Same surface container tones as the 6.x LightTheme and DarkTheme
    elevation: {
      level0: 'transparent',
      level1: colors.surfaceContainerLow,
      level2: colors.surfaceContainer,
      level3: colors.surfaceContainerHigh,
      level4: colors.surfaceContainerHigh,
      level5: colors.surfaceContainerHighest,
    },
    ...getCustomColors(mode, matchInputColors, custom),
  };
};

export const prepareThemes = (options: ThemeOptions) => ({
  light: prepareVariant(options, 'light'),
  dark: prepareVariant(options, 'dark'),
});

/**
 * The secondary and tertiary colors generated from the primary color, shown
 * in the pickers until the user picks their own.
 */
export const getDefaultAccentColors = (
  primary: string,
  matchInputColors: boolean
) => {
  const colors = getColors(primary, 'light', matchInputColors);

  return { secondary: colors.secondary, tertiary: colors.tertiary };
};

/** The preview boxes: background role, role of the text on it, grid columns. */
export const previewColors: [ColorRole, ColorRole, number?][] = [
  ['primary', 'onPrimary'],
  ['onPrimary', 'primary'],
  ['primaryContainer', 'onPrimaryContainer'],
  ['onPrimaryContainer', 'primaryContainer'],
  ['secondary', 'onSecondary'],
  ['onSecondary', 'secondary'],
  ['secondaryContainer', 'onSecondaryContainer'],
  ['onSecondaryContainer', 'secondaryContainer'],
  ['tertiary', 'onTertiary'],
  ['onTertiary', 'tertiary'],
  ['tertiaryContainer', 'onTertiaryContainer'],
  ['onTertiaryContainer', 'tertiaryContainer'],
  ['error', 'onError'],
  ['onError', 'error'],
  ['errorContainer', 'onErrorContainer'],
  ['onErrorContainer', 'errorContainer'],
  ['primaryFixed', 'onPrimaryFixed'],
  ['primaryFixedDim', 'onPrimaryFixedVariant'],
  ['onPrimaryFixed', 'primaryFixed'],
  ['onPrimaryFixedVariant', 'primaryFixedDim'],
  ['secondaryFixed', 'onSecondaryFixed'],
  ['secondaryFixedDim', 'onSecondaryFixedVariant'],
  ['onSecondaryFixed', 'secondaryFixed'],
  ['onSecondaryFixedVariant', 'secondaryFixedDim'],
  ['tertiaryFixed', 'onTertiaryFixed'],
  ['tertiaryFixedDim', 'onTertiaryFixedVariant'],
  ['onTertiaryFixed', 'tertiaryFixed'],
  ['onTertiaryFixedVariant', 'tertiaryFixedDim'],
  ['surfaceDim', 'onSurface'],
  ['surface', 'onSurface'],
  ['surfaceBright', 'onSurface'],
  ['background', 'onBackground'],
  ['surfaceContainerLowest', 'onSurface'],
  ['surfaceContainerLow', 'onSurface'],
  ['surfaceContainer', 'onSurface'],
  ['surfaceContainerHigh', 'onSurface'],
  ['surfaceContainerHighest', 'onSurface'],
  ['surfaceVariant', 'onSurfaceVariant'],
  ['onSurface', 'surface'],
  ['onSurfaceVariant', 'surfaceVariant'],
  ['inverseSurface', 'inverseOnSurface'],
  ['inverseOnSurface', 'inverseSurface'],
  ['inversePrimary', 'inverseSurface'],
  ['onBackground', 'background'],
  ['outline', 'surface', 2],
  ['outlineVariant', 'onSurface', 2],
];
