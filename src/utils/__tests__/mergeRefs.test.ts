import { createRef } from 'react';

import { describe, expect, it, jest } from '@jest/globals';

import { mergeRefs } from '../mergeRefs';

describe('mergeRefs', () => {
  it('writes the node to object refs and calls callback refs', () => {
    const object = createRef<string>();
    const callback = jest.fn<(node: string | null) => void>();

    mergeRefs<string>(object, callback)('node');

    expect(object.current).toBe('node');
    expect(callback).toHaveBeenCalledWith('node');
  });

  it('skips refs that were not passed', () => {
    const object = createRef<string>();

    expect(() =>
      mergeRefs<string>(undefined, object, null)('node')
    ).not.toThrow();
    expect(object.current).toBe('node');
  });

  it('clears every ref when react detaches it', () => {
    const object = createRef<string>();
    const callback = jest.fn<(node: string | null) => void>();
    const merged = mergeRefs<string>(object, callback);

    merged('node');
    merged(null);

    expect(object.current).toBeNull();
    expect(callback).toHaveBeenLastCalledWith(null);
  });
});
