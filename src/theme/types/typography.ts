export type Font = {
  fontFamily: string;
  fontWeight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  fontStyle?: 'normal' | 'italic' | undefined;
};

export type Fonts = {
  regular: Font;
  medium: Font;
  light: Font;
  thin: Font;
};

export type TypescaleKey =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headlineLarge'
  | 'headlineMedium'
  | 'headlineSmall'
  | 'titleLarge'
  | 'titleMedium'
  | 'titleSmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  // Emphasized styles carry the `*-weight-prominent` weight of their base
  // style, used to mark selection (e.g. the active navigation destination).
  // @see https://m3.material.io/styles/typography/type-scale-tokens
  | 'displayLargeEmphasized'
  | 'displayMediumEmphasized'
  | 'displaySmallEmphasized'
  | 'headlineLargeEmphasized'
  | 'headlineMediumEmphasized'
  | 'headlineSmallEmphasized'
  | 'titleLargeEmphasized'
  | 'titleMediumEmphasized'
  | 'titleSmallEmphasized'
  | 'labelLargeEmphasized'
  | 'labelMediumEmphasized'
  | 'labelSmallEmphasized'
  | 'bodyLargeEmphasized'
  | 'bodyMediumEmphasized'
  | 'bodySmallEmphasized';

export type TypescaleStyle = {
  fontFamily: string;
  letterSpacing: number;
  fontWeight: Font['fontWeight'];
  lineHeight: number;
  fontSize: number;
  fontStyle?: Font['fontStyle'];
};

export type Typescale = Record<TypescaleKey, TypescaleStyle> & {
  default: Omit<TypescaleStyle, 'lineHeight' | 'fontSize'>;
};
