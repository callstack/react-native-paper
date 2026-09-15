import { describe, expect, it } from '@jest/globals';

import { expressiveMotion, getTransition } from '../tokens/sys/motion';

const theme = { motion: expressiveMotion };

describe('getTransition', () => {
  it('passes the property through unchanged for a single property', () => {
    expect(
      getTransition(theme, 'opacity', 'short3', 'standard', false)
    ).toMatchObject({ transitionProperty: 'opacity' });
  });

  it('passes the property through unchanged for multiple properties', () => {
    expect(
      getTransition(theme, ['width', 'opacity'], 'short3', 'standard', false)
    ).toMatchObject({ transitionProperty: ['width', 'opacity'] });
  });

  it('reads the duration from the given token', () => {
    expect(
      getTransition(theme, 'opacity', 'short2', 'standard', false)
        .transitionDuration
    ).toBe(expressiveMotion.duration.short2);
  });

  it('zeroes the duration when reduceMotion is set, regardless of the token', () => {
    expect(
      getTransition(theme, 'opacity', 'short2', 'standard', true)
        .transitionDuration
    ).toBe(0);
  });

  it('builds a cubicBezier timing function from the given easing token', () => {
    const { transitionTimingFunction } = getTransition(
      theme,
      'opacity',
      'short3',
      'standardAccelerate',
      false
    );

    expect(transitionTimingFunction?.toString()).toBe(
      `cubicBezier(${expressiveMotion.easing.standardAccelerate.join(', ')})`
    );
  });
});
