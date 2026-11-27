import { AccessibilityInfo } from 'react-native';

import { beforeEach, expect, it, jest } from '@jest/globals';
import * as Reanimated from 'react-native-reanimated';

import PaperProvider from '../../core/PaperProvider';
import { act, render, screen } from '../../test-utils';
import CrossFadeIcon from '../CrossFadeIcon';

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    withTiming: jest.fn(ReanimatedModule.withTiming),
  };
});

const withTiming = jest.mocked(Reanimated.withTiming);

beforeEach(() => {
  withTiming.mockClear();
});

it('cross-fades to a new icon in 200 ms when reduceMotion is "off"', async () => {
  const makeIcon = (source: string) => (
    <PaperProvider reduceMotion="off">
      <CrossFadeIcon source={source} color="black" size={24} />
    </PaperProvider>
  );

  await render(makeIcon('plus'));
  expect(withTiming).not.toHaveBeenCalled();

  await screen.rerender(makeIcon('minus'));
  expect(withTiming.mock.calls.map(([, config]) => config?.duration)).toEqual([
    200,
  ]);
});

it('switches immediately without animating when reduceMotion is "on"', async () => {
  const makeIcon = (source: string) => (
    <PaperProvider reduceMotion="on">
      <CrossFadeIcon source={source} color="black" size={24} />
    </PaperProvider>
  );

  await render(makeIcon('plus'));
  await screen.rerender(makeIcon('minus'));
  expect(withTiming).not.toHaveBeenCalled();
});

it('does not replay the last icon change when the OS setting changes', async () => {
  const addEventListener = jest.mocked(AccessibilityInfo.addEventListener);
  const reduceMotionListeners = () =>
    addEventListener.mock.calls
      .filter(([eventName]) => eventName === 'reduceMotionChanged')
      .map(([, listener]) => listener);
  addEventListener.mockClear();
  const makeIcon = (source: string) => (
    <PaperProvider>
      <CrossFadeIcon source={source} color="black" size={24} />
    </PaperProvider>
  );

  await render(makeIcon('plus'));
  await screen.rerender(makeIcon('minus'));
  await act(() => {
    jest.runAllTimers();
  });
  expect(withTiming).toHaveBeenCalledTimes(1);
  expect(reduceMotionListeners()).not.toHaveLength(0);

  for (const enabled of [true, false]) {
    await act(() => {
      reduceMotionListeners().forEach((listener) => listener(enabled));
    });
  }

  expect(withTiming).toHaveBeenCalledTimes(1);
});
