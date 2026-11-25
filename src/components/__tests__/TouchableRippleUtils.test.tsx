import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import color from 'color';

import { tokens } from '../../theme/tokens';
import {
  getHoverColor,
  getRippleColorFromContent,
} from '../TouchableRipple/utils';

const stateOpacity = tokens.md.sys.state.opacity;

describe('getRippleColorFromContent', () => {
  it('defaults to the content color at the pressed-state opacity', () => {
    expect(getRippleColorFromContent({ contentColor: '#123456' })).toBe(
      color('#123456').alpha(stateOpacity.pressed).rgb().string()
    );
  });

  it('returns undefined when the content color is not a plain string', () => {
    expect(
      getRippleColorFromContent({
        contentColor: PlatformColor('?attr/colorPrimary'),
      })
    ).toBeUndefined();
  });
});

describe('getHoverColor', () => {
  it('gives the content color at the hovered-state opacity for a content ripple', () => {
    const rippleColor = getRippleColorFromContent({ contentColor: '#123456' });

    expect(rippleColor).toBeDefined();
    expect(getHoverColor(rippleColor ?? '')).toBe(
      color('#123456').alpha(stateOpacity.hovered).rgb().string()
    );
  });

  it('keeps the hovered-to-pressed ratio for a custom ripple color', () => {
    const hoverColor = color(String(getHoverColor('rgba(255, 0, 0, 0.5)')));

    expect(hoverColor.rgb().array().slice(0, 3)).toEqual([255, 0, 0]);
    expect(hoverColor.alpha()).toBeCloseTo(
      (0.5 * stateOpacity.hovered) / stateOpacity.pressed
    );
  });

  it('returns a color that is not a plain string as is', () => {
    const rippleColor = PlatformColor('?attr/colorPrimary');

    expect(getHoverColor(rippleColor)).toBe(rippleColor);
  });
});
