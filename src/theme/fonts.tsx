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

  const isFlatConfig = Object.values(config).every(
    (value) => typeof value !== 'object'
  );

  if (isFlatConfig) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    return Object.fromEntries(
      Object.entries(typescale).map(([variantName, variantProperties]) => [
        variantName,
        { ...variantProperties, ...config },
      ])
    ) as Typescale;
  }

  const typescaleByVariant: Partial<
    Record<string, Typescale[keyof Typescale]>
  > = typescale;

  return Object.assign(
    {},
    typescale,
    ...Object.entries(config).map(([variantName, variantProperties]) => ({
      [variantName]: {
        ...typescaleByVariant[variantName],
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
