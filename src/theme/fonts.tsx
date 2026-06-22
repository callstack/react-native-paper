import { typescale } from './tokens';
import type { TypescaleStyle, Typescale, TypescaleKey } from './types';

type FontsConfig =
  | Record<TypescaleKey, Partial<TypescaleStyle>>
  | Record<string, TypescaleStyle>
  | Partial<TypescaleStyle>;

function configureFontsConfig(
  config: FontsConfig
): Typescale | (Typescale & { [key: string]: TypescaleStyle }) {
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

export default function configureFonts(params?: {
  config?: Partial<TypescaleStyle>;
}): Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: {
  config?: Partial<Record<TypescaleKey, Partial<TypescaleStyle>>>;
}): Typescale;
// eslint-disable-next-line no-redeclare
export default function configureFonts(params: {
  config: Record<string, TypescaleStyle>;
}): Typescale & { [key: string]: TypescaleStyle };
// eslint-disable-next-line no-redeclare
export default function configureFonts(params?: any) {
  const { config } = params || {};
  return configureFontsConfig(config);
}
