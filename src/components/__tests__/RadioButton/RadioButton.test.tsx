import { type GestureResponderEvent, Platform } from 'react-native';

import {
  afterEach,
  describe,
  expect,
  it,
  jest as mockJest,
} from '@jest/globals';
import { userEvent } from '@testing-library/react-native';
import { getAnimatedStyle } from 'react-native-reanimated';

import PaperProvider from '../../../core/PaperProvider';
import { fireEvent, render, screen } from '../../../test-utils';
import { LightTheme } from '../../../theme/schemes';
import { tokens } from '../../../theme/tokens';
import RadioButton from '../../RadioButton';
import type { Props as RadioButtonProps } from '../../RadioButton/RadioButton';
import { RadioButtonContext } from '../../RadioButton/RadioButtonGroup';

describe('RadioButton', () => {
  it('renders properly', async () => {
    const tree = (await render(<RadioButton value="first" />)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('provides a 48dp touch target in its layout', async () => {
    await render(<RadioButton value="first" />);

    expect(screen.getByRole('radio')).toHaveStyle({
      width: 48,
      height: 48,
      borderRadius: 24,
    });
  });

  it('preserves consumer layout styles on the touch target', async () => {
    await render(
      <RadioButton value="first" style={{ margin: 8, width: 56, height: 56 }} />
    );

    expect(screen.getByRole('radio')).toHaveStyle({
      margin: 8,
      width: 56,
      height: 56,
    });
  });

  it('announces status changes politely', async () => {
    await render(<RadioButton value="first" onPress={() => {}} />);

    expect(screen.getByRole('radio')).toHaveProp(
      'accessibilityLiveRegion',
      'polite'
    );
  });

  describe('when RadioButton is wrapped by RadioButtonContext.Provider', () => {
    it('renders properly', async () => {
      const tree = (
        await render(
          <RadioButtonContext.Provider
            value={{ value: 'first', onValueChange: () => {} }}
          >
            <RadioButton value="first" />
          </RadioButtonContext.Provider>
        )
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('RadioButton with custom testID', () => {
    it('renders properly', async () => {
      const tree = (
        await render(<RadioButton value="first" testID={'custom:testID'} />)
      ).toJSON();

      expect(tree).toMatchSnapshot();
    });
  });

  describe('press handling', () => {
    it('calls onPress when pressed', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      await render(<RadioButton value="first" onPress={onPress} />);

      await userEvent.press(screen.getByRole('radio'));

      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('is a disabled control and ignores presses when disabled', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      await render(<RadioButton value="first" disabled onPress={onPress} />);

      const radio = screen.getByRole('radio');

      expect(radio).toBeDisabled();

      await userEvent.press(radio);

      expect(onPress).not.toHaveBeenCalled();
    });

    it('calls onLongPress on a long press', async () => {
      const onLongPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      await render(<RadioButton value="first" onLongPress={onLongPress} />);

      await userEvent.longPress(screen.getByRole('radio'));

      expect(onLongPress).toHaveBeenCalledTimes(1);
    });

    it('keeps the same element when it gets disabled', async () => {
      const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
      const { rerender } = await render(
        <RadioButton value="first" onPress={onPress} />
      );

      const enabled = screen.getByRole('radio');

      // a disabled radio that switched element would drop focus and any state a
      // child holds, so `disabled` has to be what switches it off
      await rerender(<RadioButton value="first" disabled onPress={onPress} />);

      const disabled = screen.getByRole('radio');

      expect(disabled).toBeDisabled();
      expect(disabled).toBe(enabled);
    });
  });
});

describe('RadioButton state layer', () => {
  const { colors } = LightTheme;
  const { hovered, focused, pressed } = tokens.md.sys.state.opacity;

  const stateLayer = () => screen.getByTestId('radio-state-layer');
  const radio = () => screen.getByRole('radio');

  const renderRadio = (props: Partial<RadioButtonProps> = {}) =>
    render(
      <RadioButton
        value="first"
        status="unchecked"
        testID="radio"
        onPress={() => {}}
        {...props}
      />
    );

  it('is idle until the radio is interacted with', async () => {
    await renderRadio();

    expect(stateLayer()).toHaveStyle({ opacity: 0 });
  });

  it('is 40dp, not the 48dp touch target', async () => {
    await renderRadio();

    expect(stateLayer()).toHaveStyle({ width: 40, height: 40 });
  });

  it('tints hover with onSurface when unchecked', async () => {
    await renderRadio();

    await fireEvent(radio(), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: hovered,
    });
  });

  it('tints hover with primary when checked', async () => {
    await renderRadio({ status: 'checked' });

    await fireEvent(radio(), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.primary,
      opacity: hovered,
    });
  });

  it('tints focus the same way as hover', async () => {
    await renderRadio({ status: 'checked' });

    await fireEvent(radio(), 'focus');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.primary,
      opacity: focused,
    });
  });

  it('inverts the color on press, previewing the next state', async () => {
    await renderRadio();

    await fireEvent(radio(), 'pressIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.primary,
      opacity: pressed,
    });

    await fireEvent(radio(), 'hoverIn');
    await fireEvent(radio(), 'pressOut');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: hovered,
    });
  });

  it('stays on error for every interaction', async () => {
    await renderRadio({ status: 'checked', error: true });

    await fireEvent(radio(), 'hoverIn');
    expect(stateLayer()).toHaveStyle({ backgroundColor: colors.error });

    await fireEvent(radio(), 'focus');
    expect(stateLayer()).toHaveStyle({ backgroundColor: colors.error });
  });

  it('tints with a custom color instead of the token role', async () => {
    await renderRadio({ status: 'checked', color: 'teal' });

    await fireEvent(radio(), 'hoverIn');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: 'teal',
      opacity: hovered,
    });
  });

  it('stays idle on a disabled radio', async () => {
    await renderRadio({ disabled: true });

    await fireEvent(radio(), 'hoverIn');

    expect(stateLayer()).toHaveStyle({ opacity: 0 });
  });

  it('stays idle on a read-only radio', async () => {
    await renderRadio({ onPress: undefined });

    await fireEvent(radio(), 'hoverIn');

    expect(stateLayer()).toHaveStyle({ opacity: 0 });
  });

  it('fades out by opacity and keeps its color', async () => {
    await renderRadio();

    await fireEvent(radio(), 'hoverIn');
    await fireEvent(radio(), 'hoverOut');

    expect(stateLayer()).toHaveStyle({
      backgroundColor: colors.onSurface,
      opacity: 0,
    });
  });

  it('transitions opacity only', async () => {
    await renderRadio();

    // Interpolating a themed `PlatformColor` is not possible, so the layer
    // fades by opacity alone and its color is left to snap. Read the style off
    // the element rather than `toHaveStyle`, which only knows layout props.
    // `toHaveStyle` reads the props Reanimated leaves on the host node, which
    // drops CSS-transition-only keys -- `getAnimatedStyle` mirrors how
    // Surface.test.tsx asserts `transitionProperty` for the same reason.
    expect(getAnimatedStyle(stateLayer())).toMatchObject({
      transitionProperty: 'opacity',
    });
  });
});

