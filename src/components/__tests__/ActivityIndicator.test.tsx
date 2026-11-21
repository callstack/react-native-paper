// eslint-disable-next-line no-restricted-imports -- ActivityIndicator animates with React Native's Animated.
import { AccessibilityInfo, Animated } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import PaperProvider from '../../core/PaperProvider';
import { act, render, screen } from '../../test-utils';
import ActivityIndicator from '../ActivityIndicator';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders indicator', async () => {
  const tree = (await render(<ActivityIndicator animating />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders hidden indicator', async () => {
  const tree = (
    await render(<ActivityIndicator animating={false} hidesWhenStopped />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large indicator', async () => {
  const tree = (await render(<ActivityIndicator size="large" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders colored indicator', async () => {
  const tree = (await render(<ActivityIndicator color="#FF0000" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('is a progress bar for assistive technology', async () => {
  await render(<ActivityIndicator />);

  expect(screen.getByRole('progressbar', { busy: true })).toBeOnTheScreen();
});

it('is no accessible element when hidden, so no keyboard stop either', async () => {
  await render(<ActivityIndicator testID="indicator" aria-hidden />);

  expect(
    screen.queryByRole('progressbar', { includeHiddenElements: true })
  ).not.toBeOnTheScreen();
  expect(
    screen.getByTestId('indicator', { includeHiddenElements: true })
  ).toHaveProp('accessible', false);
});

describe('with reduce motion', () => {
  it.each([
    { reduceMotion: 'off', fade: 200 },
    { reduceMotion: 'on', fade: 0 },
  ] as const)(
    'fades in and out in $fade ms and keeps rotating when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, fade }) => {
      const timing = jest.spyOn(Animated, 'timing');
      const loop = jest.spyOn(Animated, 'loop');
      const makeIndicator = (animating: boolean) => (
        <PaperProvider reduceMotion={reduceMotion}>
          <ActivityIndicator animating={animating} />
        </PaperProvider>
      );

      await render(makeIndicator(true));
      expect(loop).toHaveBeenCalledTimes(1);

      await screen.rerender(makeIndicator(false));

      // The 2400 ms rotation, then the fade in and the fade out.
      expect(timing.mock.calls.map(([, config]) => config.duration)).toEqual([
        2400,
        fade,
        fade,
      ]);
    }
  );

  it('does not restart the rotation when the OS setting changes', async () => {
    const listeners: Array<(enabled: boolean) => void> = [];
    jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockImplementation((_eventName, listener) => {
        listeners.push(listener);
        return { remove: jest.fn() };
      });
    const loop = jest.spyOn(Animated, 'loop');

    await render(
      <PaperProvider>
        <ActivityIndicator animating />
      </PaperProvider>
    );
    expect(loop).toHaveBeenCalledTimes(1);
    expect(listeners).not.toHaveLength(0);

    for (const enabled of [true, false]) {
      await act(() => {
        listeners.forEach((listener) => listener(enabled));
      });
    }

    expect(loop).toHaveBeenCalledTimes(1);
  });
});
