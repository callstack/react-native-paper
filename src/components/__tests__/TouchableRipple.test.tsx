import * as React from 'react';
import { Platform, Text } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import { render, screen } from '../../test-utils';
import TouchableRipple from '../TouchableRipple/TouchableRipple.native';

describe('TouchableRipple', () => {
  it('renders children correctly', async () => {
    await render(
      <TouchableRipple>
        <Text>Button</Text>
      </TouchableRipple>
    );

    expect(screen.getByText('Button')).toBeOnTheScreen();
  });

  it('calls onPress when pressed', async () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
    await render(
      <TouchableRipple onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await userEvent.press(screen.getByText('Button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', async () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();
    await render(
      <TouchableRipple disabled onPress={onPress}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await userEvent.press(screen.getByText('Button'));

    expect(onPress).not.toHaveBeenCalled();
  });

  describe('on iOS', () => {
    Platform.OS = 'ios';

    it('displays the underlay when pressed', async () => {
      await render(
        <TouchableRipple testOnly_pressed>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toBeOnTheScreen();
    });

    it('renders custom underlay color', async () => {
      await render(
        <TouchableRipple testOnly_pressed underlayColor="purple">
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      const underlay = screen.getByTestId('touchable-ripple-underlay');
      expect(underlay).toHaveStyle({ backgroundColor: 'purple' });
    });

    it('takes the shape of the touchable so it does not square off the corners', async () => {
      await render(
        <TouchableRipple testOnly_pressed style={{ borderRadius: 4 }}>
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('touchable-ripple-underlay')).toHaveStyle({
        borderRadius: 4,
      });
    });

    it('takes per-corner radii too', async () => {
      await render(
        <TouchableRipple
          testOnly_pressed
          style={[{ borderTopLeftRadius: 8 }, { borderBottomRightRadius: 2 }]}
        >
          <Text>Press me!</Text>
        </TouchableRipple>
      );

      expect(screen.getByTestId('touchable-ripple-underlay')).toHaveStyle({
        borderTopLeftRadius: 8,
        borderBottomRightRadius: 2,
      });
    });
  });

  describe('minimum interactive size', () => {
    const layout = (width: number, height: number) => ({
      nativeEvent: { layout: { width, height, x: 0, y: 0 } },
    });

    // hitSlop has no user-visible effect here, the renderer does not lay views
    // out or hit-test them. Real behaviour is checked on device; this only stops
    // the props being dropped.
    /* eslint-disable no-restricted-syntax */
    const hitSlopOf = () => screen.getByTestId('touchable').props.hitSlop;
    const onLayoutOf = () => screen.getByTestId('touchable').props.onLayout;
    /* eslint-enable no-restricted-syntax */

    const renderTouchable = async (props = {}) => {
      await render(
        <TouchableRipple testID="touchable" onPress={() => {}} {...props}>
          <Text>Button</Text>
        </TouchableRipple>
      );
      return screen.getByTestId('touchable');
    };

    const fireLayout = async (width: number, height: number) => {
      await act(async () => {
        await fireEvent(
          screen.getByTestId('touchable'),
          'layout',
          layout(width, height)
        );
      });
    };

    it('expands a small target out to the minimum interactive size', async () => {
      await renderTouchable();
      expect(hitSlopOf()).toBeUndefined();

      await fireLayout(32, 32);

      // (48 - 32) / 2 on every side
      expect(hitSlopOf()).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    });

    it('expands each axis independently', async () => {
      await renderTouchable();

      await fireLayout(40, 100);

      expect(hitSlopOf()).toEqual({ top: 0, bottom: 0, left: 4, right: 4 });
    });

    it('leaves a target that is already big enough alone', async () => {
      await renderTouchable();

      await fireLayout(48, 48);

      expect(hitSlopOf()).toBeUndefined();
    });

    it('lets a caller-supplied hitSlop win', async () => {
      await renderTouchable({ hitSlop: 2 });

      await fireLayout(32, 32);

      expect(hitSlopOf()).toBe(2);
    });

    it('does not expand a touchable with no touch handlers', async () => {
      await render(
        <TouchableRipple testID="touchable">
          <Text>Not a control</Text>
        </TouchableRipple>
      );

      expect(hitSlopOf()).toBeUndefined();
    });

    // Measuring and applying are separate. RN emits onLayout on mount and on
    // layout change, so measuring only once interactive would mean no event ever
    // arrives and the target stays small.
    it('measures even while it cannot be pressed', async () => {
      await renderTouchable({ disabled: true });

      expect(onLayoutOf()).toEqual(expect.any(Function));
      expect(hitSlopOf()).toBeUndefined();
    });

    it('does not expand a disabled touchable', async () => {
      await renderTouchable({ disabled: true });

      await fireLayout(32, 32);

      expect(hitSlopOf()).toBeUndefined();
    });

    it('keeps the measurement across losing and regaining interactivity', async () => {
      const Harness = ({ disabled }: { disabled: boolean }) => (
        <TouchableRipple
          testID="touchable"
          disabled={disabled}
          onPress={() => {}}
        >
          <Text>Button</Text>
        </TouchableRipple>
      );
      const view = await render(<Harness disabled={false} />);
      const expanded = { top: 8, bottom: 8, left: 8, right: 8 };

      await fireLayout(32, 32);
      expect(hitSlopOf()).toEqual(expanded);

      await act(async () => {
        await view.rerender(<Harness disabled />);
      });
      expect(hitSlopOf()).toBeUndefined();

      // back again, with no second layout event to rely on
      await act(async () => {
        await view.rerender(<Harness disabled={false} />);
      });
      expect(hitSlopOf()).toEqual(expanded);
    });

    it('expands once a caller-supplied hitSlop is taken away', async () => {
      const Harness = ({ hitSlop }: { hitSlop?: number }) => (
        <TouchableRipple
          testID="touchable"
          hitSlop={hitSlop}
          onPress={() => {}}
        >
          <Text>Button</Text>
        </TouchableRipple>
      );
      const view = await render(<Harness hitSlop={2} />);

      await fireLayout(32, 32);
      expect(hitSlopOf()).toBe(2);

      // back to the default, with no second layout event to rely on
      await act(async () => {
        await view.rerender(<Harness />);
      });
      expect(hitSlopOf()).toEqual({ top: 8, bottom: 8, left: 8, right: 8 });
    });

    it('still calls a caller-supplied onLayout', async () => {
      const onLayout = jest.fn();
      await renderTouchable({ onLayout });

      await fireLayout(32, 32);

      expect(onLayout).toHaveBeenCalledTimes(1);
    });

    describe('render cost', () => {
      // TouchableRipple renders everywhere, so the cost of measuring is worth
      // pinning down.
      const withProfiler = async () => {
        const commits: string[] = [];
        await render(
          <React.Profiler
            id="tr"
            onRender={(_id, phase) => commits.push(phase)}
          >
            <TouchableRipple testID="touchable" onPress={() => {}}>
              <Text>Button</Text>
            </TouchableRipple>
          </React.Profiler>
        );
        return commits;
      };

      it('costs no extra render when the target is already big enough', async () => {
        const commits = await withProfiler();
        expect(commits).toEqual(['mount']);

        await fireLayout(56, 56);

        // the updater returned the identical value, so React bails out
        expect(commits).toEqual(['mount']);
      });

      it('costs one extra render when the target is too small', async () => {
        const commits = await withProfiler();

        await fireLayout(32, 32);

        expect(commits).toEqual(['mount', 'update']);
      });

      it('settles after a repeated layout at the same size', async () => {
        const commits = await withProfiler();

        await fireLayout(32, 32);
        await fireLayout(32, 32);
        await fireLayout(32, 32);

        // React renders once more before it can bail out on an unchanged value,
        // then stops. Three more layout events, one more render.
        expect(commits).toEqual(['mount', 'update', 'update']);
      });
    });
  });
});

describe('TouchableRipple focus ring', () => {
  const focus = async () => {
    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'focus');
    });
  };

  it('rings on keyboard focus and clears on blur', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineWidth: 3,
      outlineOffset: 2,
    });

    await act(async () => {
      await fireEvent(screen.getByTestId('ripple'), 'blur');
    });
    expect(screen.getByTestId('ripple')).not.toHaveStyle({ outlineWidth: 3 });
  });

  // Inward is opt-in, for controls a clipping ancestor would trim.
  it('draws the ring inward only when asked', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} focusRing="inward">
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).toHaveStyle({
      outlineWidth: 3,
      outlineOffset: -3,
    });
  });

  // The non-interactive case is covered in useFocusRing's own tests. It cannot
  // be asserted here: RNTL will not dispatch to a disabled element, so a
  // touchable with no press handler passes for free.
  it('does not ring when the ring is turned off', async () => {
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} focusRing="none">
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(screen.getByTestId('ripple')).not.toHaveStyle({ outlineWidth: 3 });
  });

  it('still calls a caller onFocus', async () => {
    const onFocus = jest.fn();
    await render(
      <TouchableRipple testID="ripple" onPress={() => {}} onFocus={onFocus}>
        <Text>Button</Text>
      </TouchableRipple>
    );

    await focus();
    expect(onFocus).toHaveBeenCalled();
  });
});
