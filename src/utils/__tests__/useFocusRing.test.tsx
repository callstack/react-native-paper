import { Platform, Pressable, Text, View } from 'react-native';
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
import { tokens } from '../../theme/tokens';
import type { FocusRingPlacement, FocusRingScope } from '../useFocusRing';
import { buildFocusRingStylesheet, useFocusRing } from '../useFocusRing';

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
  const { target, ring } = useFocusRing(disabled, 'rebeccapurple');
  onRender?.();
  return (
    <Pressable
      testID="probe"
      onPress={() => {}}
      onFocus={target.onFocus}
      onBlur={target.onBlur}
      style={ring.style}
    >
      <Text>probe</Text>
    </Pressable>
  );
};

describe('buildFocusRingStylesheet', () => {
  const css = buildFocusRingStylesheet();

  it('rings `self` via :focus-visible and `within` via :has(:focus-visible), for both placements', () => {
    expect(css).toContain('[data-focus-ring="outward"]:focus-visible');
    expect(css).toContain('[data-focus-ring="inward"]:focus-visible');
    expect(css).toContain(
      '[data-focus-ring-within="outward"]:has(:focus-visible)'
    );
    expect(css).toContain(
      '[data-focus-ring-within="inward"]:has(:focus-visible)'
    );
  });

  // Values must come from the design tokens, not be hardcoded here, or the
  // token is decorative. Derive the expectation from the token itself.
  it('takes its thickness and offsets from the focusIndicator tokens', () => {
    const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

    expect(css).toContain(`outline: ${thickness}px solid`);
    expect(css).toContain(`outline-offset: ${outerOffset}px;`);
    expect(css).toContain(`outline-offset: ${-thickness}px;`);
  });
});

describe('useFocusRing (native)', () => {
  // Derived from the token, not hardcoded - see the note on the stylesheet
  // test above.
  const { thickness, outerOffset } = tokens.md.sys.state.focusIndicator;

  it('applies the outline on focus and removes it on blur', async () => {
    await render(<Probe />);
    expect(screen.getByTestId('probe')).not.toHaveStyle({
      outlineWidth: thickness,
    });

    await focus();
    expect(screen.getByTestId('probe')).toHaveStyle({
      outlineWidth: thickness,
      outlineColor: 'rebeccapurple',
      outlineOffset: outerOffset,
    });

    await blur();
    expect(screen.getByTestId('probe')).not.toHaveStyle({
      outlineWidth: thickness,
    });
  });

  // `disabled` goes to the hook only, never to the Pressable: RNTL will not
  // dispatch to a disabled element, so that would pass for free.
  it('never rings a disabled control, even if a focus event arrives', async () => {
    await render(<Probe disabled />);

    await focus();

    expect(screen.getByTestId('probe')).not.toHaveStyle({
      outlineWidth: thickness,
    });
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
    expect(screen.getByTestId('probe')).toHaveStyle({
      outlineWidth: thickness,
    });

    await act(async () => {
      await rerender(<Probe disabled />);
    });
    await act(async () => {
      await rerender(<Probe />);
    });

    // no focus event happened in between, so nothing should be ringed
    expect(screen.getByTestId('probe')).not.toHaveStyle({
      outlineWidth: thickness,
    });
  });
});

// There is no DOM in this repo's Jest, so these can only prove the wiring -
// the right data attribute and CSS variable land on the right element. Real
// `:focus-visible`/`:has()` behaviour is a manual, browser-only check (see
// the PR description).
describe('useFocusRing (web)', () => {
  const original = Platform.OS;
  beforeEach(() => {
    Platform.OS = 'web';
  });
  afterEach(() => {
    Platform.OS = original;
  });

  const WebProbe = ({
    disabled,
    placement,
    scope,
  }: {
    disabled?: boolean;
    placement?: FocusRingPlacement;
    scope?: FocusRingScope;
  }) => {
    const { target, ring } = useFocusRing(
      disabled,
      'rebeccapurple',
      placement,
      scope
    );
    return (
      <View testID="probe" style={ring.style} {...ring.dataSetProps}>
        <View testID="target" style={target.style} />
      </View>
    );
  };

  it('emits data-focus-ring and the colour variable for scope "self"', async () => {
    await render(<WebProbe placement="outward" />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toEqual({
      focusRing: 'outward',
    });
    expect(screen.getByTestId('probe')).toHaveStyle(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      { '--rnp-focus-ring-color': 'rebeccapurple' } as unknown as ViewStyle
    );
  });

  it('emits data-focus-ring-within for scope "within", and suppresses the target element\'s own outline', async () => {
    await render(<WebProbe placement="inward" scope="within" />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toEqual({
      focusRingWithin: 'inward',
    });
    expect(screen.getByTestId('target')).toHaveStyle(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      { outline: 'none' } as unknown as ViewStyle
    );
  });

  it('does not suppress the target element\'s outline for scope "self"', async () => {
    await render(<WebProbe placement="outward" />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('target').props.style).toEqual([]);
  });

  it('emits nothing when disabled or when the ring is turned off', async () => {
    await render(<WebProbe placement="none" />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toBeUndefined();

    await render(<WebProbe placement="outward" disabled />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toBeUndefined();
  });
});
