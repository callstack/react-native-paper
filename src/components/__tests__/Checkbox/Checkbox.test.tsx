import { PlatformColor } from 'react-native';

import { describe, expect, it } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';

import { defaultThemes } from '../../../core/theming';
import { fireEvent, render, screen } from '../../../test-utils';
import { tokens } from '../../../theme/tokens';
import Checkbox from '../../Checkbox';
import type { Props as CheckboxProps } from '../../Checkbox/Checkbox';

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
