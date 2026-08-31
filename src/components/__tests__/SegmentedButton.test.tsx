import type { ViewStyle } from 'react-native';
import { Platform } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { ReduceMotion } from 'react-native-reanimated';

import { LocaleProvider } from '../../core/locale';
import { getTheme } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { ReduceMotionContext } from '../../theme/accessibility/ReduceMotionContext';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import {
  FOCUS_RING_OUTSET,
  SegmentedButtonTokens,
} from '../SegmentedButtons/tokens';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonBorderStyles,
  resolveColors,
} from '../SegmentedButtons/utils';

it('type checks single- and multi-select values with their callbacks', () => {
  type Value = 'walk' | 'ride';
  const buttons: { value: Value }[] = [{ value: 'walk' }, { value: 'ride' }];
  const singleValue: Value = 'walk';
  const multiValue: Value[] = ['walk'];
  const onSingleValueChange = (_value: Value) => {};
  const onMultiValueChange = (_value: Value[]) => {};

  const validSingleSelect = (
    <SegmentedButtons<Value>
      value={singleValue}
      buttons={buttons}
      onValueChange={onSingleValueChange}
    />
  );
  const validMultiSelect = (
    <SegmentedButtons<Value>
      multiSelect
      value={multiValue}
      buttons={buttons}
      onValueChange={onMultiValueChange}
    />
  );
  const invalidSingleSelectValue = (
    // @ts-expect-error Single-select value must be a string.
    <SegmentedButtons<Value>
      value={multiValue}
      buttons={buttons}
      onValueChange={onSingleValueChange}
    />
  );
  const invalidMultiSelectValue = (
    // @ts-expect-error Multi-select value must be an array.
    <SegmentedButtons<Value>
      multiSelect
      value={singleValue}
      buttons={buttons}
      onValueChange={onMultiValueChange}
    />
  );
  const invalidSingleSelectCallback = (
    // @ts-expect-error Single-select callback must receive a string.
    <SegmentedButtons<Value>
      value={singleValue}
      buttons={buttons}
      onValueChange={onMultiValueChange}
    />
  );
  const invalidMultiSelectCallback = (
    // @ts-expect-error Multi-select callback must receive an array.
    <SegmentedButtons<Value>
      multiSelect
      value={multiValue}
      buttons={buttons}
      onValueChange={onSingleValueChange}
    />
  );

  expect(validSingleSelect).toBeDefined();
  expect(validMultiSelect).toBeDefined();
  void invalidSingleSelectValue;
  void invalidMultiSelectValue;
  void invalidSingleSelectCallback;
  void invalidMultiSelectCallback;
});

