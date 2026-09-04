import { Platform, PlatformColor } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';

import { Provider as SettingsProvider } from '../../../core/settings';
import { defaultThemes } from '../../../core/theming';
import { fireEvent, render, screen } from '../../../test-utils';
import { ReduceMotionContext } from '../../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../../theme/tokens';
import Checkbox from '../../Checkbox';
import type { Props as CheckboxProps } from '../../Checkbox/Checkbox';

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders checked Checkbox with onPress', async () => {
  const tree = (
    await render(<Checkbox status="checked" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with onPress', async () => {
  const tree = (
    await render(<Checkbox status="unchecked" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox', async () => {
  const tree = (
    await render(<Checkbox status="indeterminate" onPress={() => {}} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="checked" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="checked" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox with color', async () => {
  const tree = (
    await render(<Checkbox status="indeterminate" color="red" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders Checkbox with custom testID', async () => {
  const tree = (
    await render(<Checkbox status="checked" testID={'custom:testID'} />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('Checkbox state layer', () => {
  const { colors } = defaultThemes.light;
  const { hovered, focused } = tokens.md.sys.state.opacity;

  const stateLayer = () => screen.getByTestId('checkbox-state-layer');

  const renderCheckbox = (props: Partial<CheckboxProps> = {}) =>
    render(
      <Checkbox
        status="unchecked"
        onPress={() => {}}
        testID="checkbox"
        {...props}
      />
    );

  it('is idle until the checkbox is interacted with', async () => {
    await renderCheckbox();

    expect(stateLayer()).toHaveStyle({ opacity: 0 });
  });

  it('tints hover with onSurface when unselected', async () => {
    await renderCheckbox();

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: hovered,
    });
  });

  it('tints hover with primary when selected', async () => {
    await renderCheckbox({ status: 'checked' });

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.primary,
      opacity: hovered,
    });
  });

  it('tints focus the same way as hover', async () => {
    await renderCheckbox({ status: 'checked' });

    await fireEvent(screen.getByRole('checkbox'), 'focus');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.primary,
      opacity: focused,
    });
  });

  it('stays on error for every interaction', async () => {
    await renderCheckbox({ status: 'checked', error: true });

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');
    expect(stateLayer()).toHaveStyle({ backgroundColor: colors.error });

    await fireEvent(screen.getByRole('checkbox'), 'focus');
    expect(stateLayer()).toHaveStyle({ backgroundColor: colors.error });
  });

  it('tints hover with a custom color instead of the token role', async () => {
    await renderCheckbox({ status: 'checked', color: 'teal' });

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: 'teal',
      opacity: hovered,
    });
  });

  it('stays idle on a disabled checkbox', async () => {
    await renderCheckbox({ disabled: true });

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(stateLayer()).toHaveStyle({ opacity: 0 });
  });

  it('fades out by opacity and keeps its color', async () => {
    await renderCheckbox();

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');
    await fireEvent(screen.getByRole('checkbox'), 'hoverOut');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: 0,
    });
  });

  it('transitions opacity only', async () => {
    await renderCheckbox();

    // `toHaveStyle` reads the props Reanimated leaves on the host node, which
    // drops CSS-transition-only keys -- `getAnimatedStyle` mirrors how
    // Surface.test.tsx asserts `transitionProperty` for the same reason.
    expect(getAnimatedStyle(stateLayer())).toMatchObject({
      transitionProperty: ['opacity'],
    });
  });

  it('tints with a PlatformColor role as-is on hover', async () => {
    const onSurface = PlatformColor('?attr/colorOnSurface');
    await renderCheckbox({ theme: { colors: { onSurface } } });

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: onSurface,
      opacity: hovered,
    });
  });
});

