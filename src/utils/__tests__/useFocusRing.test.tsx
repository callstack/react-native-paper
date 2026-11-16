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

import { ownFocusEvent, render, screen } from '../../test-utils';
import { tokens } from '../../theme/tokens';
import type { FocusRingPlacement, FocusRingScope } from '../useFocusRing';
import {
  buildFocusRingStylesheet,
  FocusRingColorContext,
  mergeDataSetProps,
  useFocusRing,
} from '../useFocusRing';

const focus = async (data: unknown = ownFocusEvent()) => {
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

  // `within` matches only a focused direct child, so a focused Button or
  // TextInput inside a pressable Card doesn't light the Card's ring as well.
  it('rings `self` via :focus-visible and `within` via a focused direct child, for both placements', () => {
    expect(css).toContain('[data-focus-ring="outward"]:focus-visible');
    expect(css).toContain('[data-focus-ring="inward"]:focus-visible');
    expect(css).toContain(
      '[data-focus-ring-within="outward"]:has(> :focus-visible)'
    );
    expect(css).toContain(
      '[data-focus-ring-within="inward"]:has(> :focus-visible)'
    );
    expect(css).not.toContain(':has(:focus-visible)');
  });

  // `:has()` only looks down from the ringed element, so a ring on a child of
  // the focused element needs its own rule, keyed off the focused ancestor.
  it('rings `descendant` from its focused ancestor, for both placements', () => {
    expect(css).toContain(
      '[data-focus-ring-target]:focus-visible [data-focus-ring-descendant="outward"]'
    );
    expect(css).toContain(
      '[data-focus-ring-target]:focus-visible [data-focus-ring-descendant="inward"]'
    );
  });

  // The `within` ring replaces the browser's outline on the focused child, but
  // only a browser that supports `:has()` draws it. One without keeps its own
  // outline, so the control still shows focus.
  it('hides the browser outline on a `within` target only where :has() works', () => {
    expect(css).toMatch(
      /@supports selector\(:has\(> :focus-visible\)\) \{\s*\[data-focus-ring-within\] > :focus \{\s*outline: none !important;\s*\}\s*\}/
    );
    // Nowhere else: the `descendant` target hides its outline inline.
    expect(css.match(/outline: none/g)).toHaveLength(1);
  });

  // The ring view often clips (FAB's clip view, a FAB.Menu item's pill), so a
  // browser without `:has()` draws its own outline inside the edge.
  it('insets the browser outline on a `within` target, outside the :has() check', () => {
    const { thickness } = tokens.md.sys.state.focusIndicator;

    expect(css).toMatch(
      new RegExp(
        `\\}\\n\\[data-focus-ring-within\\] > :focus \\{\\s*outline-offset: ${-thickness}px;\\s*\\}`
      )
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

describe('mergeDataSetProps', () => {
  it("keeps the caller's dataSet alongside the ring attribute", () => {
    expect(
      mergeDataSetProps(
        { dataSet: { qa: 'save' } },
        { dataSet: { focusRing: 'outward' } }
      )
    ).toEqual({ dataSet: { qa: 'save', focusRing: 'outward' } });
  });

  // With no ring attribute the caller's own spread already carries theirs.
  it('adds nothing when there is no ring attribute', () => {
    expect(mergeDataSetProps({ dataSet: { qa: 'save' } }, {})).toEqual({});
  });

  it('passes the ring attribute through when the caller has no dataSet', () => {
    expect(mergeDataSetProps({}, { dataSet: { focusRing: 'inward' } })).toEqual(
      { dataSet: { focusRing: 'inward' } }
    );
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

  // Native focus events bubble, so a focused Switch inside a List.Item, or a
  // TextInput tapped inside a pressable Card, reaches the container's onFocus
  // with the descendant as `target`.
  it('does not ring when focus bubbles up from a descendant', async () => {
    await render(<Probe />);

    await focus({
      nativeEvent: { target: 0 },
      target: {},
      currentTarget: {},
    });

    expect(screen.getByTestId('probe')).not.toHaveStyle({
      outlineWidth: thickness,
    });
  });

  // `fireEvent(element, 'focus')` without an event calls the handler with
  // nothing, as an app's own tests may do.
  it('rings when the focus handler gets no event', async () => {
    await render(<Probe />);

    await act(async () => {
      await fireEvent(screen.getByTestId('probe'), 'focus');
    });

    expect(screen.getByTestId('probe')).toHaveStyle({
      outlineWidth: thickness,
    });
  });

  it('takes its color from FocusRingColorContext when one is set', async () => {
    await render(
      <FocusRingColorContext.Provider value="seagreen">
        <Probe />
      </FocusRingColorContext.Provider>
    );

    await focus();

    expect(screen.getByTestId('probe')).toHaveStyle({
      outlineColor: 'seagreen',
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

  it('emits data-focus-ring-within for scope "within", and leaves the target element\'s own outline to the stylesheet', async () => {
    await render(<WebProbe placement="inward" scope="within" />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toEqual({
      focusRingWithin: 'inward',
    });
    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('target').props.style).toEqual([]);
  });

  it('marks the focused element and its ringed child for scope "descendant", and suppresses the target element\'s own outline', async () => {
    const DescendantProbe = () => {
      const { target, ring } = useFocusRing(
        false,
        'rebeccapurple',
        'outward',
        'descendant'
      );
      return (
        <View testID="target" style={target.style} {...target.dataSetProps}>
          <View testID="probe" style={ring.style} {...ring.dataSetProps} />
        </View>
      );
    };
    await render(<DescendantProbe />);

    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('target').props.dataSet).toEqual({
      focusRingTarget: 'true',
    });
    // eslint-disable-next-line no-restricted-syntax
    expect(screen.getByTestId('probe').props.dataSet).toEqual({
      focusRingDescendant: 'outward',
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

  it('takes the color variable from FocusRingColorContext when one is set', async () => {
    await render(
      <FocusRingColorContext.Provider value="seagreen">
        <WebProbe placement="outward" />
      </FocusRingColorContext.Provider>
    );

    expect(screen.getByTestId('probe')).toHaveStyle(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      { '--rnp-focus-ring-color': 'seagreen' } as unknown as ViewStyle
    );
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
