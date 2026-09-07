import { Platform, Text } from 'react-native';
import type { ViewStyle } from 'react-native';

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
// By extension: a bare import resolves to `.native` under the jest preset, so
// the web implementation would never be exercised.
import TouchableRipple from '../TouchableRipple/TouchableRipple.tsx';

// There is no DOM in this repo's Jest, so there is no real `:focus-visible` to
// fire - the mechanism is now the browser's, not this library's. These prove
// the wiring instead: the right `data-focus-ring[-within]` attribute and CSS
// colour variable land on the rendered element for a given `focusRing` prop.
// Real focus behaviour is a manual, browser-only check (see the PR
// description).
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

  it('emits data-focus-ring="outward" and the secondary colour by default', async () => {
    await renderRipple();

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('ripple').props.dataSet).toEqual({
      focusRing: 'outward',
    });
    expect(screen.getByTestId('ripple')).toHaveStyle(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      {
        ['--rnp-focus-ring-color']: 'rgba(98, 91, 113, 1)',
      } as unknown as ViewStyle
    );
  });

  it('emits data-focus-ring="inward" when asked', async () => {
    await renderRipple({ focusRing: 'inward' });

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('ripple').props.dataSet).toEqual({
      focusRing: 'inward',
    });
  });

  it('emits no attribute when the ring is turned off', async () => {
    await renderRipple({ focusRing: 'none' });

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('ripple').props.dataSet).toBeUndefined();
  });

  it('emits no attribute when disabled', async () => {
    await renderRipple({ disabled: true });

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('ripple').props.dataSet).toBeUndefined();
  });

  // Not reference equality: RN's own `Pressable` wraps the handler it is
  // given internally, on every platform, ring or no ring. What matters here
  // is that this library stops doing its own extra wrapping around it.
  it('still calls a caller onFocus and onBlur', async () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    await renderRipple({ onFocus, onBlur });

    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'focus');
    });
    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'blur');
    });

    expect(onFocus).toHaveBeenCalled();
    expect(onBlur).toHaveBeenCalled();
  });
});
