import {
  argbFromHex,
  themeFromSourceColor,
  //@ts-ignore
} from '@material/material-color-utilities';
import camelCase from 'camelcase';
import Color from 'color';

type ARGBTheme = ReturnType<typeof argbThemeFromColor>;
type CSSTheme = Record<keyof ARGBTheme, string>;

type RGBColorList = {
  primary: string;
  secondary?: string;
  tertiary?: string;
  custom?: [string, string][];
};

type CustomTheme = RGBColorList & { type: 'light' | 'dark' };

const opacity = {
  level1: 0.08,
  level2: 0.12,
  level3: 0.16,
  level4: 0.38,
};

const elevationLevels = [0.05, 0.08, 0.11, 0.12, 0.14];

const nonMaterialCore = [
  'elevation',
  'shadow',
  'scrim',
  'inverseSurface',
  'inverseOnSurface',
  'surfaceDisabled',
  'onSurfaceDisabled',
  'outlineVariant',
  'backdrop',
  'inversePrimary',
];

const argbThemeFromColor = (
  color: string,
  type: 'light' | 'dark' = 'light'
) => {
  return themeFromSourceColor(argbFromHex(color)).schemes[type].toJSON();
};

const argbThemeToHexTheme = (theme: ARGBTheme) => {
  return Object.fromEntries(
    //@ts-ignore
    Object.entries(theme).map(([key, value]) => [key, Color(value).hex()])
  ) as CSSTheme;
};

const argbThemeToRgbTheme = (theme: ARGBTheme) => {
  return Object.fromEntries(
    //@ts-ignore
    Object.entries(theme).map(([key, value]) => [
      key,
      //@ts-ignore
      Color(value).rgb().string(),
    ])
  ) as CSSTheme;
};

export const hexThemeFromColor = (
  color: string,
  type: 'light' | 'dark' = 'light'
) => {
  return argbThemeToHexTheme(argbThemeFromColor(color, type));
};

const prepareSurfaceColors = (argbTheme: ARGBTheme) => {
  const { palettes } = themeFromSourceColor(argbTheme.primary);

  const surfaceDisabled = Color(argbTheme.onSurface)
    .alpha(opacity.level2)
    .rgb()
    .string();

  const onSurfaceDisabled = Color(argbTheme.onSurface)
    .alpha(opacity.level4)
    .rgb()
    .string();

  const backdrop = Color(palettes.neutralVariant.tone(20))
    .alpha(0.4)
    .rgb()
    .string();

  return {
    surfaceDisabled,
    onSurfaceDisabled,
    backdrop,
  };
};

const prepareElevations = (argbTheme: ARGBTheme) => {
  let elevations: Record<string, string> = {
    level0: 'transparent',
  };

  const { primary, surface } = argbTheme;

  for (let i = 0; i < elevationLevels.length; i++) {
    elevations[`level${i + 1}`] = Color(surface)
      .mix(Color(primary), Number(elevationLevels[i]))
      .rgb()
      .string();
  }

  return elevations;
};

export const getPreviewColors = (theme: Record<string, any>) => {
  const preview = { ...theme };

  for (let key of nonMaterialCore) {
    delete preview[key];
  }

  delete preview.elevation;

  return Object.entries(preview);
};

export const getMatchingColor = (
  colorName: string,
  theme: Record<string, any>
) => {
  if (colorName === 'outline') {
    return theme.surface;
  }

  if (colorName.startsWith('on')) {
    const key = camelCase(colorName.slice(2));
    return theme[key];
  }

  const key = `on${camelCase(colorName, { pascalCase: true })}`;
  return theme[key];
};

const prepareCustomColors = (
  type: 'light' | 'dark',
  custom?: [string, string][]
) => {
  if (!custom?.length) {
    return {};
  }

  let customColors: Record<string, string> = {};

  for (let [name, value] of custom) {
    if (name) {
      const customColor = argbThemeToRgbTheme(argbThemeFromColor(value, type));
      const camelName = camelCase(name);
      const PascalName = camelCase(name, { pascalCase: true });

      customColors[camelName] = customColor.primary;
      customColors[`on${PascalName}`] = customColor.onPrimary;
      customColors[`${camelName}Container`] = customColor.primaryContainer;
      customColors[`on${PascalName}Container`] = customColor.onPrimaryContainer;
    }
  }

  return customColors;
};

export const prepareVariant = ({
  primary,
  secondary,
  tertiary,
  type,
  custom,
}: CustomTheme) => {
  const baseTheme = argbThemeFromColor(primary, type);

  if (secondary) {
    const secondaryTheme = argbThemeFromColor(secondary, type);
    baseTheme.secondary = secondaryTheme.primary;
    baseTheme.onSecondary = secondaryTheme.onPrimary;
    baseTheme.secondaryContainer = secondaryTheme.primaryContainer;
    baseTheme.onSecondaryContainer = secondaryTheme.onPrimaryContainer;
  }

  if (tertiary) {
    const tertiaryTheme = argbThemeFromColor(tertiary, type);
    baseTheme.tertiary = tertiaryTheme.primary;
    baseTheme.onTertiary = tertiaryTheme.onPrimary;
    baseTheme.tertiaryContainer = tertiaryTheme.primaryContainer;
    baseTheme.onTertiaryContainer = tertiaryTheme.onPrimaryContainer;
  }

  const theme = argbThemeToRgbTheme(baseTheme);
  const elevation = prepareElevations(baseTheme);
  const surfaceColors = prepareSurfaceColors(baseTheme);
  const customColors = prepareCustomColors(type, custom);

  return {
    ...theme,
    elevation,
    ...surfaceColors,
    ...customColors,
  };
};

export const prepareThemes = (colors: RGBColorList) => {
  const light = prepareVariant({
    ...colors,
    type: 'light',
  });

  const dark = prepareVariant({
    ...colors,
    type: 'dark',
  });

  return { light, dark };
};
