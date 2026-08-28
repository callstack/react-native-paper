import { Platform, Pressable, Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import { getFocusRingStyle, useFocusRing } from '../useFocusRing';

const focus = async (data?: unknown) => {
  await act(async () => {
    await fireEvent(screen.getByTestId('probe'), 'focus', data);
  });
};

const blur = async () => {
  await act(async () => {
    await fireEvent(screen.getByTestId('probe'), 'blur');
  });
};

const Probe = ({
  disabled,
  onRender,
}: {
  disabled?: boolean;
  onRender?: () => void;
}) => {
  const { focused, onFocus, onBlur } = useFocusRing(disabled);
  onRender?.();
  return (
    <Pressable
      testID="probe"
      onPress={() => {}}
      onFocus={onFocus}
      onBlur={onBlur}
      style={getFocusRingStyle(focused, 'rebeccapurple')}
    >
      <Text>probe</Text>
    </Pressable>
  );
};

describe('getFocusRingStyle', () => {
  it('returns nothing when not focused', () => {
    expect(getFocusRingStyle(false, 'rebeccapurple')).toBeNull();
  });

  // Values must come from the design tokens, not be hardcoded here, or the
  // token is decorative. Derive the expectation from the token itself.
  it('takes its thickness and offset from the focusIndicator tokens', () => {
    const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

    expect(getFocusRingStyle(true, 'rebeccapurple')).toEqual({
      outlineWidth: thickness,
      outlineColor: 'rebeccapurple',
      outlineStyle: 'solid',
      outlineOffset: outerOffset,
    });
    expect(getFocusRingStyle(true, 'rebeccapurple', 'inward')).toEqual({
      outlineWidth: thickness,
      outlineColor: 'rebeccapurple',
      outlineStyle: 'solid',
      outlineOffset: -thickness,
    });
  });
});

describe('useFocusRing', () => {
  it('applies the outline on focus and removes it on blur', async () => {
    await render(<Probe />);
    expect(screen.getByTestId('probe')).not.toHaveStyle({ outlineWidth: 3 });

    await focus();
    expect(screen.getByTestId('probe')).toHaveStyle({
      outlineWidth: 3,
      outlineColor: 'rebeccapurple',
      outlineOffset: 2,
    });

    await blur();
    expect(screen.getByTestId('probe')).not.toHaveStyle({ outlineWidth: 3 });
  });

  // `disabled` goes to the hook only, never to the Pressable: RNTL will not
  // dispatch to a disabled element, so that would pass for free.
  it('never rings a disabled control, even if a focus event arrives', async () => {
    await render(<Probe disabled />);

    await focus();

    expect(screen.getByTestId('probe')).not.toHaveStyle({ outlineWidth: 3 });
  });

  it('ignores a non-keyboard focus event on web, so a mouse click does not ring', async () => {
    const original = Platform.OS;
    Platform.OS = 'web';
    try {
      await render(<Probe />);

      await focus({ currentTarget: { matches: () => false } });

      expect(screen.getByTestId('probe')).not.toHaveStyle({ outlineWidth: 3 });
    } finally {
      Platform.OS = original;
    }
  });

  // The gate has to skip the state update, not just mask the result, or a
  // suppressed ring still costs a render on the library's hottest primitive.
  it('costs no re-render when the ring is suppressed', async () => {
    const onRender = jest.fn();
    await render(<Probe disabled onRender={onRender} />);
    const before = onRender.mock.calls.length;

    await focus();

    expect(onRender.mock.calls.length).toBe(before);
  });

  it('does not restore the ring when a control is re-enabled', async () => {
    const { rerender } = await render(<Probe />);
    await focus();
    expect(screen.getByTestId('probe')).toHaveStyle({ outlineWidth: 3 });

    await act(async () => {
      await rerender(<Probe disabled />);
    });
    await act(async () => {
      await rerender(<Probe />);
    });

    // no focus event happened in between, so nothing should be ringed
    expect(screen.getByTestId('probe')).not.toHaveStyle({ outlineWidth: 3 });
  });
});
