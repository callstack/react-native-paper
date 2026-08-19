import { describe, expect, it } from '@jest/globals';

import { splitAccessibilityProps } from '../splitAccessibilityProps';

describe('splitAccessibilityProps', () => {
  it('moves accessibility props out of rest', () => {
    const onAccessibilityAction = () => {};
    const { accessibilityProps, rest } = splitAccessibilityProps({
      accessibilityLabel: 'Profile photo',
      accessibilityHint: 'User avatar',
      accessibilityRole: 'image',
      'aria-label': 'Jane Doe',
      role: 'img',
      onAccessibilityAction,
      pointerEvents: 'none',
      collapsable: false,
    });

    expect(accessibilityProps).toEqual({
      accessibilityLabel: 'Profile photo',
      accessibilityHint: 'User avatar',
      accessibilityRole: 'image',
      'aria-label': 'Jane Doe',
      role: 'img',
      onAccessibilityAction,
    });
    expect(rest).toEqual({
      pointerEvents: 'none',
      collapsable: false,
    });
  });

  it('omits undefined accessibility values', () => {
    const { accessibilityProps, rest } = splitAccessibilityProps({
      accessibilityLabel: undefined,
      pointerEvents: 'box-none',
    });

    expect(accessibilityProps).toEqual({});
    expect(rest).toEqual({
      pointerEvents: 'box-none',
    });
  });
});
