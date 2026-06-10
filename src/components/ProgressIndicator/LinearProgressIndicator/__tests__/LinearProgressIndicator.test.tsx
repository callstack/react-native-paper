import * as React from 'react';

import { act } from '@testing-library/react-native';

import { render } from '../../../../test-utils';
import LinearProgressIndicator from '../LinearProgressIndicator';

const a11yRole = 'progressbar';

const layoutEvent = {
  nativeEvent: { layout: { width: 100 } },
};

const triggerLayout = async (
  tree: ReturnType<typeof render>
): Promise<void> => {
  await act(async () => {
    tree.getByRole(a11yRole).props.onLayout(layoutEvent);
  });
};

// One smoke snapshot; behavior is checked with the assertions below.
it('renders determinate progress', async () => {
  const tree = render(<LinearProgressIndicator progress={0.3} />);
  await triggerLayout(tree);

  expect(tree.toJSON()).toMatchSnapshot();
});

it('resolves active, track and stop colors', async () => {
  const tree = render(
    <LinearProgressIndicator
      progress={0.3}
      color="red"
      trackColor="blue"
      testID="pi"
    />
  );
  await triggerLayout(tree);

  expect(tree.getByTestId('pi-active')).toHaveStyle({ backgroundColor: 'red' });
  expect(tree.getByTestId('pi-track')).toHaveStyle({ backgroundColor: 'blue' });
  expect(tree.getByTestId('pi-stop')).toHaveStyle({ backgroundColor: 'red' });
});

it('lays out the determinate active, track and stop dot', async () => {
  const tree = render(<LinearProgressIndicator progress={0.5} testID="pi" />);
  await triggerLayout(tree);

  // width 100, progress 0.5: active 50, then a 4dp gap, then the track. Segments anchor at the
  // leading edge and shift with translateX (flipped for RTL).
  expect(tree.getByTestId('pi-active')).toHaveStyle({ left: 0, width: 50 });
  expect(tree.getByTestId('pi-track')).toHaveStyle({
    transform: [{ translateX: 54 }],
    width: 46,
  });
  expect(tree.getByTestId('pi-stop')).toHaveStyle({ right: 0 });
});

it('renders separate track segments and no stop dot when indeterminate', async () => {
  const tree = render(<LinearProgressIndicator indeterminate testID="pi" />);
  await triggerLayout(tree);

  expect(tree.getByTestId('pi-track')).toBeTruthy();
  expect(tree.getByTestId('pi-active')).toBeTruthy();
  expect(tree.queryByTestId('pi-stop')).toBeNull();
  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({});
});

it('reports the determinate value', async () => {
  const tree = render(<LinearProgressIndicator progress={0.42} />);
  await triggerLayout(tree);

  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({
    min: 0,
    max: 100,
    now: 42,
  });
});

it('is busy below 100% and not busy at 100% (determinate)', async () => {
  const partial = render(<LinearProgressIndicator progress={0.5} />);
  await triggerLayout(partial);
  expect(partial.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });

  const complete = render(<LinearProgressIndicator progress={1} />);
  await triggerLayout(complete);
  expect(complete.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: false,
  });
});

it('is busy when indeterminate', async () => {
  const tree = render(<LinearProgressIndicator indeterminate />);
  await triggerLayout(tree);

  expect(tree.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });
});

it('resets the active indicator layout when toggling indeterminate -> determinate', async () => {
  const tree = render(<LinearProgressIndicator indeterminate testID="pi" />);
  await triggerLayout(tree);
  expect(tree.queryByTestId('pi-stop')).toBeNull();

  tree.rerender(<LinearProgressIndicator progress={0.3} testID="pi" />);
  await triggerLayout(tree);

  // Active must start at the leading edge after the toggle.
  expect(tree.getByTestId('pi-active')).toHaveStyle({ left: 0, width: 30 });
  expect(tree.getByTestId('pi-stop')).toBeTruthy();
});
