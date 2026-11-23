// eslint-disable-next-line no-restricted-imports -- RadioButtonAndroid animates with React Native's Animated.
import { AccessibilityInfo, Animated } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import PaperProvider from '../../../core/PaperProvider';
import { act, render, screen } from '../../../test-utils';
import RadioButtonAndroid from '../../RadioButton/RadioButtonAndroid';

type Status = 'checked' | 'unchecked';

afterEach(() => {
  jest.restoreAllMocks();
});

describe('with reduce motion', () => {
  it.each([
    { reduceMotion: 'off', duration: 150 },
    { reduceMotion: 'on', duration: 0 },
  ] as const)(
    'checks and unchecks in $duration ms when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, duration }) => {
      const makeRadio = (status: Status) => (
        <PaperProvider reduceMotion={reduceMotion}>
          <RadioButtonAndroid value="first" status={status} />
        </PaperProvider>
      );

      await render(makeRadio('unchecked'));
      const timing = jest.spyOn(Animated, 'timing');

      await screen.rerender(makeRadio('checked'));
      await screen.rerender(makeRadio('unchecked'));

      expect(timing.mock.calls.map(([, config]) => config.duration)).toEqual([
        duration,
        duration,
      ]);
    }
  );

  it('does not replay the last check when the OS setting changes', async () => {
    const addEventListener = jest.mocked(AccessibilityInfo.addEventListener);
    const reduceMotionListeners = () =>
      addEventListener.mock.calls
        .filter(([eventName]) => eventName === 'reduceMotionChanged')
        .map(([, listener]) => listener);
    addEventListener.mockClear();
    const makeRadio = (status: Status) => (
      <PaperProvider>
        <RadioButtonAndroid value="first" status={status} />
      </PaperProvider>
    );

    await render(makeRadio('unchecked'));
    const timing = jest.spyOn(Animated, 'timing');

    await screen.rerender(makeRadio('checked'));
    expect(timing).toHaveBeenCalledTimes(1);
    expect(reduceMotionListeners()).not.toHaveLength(0);

    for (const enabled of [true, false]) {
      await act(() => {
        reduceMotionListeners().forEach((listener) => listener(enabled));
      });
    }

    expect(timing).toHaveBeenCalledTimes(1);
  });
});
