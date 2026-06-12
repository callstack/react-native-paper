import * as React from 'react';

import { render } from '../../../../test-utils';
import CircularWavyProgressIndicator from '../CircularWavyProgressIndicator';

const a11yRole = 'progressbar';

// One smoke snapshot; behavior is checked with the assertions below.
it('renders determinate progress', () => {
  const tree = render(
    <CircularWavyProgressIndicator progress={0.3} />
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('resolves active and track colors', () => {
  const tree = render(
    <CircularWavyProgressIndicator
      progress={0.3}
      color="red"
      trackColor="blue"
      testID="pi"
    />
  );

  expect(tree.getByTestId('pi-active').props.stroke).toBe('red');
  expect(tree.getByTestId('pi-track').props.stroke).toBe('blue');
});

it('renders the active stroke and a track when indeterminate', () => {
  const tree = render(
    <CircularWavyProgressIndicator indeterminate testID="pi" />
  );

  expect(tree.getByTestId('pi-active')).toBeTruthy();
  expect(tree.getByTestId('pi-track')).toBeTruthy();
  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({});
});

it('reports the determinate value', () => {
  const tree = render(<CircularWavyProgressIndicator progress={0.42} />);

  expect(tree.getByRole(a11yRole).props.accessibilityValue).toEqual({
    min: 0,
    max: 100,
    now: 42,
  });
});

it('is busy below 100% and not busy at 100% (determinate)', () => {
  const partial = render(<CircularWavyProgressIndicator progress={0.5} />);
  expect(partial.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });

  const complete = render(<CircularWavyProgressIndicator progress={1} />);
  expect(complete.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: false,
  });
});

it('is busy when indeterminate', () => {
  const tree = render(<CircularWavyProgressIndicator indeterminate />);

  expect(tree.getByRole(a11yRole).props.accessibilityState).toEqual({
    busy: true,
  });
});

it('keeps the track when toggling indeterminate -> determinate', () => {
  const tree = render(
    <CircularWavyProgressIndicator indeterminate testID="pi" />
  );
  expect(tree.getByTestId('pi-track')).toBeTruthy();

  tree.rerender(<CircularWavyProgressIndicator progress={0.3} testID="pi" />);

  expect(tree.getByTestId('pi-track')).toBeTruthy();
  expect(tree.getByTestId('pi-active')).toBeTruthy();
});
