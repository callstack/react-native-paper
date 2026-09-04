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

  // A config entry is either a whole variant (an object, e.g. `bodyLarge: { fontSize: 18 }`)
  // or a single font property shared by every variant (e.g. `fontFamily: 'NotoSans'`).
  // Both may appear in the same config, so they are collected separately instead of
  // classifying the config as a whole.
  const sharedProperties: Record<string, unknown> = {};
  const variantOverrides: Record<string, object> = {};

  for (const [key, value] of Object.entries(config)) {
    if (typeof value === 'object' && value !== null) {
      variantOverrides[key] = value;
    } else {
      sharedProperties[key] = value;
    }
  }

  const typescaleByVariant: Partial<
    Record<string, Typescale[keyof Typescale]>
  > = typescale;

  const variantNames = new Set([
    ...Object.keys(typescale),
    ...Object.keys(variantOverrides),
  ]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  return Object.fromEntries(
    Array.from(variantNames, (variantName) => [
      variantName,
      {
        ...typescaleByVariant[variantName],
        ...sharedProperties,
        ...variantOverrides[variantName],
      },
    ])
  ) as Typescale;
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
  config: Partial<TypescaleStyle> &
    Partial<Record<TypescaleKey, Partial<TypescaleStyle>>>;
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
