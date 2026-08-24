import { Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { LocaleProvider } from '../../core/locale';
import { getTheme } from '../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import SegmentedButtons from '../SegmentedButtons/SegmentedButtons';
import { SegmentedButtonTokens } from '../SegmentedButtons/tokens';
import {
  getDisabledSegmentedButtonStyle,
  getSegmentedButtonColors,
  getSegmentedButtonHeight,
  getSegmentedButtonStateLayerOpacity,
} from '../SegmentedButtons/utils';

const stateOpacity = tokens.md.sys.state.opacity;

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
      theme={{ colors: { secondaryContainer: '#123456' } }}
    />
  );

  expect(screen.getByTestId('walk-container')).toHaveStyle({
    backgroundColor: '#123456',
  });
});

describe('getSegmentedButtonColors', () => {
  const theme = getTheme();

  it('maps the default light selected colors to secondary tone 30', () => {
    const selectedColor = tokens.md.ref.palette.secondary30;

    expect(theme.colors.onSecondaryContainer).toBe(
      tokens.md.ref.palette.secondary10
    );
    expect(theme.colors[SegmentedButtonTokens.selectedContentColor]).toBe(
      selectedColor
    );
    expect(theme.colors[SegmentedButtonTokens.selectedStateLayerColor]).toBe(
      selectedColor
    );
  });

  it('preserves dark, custom theme, and checked color resolution', () => {
    const darkTheme = getTheme(true);
    const customTheme = {
      ...theme,
      colors: {
        ...theme.colors,
        onSecondaryContainerVariant: '#123456',
      },
    };

    expect(
      getSegmentedButtonColors({
        theme: darkTheme,
        checked: true,
      })
    ).toMatchObject({
      textColor: tokens.md.ref.palette.secondary90,
      stateLayerColor: tokens.md.ref.palette.secondary90,
    });
    expect(
      getSegmentedButtonColors({
        theme: customTheme,
        checked: true,
      })
    ).toMatchObject({
      textColor: '#123456',
      stateLayerColor: '#123456',
    });
    expect(
      getSegmentedButtonColors({
        theme,
        checked: true,
        checkedColor: '#654321',
      })
    ).toMatchObject({
      textColor: '#654321',
      stateLayerColor: tokens.md.ref.palette.secondary30,
    });
  });

  it.each([
    {
      disabled: false,
      checked: true,
      checkedColor: undefined,
      uncheckedColor: undefined,
      expected: theme.colors.onSecondaryContainerVariant,
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
      expected: theme.colors.onSecondaryContainerVariant,
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
      ).toMatchObject({ textColor: expected });
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
      textOpacity: stateOpacity.disabled,
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
      expected: stateOpacity.pressed,
    },
    {
      state: 'focused',
      disabled: false,
      pressed: false,
      focused: true,
      hovered: true,
      expected: stateOpacity.focused,
    },
    {
      state: 'hovered',
      disabled: false,
      pressed: false,
      focused: false,
      hovered: true,
      expected: stateOpacity.hovered,
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

describe('segmented button presentation', () => {
  it('renders selected content and state layers with the default light color', async () => {
    const selectedColor = tokens.md.ref.palette.secondary30;

    await render(
      <SegmentedButtons
        value="walk"
        onValueChange={() => {}}
        buttons={[
          {
            value: 'walk',
            icon: ({ color }) => <Text testID="walk-glyph" style={{ color }} />,
            label: 'Walking',
            testID: 'walk',
          },
          { value: 'drive', label: 'Driving' },
        ]}
      />
    );

    const button = screen.getByTestId('walk');
    const stateLayer = screen.getByTestId('walk-state-layer');

    expect(screen.getByTestId('walk-label')).toHaveStyle({
      color: selectedColor,
    });
    expect(screen.getByTestId('walk-glyph')).toHaveStyle({
      color: selectedColor,
    });
    expect(stateLayer).toHaveStyle({
      backgroundColor: selectedColor,
      opacity: 0,
    });

    await fireEvent(button, 'hoverIn');
    expect(stateLayer).toHaveStyle({ opacity: stateOpacity.hovered });

    await fireEvent(button, 'focus');
    expect(stateLayer).toHaveStyle({ opacity: stateOpacity.focused });

    await fireEvent(button, 'pressIn');
    expect(stateLayer).toHaveStyle({ opacity: stateOpacity.pressed });
  });

  it.each([
    { density: 'regular' as const, expected: 40 },
    { density: 'small' as const, expected: 36 },
    { density: 'medium' as const, expected: 32 },
    { density: 'high' as const, expected: 28 },
  ])('uses the $density density height', ({ density, expected }) => {
    expect(getSegmentedButtonHeight(density)).toBe(expected);
  });

  it('keeps a 48dp target around the visual container', async () => {
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
      minHeight: SegmentedButtonTokens.touchTargetHeight,
    });
    expect(screen.getByTestId('walk-container')).toHaveStyle({ height: 40 });
  });

  it('renders token opacity for hover and keyboard focus states', async () => {
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

    const button = screen.getByTestId('walk');
    const stateLayer = screen.getByTestId('walk-state-layer');

    await fireEvent(button, 'hoverIn');
    expect(stateLayer).toHaveStyle({ opacity: stateOpacity.hovered });

    await fireEvent(button, 'focus');
    expect(stateLayer).toHaveStyle({ opacity: stateOpacity.focused });
    expect(screen.getByTestId('walk-focus-ring')).toHaveStyle({
      borderWidth: tokens.md.sys.state.focusIndicator.thickness,
      borderColor: getTheme().colors.secondary,
    });
  });
});

describe('getDisabledSegmentedButtonBorderWidth', () => {
  it('Returns empty style object for all enabled buttons', () => {
    [0, 1, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [
            { disabled: false },
            { disabled: false },
            { disabled: false },
          ],
          index,
        })
      ).toMatchObject({});
    });
  });

  it('Returns empty style object for all disabled buttons', () => {
    [0, 1, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [{ disabled: true }, { disabled: true }, { disabled: true }],
          index,
        })
      ).toMatchObject({});
    });
  });

  it('Returns proper style object for one disabled button', () => {
    expect(
      getDisabledSegmentedButtonStyle({
        theme: getTheme(),
        buttons: [{ disabled: false }, { disabled: true }, { disabled: true }],
        index: 0,
      })
    ).toMatchObject({ borderRightWidth: 1 });
  });

  it('Returns proper style object for two disabled buttons (alternately)', () => {
    [0, 2].forEach((index) => {
      expect(
        getDisabledSegmentedButtonStyle({
          theme: getTheme(),
          buttons: [
            { disabled: false },
            { disabled: true },
            { disabled: false },
            { disabled: true },
          ],
          index,
        })
      ).toMatchObject({ borderRightWidth: 1 });
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
          aria-label="Transport mode"
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
      props: { 'aria-label': 'Transport mode', role: 'radiogroup' },
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
          aria-label="Transport modes"
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
      props: { 'aria-label': 'Transport modes', role: 'group' },
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
            testID: 'walking-check-icon',
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
            labelStyle: { fontSize: 10 },
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