describe('RadioButton with reduce motion', () => {
  it.each([
    { reduceMotion: 'off', duration: LightTheme.motion.duration.short2 },
    { reduceMotion: 'on', duration: 0 },
  ] as const)(
    'fades the state layer in $duration ms when reduceMotion is "$reduceMotion"',
    async ({ reduceMotion, duration }) => {
      await render(
        <PaperProvider reduceMotion={reduceMotion}>
          <RadioButton value="first" testID="radio" onPress={() => {}} />
        </PaperProvider>
      );

      expect(
        getAnimatedStyle(screen.getByTestId('radio-state-layer'))
      ).toMatchObject({ transitionDuration: duration });
    }
  );
});

describe('RadioButton Space key on web', () => {
  afterEach(() => {
    mockJest.restoreAllMocks();
  });

  it('presses the radio once on Space release', async () => {
    mockJest.replaceProperty(Platform, 'OS', 'web');
    const onPress = mockJest.fn<(e: GestureResponderEvent) => void>();
    const preventDefault = mockJest.fn();
    await render(<RadioButton value="first" onPress={onPress} />);
    const radio = screen.getByRole('radio');

    await fireEvent(radio, 'keyDown', {
      nativeEvent: { key: ' ' },
      preventDefault,
    });

    expect(preventDefault).toHaveBeenCalled();
    expect(onPress).not.toHaveBeenCalled();

    await fireEvent(radio, 'keyUp', {
      nativeEvent: { key: ' ' },
      preventDefault,
    });

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('selects its value in a group on Space release', async () => {
    mockJest.replaceProperty(Platform, 'OS', 'web');
    const onValueChange = mockJest.fn<(value: string) => void>();
    const space = { nativeEvent: { key: ' ' }, preventDefault: mockJest.fn() };
    await render(
      <RadioButton.Group value="first" onValueChange={onValueChange}>
        <RadioButton value="second" />
      </RadioButton.Group>
    );
    const radio = screen.getByRole('radio');

    await fireEvent(radio, 'keyDown', space);
    await fireEvent(radio, 'keyUp', space);

    expect(onValueChange).toHaveBeenCalledWith('second');
  });

  it('leaves Space to the page on a read-only radio', async () => {
    mockJest.replaceProperty(Platform, 'OS', 'web');
    const space = { nativeEvent: { key: ' ' }, preventDefault: mockJest.fn() };
    await render(<RadioButton value="first" />);
    const radio = screen.getByRole('radio');

    await fireEvent(radio, 'keyDown', space);
    await fireEvent(radio, 'keyUp', space);

    expect(space.preventDefault).not.toHaveBeenCalled();
  });
});

describe('RadioButton focus ring', () => {
  const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;
  const ringOutline = { outlineWidth: thickness, outlineOffset: outerOffset };

  const ring = () => screen.getByTestId('radio-focus-ring');
  const radio = () => screen.getByRole('radio');

  afterEach(() => {
    mockJest.restoreAllMocks();
  });

  it('draws an outward ring around the 20dp radio on keyboard focus', async () => {
    await render(
      <RadioButton value="first" testID="radio" onPress={() => {}} />
    );

    await fireEvent(radio(), 'focus');

    expect(ring()).toHaveStyle({ width: 20, height: 20, ...ringOutline });
    expect(radio()).not.toHaveStyle({ outlineWidth: thickness });
  });

  it('removes the ring on blur', async () => {
    await render(
      <RadioButton value="first" testID="radio" onPress={() => {}} />
    );

    await fireEvent(radio(), 'focus');
    await fireEvent(radio(), 'blur');

    expect(ring()).not.toHaveStyle({ outlineWidth: thickness });
  });

  it.each([
    ['disabled', { disabled: true, onPress: () => {} }],
    ['read only', {}],
  ])('draws no ring on a %s radio', async (_, props) => {
    await render(<RadioButton value="first" testID="radio" {...props} />);

    await fireEvent(radio(), 'focus');

    expect(ring()).not.toHaveStyle({ outlineWidth: thickness });
  });

  it('marks the ring for the shared stylesheet on web', async () => {
    mockJest.replaceProperty(Platform, 'OS', 'web');
    await render(
      <RadioButton value="first" testID="radio" onPress={() => {}} />
    );

    expect(ring()).toHaveProp('dataSet', { focusRingDescendant: 'outward' });
    expect(radio()).toHaveProp('dataSet', { focusRingTarget: 'true' });
  });
});