it('renders segmented button', async () => {
  const tree = (
    await render(
      <SegmentedButtons
        onValueChange={() => {}}
        value={'walk'}
        buttons={[
          { value: 'walk', label: 'Walking' },
          { value: 'ride', label: 'Riding' },
        ]}
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled segmented button', async () => {
  await render(
    <SegmentedButtons
      onValueChange={() => {}}
      value="walk"
      buttons={[
        { value: 'walk', label: 'Walking' },
        {
          value: 'ride',
          label: 'Riding',
          icon: 'car',
          disabled: true,
          testID: 'ride',
        },
      ]}
    />
  );

  expect(screen.getByTestId('ride-outline')).toHaveStyle({
    borderColor: getTheme().colors.onSurface,
    opacity: SegmentedButtonTokens.disabledOutlineOpacity,
  });
  expect(screen.getByTestId('ride-label')).toHaveStyle({
    opacity: SegmentedButtonTokens.disabledLabelTextOpacity,
  });
  expect(screen.getByTestId('ride-icon')).toHaveStyle({
    opacity: SegmentedButtonTokens.disabledIconOpacity,
  });
});

it('renders checked segmented button with selected check', async () => {
  await render(
    <SegmentedButtons
      onValueChange={() => {}}
      value="walk"
      buttons={[
        {
          value: 'walk',
          label: 'Walking',
          showSelectedCheck: true,
          testID: 'walk',
        },
        { value: 'ride', label: 'Riding', disabled: true },
      ]}
    />
  );

  expect(screen.getByTestId('walk-check-icon')).toBeOnTheScreen();
});

describe('selection behavior', () => {
  it('uses updated item and value callbacks while preserving their order', async () => {
    const user = userEvent.setup();
    const initialItemOnPress = jest.fn();
    const initialValueChange = jest.fn();
    const callOrder: string[] = [];
    const itemOnPress = jest.fn(() => callOrder.push('item'));
    const onValueChange = jest.fn(() => callOrder.push('value'));

    const { rerender } = await render(
      <SegmentedButtons
        value="walk"
        onValueChange={initialValueChange}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            onPress: initialItemOnPress,
            testID: 'walk',
          },
          { value: 'ride', label: 'Riding' },
        ]}
      />
    );

    await rerender(
      <SegmentedButtons
        value="ride"
        onValueChange={onValueChange}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            onPress: itemOnPress,
            testID: 'walk',
          },
          { value: 'ride', label: 'Riding' },
        ]}
      />
    );
    await user.press(screen.getByTestId('walk'));

    expect(initialItemOnPress).not.toHaveBeenCalled();
    expect(initialValueChange).not.toHaveBeenCalled();
    expect(itemOnPress).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('walk');
    expect(callOrder).toEqual(['item', 'value']);
  });

  it('cancels an in-flight press when the item becomes disabled', async () => {
    const itemOnPress = jest.fn();
    const onValueChange = jest.fn();
    const buttons = [
      {
        value: 'walk',
        label: 'Walking',
        onPress: itemOnPress,
        testID: 'walk',
      },
      { value: 'ride', label: 'Riding' },
    ];
    const { rerender } = await render(
      <SegmentedButtons
        value="ride"
        onValueChange={onValueChange}
        buttons={buttons}
      />
    );
    const pressedButton = screen.getByTestId('walk');

    await fireEvent(pressedButton, 'pressIn');
    await rerender(
      <SegmentedButtons
        value="ride"
        onValueChange={onValueChange}
        buttons={buttons.map((button) =>
          button.value === 'walk' ? { ...button, disabled: true } : button
        )}
      />
    );

    expect(screen.getByTestId('walk')).not.toHaveProp('onPress');

    await fireEvent(pressedButton, 'pressOut');
    // userEvent.press cannot interleave a rerender with the press lifecycle.
    // eslint-disable-next-line no-restricted-syntax
    await fireEvent(pressedButton, 'onPress');

    expect(itemOnPress).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('keeps focus and an in-flight press with the same value after reordering', async () => {
    const walkOnPress = jest.fn();
    const rideOnPress = jest.fn();
    const onValueChange = jest.fn();
    const buttons = [
      {
        value: 'walk',
        label: 'Walking',
        onPress: walkOnPress,
        testID: 'walk',
      },
      {
        value: 'ride',
        label: 'Riding',
        onPress: rideOnPress,
        testID: 'ride',
      },
    ];
    const { rerender } = await render(
      <SegmentedButtons
        value="walk"
        onValueChange={onValueChange}
        buttons={buttons}
      />
    );
    const pressedButton = screen.getByTestId('walk');

    await fireEvent(pressedButton, 'focus');
    await fireEvent(pressedButton, 'pressIn');
    await rerender(
      <SegmentedButtons
        value="walk"
        onValueChange={onValueChange}
        buttons={[...buttons].reverse()}
      />
    );

    expect(screen.getByTestId('walk-focus-ring')).toBeOnTheScreen();
    expect(screen.queryByTestId('ride-focus-ring')).not.toBeOnTheScreen();

    await fireEvent(pressedButton, 'pressOut');
    // userEvent.press cannot interleave a rerender with the press lifecycle.
    // eslint-disable-next-line no-restricted-syntax
    await fireEvent(pressedButton, 'onPress');

    expect(walkOnPress).toHaveBeenCalledTimes(1);
    expect(rideOnPress).not.toHaveBeenCalled();
    expect(onValueChange).toHaveBeenCalledWith('walk');
  });

  it('preserves multiselect append order and removes duplicate values', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    const buttons = [
      { value: 'walk', label: 'Walking', testID: 'walk' },
      { value: 'ride', label: 'Riding' },
      { value: 'drive', label: 'Driving', testID: 'drive' },
    ];
    const { rerender } = await render(
      <SegmentedButtons
        multiSelect
        value={['walk', 'ride', 'walk']}
        onValueChange={onValueChange}
        buttons={buttons}
      />
    );

    await user.press(screen.getByTestId('walk'));
    expect(onValueChange).toHaveBeenLastCalledWith(['ride']);

    await rerender(
      <SegmentedButtons
        multiSelect
        value={['ride']}
        onValueChange={onValueChange}
        buttons={buttons}
      />
    );
    await user.press(screen.getByTestId('drive'));
    expect(onValueChange).toHaveBeenLastCalledWith(['ride', 'drive']);
  });
});

