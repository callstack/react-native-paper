export type Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export type ElevationLevel = `level${Elevation}`;

export type ElevationColors = Record<ElevationLevel, string>;

export type ThemeElevation = Record<ElevationLevel, Elevation>;
