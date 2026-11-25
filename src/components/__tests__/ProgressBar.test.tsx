import * as React from 'react';
import {
  AccessibilityInfo,
  // eslint-disable-next-line no-restricted-imports -- TODO: remove after ProgressBar migrates to Reanimated.
  Animated,
  Platform,
  StyleSheet,
} from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { act, render, screen } from '../../test-utils';
import ProgressBar from '../ProgressBar';
import type { Props } from '../ProgressBar';

const layoutEvent = {
  nativeEvent: {
    layout: {
      width: 100,
    },
  },
};

const styles = StyleSheet.create({
  fill: {
    borderRadius: 4,
  },
});

const a11yRole = 'progressbar';
const triggerLayout = async (): Promise<void> => {
  await fireEvent(screen.getByRole(a11yRole), 'layout', layoutEvent);
};

class ClassProgressBar extends React.Component<Props> {
  render() {
    return <ProgressBar {...this.props} />;
  }
}

const AnimatedProgressBar = Animated.createAnimatedComponent(ClassProgressBar);

afterEach(() => {
  Platform.OS = 'ios';
  jest.restoreAllMocks();
});

it('renders progress bar with animated value', async () => {
  const view = await render(<AnimatedProgressBar animatedValue={0.2} />);
  await triggerLayout();

  await view.rerender(<AnimatedProgressBar animatedValue={0.4} />);

  expect(screen.getByRole(a11yRole)).toBeOnTheScreen();
});

it('renders progress bar with specific progress', async () => {
  const view = await render(<ProgressBar progress={0.2} />);
  await triggerLayout();

  expect(view.toJSON()).toMatchSnapshot();
});

it('renders hidden progress bar', async () => {
  const view = await render(<ProgressBar progress={0.2} visible={false} />);
  await triggerLayout();

  expect(view.toJSON()).toMatchSnapshot();
});

it('renders colored progress bar', async () => {
  const view = await render(<ProgressBar progress={0.2} color="red" />);
  await triggerLayout();

  expect(view.toJSON()).toMatchSnapshot();
});

it('renders indeterminate progress bar', async () => {
  const view = await render(<ProgressBar indeterminate />);
  await triggerLayout();

  expect(view.toJSON()).toMatchSnapshot();
});

it('renders progress bar with full height on web', async () => {
  Platform.OS = 'web';
  await render(<ProgressBar progress={0.2} />);

  expect(screen.getByRole(a11yRole)).toHaveStyle({
    width: '100%',
    height: '100%',
  });
});

it('has progressbar role', async () => {
  await render(<ProgressBar progress={0.5} />);

  expect(screen.getByRole(a11yRole)).toBeOnTheScreen();
});

it('renders progress bar with custom style of filled part', async () => {
  const view = await render(
    <ProgressBar progress={0.2} fillStyle={styles.fill} testID="progress-bar" />
  );
  await triggerLayout();

  expect(view.toJSON()).toMatchSnapshot();
});

describe('with reduce motion', () => {
  it.each([
    { reduceMotion: 'off', fade: 200 },
    { reduceMotion: 'on', fade: 0 },
  ] as const)(
    'fades out in $fade ms when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, fade }) => {
      const makeProgressBar = (visible: boolean) => (
        <PaperProvider reduceMotion={reduceMotion}>
          <ProgressBar progress={0.5} visible={visible} />
        </PaperProvider>
      );

      await render(makeProgressBar(true));
      const timing = jest.spyOn(Animated, 'timing');

      await screen.rerender(makeProgressBar(false));

      expect(timing.mock.calls.map(([, config]) => config.duration)).toEqual([
        fade,
      ]);
    }
  );

  it('does not restart the indeterminate animation when the OS setting changes', async () => {
    const addEventListener = jest.mocked(AccessibilityInfo.addEventListener);
    const reduceMotionListeners = () =>
      addEventListener.mock.calls
        .filter(([eventName]) => eventName === 'reduceMotionChanged')
        .map(([, listener]) => listener);
    addEventListener.mockClear();
    const loop = jest.spyOn(Animated, 'loop');

    await render(
      <PaperProvider>
        <ProgressBar indeterminate />
      </PaperProvider>
    );
    const loopCount = loop.mock.calls.length;
    expect(loopCount).toBeGreaterThan(0);
    expect(reduceMotionListeners()).not.toHaveLength(0);

    for (const enabled of [true, false]) {
      await act(() => {
        reduceMotionListeners().forEach((listener) => listener(enabled));
      });
    }

    expect(loop).toHaveBeenCalledTimes(loopCount);
  });
});
