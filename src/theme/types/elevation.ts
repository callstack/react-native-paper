export type Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export type ElevationLevel =
  | 'level0'
  | 'level1'
  | 'level2'
  | 'level3'
  | 'level4'
  | 'level5';

export type ElevationColors = Record<ElevationLevel, string>;

export type ThemeElevation = Record<ElevationLevel, Elevation>;
