import { Platform, Text } from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
// By extension: a bare import resolves to `.native` under the jest preset, so
// the web implementation would never be exercised.
import TouchableRipple from '../TouchableRipple/TouchableRipple.tsx';

const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

// react-native-web hands `onFocus` a real DOM node, and `isKeyboardFocusEvent`
// asks it whether it matches `:focus-visible`.
const keyboardFocus = { currentTarget: { matches: () => true } };
const pointerFocus = { currentTarget: { matches: () => false } };

const focus = async (data: unknown) => {
  await act(async () => {
    await fireEvent(screen.getByTestId('ripple'), 'focus', data);
  });
};

const renderRipple = (props = {}) =>
  render(
    <TouchableRipple testID="ripple" onPress={() => {}} {...props}>
      <Text>Button</Text>
    </TouchableRipple>
  );

describe('TouchableRipple focus ring (web implementation)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'web';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  it('rings on keyboard focus, in the theme secondary colour', async () => {
    await renderRipple();

    await focus(keyboardFocus);

    // colour matters: a ring the same colour as its surface is invisible
    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineWidth: thickness,
      outlineOffset: outerOffset,
      outlineStyle: 'solid',
      outlineColor: 'rgba(98, 91, 113, 1)',
    });
  });

  it('does not ring on a pointer focus', async () => {
    await renderRipple();

    await focus(pointerFocus);

    expect(screen.getByTestId('ripple')).not.toHaveStyle({
      outlineWidth: thickness,
    });
  });

  it('draws inward when asked', async () => {
    await renderRipple({ focusRing: 'inward' });

    await focus(keyboardFocus);

    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineOffset: -thickness,
    });
  });

  it('forwards onFocus and onBlur to the caller', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    await renderRipple({ onFocus, onBlur });

    await focus(keyboardFocus);
    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'blur');
    });

    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });
});
