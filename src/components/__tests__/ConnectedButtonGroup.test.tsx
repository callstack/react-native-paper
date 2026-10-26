import * as React from 'react';
import { Platform, Text } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import ConnectedButtonGroup from '../ConnectedButtonGroup/ConnectedButtonGroup';

afterEach(() => {
  jest.restoreAllMocks();
});

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

it('exposes the selected button as a checked radio', async () => {
  await renderGroup({ value: 'train' });

  expect(screen.getByRole('radio', { name: 'Walking' })).not.toBeChecked();
  expect(screen.getByRole('radio', { name: 'Transit' })).toBeChecked();
  expect(screen.getByRole('radio', { name: 'Driving' })).not.toBeChecked();
});

it('exposes the selected buttons of a multi-select group as checked checkboxes', async () => {
  await render(
    <ConnectedButtonGroup
      multiSelect
      value={['walk', 'drive']}
      onValueChange={() => {}}
      buttons={buttons}
    />
  );

  expect(screen.getByRole('checkbox', { name: 'Walking' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Transit' })).not.toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Driving' })).toBeChecked();
});

it('calls onValueChange with the pressed value', async () => {
  const user = userEvent.setup();
  const onValueChange = jest.fn();
  await renderGroup({ onValueChange });

  await user.press(screen.getByRole('radio', { name: 'Transit' }));

  expect(onValueChange).toHaveBeenCalledWith('train');
});

it('calls the button onPress as well as onValueChange', async () => {
  const user = userEvent.setup();
  const onPress = jest.fn();
  const onValueChange = jest.fn();
  await renderGroup({
    onValueChange,
    buttons: [
      { value: 'walk', label: 'Walking' },
      { value: 'train', label: 'Transit', onPress },
    ],
  });

  await user.press(screen.getByRole('radio', { name: 'Transit' }));

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

  await user.press(screen.getByRole('checkbox', { name: 'Transit' }));
  expect(onValueChange).toHaveBeenLastCalledWith(['walk', 'train']);

  await user.press(screen.getByRole('checkbox', { name: 'Walking' }));
  expect(onValueChange).toHaveBeenLastCalledWith([]);
});

it('exposes a disabled button as disabled and ignores presses on it', async () => {
  const user = userEvent.setup();
  const onValueChange = jest.fn();
  await renderGroup({
    onValueChange,
    buttons: [
      { value: 'walk', label: 'Walking' },
      { value: 'train', label: 'Transit', disabled: true },
    ],
  });

  const transit = screen.getByRole('radio', { name: 'Transit' });
  expect(transit).toBeDisabled();

  await user.press(transit);
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

  expect(screen.getByTestId('walk-check-icon')).toBeVisible();
  expect(screen.getByTestId('train-check-icon')).not.toBeVisible();
});

it('swaps the leading icon for the selection check on labelled buttons', async () => {
  await renderGroup({
    buttons: [
      {
        value: 'walk',
        label: 'Walking',
        icon: 'walk',
        showSelectedCheck: true,
        testID: 'walk',
      },
      {
        value: 'train',
        label: 'Transit',
        icon: 'train',
        showSelectedCheck: true,
        testID: 'train',
      },
    ],
  });

  expect(screen.getByTestId('walk-check-icon')).toBeVisible();
  expect(screen.getByTestId('walk-icon')).not.toBeVisible();

  expect(screen.getByTestId('train-icon')).toBeVisible();
  expect(screen.getByTestId('train-check-icon')).not.toBeVisible();
});

it('keeps the icon of a selected icon-only button', async () => {
  await renderGroup({
    buttons: [
      { value: 'walk', icon: 'walk', showSelectedCheck: true, testID: 'walk' },
    ],
  });

  expect(screen.getByTestId('walk-check-icon')).toBeVisible();
  expect(screen.getByTestId('walk-icon')).toBeVisible();
});

it('colors the labels with the custom checked and unchecked colors', async () => {
  await renderGroup({
    buttons: [
      { value: 'walk', label: 'Walking', checkedColor: 'rgb(255, 0, 0)' },
      { value: 'train', label: 'Transit', uncheckedColor: 'rgb(0, 0, 255)' },
    ],
  });

  expect(screen.getByText('Walking')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
  expect(screen.getByText('Transit')).toHaveStyle({ color: 'rgb(0, 0, 255)' });
});

it('names the group with aria-label or aria-labelledby', async () => {
  await render(
    <>
      <ConnectedButtonGroup
        aria-label="Travel mode"
        value="walk"
        onValueChange={() => {}}
        buttons={buttons}
      />
      <Text nativeID="sort-label">Sort by</Text>
      <ConnectedButtonGroup
        multiSelect
        aria-labelledby="sort-label"
        value={['walk']}
        onValueChange={() => {}}
        buttons={buttons}
      />
    </>
  );

  expect(screen.getByLabelText('Travel mode')).toHaveProp('role', 'radiogroup');
  expect(screen.getByLabelText('Sort by')).toHaveProp('role', 'group');
});

describe('keyboard on web', () => {
  const pressKey = (name: string, key: string) =>
    fireEvent(screen.getByRole('radio', { name }), 'keyDown', {
      key,
      preventDefault: () => {},
    });

  it('keeps one Tab stop, on the checked radio', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    await renderGroup({ value: 'train' });

    expect(screen.getByRole('radio', { name: 'Walking' })).toHaveProp(
      'tabIndex',
      -1
    );
    expect(screen.getByRole('radio', { name: 'Transit' })).toHaveProp(
      'tabIndex',
      0
    );
    expect(screen.getByRole('radio', { name: 'Driving' })).toHaveProp(
      'tabIndex',
      -1
    );
  });

  it('moves the selection with the arrow keys and wraps around', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = jest.fn();
    await renderGroup({ value: 'train', onValueChange });

    await pressKey('Transit', 'ArrowRight');
    expect(onValueChange).toHaveBeenLastCalledWith('drive');

    await pressKey('Transit', 'ArrowUp');
    expect(onValueChange).toHaveBeenLastCalledWith('walk');

    await pressKey('Walking', 'ArrowLeft');
    expect(onValueChange).toHaveBeenLastCalledWith('drive');
  });

  it('skips disabled buttons', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = jest.fn();
    await renderGroup({
      value: 'walk',
      onValueChange,
      buttons: [
        { value: 'walk', label: 'Walking' },
        { value: 'train', label: 'Transit', disabled: true },
        { value: 'drive', label: 'Driving' },
      ],
    });

    await pressKey('Walking', 'ArrowRight');
    expect(onValueChange).toHaveBeenLastCalledWith('drive');
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