it('applies group theme overrides to items', async () => {
  await render(
    <SegmentedButtons
      value="walk"
      onValueChange={() => {}}
      buttons={[
        { value: 'walk', label: 'Walking', testID: 'walk' },
        { value: 'ride', label: 'Riding' },
      ]}
      theme={{
        colors: {
          secondaryContainer: '#123456',
          stateLayerPressed: '#654321',
        },
        fonts: { labelLarge: { fontSize: 18 } },
      }}
    />
  );

  expect(screen.getByTestId('walk-wrapper')).toHaveStyle({
    backgroundColor: '#123456',
  });
  expect(screen.getByTestId('walk-label')).toHaveStyle({ fontSize: 18 });

  const button = screen.getByTestId('walk');
  // Drive Pressability so the fallback render prop receives its pressed state.
  await fireEvent(button, 'responderGrant', {
    nativeEvent: {},
    persist: jest.fn(),
  });
  expect(screen.getByTestId('touchable-ripple-underlay')).toHaveStyle({
    backgroundColor: '#654321',
  });
});

describe('segmented button colors', () => {
  const theme = getTheme();

  it.each([
    {
      disabled: false,
      checked: true,
      customColor: undefined,
      expected: theme.colors.onSecondaryContainer,
    },
    {
      disabled: false,
      checked: false,
      customColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: true,
      customColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: false,
      customColor: 'custom',
      expected: theme.colors.onSurface,
    },
    {
      disabled: false,
      checked: true,
      customColor: 'a125f5',
      expected: 'a125f5',
    },
    {
      disabled: false,
      checked: false,
      customColor: '000',
      expected: '000',
    },
  ])(
    'returns $expected when disabled: $disabled, checked: $checked, and customColor is $customColor',
    ({ disabled, checked, customColor, expected }) => {
      expect(
        resolveColors(theme, {
          checked,
          disabled,
          contentColor: customColor,
          dividerDisabled: false,
        }).content
      ).toMatchObject({ labelColor: expected, iconColor: expected });
    }
  );

  it('uses the content color override for each selection state', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            checkedColor: '#123456',
            uncheckedColor: '#aaaaaa',
            testID: 'walk',
          },
          {
            value: 'drive',
            label: 'Driving',
            checkedColor: '#bbbbbb',
            uncheckedColor: '#654321',
            testID: 'drive',
          },
        ]}
      />
    );

    expect(screen.getByTestId('walk-label')).toHaveStyle({ color: '#123456' });
    expect(screen.getByTestId('drive-label')).toHaveStyle({ color: '#654321' });
  });

  it.each([
    {
      state: 'enabled',
      disabled: false,
      color: theme.colors.outline,
      opacity: 1,
    },
    {
      state: 'disabled',
      disabled: true,
      color: theme.colors.onSurface,
      opacity: SegmentedButtonTokens.disabledOutlineOpacity,
    },
  ])('resolves the $state outline', ({ disabled, color, opacity }) => {
    expect(
      resolveColors(theme, {
        checked: false,
        disabled,
        dividerDisabled: false,
      }).outline
    ).toEqual({ color, opacity });
  });

  it.each([
    { checked: true, expected: theme.colors.secondaryContainer },
    { checked: false, expected: 'transparent' },
  ])('resolves the checked: $checked container', ({ checked, expected }) => {
    expect(
      resolveColors(theme, {
        checked,
        disabled: false,
        dividerDisabled: false,
      }).container
    ).toBe(expected);
  });
});

