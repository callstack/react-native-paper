import { describe, expect, it } from '@jest/globals';

import { takeGraphemes } from '../takeGraphemes';

describe('takeGraphemes', () => {
  it('returns ASCII characters by count', () => {
    expect(takeGraphemes('XD', 2)).toBe('XD');
    expect(takeGraphemes('Hello', 2)).toBe('He');
  });

  it('returns an empty string for empty input or non-positive count', () => {
    expect(takeGraphemes('', 2)).toBe('');
    expect(takeGraphemes('XD', 0)).toBe('');
    expect(takeGraphemes('XD', -1)).toBe('');
  });

  it('keeps combining marks attached to the base character', () => {
    expect(takeGraphemes('e\u0301va', 1)).toBe('e\u0301');
    expect(takeGraphemes('e\u0301va', 2)).toBe('e\u0301v');
  });

  it('does not split surrogate-pair emoji', () => {
    expect(takeGraphemes('😀😃', 1)).toBe('😀');
    expect(takeGraphemes('😀😃', 2)).toBe('😀😃');
  });

  it('keeps emoji skin tones as a single grapheme', () => {
    expect(takeGraphemes('👍🏽👍', 1)).toBe('👍🏽');
  });

  it('keeps ZWJ emoji sequences as a single grapheme', () => {
    expect(takeGraphemes('👨‍👩‍👧X', 1)).toBe('👨‍👩‍👧');
  });

  it('keeps flag emoji as a single grapheme', () => {
    expect(takeGraphemes('🇪🇺X', 1)).toBe('🇪🇺');
    expect(takeGraphemes('🇪🇺X', 2)).toBe('🇪🇺X');
  });
});
