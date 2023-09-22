import { Platform, PlatformOSType } from 'react-native';

import { typescale } from './themes/v3/tokens';
import type { Fonts, MD3Type, MD3Typescale, MD3TypescaleKey } from '../types';

export const fontConfig = {
  web: {
    regular: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '400' as '400',
    },
    medium: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '500' as '500',
    },
    light: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '300' as '300',
    },
    thin: {
      fontFamily: 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
      fontWeight: '100' as '100',
    },
  },
  ios: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300' as '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100' as '100',
    },
  },
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal' as 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal' as 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal' as 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal' as 'normal',
    },
  },
};

type MD2FontsConfig = {
  [platform in PlatformOSType | 'default']?: Fonts;
};

type MD3FontsConfig =
  | {
      [key in MD3TypescaleKey]: Partial<MD3Type>;
    }
  | {
      [key: string]: MD3Type;
    }
  | Partial<MD3Type>;

function configureV2Fonts(config: MD2FontsConfig): Fonts {
  const fonts = Platform.select({ ...fontConfig, ...config }) as Fonts;
  return fonts;
}

function configureV3Fonts(
  config: MD3FontsConfig
): MD3Typescale | (MD3Typescale & { [key: string]: MD3Type }) {
  if (!config) {
    return typescale;
  }

  const isFlatConfig = Object.keys(config).every(
    (key) => typeof config[key as keyof typeof config] !== 'object'
  );

  if (isFlatConfig) {
    return Object.fromEntries(
      Object.entries(typescale).map(([variantName, variantProperties]) => [
        variantName,
        { ...variantProperties, ...config },
      ])
    ) as MD3Typescale;
  }

  return Object.assign(
    {},
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescale[variantName as MD3TypescaleKey],
        ...variantProperties,
      },
    }))
  );
}

// eslint-disable-next-line no-redeclare
export default function configureFonts(params: { isV3: false }): Fonts;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config?: MD2FontsConfig;
  isV3: false;
}): Fonts;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<MD3Type>;
  isV3?: true;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>;
  isV3?: true;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config: Record<string, MD3Type>;
  isV3?: true;
}): MD3Typescale & { [key: string]: MD3Type };
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { isV3 = true, config } = params || {};

  if (isV3) {
    return configureV3Fonts(config);
  }
  return configureV2Fonts(config);
}
