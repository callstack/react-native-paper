import * as React from 'react';
import { Animated, Platform, StyleSheet } from 'react-native';

import { afterEach, expect, it } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
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

it('renders progress bar with custom style of filled part', async () => {
  await render(
    <ProgressBar progress={0.2} fillStyle={styles.fill} testID="progress-bar" />
  );
  await triggerLayout();

  expect(screen.getByTestId('progress-bar-fill')).toHaveStyle({
    borderRadius: 4,
  });
});