describe('segmented button topology helpers', () => {
  it.each([
    {
      segment: 'first' as const,
      expected: {
        borderTopStartRadius: 9999,
        borderBottomStartRadius: 9999,
        borderTopEndRadius: 0,
        borderBottomEndRadius: 0,
      },
    },
    {
      segment: 'middle' as const,
      expected: { borderRadius: 0 },
    },
    {
      segment: 'last' as const,
      expected: {
        borderTopStartRadius: 0,
        borderBottomStartRadius: 0,
        borderTopEndRadius: 9999,
        borderBottomEndRadius: 9999,
      },
    },
  ])('returns the $segment segment radii', ({ segment, expected }) => {
    expect(getSegmentedButtonBorderRadius(segment)).toEqual(expected);
  });

  it.each([
    {
      segment: 'first' as const,
      expected: {
        outline: {
          borderTopWidth: SegmentedButtonTokens.outlineWidth,
          borderBottomWidth: SegmentedButtonTokens.outlineWidth,
          borderStartWidth: SegmentedButtonTokens.outlineWidth,
          borderEndWidth: 0,
        },
      },
    },
    {
      segment: 'middle' as const,
      expected: {
        outline: {
          borderTopWidth: SegmentedButtonTokens.outlineWidth,
          borderBottomWidth: SegmentedButtonTokens.outlineWidth,
          borderEndWidth: 0,
        },
        divider: { borderStartWidth: SegmentedButtonTokens.outlineWidth },
      },
    },
    {
      segment: 'last' as const,
      expected: {
        outline: {
          borderTopWidth: SegmentedButtonTokens.outlineWidth,
          borderBottomWidth: SegmentedButtonTokens.outlineWidth,
          borderEndWidth: SegmentedButtonTokens.outlineWidth,
        },
        divider: { borderStartWidth: SegmentedButtonTokens.outlineWidth },
      },
    },
  ])('returns the $segment segment borders', ({ segment, expected }) => {
    expect(getSegmentedButtonBorderStyles(segment)).toEqual(expected);
  });
});

