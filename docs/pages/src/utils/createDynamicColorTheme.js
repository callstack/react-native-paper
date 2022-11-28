/* @flow */
import {
  argbFromHex,
  themeFromSourceColor,
} from '@material/material-color-utilities';
import color from 'color';

type Config = {
  sourceColor: string,
};

const createDynamicThemeColors = ({ sourceColor }: Config) => {
  const opacity = {
    level1: 0.08,
    level2: 0.12,
    level3: 0.16,
    level4: 0.38,
  };
  const modes: Array<'light' | 'dark'> = ['light', 'dark'];

  const { schemes, palettes } = themeFromSourceColor(
    argbFromHex(color(sourceColor).hex())
  );

  const { light, dark } = modes.reduce(
    (prev, curr) => {
      const elevations = ['transparent', 0.05, 0.08, 0.11, 0.12, 0.14];
      const schemeModeJSON = schemes[curr].toJSON();

      const elevation = elevations.reduce(
        (a, v, index) => ({
          ...a,
          [`level${index}`]:
            index === 0
              ? v
              : color(schemeModeJSON.surface)
                  .mix(color(schemeModeJSON.primary), Number(v))
                  .rgb()
                  .string(),
        }),
        {}
      );

      const customColors = {
        surfaceDisabled: color(schemeModeJSON.onSurface)
          .alpha(opacity.level2)
          .rgb()
          .string(),
        onSurfaceDisabled: color(schemeModeJSON.onSurface)
          .alpha(opacity.level4)
          .rgb()
          .string(),
        backdrop: color(palettes.neutralVariant.tone(20))
          .alpha(0.4)
          .rgb()
          .string(),
      };

      const dynamicThemeColors = Object.assign(
        {},
        ...Object.entries(schemeModeJSON).map(([colorName, colorValue]) => ({
          [colorName]: color(colorValue).rgb().string(),
        })),
        {
          elevation,
          ...customColors,
        }
      );

      return {
        ...prev,
        [curr]: dynamicThemeColors,
      };
    },
    { light: {}, dark: {} }
  );

  return { light, dark };
};

export default createDynamicThemeColors;
