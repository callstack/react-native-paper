export type Elevation = 0 | 1 | 2 | 3 | 4 | 5;

export type ElevationColors = Record<`level${Elevation}`, string>;
