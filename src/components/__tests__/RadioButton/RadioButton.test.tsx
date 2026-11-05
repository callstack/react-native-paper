import { describe, expect, it } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';

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
});

describe('RadioButton state layer', () => {
  const { colors } = LightTheme;
  const { hovered, focused, pressed } = tokens.md.sys.state.opacity;

  const stateLayer = () => screen.getByTestId('radio-state-layer');
  const radio = () => screen.getByRole('radio');

  const renderRadio = (props: Partial<RadioButtonProps> = {}) =>
    render(
      <RadioButton value="first" status="unchecked" testID="radio" {...props} />
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
