import * as React from 'react';

import { describe, expect, it, jest } from '@jest/globals';

import { getTheme } from '../../core/theming';
import { render, screen, userEvent } from '../../test-utils';
import ConnectedButtonGroup from '../ConnectedButtonGroup/ConnectedButtonGroup';
import { connectedButtonSizeTokens } from '../ConnectedButtonGroup/tokens';
import {
  getConnectedButtonColors,
  getConnectedButtonPosition,
  getConnectedButtonSizeStyle,
} from '../ConnectedButtonGroup/utils';

const theme = getTheme();

type SingleSelectProps = Extract<
  React.ComponentProps<typeof ConnectedButtonGroup>,
  { multiSelect?: false | undefined }
>;

const buttons = [
  { value: 'walk', label: 'Walking', testID: 'walk' },
  { value: 'train', label: 'Transit', testID: 'train' },
  { value: 'drive', label: 'Driving', testID: 'drive' },
];

const renderGroup = (props: Partial<SingleSelectProps> = {}) =>
  render(
    <ConnectedButtonGroup
      value="walk"
      onValueChange={() => {}}
      buttons={buttons}
      {...props}
    />
  );

it('renders every button with its label', async () => {
  await renderGroup();

  expect(screen.getByTestId('walk-label')).toHaveTextContent('Walking');
  expect(screen.getByTestId('train-label')).toHaveTextContent('Transit');
  expect(screen.getByTestId('drive-label')).toHaveTextContent('Driving');
});

it('defaults to the small size (40dp height)', async () => {
  await renderGroup();

  expect(screen.getByTestId('walk-container')).toHaveStyle({ height: 40 });
});

it('applies the requested size height', async () => {
  await renderGroup({ size: 'medium' });

  expect(screen.getByTestId('walk-container')).toHaveStyle({ height: 56 });
});

it('calls onValueChange with the pressed value in single-select mode', async () => {
  const user = userEvent.setup();
  const onValueChange = jest.fn();
  await renderGroup({ onValueChange });

  await user.press(screen.getByTestId('train'));

  expect(onValueChange).toHaveBeenCalledWith('train');
});

it('invokes the per-button onPress alongside onValueChange', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  const onValueChange = jest.fn();
  await renderGroup({
    onValueChange,
    buttons: [
      { value: 'walk', label: 'Walking', testID: 'walk' },
      { value: 'train', label: 'Transit', testID: 'train', onPress },
    ],
  });

  await user.press(screen.getByTestId('train'));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onValueChange).toHaveBeenCalledWith('train');
});

it('toggles values in multi-select mode', async () => {
  const user = userEvent.setup();
  const onValueChange = jest.fn();
  await render(
    <ConnectedButtonGroup
      multiSelect
      value={['walk']}
      onValueChange={onValueChange}
      buttons={buttons}
    />
  );

  await user.press(screen.getByTestId('train'));
  expect(onValueChange).toHaveBeenLastCalledWith(['walk', 'train']);

  await user.press(screen.getByTestId('walk'));
  expect(onValueChange).toHaveBeenLastCalledWith([]);
});

it('fills the selected button with the secondary container color', async () => {
  await renderGroup();

  expect(screen.getByTestId('walk-container')).toHaveStyle({
    backgroundColor: theme.colors.secondaryContainer,
  });
  expect(screen.getByTestId('train-container')).toHaveStyle({
    backgroundColor: theme.colors.surfaceContainer,
  });
});

it('does not fire onValueChange for a disabled button', async () => {
  const user = userEvent.setup();
  const onValueChange = jest.fn();
  await renderGroup({
    onValueChange,
    buttons: [
      { value: 'walk', label: 'Walking', testID: 'walk' },
      { value: 'train', label: 'Transit', disabled: true, testID: 'train' },
    ],
  });

  await user.press(screen.getByTestId('train'));

  expect(onValueChange).not.toHaveBeenCalled();
});

it('shows the selection check only on the selected button', async () => {
  await renderGroup({
    buttons: [
      {
        value: 'walk',
        label: 'Walking',
        showSelectedCheck: true,
        testID: 'walk',
      },
      {
        value: 'train',
        label: 'Transit',
        showSelectedCheck: true,
        testID: 'train',
      },
    ],
  });

  expect(screen.getByTestId('walk-check-icon')).toBeTruthy();
  expect(screen.queryByTestId('train-check-icon')).toBeNull();
});

