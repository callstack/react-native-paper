import { describe, expect, it } from '@jest/globals';

import {
  MIN_TOUCH_TARGET_SIZE,
  getMinTouchTargetHitSlop,
} from '../touchTarget';

describe('getMinTouchTargetHitSlop', () => {
  it('expands a control smaller than the minimum target', () => {
    expect(getMinTouchTargetHitSlop(40)).toEqual({
      top: 4,
      bottom: 4,
      left: 4,
      right: 4,
    });
  });

  it('returns undefined when the control already meets the minimum', () => {
    expect(getMinTouchTargetHitSlop(MIN_TOUCH_TARGET_SIZE)).toBeUndefined();
    expect(getMinTouchTargetHitSlop(56)).toBeUndefined();
  });
});