describe('segmented button presentation', () => {
  const dividerCases = (['ltr', 'rtl'] as const).flatMap((direction) =>
    (
      [
        [false, false, false],
        [false, false, true],
        [false, true, false],
        [false, true, true],
        [true, false, false],
        [true, false, true],
        [true, true, false],
        [true, true, true],
      ] as const
    ).map((disabledStates) => ({ direction, disabledStates }))
  );

  it.each(['ltr', 'rtl'] as const)(
    'renders first, middle, and last geometry in %s',
    async (direction) => {
      const view = await render(
        <LocaleProvider direction={direction}>
          <SegmentedButtons
            value="first"
            onValueChange={() => {}}
            buttons={[
              { value: 'first', label: 'First', testID: 'first' },
              { value: 'middle', label: 'Middle', testID: 'middle' },
              { value: 'last', label: 'Last', testID: 'last' },
            ]}
          />
        </LocaleProvider>
      );
      const segmentCases = [
        {
          id: 'first',
          radii: {
            borderTopStartRadius: 9999,
            borderBottomStartRadius: 9999,
            borderTopEndRadius: 0,
            borderBottomEndRadius: 0,
          },
          borderEndWidth: 0,
        },
        {
          id: 'middle',
          radii: { borderRadius: 0 },
          borderEndWidth: 0,
        },
        {
          id: 'last',
          radii: {
            borderTopStartRadius: 0,
            borderBottomStartRadius: 0,
            borderTopEndRadius: 9999,
            borderBottomEndRadius: 9999,
          },
          borderEndWidth: SegmentedButtonTokens.outlineWidth,
        },
      ];

      expect(view.root).toHaveStyle({ direction });

      for (const { id, radii, borderEndWidth } of segmentCases) {
        expect(screen.getByTestId(`${id}-wrapper`)).toHaveStyle(radii);
        expect(screen.getByTestId(id)).toHaveStyle(radii);
        expect(screen.getByTestId(`${id}-outline`)).toHaveStyle({
          ...radii,
          borderTopWidth: SegmentedButtonTokens.outlineWidth,
          borderBottomWidth: SegmentedButtonTokens.outlineWidth,
          borderEndWidth,
        });

        await fireEvent(screen.getByTestId(id), 'focus');
        expect(screen.getByTestId(`${id}-focus-ring`)).toHaveStyle({
          ...radii,
          top: -FOCUS_RING_OUTSET,
          bottom: -FOCUS_RING_OUTSET,
          left: -FOCUS_RING_OUTSET,
          right: -FOCUS_RING_OUTSET,
          borderWidth: SegmentedButtonTokens.focusIndicatorThickness,
          borderColor: getTheme().colors.secondary,
        });
        await fireEvent(screen.getByTestId(id), 'blur');
        expect(screen.queryByTestId(`${id}-focus-ring`)).not.toBeOnTheScreen();
      }

      expect(screen.getByTestId('first-outline')).toHaveStyle({
        borderStartWidth: SegmentedButtonTokens.outlineWidth,
      });
      expect(screen.queryByTestId('first-divider')).not.toBeOnTheScreen();

      ['middle', 'last'].forEach((id) => {
        expect(screen.getByTestId(`${id}-outline`)).not.toHaveStyle({
          borderStartWidth: SegmentedButtonTokens.outlineWidth,
        });
        expect(screen.getByTestId(`${id}-divider`)).toHaveStyle({
          borderStartWidth: SegmentedButtonTokens.outlineWidth,
        });
      });
    }
  );

  it.each(dividerCases)(
    'renders each $direction divider once for disabled states $disabledStates',
    async ({ direction, disabledStates }) => {
      const ids = ['first', 'middle', 'last'] as const;

      const view = await render(
        <LocaleProvider direction={direction}>
          <SegmentedButtons
            value="first"
            onValueChange={() => {}}
            buttons={ids.map((id, index) => ({
              value: id,
              label: id,
              testID: id,
              disabled: disabledStates[index],
            }))}
          />
        </LocaleProvider>
      );

      expect(view.root).toHaveStyle({ direction });
      expect(screen.queryAllByTestId(/-divider$/)).toHaveLength(2);
      expect(screen.queryByTestId('first-divider')).not.toBeOnTheScreen();

      [1, 2].forEach((index) => {
        const dividerDisabled =
          disabledStates[index - 1] && disabledStates[index];

        expect(screen.getByTestId(`${ids[index]}-divider`)).toHaveStyle({
          borderColor: dividerDisabled
            ? getTheme().colors.onSurface
            : getTheme().colors.outline,
          opacity: dividerDisabled
            ? SegmentedButtonTokens.disabledOutlineOpacity
            : 1,
          borderStartWidth: SegmentedButtonTokens.outlineWidth,
        });
        expect(screen.getByTestId(`${ids[index]}-outline`)).not.toHaveStyle({
          borderStartWidth: SegmentedButtonTokens.outlineWidth,
        });
      });
    }
  );

  it('applies custom styles to the outer segment', async () => {
    const style = {
      flex: 3,
      marginHorizontal: 8,
      backgroundColor: '#123456',
      borderColor: '#654321',
      borderRadius: 12,
      borderWidth: 3,
      elevation: 4,
      shadowColor: '#000000',
    };

    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            testID: 'walk',
            style,
          },
          { value: 'drive', label: 'Driving' },
        ]}
      />
    );

    expect(screen.getByTestId('walk-wrapper')).toHaveStyle(style);
    expect(screen.getByTestId('walk-wrapper')).not.toHaveStyle({
      minHeight: 48,
      minWidth: 48,
    });
    expect(screen.getByTestId('walk-container')).not.toHaveStyle({ flex: 3 });
    expect(screen.getByTestId('walk-container')).not.toHaveStyle({
      backgroundColor: style.backgroundColor,
    });
    expect(screen.getByTestId('walk-outline')).not.toHaveStyle({
      borderColor: style.borderColor,
      borderWidth: style.borderWidth,
    });
  });

  it('always suppresses the user-agent outline on web', async () => {
    const originalPlatform = Platform.OS;
    Platform.OS = 'web';

    try {
      await render(
        <SegmentedButtons
          value="walk"
          onValueChange={() => {}}
          buttons={[
            { value: 'walk', label: 'Walking', testID: 'walk' },
            { value: 'drive', label: 'Driving' },
          ]}
        />
      );

      expect(screen.getByTestId('walk')).toHaveStyle({
        outline: 'none',
      } as unknown as ViewStyle);
    } finally {
      Platform.OS = originalPlatform;
    }
  });

  it.each([
    { density: 'regular' as const, expected: 40 },
    { density: 'small' as const, expected: 36 },
    { density: 'medium' as const, expected: 32 },
    { density: 'high' as const, expected: 28 },
  ])(
    'uses the $density visual height without local target constraints',
    async ({ density, expected }) => {
      expect(SegmentedButtonTokens.containerHeight[density]).toBe(expected);

      await render(
        <SegmentedButtons
          density={density}
          value="walk"
          onValueChange={() => {}}
          buttons={[
            { value: 'walk', label: 'Walking', testID: 'walk' },
            { value: 'drive', label: 'Driving' },
          ]}
        />
      );

      expect(screen.getByTestId('walk-wrapper')).not.toHaveStyle({
        minHeight: 48,
        minWidth: 48,
      });
      expect(screen.getByTestId('walk')).not.toHaveStyle({
        minHeight: 48,
        minWidth: 48,
      });
      expect(screen.getByTestId('walk-container')).toHaveStyle({
        height: expected,
      });
    }
  );

  it('does not render a focus ring for a disabled item', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          { value: 'walk', label: 'Walking', testID: 'walk' },
          {
            value: 'drive',
            label: 'Driving',
            testID: 'drive',
            disabled: true,
          },
        ]}
      />
    );

    await fireEvent(screen.getByTestId('drive'), 'focus');
    expect(screen.queryByTestId('drive-focus-ring')).not.toBeOnTheScreen();
  });
});

