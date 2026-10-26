import * as React from 'react';
import { Platform, Text } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import { cornerFull } from '../../theme/tokens/sys/shape';
import ConnectedButtonGroup from '../ConnectedButtonGroup/ConnectedButtonGroup';
import {
  connectedButtonSizeTokens,
  type ConnectedButtonGroupSize,
} from '../ConnectedButtonGroup/tokens';
import {
  getConnectedButtonColors,
  getConnectedButtonPosition,
  getConnectedButtonSizeStyle,
} from '../ConnectedButtonGroup/utils';

const theme = LightTheme;

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

it('gaps the check from the icon but not the end of an icon-only button', async () => {
  await renderGroup({
    buttons: [
      { value: 'walk', icon: 'walk', showSelectedCheck: true, testID: 'walk' },
    ],
  });

  const { iconLabelGap } = getConnectedButtonSizeStyle({
    size: 'small',
    theme,
  });

  expect(screen.getByTestId('walk-check-icon')).toHaveStyle({
    marginEnd: iconLabelGap,
  });
  expect(screen.getByTestId('walk-icon')).not.toHaveStyle({
    marginEnd: iconLabelGap,
  });
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

it('morphs only the connected corners of each position', async () => {
  const { innerRadius, outerRadius } = getConnectedButtonSizeStyle({
    size: 'small',
    theme,
  });

  await renderGroup({ value: 'train' });

  // first, unselected — leading corners pinned, trailing corners morph
  expect(screen.getByTestId('walk-container')).toHaveStyle({
    borderTopStartRadius: outerRadius,
    borderBottomStartRadius: outerRadius,
    borderTopEndRadius: innerRadius,
    borderBottomEndRadius: innerRadius,
  });
  // middle, selected — both sides morph, so both reach the pill
  expect(screen.getByTestId('train-container')).toHaveStyle({
    borderTopStartRadius: outerRadius,
    borderBottomStartRadius: outerRadius,
    borderTopEndRadius: outerRadius,
    borderBottomEndRadius: outerRadius,
  });
  // last, unselected — leading corners morph, trailing corners pinned
  expect(screen.getByTestId('drive-container')).toHaveStyle({
    borderTopStartRadius: innerRadius,
    borderBottomStartRadius: innerRadius,
    borderTopEndRadius: outerRadius,
    borderBottomEndRadius: outerRadius,
  });
});

it('uses the CSS logical corner names on web', async () => {
  jest.replaceProperty(Platform, 'OS', 'web');
  const { innerRadius, outerRadius } = getConnectedButtonSizeStyle({
    size: 'small',
    theme,
  });

  await renderGroup({ value: 'train' });

  expect(screen.getByTestId('walk-container')).toHaveStyle({
    borderStartStartRadius: outerRadius,
    borderEndStartRadius: outerRadius,
    borderStartEndRadius: innerRadius,
    borderEndEndRadius: innerRadius,
  });
});

it('tightens the connected corners while a button is pressed', async () => {
  const { innerRadius, outerRadius, pressedRadius } =
    getConnectedButtonSizeStyle({ size: 'small', theme });

  await renderGroup({ value: 'train' });

  // first, unselected — only the trailing corner morphs
  await fireEvent(screen.getByTestId('walk'), 'pressIn');
  expect(screen.getByTestId('walk-container')).toHaveStyle({
    borderTopStartRadius: outerRadius,
    borderTopEndRadius: pressedRadius,
    borderBottomEndRadius: pressedRadius,
  });

  await fireEvent(screen.getByTestId('walk'), 'pressOut');
  expect(screen.getByTestId('walk-container')).toHaveStyle({
    borderTopStartRadius: outerRadius,
    borderTopEndRadius: innerRadius,
    borderBottomEndRadius: innerRadius,
  });
});

it('leaves a lone button fully rounded on both sides', async () => {
  const { outerRadius } = getConnectedButtonSizeStyle({
    size: 'small',
    theme,
  });

  await renderGroup({
    buttons: [{ value: 'walk', label: 'Walking', testID: 'walk' }],
  });

  expect(screen.getByTestId('walk-container')).toHaveStyle({
    borderTopStartRadius: outerRadius,
    borderBottomStartRadius: outerRadius,
    borderTopEndRadius: outerRadius,
    borderBottomEndRadius: outerRadius,
  });
});

it('draws the keyboard focus ring on the container', async () => {
  const { thickness } = tokens.md.sys.state.focusIndicator;
  const ring = {
    outlineWidth: thickness,
    outlineStyle: 'solid',
    outlineColor: theme.colors.secondary,
    outlineOffset: -thickness,
  } as const;

  await renderGroup();

  await fireEvent(screen.getByTestId('walk'), 'focus');
  expect(screen.getByTestId('walk-container')).toHaveStyle(ring);

  await fireEvent(screen.getByTestId('walk'), 'blur');
  expect(screen.getByTestId('walk-container')).not.toHaveStyle(ring);
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

  it('resolves the pill corner to half the height, not the full-corner sentinel', () => {
    const sizes: ConnectedButtonGroupSize[] = [
      'extra-small',
      'small',
      'medium',
      'large',
      'extra-large',
    ];
    expect(sizes).toHaveLength(Object.keys(connectedButtonSizeTokens).length);

    sizes.forEach((size) => {
      const { outerRadius, containerHeight } = getConnectedButtonSizeStyle({
        size,
        theme,
      });

      expect(connectedButtonSizeTokens[size].outerShape).toBe('full');
      expect(outerRadius).toBe(containerHeight / 2);
      expect(outerRadius).toBeLessThan(cornerFull);
    });
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
