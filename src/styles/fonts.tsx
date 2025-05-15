import type { TypescaleConfig, Typescale, TypescaleKey } from '../types';
import { typescale } from './themes/tokens';

type FontsConfig =
  | {
      [key in TypescaleKey]: Partial<TypescaleConfig>;
    }
  | {
      [key: string]: TypescaleConfig;
    }
  | Partial<TypescaleConfig>;

function mergeFontsConfig(
  config: FontsConfig
): Typescale | (Typescale & { [key: string]: TypescaleConfig }) {
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
    ) as Typescale;
  }

  return Object.assign(
    {},
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescale[variantName as TypescaleKey],
        ...variantProperties,
      },
    }))
  );
}

// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<TypescaleConfig>;
}): Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<TypescaleKey, Partial<TypescaleConfig>>>;
}): Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config: Record<string, TypescaleConfig>;
}): Typescale & { [key: string]: TypescaleConfig };
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { config } = params || {};
  return mergeFontsConfig(config);
}
