import { describe, expect, it, jest } from '@jest/globals';

import { LocaleProvider } from '../../core/locale';
import { getTheme } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import { SegmentedButtonTokens } from '../SegmentedButtons/tokens';
import {
  getSegmentedButtonBorderRadius,
  getSegmentedButtonBorderStyles,
  getSegmentedButtonColors,
  getSegmentedButtonHeight,
  getSegmentedButtonOutlineStyle,
  getSegmentedButtonStateLayerOpacity,
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

  it('selects only the first matching item when single-select values are duplicated', async () => {
    const user = userEvent.setup();
    const duplicateOnPress = jest.fn();
    const onValueChange = jest.fn();

    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={onValueChange}
        buttons={[
          { value: 'walk', label: 'Walking', testID: 'first-walk' },
          {
            value: 'walk',
            label: 'Walking again',
            onPress: duplicateOnPress,
            testID: 'second-walk',
          },
          { value: 'ride', label: 'Riding' },
        ]}
      />
    );

    const radios = screen.getAllByRole('radio');

    expect(radios[0]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(radios[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false })
    );

    await user.press(screen.getByTestId('second-walk'));

    expect(duplicateOnPress).toHaveBeenCalledTimes(1);
    expect(onValueChange).toHaveBeenCalledWith('walk');
    expect(screen.getAllByRole('radio')[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: false })
    );
  });

  it('keeps duplicate button values selected and toggleable in multiselect', async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();

    await render(
      <SegmentedButtons<string>
        multiSelect
        value={['walk']}
        onValueChange={onValueChange}
        buttons={[
          { value: 'walk', label: 'Walking', testID: 'first-walk' },
          { value: 'walk', label: 'Walking again', testID: 'second-walk' },
          { value: 'ride', label: 'Riding' },
        ]}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );
    expect(checkboxes[1]).toHaveProp(
      'accessibilityState',
      expect.objectContaining({ checked: true })
    );

    await user.press(screen.getByTestId('second-walk'));

    expect(onValueChange).toHaveBeenCalledWith([]);
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
        colors: { secondaryContainer: '#123456' },
        fonts: { labelLarge: { fontSize: 18 } },
      }}
    />
  );

  expect(screen.getByTestId('walk-container')).toHaveStyle({
    backgroundColor: '#123456',
  });
  expect(screen.getByTestId('walk-label')).toHaveStyle({ fontSize: 18 });
});

describe('getSegmentedButtonColors', () => {
  const theme = getTheme();

  it.each([
    {
      disabled: false,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSecondaryContainer,
    },
    {
      disabled: false,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: true,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: false,
      checked: true,
      checkedColor: 'a125f5',
      uncheckedColor: undefined,
      expected: 'a125f5',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: undefined,
      uncheckedColor: '000',
      expected: '000',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: 'a125f5',
      uncheckedColor: '000',
      expected: '000',
    },
    {
      disabled: false,
      checked: false,
      checkedColor: 'a125f5',
      uncheckedColor: undefined,
      expected: theme.colors.onSurface,
    },
    {
      disabled: false,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: '000',
      expected: theme.colors.onSecondaryContainer,
    },
  ])(
    'returns $expected when disabled: $disabled, checked: $checked, checkedColor is $checkedColor and uncheckedColor is $uncheckedColor',
    ({ disabled, checked, checkedColor, uncheckedColor, expected }) => {
      expect(
        getSegmentedButtonColors({
          theme,
          disabled,
          checked,
          checkedColor,
          uncheckedColor,
        })
      ).toMatchObject({ textColor: expected, iconColor: expected });
    }
  );

  it('should return correct background color when checked and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: true,
      })
    ).toMatchObject({ backgroundColor: getTheme().colors.secondaryContainer });
  });

  it('should return correct background color when uncheked (V3 & V2)', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      backgroundColor: 'transparent',
    });
  });

  it('should return correct border color with theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return correct border color when disabled and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.onSurface,
      borderOpacity: SegmentedButtonTokens.disabledOutlineOpacity,
    });
  });

  it('should return correct textColor with theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: false,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct textColor when disabled and theme version 3', () => {
    expect(
      getSegmentedButtonColors({
        theme: getTheme(),
        disabled: true,
        checked: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
      textOpacity: SegmentedButtonTokens.disabledLabelTextOpacity,
      iconColor: getTheme().colors.onSurface,
      iconOpacity: SegmentedButtonTokens.disabledIconOpacity,
    });
  });
});

