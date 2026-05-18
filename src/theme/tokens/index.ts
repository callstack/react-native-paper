import { palette } from './ref/palette';
import { typeface } from './ref/typeface';
import { state } from './sys/state';
import { typescale } from './sys/typography';

/** Material Design token tree: md.ref.* (raw values) and md.sys.* (semantic decisions). */
export const tokens = {
  md: {
    ref: {
      palette,
      typeface,
    },
    sys: {
      typescale,
      state: state,
      scrim: { alpha: 0.32 },
    },
  },
};

export { typescale };
export const Palette = palette;