describe('Checkbox press ripple', () => {
  const { colors, motion } = defaultThemes.light;
  const { hovered, pressed } = tokens.md.sys.state.opacity;
  const GROW = motion.duration.short4;
  const FADE_OUT = motion.duration.short3;
  // Mirrors `RIPPLE_START_SCALE` in Checkbox.tsx.
  const RIPPLE_START_SCALE = 0.6;
  const platforms = ['ios', 'android', 'web'] as const;

  const ripple = () => getAnimatedStyle(screen.getByTestId('checkbox-ripple'));

  const renderCheckbox = (props: Partial<CheckboxProps> = {}) =>
    render(
      <Checkbox
        status="unchecked"
        onPress={() => {}}
        testID="checkbox"
        {...props}
      />
    );

  const pressIn = () => fireEvent(screen.getByRole('checkbox'), 'pressIn');
  const pressOut = () => fireEvent(screen.getByRole('checkbox'), 'pressOut');

  // The ripple has no `Platform` branch; these two guard against one
  // creeping back in (the old implementation split on it).
  it.each(platforms)('grows to fill the state layer on %s', async (os) => {
    jest.replaceProperty(Platform, 'OS', os);
    await renderCheckbox();

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({
      backgroundColor: colors.primary,
      opacity: pressed,
      transform: [{ scale: 1 }],
    });
  });

  it.each(platforms)('inverts to onSurface when selected on %s', async (os) => {
    jest.replaceProperty(Platform, 'OS', os);
    await renderCheckbox({ status: 'checked' });

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({
      backgroundColor: colors.onSurface,
      opacity: pressed,
      transform: [{ scale: 1 }],
    });
  });

  it('resets the scale on a second press', async () => {
    await renderCheckbox();

    await pressIn();
    await pressOut();
    await jest.runAllTimersAsync();

    await pressIn();
    jest.advanceTimersByTime(0);
    expect(ripple().transform).toEqual([{ scale: RIPPLE_START_SCALE }]);

    jest.advanceTimersByTime(GROW);
    expect(ripple().transform).toEqual([{ scale: 1 }]);
  });

  it('stays on error while pressed', async () => {
    await renderCheckbox({ status: 'checked', error: true });

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({ backgroundColor: colors.error });
  });

  it('inverts a selected checkbox into its custom unchecked color', async () => {
    await renderCheckbox({ status: 'checked', uncheckedColor: 'teal' });

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({ backgroundColor: 'teal' });
  });

  it('inverts an unselected checkbox into its custom color', async () => {
    await renderCheckbox({ color: 'teal' });

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({ backgroundColor: 'teal' });
  });

  it('stays up for a minimum press when the finger lifts immediately', async () => {
    await renderCheckbox();

    await pressIn();
    await pressOut();

    jest.advanceTimersByTime(100);
    expect(ripple()).toMatchObject({ opacity: pressed });

    jest.advanceTimersByTime(GROW + FADE_OUT);
    expect(ripple()).toMatchObject({ opacity: 0 });
  });

  it('takes the fade-out duration to reach zero', async () => {
    await renderCheckbox();

    await pressIn();
    await pressOut();
    jest.advanceTimersByTime(GROW + FADE_OUT / 2);

    const { opacity } = ripple();
    expect(opacity).toBeGreaterThan(0);
    expect(opacity).toBeLessThan(pressed);

    jest.advanceTimersByTime(FADE_OUT / 2);
    expect(ripple()).toMatchObject({ opacity: 0 });
  });

  it('is not left behind by a rapid double tap', async () => {
    await renderCheckbox();

    await pressIn();
    await pressOut();
    jest.advanceTimersByTime(30);
    await pressIn();
    await pressOut();

    // The first press's hold (armed at t=0) would have expired here if the
    // second press (t=30) hadn't re-armed it -- the ripple must still be up.
    jest.advanceTimersByTime(GROW - 30 + 1);
    expect(ripple()).toMatchObject({ opacity: pressed });

    await jest.runAllTimersAsync();
    expect(ripple()).toMatchObject({ opacity: 0 });
  });

  it('keeps the minimum-press hold under reduce motion', async () => {
    await render(
      <ReduceMotionContext.Provider value={true}>
        <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
      </ReduceMotionContext.Provider>
    );

    await pressIn();
    jest.advanceTimersByTime(0);
    expect(ripple()).toMatchObject({
      opacity: pressed,
      transform: [{ scale: 1 }],
    });

    await pressOut();
    jest.advanceTimersByTime(GROW - 1);
    expect(ripple()).toMatchObject({ opacity: pressed });

    // Hold expires; the fade duration is 0 under reduce motion so it lands on
    // 0 within this same tick.
    jest.advanceTimersByTime(1);
    expect(ripple()).toMatchObject({ opacity: 0 });
  });

  it('leaves the flat state layer on hover while it paints the press', async () => {
    await renderCheckbox();

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');
    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(screen.getByTestId('checkbox-state-layer')).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: hovered,
    });
    expect(ripple()).toMatchObject({
      backgroundColor: colors.primary,
      opacity: pressed,
    });
  });

  it('tints with a PlatformColor role as-is', async () => {
    const primary = PlatformColor('?attr/colorPrimary');
    await renderCheckbox({ theme: { colors: { primary } } });

    await pressIn();
    jest.advanceTimersByTime(GROW);

    expect(ripple()).toMatchObject({ backgroundColor: primary });
  });

  it('hands the press back to the platform when a rippleColor is given', async () => {
    await renderCheckbox({ rippleColor: 'teal' });

    expect(screen.queryByTestId('checkbox-ripple')).toBeNull();
  });

  it('hands the press back to the platform when an underlayColor is given', async () => {
    await renderCheckbox({ underlayColor: 'teal' });

    expect(screen.queryByTestId('checkbox-ripple')).toBeNull();
  });

  it('paints nothing when the ripple effect is turned off', async () => {
    await render(
      <SettingsProvider value={{ rippleEffectEnabled: false }}>
        <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
      </SettingsProvider>
    );

    expect(screen.queryByTestId('checkbox-ripple')).toBeNull();
  });

  it('is not rendered on a disabled checkbox', async () => {
    await renderCheckbox({ disabled: true });

    expect(screen.queryByTestId('checkbox-ripple')).toBeNull();
  });

  it('is not rendered without a press handler', async () => {
    await render(<Checkbox status="unchecked" testID="checkbox" />);

    expect(screen.queryByTestId('checkbox-ripple')).toBeNull();
  });
});

