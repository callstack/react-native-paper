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
  | 'bodySmall';

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