describe('getSegmentedButtonStateLayerOpacity', () => {
  it.each([
    {
      state: 'disabled',
      disabled: true,
      pressed: true,
      focused: true,
      hovered: true,
      expected: 0,
    },
    {
      state: 'pressed',
      disabled: false,
      pressed: true,
      focused: true,
      hovered: true,
      expected: SegmentedButtonTokens.stateLayerOpacity.pressed,
    },
    {
      state: 'focused',
      disabled: false,
      pressed: false,
      focused: true,
      hovered: true,
      expected: SegmentedButtonTokens.stateLayerOpacity.focused,
    },
    {
      state: 'hovered',
      disabled: false,
      pressed: false,
      focused: false,
      hovered: true,
      expected: SegmentedButtonTokens.stateLayerOpacity.hovered,
    },
    {
      state: 'idle',
      disabled: false,
      pressed: false,
      focused: false,
      hovered: false,
      expected: 0,
    },
  ])(
    'returns the $state state opacity',
    ({ disabled, pressed, focused, hovered, expected }) => {
      expect(
        getSegmentedButtonStateLayerOpacity({
          disabled,
          pressed,
          focused,
          hovered,
        })
      ).toBe(expected);
    }
  );
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
    expect(getSegmentedButtonBorderRadius({ segment })).toEqual(expected);
  });

  it.each([
    { segment: 'first' as const, borderEndWidth: 0 },
    { segment: 'middle' as const, borderEndWidth: 0 },
    { segment: 'last' as const, borderEndWidth: 3 },
  ])(
    'returns the $segment segment outline widths',
    ({ segment, borderEndWidth }) => {
      expect(getSegmentedButtonOutlineStyle(segment, 3)).toEqual({
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderStartWidth: 3,
        borderEndWidth,
      });
    }
  );

  it('keeps the first segment border on its outline', () => {
    expect(
      getSegmentedButtonBorderStyles({
        segment: 'first',
        borderOverrides: {
          borderWidth: 3,
          borderColor: '#123456',
          borderStartColor: '#abcdef',
          borderStyle: 'dashed',
        },
      })
    ).toEqual({
      outlineBorderStyle: {
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderStartWidth: 3,
        borderEndWidth: 0,
        borderColor: '#123456',
        borderStartColor: '#abcdef',
        borderStyle: 'dashed',
      },
    });
  });

  it('moves a non-first segment start edge to the shared border', () => {
    expect(
      getSegmentedButtonBorderStyles({
        segment: 'middle',
        borderOverrides: {
          borderWidth: 3,
          borderTopWidth: 4,
          borderStartWidth: 5,
          borderColor: '#123456',
          borderStartColor: '#abcdef',
          borderStyle: 'dotted',
        },
      })
    ).toEqual({
      outlineBorderStyle: {
        borderTopWidth: 4,
        borderBottomWidth: 3,
        borderEndWidth: 0,
        borderColor: '#123456',
        borderStyle: 'dotted',
      },
      sharedBorderStyle: {
        borderStartWidth: 5,
        borderColor: '#123456',
        borderStartColor: '#abcdef',
        borderStyle: 'dotted',
      },
    });
  });

  it('preserves a zero border width', () => {
    expect(
      getSegmentedButtonBorderStyles({
        segment: 'last',
        borderOverrides: { borderWidth: 0 },
      })
    ).toEqual({
      outlineBorderStyle: {
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderEndWidth: 0,
      },
      sharedBorderStyle: { borderStartWidth: 0 },
    });
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
        expect(screen.getByTestId(id)).toHaveStyle(radii);
        expect(screen.getByTestId(`${id}-container`)).toHaveStyle(radii);
        expect(screen.getByTestId(`${id}-state-layer`)).toHaveStyle(radii);
        expect(screen.getByTestId(`${id}-outline`)).toHaveStyle({
          ...radii,
          borderTopWidth: SegmentedButtonTokens.outlineWidth,
          borderBottomWidth: SegmentedButtonTokens.outlineWidth,
          borderEndWidth,
        });

        await fireEvent(screen.getByTestId(id), 'focus');
        expect(screen.getByTestId(`${id}-focus-ring`)).toHaveStyle(radii);
        await fireEvent(screen.getByTestId(id), 'blur');
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

  it('applies custom backgrounds, radii, and shadows to selected and unselected visual containers', async () => {
    const selectedStyle = {
      backgroundColor: '#112233',
      borderRadius: 12,
      elevation: 4,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 3,
    };
    const unselectedStyle = {
      backgroundColor: '#445566',
      borderRadius: 6,
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
            style: selectedStyle,
          },
          {
            value: 'drive',
            label: 'Driving',
            testID: 'drive',
            style: unselectedStyle,
          },
        ]}
      />
    );

    expect(screen.getByTestId('walk-container')).toHaveStyle(selectedStyle);
    expect(screen.getByTestId('drive-container')).toHaveStyle(unselectedStyle);
    expect(screen.getByTestId('walk-state-layer')).toHaveStyle({
      borderRadius: selectedStyle.borderRadius,
    });
    expect(screen.getByTestId('drive-state-layer')).toHaveStyle({
      borderRadius: unselectedStyle.borderRadius,
    });
    expect(screen.getByTestId('walk')).toHaveStyle({ overflow: 'visible' });
    expect(screen.getByTestId('walk-wrapper')).not.toHaveStyle({
      backgroundColor: selectedStyle.backgroundColor,
      shadowColor: selectedStyle.shadowColor,
    });
  });

  it('applies custom borders without double-drawing an interior edge', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            testID: 'walk',
            style: {
              borderColor: '#123456',
              borderStyle: 'dashed',
              borderWidth: 3,
            },
          },
          {
            value: 'drive',
            label: 'Driving',
            testID: 'drive',
            style: {
              borderColor: '#654321',
              borderStartColor: '#abcdef',
              borderStyle: 'dotted',
              borderTopWidth: 4,
            },
          },
        ]}
      />
    );

    const selectedOutline = screen.getByTestId('walk-outline');

    expect(selectedOutline).toHaveStyle({
      borderColor: '#123456',
      borderStyle: 'dashed',
      borderTopWidth: 3,
      borderBottomWidth: 3,
      borderStartWidth: 3,
      borderEndWidth: 0,
    });
    expect(selectedOutline).not.toHaveStyle({ borderWidth: 3 });
    expect(screen.getByTestId('drive-outline')).toHaveStyle({
      borderColor: '#654321',
      borderStyle: 'dotted',
      borderTopWidth: 4,
      borderBottomWidth: SegmentedButtonTokens.outlineWidth,
      borderEndWidth: SegmentedButtonTokens.outlineWidth,
    });
    expect(screen.getByTestId('drive-outline')).not.toHaveStyle({
      borderStartWidth: SegmentedButtonTokens.outlineWidth,
    });
    expect(screen.getByTestId('drive-divider')).toHaveStyle({
      borderColor: '#654321',
      borderStartColor: '#abcdef',
      borderStyle: 'dotted',
      borderStartWidth: SegmentedButtonTokens.outlineWidth,
    });
  });

  it.each(['ltr', 'rtl'] as const)(
    'keeps generic and explicit custom widths topology-aware in %s',
    async (direction) => {
      await render(
        <LocaleProvider direction={direction}>
          <SegmentedButtons
            value="first"
            onValueChange={() => {}}
            buttons={[
              {
                value: 'first',
                label: 'First',
                testID: 'custom-first',
                style: { borderWidth: 3, borderTopWidth: 4 },
              },
              {
                value: 'middle',
                label: 'Middle',
                testID: 'custom-middle',
                style: { borderWidth: 3, borderStartWidth: 5 },
              },
              {
                value: 'last',
                label: 'Last',
                testID: 'custom-last',
                style: {
                  borderWidth: 3,
                  borderBottomWidth: 6,
                  borderEndWidth: 7,
                },
              },
            ]}
          />
        </LocaleProvider>
      );

      expect(screen.getByTestId('custom-first-outline')).toHaveStyle({
        borderTopWidth: 4,
        borderBottomWidth: 3,
        borderStartWidth: 3,
        borderEndWidth: 0,
      });
      expect(
        screen.queryByTestId('custom-first-divider')
      ).not.toBeOnTheScreen();
      expect(screen.getByTestId('custom-middle-outline')).toHaveStyle({
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderEndWidth: 0,
      });
      expect(screen.getByTestId('custom-middle-divider')).toHaveStyle({
        borderStartWidth: 5,
      });
      expect(screen.getByTestId('custom-last-outline')).toHaveStyle({
        borderTopWidth: 3,
        borderBottomWidth: 6,
        borderEndWidth: 7,
      });
      expect(screen.getByTestId('custom-last-divider')).toHaveStyle({
        borderStartWidth: 3,
      });
    }
  );

  it('does not move visual styles to the hit target', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          {
            value: 'walk',
            label: 'Walking',
            testID: 'walk',
            style: { flex: 3, backgroundColor: '#123456' },
          },
          { value: 'drive', label: 'Driving' },
        ]}
      />
    );

    expect(screen.getByTestId('walk-container')).toHaveStyle({
      flex: 3,
      backgroundColor: '#123456',
    });
    expect(screen.getByTestId('walk-wrapper')).toHaveStyle({
      flex: 1,
      minHeight: SegmentedButtonTokens.touchTargetHeight,
    });
  });

  it.each([
    { density: 'regular' as const, expected: 40 },
    { density: 'small' as const, expected: 36 },
    { density: 'medium' as const, expected: 32 },
    { density: 'high' as const, expected: 28 },
  ])(
    'uses the $density density height inside a 48dp target',
    async ({ density, expected }) => {
      expect(getSegmentedButtonHeight(density)).toBe(expected);

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

      expect(screen.getByTestId('walk-wrapper')).toHaveStyle({
        minHeight: SegmentedButtonTokens.touchTargetHeight,
      });
      expect(screen.getByTestId('walk')).toHaveStyle({
        minHeight: SegmentedButtonTokens.touchTargetHeight,
      });
      expect(screen.getByTestId('walk-container')).toHaveStyle({
        height: expected,
      });
    }
  );

  it('renders state opacity with press, focus, and hover precedence', async () => {
    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          { value: 'walk', label: 'Walking', testID: 'walk' },
          { value: 'drive', label: 'Driving', testID: 'drive' },
        ]}
      />
    );

    const button = screen.getByTestId('walk');
    const stateLayer = screen.getByTestId('walk-state-layer');
    const focusRingInset =
      (SegmentedButtonTokens.touchTargetHeight -
        SegmentedButtonTokens.containerHeight.regular) /
        2 -
      SegmentedButtonTokens.focusIndicatorThickness -
      SegmentedButtonTokens.focusIndicatorOutlineOffset;

    await fireEvent(button, 'hoverIn');
    expect(stateLayer).toHaveStyle({
      backgroundColor: getTheme().colors.onSecondaryContainer,
      opacity: SegmentedButtonTokens.stateLayerOpacity.hovered,
    });

    await fireEvent(button, 'focus');
    expect(stateLayer).toHaveStyle({
      opacity: SegmentedButtonTokens.stateLayerOpacity.focused,
    });
    expect(screen.getByTestId('walk-focus-ring')).toHaveStyle({
      borderWidth: SegmentedButtonTokens.focusIndicatorThickness,
      borderColor: getTheme().colors.secondary,
      top: focusRingInset,
      bottom: focusRingInset,
    });

    await fireEvent(button, 'pressIn');
    expect(stateLayer).toHaveStyle({
      opacity: SegmentedButtonTokens.stateLayerOpacity.pressed,
    });

    await fireEvent(button, 'pressOut');
    expect(stateLayer).toHaveStyle({
      opacity: SegmentedButtonTokens.stateLayerOpacity.focused,
    });

    await fireEvent(button, 'blur');
    expect(stateLayer).toHaveStyle({
      opacity: SegmentedButtonTokens.stateLayerOpacity.hovered,
    });
    expect(screen.queryByTestId('walk-focus-ring')).not.toBeOnTheScreen();

    await fireEvent(button, 'hoverOut');
    expect(stateLayer).toHaveStyle({ opacity: 0 });

    const unselectedButton = screen.getByTestId('drive');
    const unselectedStateLayer = screen.getByTestId('drive-state-layer');

    await fireEvent(unselectedButton, 'hoverIn');
    expect(unselectedStateLayer).toHaveStyle({
      backgroundColor: getTheme().colors.onSurface,
      opacity: SegmentedButtonTokens.stateLayerOpacity.hovered,
    });
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
  it('uses icon descriptions and visible text as segment names', async () => {
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
        ]}
        onValueChange={() => {}}
      />
    );

    expect(screen.getByRole('radio', { name: 'Walking' })).toBeOnTheScreen();
    expect(screen.getByRole('radio', { name: 'Driving' })).toBeOnTheScreen();
    expect(
      screen.queryByRole('radio', { name: 'Travel by car' })
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