describe('Checkbox without a press handler', () => {
  it('is reported as disabled rather than an enabled no-op', async () => {
    await render(<Checkbox status="checked" testID="checkbox" />);

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('does not paint a state layer on hover', async () => {
    await render(<Checkbox status="checked" testID="checkbox" />);

    await fireEvent(screen.getByRole('checkbox'), 'hoverIn');

    expect(screen.getByTestId('checkbox-state-layer')).toHaveStyle({
      opacity: 0,
    });
  });
});
describe('Checkbox touch target', () => {
  it('meets the 48dp minimum without resizing the state layer', async () => {
    await render(
      <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
    );

    expect(screen.getByRole('checkbox')).toHaveStyle({
      width: 48,
      height: 48,
    });
    expect(screen.getByTestId('checkbox-state-layer')).toHaveStyle({
      width: 40,
      height: 40,
    });
  });
});
describe('Checkbox focus ring', () => {
  const renderFocused = async () => {
    await render(
      <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
    );
    await fireEvent(screen.getByRole('checkbox'), 'focus');
  };

  it('is not rendered until the checkbox is focused', async () => {
    await render(
      <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
    );

    expect(screen.queryByTestId('checkbox-focus-ring')).toBeNull();
  });

  it('stays hidden for pointer focus on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
    );
    await fireEvent(screen.getByRole('checkbox'), 'focus', {
      currentTarget: { matches: () => false },
    });

    expect(screen.queryByTestId('checkbox-focus-ring')).toBeNull();
  });

  it('is shown for keyboard focus on web', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    await render(
      <Checkbox status="unchecked" onPress={() => {}} testID="checkbox" />
    );
    await fireEvent(screen.getByRole('checkbox'), 'focus', {
      currentTarget: { matches: () => true },
    });

    expect(screen.getByTestId('checkbox-focus-ring')).toBeOnTheScreen();
  });

  it('clears the 40dp state layer by the 2dp outer offset', async () => {
    await renderFocused();

    // 40dp state layer + 2dp offset + 3dp border on each side.
    expect(screen.getByTestId('checkbox-focus-ring')).toHaveStyle({
      width: 50,
      height: 50,
      borderWidth: 3,
    });
  });
});

it('renders the focus ring outside the pressable so clipping cannot crop it', async () => {
  await render(
    <Checkbox
      status="checked"
      onPress={() => {}}
      aria-label="Notify me"
      testID="checkbox"
    />
  );
  await fireEvent(screen.getByRole('checkbox'), 'focus');

  // Android P+ forces `overflow: hidden` on the pressable for the foreground
  // ripple, so a ring nested inside it would be cropped.
  const pressable = screen.getByRole('checkbox');
  let node = screen.getByTestId('checkbox-focus-ring').parent;
  while (node) {
    expect(node).not.toBe(pressable);
    node = node.parent;
  }
});