describe('should render icon when', () => {
  it('icon prop is passed', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            'aria-label': 'Walking',
            testID: 'walking-button',
          },
          {
            icon: 'car',
            value: 'drive',
            'aria-label': 'Driving',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });

  it('selected check is shown alongside an icon-only option', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            showSelectedCheck: true,
            'aria-label': 'Walking',
            testID: 'walking-button',
          },
          {
            icon: 'car',
            value: 'drive',
            showSelectedCheck: true,
            'aria-label': 'Driving',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-check-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(
      screen.queryByTestId('driving-button-check-icon')
    ).not.toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });

  it('icon prop is passed along with label, no matter if button is checked', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            label: 'Walking',
            testID: 'walking-button',
          },
          {
            icon: 'car',
            value: 'drive',
            label: 'Driving',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is false', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            value: 'walk',
            label: 'Walking',
            testID: 'walking-button',
            showSelectedCheck: false,
          },
          {
            icon: 'car',
            value: 'drive',
            label: 'Driving',
            testID: 'driving-button',
            showSelectedCheck: false,
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });
});

describe('should not render icon when', () => {
  it('icon prop is not passed', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            testID: 'walking-button',
          },
          {
            value: 'drive',
            label: 'Driving',
            testID: 'driving-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.queryByTestId('walking-button-icon')).not.toBeOnTheScreen();
    expect(screen.queryByTestId('driving-button-icon')).not.toBeOnTheScreen();
  });

  it('icon prop is passed along with label, button is checked, showSelectedCheck is true', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            icon: 'walk',
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
            showSelectedCheck: true,
          },
          {
            icon: 'car',
            label: 'Driving',
            value: 'drive',
            testID: 'driving-button',
            showSelectedCheck: true,
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.queryByTestId('walking-button-icon')).not.toBeOnTheScreen();
    expect(screen.getByTestId('walking-button-check-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('driving-button-icon')).toBeOnTheScreen();
  });
});