it('applies a custom checked color to the selected label', async () => {
  await renderGroup({
    buttons: [
      {
        value: 'walk',
        label: 'Walking',
        checkedColor: 'rgb(255, 0, 0)',
        testID: 'walk',
      },
    ],
  });

  expect(screen.getByTestId('walk-label')).toHaveStyle({
    color: 'rgb(255, 0, 0)',
  });
});

it('marks single-select buttons with the radio role', async () => {
  await renderGroup();

  expect(screen.getByTestId('walk')).toHaveProp('role', 'radio');
});

it('marks multi-select buttons with the checkbox role', async () => {
  await render(
    <ConnectedButtonGroup
      multiSelect
      value={['walk']}
      onValueChange={() => {}}
      buttons={buttons}
    />
  );

  expect(screen.getByTestId('walk')).toHaveProp('role', 'checkbox');
});

describe('connected button shape tokens', () => {
  it('presses the inner corner sharper than its resting radius (M3)', () => {
    // small: inner = small (8dp), pressed inner = extraSmall (4dp)
    const { innerRadius, pressedRadius, outerRadius } =
      getConnectedButtonSizeStyle({ size: 'small', theme });
    expect(pressedRadius).toBeLessThan(innerRadius);
    expect(innerRadius).toBe(theme.shapes.corner.small);
    expect(pressedRadius).toBe(theme.shapes.corner.extraSmall);
    // outer edge stays fully rounded
    expect(outerRadius).toBeGreaterThan(innerRadius);
  });

  it('uses the spec inner corners for large and extra-large', () => {
    expect(connectedButtonSizeTokens.large.innerShape).toBe('large');
    expect(connectedButtonSizeTokens['extra-large'].innerShape).toBe(
      'largeIncreased'
    );
  });
});

describe('getConnectedButtonPosition', () => {
  it('classifies a lone button as single', () => {
    expect(getConnectedButtonPosition(0, 1)).toBe('single');
  });

  it('classifies first, middle and last positions', () => {
    expect(getConnectedButtonPosition(0, 3)).toBe('first');
    expect(getConnectedButtonPosition(1, 3)).toBe('middle');
    expect(getConnectedButtonPosition(2, 3)).toBe('last');
  });
});

describe('getConnectedButtonColors', () => {
  it('uses MD3 selection color roles', () => {
    const selected = getConnectedButtonColors({ theme, selected: true });
    expect(selected.containerColor).toBe(theme.colors.secondaryContainer);
    expect(selected.contentColor).toBe(theme.colors.onSecondaryContainer);

    const unselected = getConnectedButtonColors({ theme, selected: false });
    expect(unselected.containerColor).toBe(theme.colors.surfaceContainer);
    expect(unselected.contentColor).toBe(theme.colors.onSurfaceVariant);
  });

  it('dims content and keeps onSurface when disabled', () => {
    const disabled = getConnectedButtonColors({
      theme,
      selected: false,
      disabled: true,
    });
    expect(disabled.contentColor).toBe(theme.colors.onSurface);
    expect(disabled.contentOpacity).toBe(0.38);
  });

  it('honours custom checked and unchecked colors', () => {
    expect(
      getConnectedButtonColors({
        theme,
        selected: true,
        checkedColor: 'red',
      }).contentColor
    ).toBe('red');
    expect(
      getConnectedButtonColors({
        theme,
        selected: false,
        uncheckedColor: 'blue',
      }).contentColor
    ).toBe('blue');
  });
});

it('renders connected button group', async () => {
  const tree = (await renderGroup()).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders multi-select connected button group with icons', async () => {
  const tree = (
    await render(
      <ConnectedButtonGroup
        multiSelect
        value={['bold'] as string[]}
        onValueChange={() => {}}
        buttons={[
          { value: 'bold', icon: 'format-bold', 'aria-label': 'Bold' },
          { value: 'italic', icon: 'format-italic', 'aria-label': 'Italic' },
        ]}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled connected button group', async () => {
  const tree = (
    await renderGroup({
      buttons: buttons.map((button) => ({ ...button, disabled: true })),
    })
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large connected button group', async () => {
  const tree = (await renderGroup({ size: 'large' })).toJSON();

  expect(tree).toMatchSnapshot();
});
