import type { MD3Type, MD3Typescale, MD3TypescaleKey } from '../types';
import { typescale } from './themes/v3/tokens';

type MD3FontsConfig =
  | {
      [key in MD3TypescaleKey]: Partial<MD3Type>;
    }
  | {
      [key: string]: MD3Type;
    }
  | Partial<MD3Type>;

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
export default function configureFonts(params?: {
  config?: Partial<MD3Type>;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<MD3TypescaleKey, Partial<MD3Type>>>;
}): MD3Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config: Record<string, MD3Type>;
}): MD3Typescale & { [key: string]: MD3Type };
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { config } = params || {};
  return configureV3Fonts(config);
}
