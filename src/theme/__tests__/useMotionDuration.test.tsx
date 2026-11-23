import * as React from 'react';

import { describe, expect, it } from '@jest/globals';
import { render, renderHook } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import type { ReduceMotionPreference } from '../../core/useResolvedReduceMotion';
import { useMotionDuration } from '../accessibility/ReduceMotionContext';

const withProvider =
  (reduceMotion: ReduceMotionPreference) =>
  ({ children }: { children: React.ReactNode }) => (
    <PaperProvider reduceMotion={reduceMotion}>{children}</PaperProvider>
  );

describe('useMotionDuration', () => {
  it('keeps the duration when reduceMotion is "off"', async () => {
    const { result } = await renderHook(() => useMotionDuration(), {
      wrapper: withProvider('off'),
    });

    expect(result.current(200)).toBe(200);
  });

  it('returns 0 when reduceMotion is "on"', async () => {
    const { result } = await renderHook(() => useMotionDuration(), {
      wrapper: withProvider('on'),
    });

    expect(result.current(200)).toBe(0);
  });

  it('keeps the duration outside a PaperProvider', async () => {
    const { result } = await renderHook(() => useMotionDuration());

    expect(result.current(150)).toBe(150);
  });

  it('keeps its identity and reads the latest preference when it changes', async () => {
    const getDurations: ((duration: number) => number)[] = [];
    const Probe = () => {
      getDurations.push(useMotionDuration());
      return null;
    };
    const makeTree = (reduceMotion: ReduceMotionPreference) => (
      <PaperProvider reduceMotion={reduceMotion}>
        <Probe />
      </PaperProvider>
    );

    const { rerender } = await render(makeTree('off'));
    const [getDuration] = getDurations;
    expect(getDuration(200)).toBe(200);

    await rerender(makeTree('on'));
    expect(getDuration(200)).toBe(0);

    await rerender(makeTree('off'));
    expect(getDuration(200)).toBe(200);

    expect(getDurations.length).toBeGreaterThan(1);
    expect(new Set(getDurations).size).toBe(1);
  });
});
