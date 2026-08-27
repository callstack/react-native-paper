import { Text } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../test-utils';
import type TouchableRippleType from '../TouchableRipple/TouchableRipple';

// The web variant, required with its extension on purpose. A bare specifier
// resolves to `TouchableRipple.native.tsx` under the jest preset, so importing
// it the normal way silently tests the native file and none of this runs.
//
// The preset sets `Platform.OS` to 'ios' and there is no DOM, so this renders the
// web source on the native renderer. It pins props and element order, nothing
// more. Hit testing, stacking order, computed styles and clipping ancestors have
// to be checked in a browser. Pressing here would throw, `handlePressIn` reaches
// for `window`.
const TouchableRipple: typeof TouchableRippleType =
  require('../TouchableRipple/TouchableRipple.tsx').default;

const TARGET = 'touchable-ripple-touch-target';

// The target is `aria-hidden`, the button already carries the semantics. Testing
// library skips hidden elements, so queries have to opt in or they find nothing
// and the negative cases pass for free.
const HIDDEN = { includeHiddenElements: true } as const;

describe('TouchableRipple (web)', () => {
  // The target is invisible by design, so there is no user-visible assertion to
  // make about it. Its style is the behaviour.
  const styleOf = (testID: string) => {
    // eslint-disable-next-line no-restricted-syntax
    const { style } = screen.getByTestId(testID, HIDDEN).props;
    return Array.isArray(style) ? Object.assign({}, ...style.flat()) : style;
  };

  it('renders a minimum sized touch target for an interactive touchable', async () => {
    await render(
      <TouchableRipple onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByTestId(TARGET, HIDDEN)).toBeOnTheScreen();
    expect(styleOf(TARGET)).toMatchObject({
      position: 'absolute',
      minWidth: 48,
      minHeight: 48,
      width: '100%',
      height: '100%',
    });
  });

  it('renders the touch target before the children so it cannot cover them', async () => {
    // It hit-tests, so as the last sibling it covers anything interactive inside
    // the touchable, e.g. a pressable List.Item with a control in `right`.
    await render(
      <TouchableRipple onPress={() => {}}>
        <Text>child-marker</Text>
      </TouchableRipple>
    );

    const tree = JSON.stringify(screen.toJSON());

    expect(tree.indexOf(TARGET)).toBeGreaterThan(-1);
    expect(tree.indexOf(TARGET)).toBeLessThan(tree.indexOf('child-marker'));
  });

  it('does not render a touch target when there are no touch handlers', async () => {
    await render(
      <TouchableRipple>
        <Text>Not a control</Text>
      </TouchableRipple>
    );

    expect(screen.queryByTestId(TARGET, HIDDEN)).not.toBeOnTheScreen();
  });

  it('does not render a touch target when disabled', async () => {
    await render(
      <TouchableRipple disabled onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.queryByTestId(TARGET, HIDDEN)).not.toBeOnTheScreen();
  });

  it('lets a caller-supplied hitSlop size the target instead', async () => {
    await render(
      <TouchableRipple hitSlop={6} onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(styleOf(TARGET)).toEqual({
      position: 'absolute',
      top: -6,
      bottom: -6,
      left: -6,
      right: -6,
    });
  });

  it('accepts a per-edge hitSlop', async () => {
    await render(
      <TouchableRipple hitSlop={{ top: 4, left: 8 }} onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(styleOf(TARGET)).toEqual({
      position: 'absolute',
      top: -4,
      bottom: -0,
      left: -8,
      right: -0,
    });
  });

  it('no longer clips the touchable itself, which would clip the target', async () => {
    await render(
      <TouchableRipple borderless onPress={() => {}} testID="touchable">
        <Text>Button</Text>
      </TouchableRipple>
    );

    const style = styleOf('touchable');

    // check we have the touchable's own style first, or the absence below passes
    // against any empty object
    expect(style).toMatchObject({ position: 'relative' });
    expect(style.overflow).toBeUndefined();
  });
});