describe('segment content', () => {
  it('accepts label-only, icon-only, and icon-and-label segments', async () => {
    await render(
      <SegmentedButtons
        value="label"
        buttons={[
          { value: 'label', label: 'Label only', testID: 'label-only' },
          {
            value: 'icon',
            icon: 'walk',
            'aria-label': 'Icon only',
            testID: 'icon-only',
          },
          {
            value: 'both',
            icon: 'car',
            label: 'Icon and label',
            testID: 'icon-and-label',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('label-only-label')).toBeOnTheScreen();
    expect(screen.queryByTestId('label-only-icon')).not.toBeOnTheScreen();
    expect(screen.getByTestId('icon-only-icon')).toBeOnTheScreen();
    expect(screen.queryByTestId('icon-only-label')).not.toBeOnTheScreen();
    expect(screen.getByTestId('icon-and-label-icon')).toBeOnTheScreen();
    expect(screen.getByTestId('icon-and-label-label')).toBeOnTheScreen();
  });
});

describe('accessibility semantics', () => {
  it('prioritizes aria-label and falls back to visible text', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        buttons={[
          { value: 'walk', icon: 'walk', 'aria-label': 'Walking' },
          {
            value: 'drive',
            label: 'Driving',
            'aria-label': 'Travel by car',
          },
          { value: 'transit', label: 'Transit' },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByRole('radio', { name: 'Walking' })).toBeOnTheScreen();
    expect(
      screen.getByRole('radio', { name: 'Travel by car' })
    ).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Transit' })).toBeOnTheScreen();
    expect(
      screen.queryByRole('radio', { name: 'Driving' })
    ).not.toBeOnTheScreen();
  });

  it('exposes a single-select radiogroup containing radio controls', async () => {
    const group = (
      await render(
        <SegmentedButtons
          value="walk"
          buttons={[
            { value: 'walk', label: 'Walking' },
            { value: 'transit', label: 'Transit' },
            { value: 'drive', label: 'Driving' },
          ]}
          onValueChange={() => {}}
        />
      )
    ).toJSON();
    const radios = screen.getAllByRole('radio');

    expect(group).toMatchObject({
      props: { role: 'radiogroup' },
    });
    expect(radios).toHaveLength(3);
    expect(radios[0]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(radios[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false })
    );
  });

  it('exposes a multi-select group containing checkbox controls', async () => {
    const onValueChange = jest.fn();
    const group = (
      await render(
        <SegmentedButtons<string>
          multiSelect
          value={['walk', 'transit']}
          buttons={[
            { value: 'walk', label: 'Walking' },
            { value: 'transit', label: 'Transit' },
            { value: 'drive', label: 'Driving' },
          ]}
          onValueChange={onValueChange}
        />
      )
    ).toJSON();
    const checkboxes = screen.getAllByRole('checkbox');

    expect(group).toMatchObject({
      props: { role: 'group' },
    });
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(checkboxes[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(checkboxes[2]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false })
    );
  });
});

describe('keyboard traversal', () => {
  const buttons = [
    { value: 'first', label: 'First', testID: 'first' },
    {
      value: 'disabled',
      label: 'Disabled',
      disabled: true,
      testID: 'disabled',
    },
    { value: 'last', label: 'Last', testID: 'last' },
  ];

  it.each([
    { variant: 'single-select', multiSelect: false },
    { variant: 'multi-select', multiSelect: true },
  ])(
    'skips disabled segments in forward and reverse $variant tab order',
    async ({ multiSelect }) => {
      if (multiSelect) {
        await render(
          <SegmentedButtons
            multiSelect
            value={[]}
            buttons={buttons}
            onValueChange={() => {}}
          />
        );
      } else {
        await render(
          <SegmentedButtons
            value="first"
            buttons={buttons}
            onValueChange={() => {}}
          />
        );
      }

      const controls = screen.getAllByRole(multiSelect ? 'checkbox' : 'radio');

      expect(controls[0]).toHaveProp('focusable', true);
      expect(controls[1]).toHaveProp('focusable', false);
      expect(controls[2]).toHaveProp('focusable', true);
    }
  );

  it('has no keyboard focus target when every segment is disabled', async () => {
    await render(
      <SegmentedButtons
        value="first"
        buttons={buttons.map((button) => ({ ...button, disabled: true }))}
        onValueChange={() => {}}
      />
    );

    screen
      .getAllByRole('radio')
      .forEach((control) => expect(control).toHaveProp('focusable', false));
  });

  it.each(['ltr', 'rtl'] as const)(
    'keeps disabled group edges out of the %s keyboard order',
    async (direction) => {
      const view = await render(
        <LocaleProvider direction={direction}>
          <SegmentedButtons
            value="middle"
            buttons={[
              { value: 'first', label: 'First', disabled: true },
              { value: 'middle', label: 'Middle' },
              { value: 'last', label: 'Last', disabled: true },
            ]}
            onValueChange={() => {}}
          />
        </LocaleProvider>
      );
      const controls = screen.getAllByRole('radio');

      expect(view.root).toHaveStyle({ direction });
      expect(controls[0]).toHaveProp('focusable', false);
      expect(controls[1]).toHaveProp('focusable', true);
      expect(controls[2]).toHaveProp('focusable', false);
    }
  );

  it('updates the traversal targets when disabled segments change', async () => {
    const view = await render(
      <SegmentedButtons
        value="first"
        buttons={[
          { value: 'first', label: 'First', disabled: true },
          { value: 'last', label: 'Last' },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByRole('radio', { name: 'First' })).toHaveProp(
      'focusable',
      false
    );
    expect(screen.getByRole('radio', { name: 'Last' })).toHaveProp(
      'focusable',
      true
    );

    await view.rerender(
      <SegmentedButtons
        value="first"
        buttons={[
          { value: 'first', label: 'First' },
          { value: 'last', label: 'Last', disabled: true },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByRole('radio', { name: 'First' })).toHaveProp(
      'focusable',
      true
    );
    expect(screen.getByRole('radio', { name: 'Last' })).toHaveProp(
      'focusable',
      false
    );
  });
});

describe('selected check icon', () => {
  it('show selected check icon should be shown', async () => {
    const onValueChange = jest.fn();

    await render(
      <SegmentedButtons<string>
        multiSelect
        value={['walk', 'transit']}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            showSelectedCheck: true,
            testID: 'walking',
          },
          { value: 'transit', label: 'Transit' },
          { value: 'drive', label: 'Driving' },
        ]}
        onValueChange={onValueChange}
      />
    );

    expect(screen.getByTestId('walking-check-icon')).toBeOnTheScreen();
  });

  it('restores the option icon and resets its scale when selected checks are disabled', async () => {
    const reanimated = jest.requireMock('react-native-reanimated') as {
      withSpring: typeof import('react-native-reanimated').withSpring;
    };
    const withSpringSpy = jest.spyOn(reanimated, 'withSpring');
    const buttons = [
      {
        value: 'walk',
        icon: 'walk',
        label: 'Walking',
        showSelectedCheck: true,
        testID: 'walking',
      },
    ];

    try {
      const { rerender } = await render(
        <SegmentedButtons
          value="walk"
          buttons={buttons}
          onValueChange={() => {}}
        />
      );

      expect(screen.getByTestId('walking-check-icon')).toHaveStyle({
        transform: [{ scale: 1 }],
      });

      await rerender(
        <SegmentedButtons
          value="walk"
          buttons={buttons.map((button) => ({
            ...button,
            showSelectedCheck: false,
          }))}
          onValueChange={() => {}}
        />
      );

      const optionIcon = screen.getByTestId('walking-icon');
      expect(optionIcon).toBeOnTheScreen();
      expect(optionIcon).not.toHaveStyle({ transform: [{ scale: 0 }] });
      expect(withSpringSpy).toHaveBeenLastCalledWith(0, {
        reduceMotion: ReduceMotion.Never,
      });
    } finally {
      withSpringSpy.mockRestore();
    }
  });

  it.each([
    { reduceMotion: true, expected: ReduceMotion.Always },
    { reduceMotion: false, expected: ReduceMotion.Never },
  ])(
    'uses the resolved reduce-motion policy when reduceMotion is $reduceMotion',
    async ({ reduceMotion, expected }) => {
      const reanimated = jest.requireMock('react-native-reanimated') as {
        withSpring: typeof import('react-native-reanimated').withSpring;
      };
      const withSpringSpy = jest.spyOn(reanimated, 'withSpring');

      try {
        await render(
          <ReduceMotionContext.Provider value={reduceMotion}>
            <SegmentedButtons
              value="walk"
              buttons={[
                {
                  value: 'walk',
                  label: 'Walking',
                  showSelectedCheck: true,
                },
              ]}
              onValueChange={() => {}}
            />
          </ReduceMotionContext.Provider>
        );

        expect(withSpringSpy).toHaveBeenLastCalledWith(1, {
          reduceMotion: expected,
        });
      } finally {
        withSpringSpy.mockRestore();
      }
    }
  );
});

describe('labelStyle is handled', () => {
  it('when labelStyle is given', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
            labelStyle: { fontSize: 10, opacity: 0.5 },
          },
          {
            label: 'Driving',
            value: 'drive',
            testID: 'driving-button',
            labelStyle: { fontSize: 12 },
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-label')).toHaveStyle({
      fontSize: 10,
      opacity: 0.5,
    });
    expect(screen.getByTestId('driving-button-label')).toHaveStyle({
      fontSize: 12,
    });
  });

  it('when labelStyle is omitted', async () => {
    await render(
      <SegmentedButtons
        value={'walk'}
        buttons={[
          {
            label: 'Walking',
            value: 'walk',
            testID: 'walking-button',
          },
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByTestId('walking-button-label')).toHaveStyle({
      fontSize: 14,
    });
  });
});
