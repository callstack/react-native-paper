import React from 'react';
import {
  BackHandler as RNBackHandler,
  Dimensions,
  Text,
  View,
  Platform,
  Pressable,
} from 'react-native';
import type { ViewProps } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import {
  act,
  fireEvent,
  isHiddenFromAccessibility,
  userEvent,
} from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { render, screen } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import TooltipCompound from '../Tooltip';
import * as registry from '../Tooltip/registry';
import { releaseSingletonSlot, takeSingletonSlot } from '../Tooltip/registry';
import Tooltip, { type TooltipTriggerProps } from '../Tooltip/Tooltip';

const ViewPrototype: React.ComponentRef<typeof View> = View.prototype;

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const BackHandler = RNBackHandler as typeof RNBackHandler & {
  mockPressBack(): void;
  exitApp: jest.Mock<() => void>;
};

const initialDimensions = {
  window: Dimensions.get('window'),
  screen: Dimensions.get('screen'),
};

const changeScreenSize = async () => {
  await act(() => {
    Dimensions.set({
      window: { width: 400, height: 800, scale: 2, fontScale: 1 },
      screen: { width: 400, height: 800, scale: 2, fontScale: 1 },
    });
  });
};

afterEach(() => {
  Dimensions.set(initialDimensions);
});

// What react-native-web passes to pointer handlers for a mouse
const mousePointer = {
  nativeEvent: { pointerType: 'mouse', clientX: 0, clientY: 0 },
};

const DummyComponent = ({
  ref,
  ...props
}: ViewProps &
  TooltipTriggerProps & {
    ref?: React.RefObject<React.ComponentRef<typeof View> | null>;
  }) => (
  <View testID="trigger" {...props} ref={ref}>
    <Text>dummy component</Text>
  </View>
);

describe('Tooltip', () => {
  const getTrigger = () =>
    screen.getByTestId('trigger', { includeHiddenElements: true });

  const getTooltipContainer = () => screen.getByTestId('tooltip');

  // Advancing async lets the timer callbacks' state updates flush and re-render
  // (a sync `act` doesn't under the async renderer). Default to a large step
  // that drains every pending tooltip timer.
  const runTimers = async (ms = 1000) => {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(ms);
    });
  };

  const setup = async (
    propOverrides?: Partial<React.ComponentProps<typeof Tooltip>>,
    measure = {}
  ) => {
    const defaultProps = {
      children: (props: TooltipTriggerProps) => <DummyComponent {...props} />,
      title: 'some tooltip text',
      testID: 'tooltip',
      ...propOverrides,
    };

    const { x, y, width, height, pageX, pageY } = {
      x: 0,
      y: 0,
      width: 80,
      height: 50,
      pageX: 220,
      pageY: 200,
      ...measure,
    };

    jest
      .spyOn(ViewPrototype, 'measure')
      .mockImplementation((cb) => cb(x, y, width, height, pageX, pageY));

    const wrapper = await render(
      <PaperProvider>
        <Tooltip {...defaultProps} />
      </PaperProvider>
    );

    return { wrapper };
  };

  // `userEvent.setup()` coordinates the press gestures with the fake timers so
  // its `act()` scopes don't overlap the tooltip's own timer-driven updates
  // (overlapping act() calls corrupt the renderer across tests).
  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('Mobile', () => {
    beforeAll(() => {
      Platform.OS = 'android';
    });
    afterAll(() => {
      jest.clearAllMocks();
    });
    describe('screen size change', () => {
      it('hides the tooltip when the screen size changes', async () => {
        const {
          wrapper: { findByText, queryByText },
        } = await setup({ leaveTouchDelay: 5000 });

        await user.longPress(getTrigger());
        await findByText('some tooltip text');

        await changeScreenSize();
        await runTimers();

        expect(queryByText('some tooltip text')).toBeNull();
      });
    });

    describe('longPress', () => {
      it('stays open when the user presses the component again before it hides', async () => {
        const {
          wrapper: { getByText },
        } = await setup({ leaveTouchDelay: 2000 });

        const trigger = getTrigger();
        // The release schedules the hide, which pressing again cancels
        await user.longPress(trigger);
        await runTimers(500);
        await user.longPress(trigger);
        await runTimers(1500);

        expect(getByText('some tooltip text')).toBeOnTheScreen();
      });
    });

    describe('anchor that ignores the trigger props', () => {
      it('shows the tooltip on long press as the wrapper handles it', async () => {
        jest
          .spyOn(ViewPrototype, 'measure')
          .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

        // An anchor like `Avatar.Text` never receives the handlers, so the
        // wrapper has to keep handling the long press for it.
        const { findByText } = await render(
          <PaperProvider>
            <Tooltip title="some tooltip text" testID="tooltip">
              {() => (
                <View testID="trigger">
                  <Text>dummy component</Text>
                </View>
              )}
            </Tooltip>
          </PaperProvider>
        );

        await user.longPress(getTrigger());

        expect(await findByText('some tooltip text')).toBeTruthy();
      });
    });

    describe('consumer handlers', () => {
      it('forwards the gesture event to the onPress written by the consumer', async () => {
        const onPress = jest.fn();
        await setup({
          children: (props: TooltipTriggerProps) => (
            <Pressable {...props} onPress={onPress} testID="trigger">
              <Text>dummy component</Text>
            </Pressable>
          ),
        });

        // The trigger props are spread onto the consumer's element, so its own
        // handler runs with the real event instead of being called without one
        await user.press(getTrigger());

        expect(onPress).toHaveBeenCalledTimes(1);
        expect(onPress).toHaveBeenCalledWith(
          expect.objectContaining({ nativeEvent: expect.anything() })
        );
      });
    });

    describe('accessibility', () => {
      it('names the trigger with the title so it is announceable', async () => {
        await setup();

        expect(getTrigger()).toHaveAccessibleName('some tooltip text');

        await user.longPress(getTrigger());

        expect(getTooltipContainer()).toHaveProp('role', 'tooltip');
      });

      it("doesn't merge the trigger into its wrapper", async () => {
        await setup();

        expect(getTrigger().parent).toHaveProp('accessible', false);
      });

      it('keeps the label the consumer writes after the spread', async () => {
        await setup({
          children: (props: TooltipTriggerProps) => (
            <DummyComponent {...props} aria-label="Own label" />
          ),
        });

        expect(getTrigger()).toHaveAccessibleName('Own label');
      });
    });

    describe('pressOut', () => {
      it('hides the tooltip when the user stop pressing the component', async () => {
        const {
          wrapper: { queryByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 100 });

        // `longPress` includes the release (pressOut), which schedules the hide.
        await user.longPress(getTrigger());

        await findByText('some tooltip text');

        await runTimers(); // leaveTouchDelay → schedules the exit fade
        await runTimers();

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });
    });

    describe('MD3 styling', () => {
      it('renders an inverseSurface container with inverseOnSurface text', async () => {
        const {
          wrapper: { getByText, findByText },
        } = await setup();

        await user.longPress(getTrigger());

        await findByText('some tooltip text');

        expect(getTooltipContainer()).toHaveStyle({
          backgroundColor: LightTheme.colors.inverseSurface,
        });

        expect(getByText('some tooltip text')).toHaveStyle({
          color: LightTheme.colors.inverseOnSurface,
        });
      });
    });

    describe('fade animation', () => {
      it('stays mounted through the exit fade before unmounting', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ leaveTouchDelay: 0 });

        // `longPress` includes the release (pressOut), which schedules the hide.
        await user.longPress(getTrigger());

        await findByText('some tooltip text');

        await runTimers(0); // leaveTouchDelay (0) elapses → exit fade starts

        // Still mounted while fading out so the animation can play.
        expect(getByText('some tooltip text')).toBeTruthy();

        await runTimers(); // exit fade duration elapses → unmounts
        expect(queryByText('some tooltip text')).toBeNull();
      });
    });

    describe('Tooltip position', () => {
      const LAYOUT_WIDTH = 360;
      const LAYOUT_HEIGHT = 705;
      const TOOLTIP_WIDTH = 100;
      const TOOLTIP_HEIGHT = 100;

      beforeAll(() => {
        jest.spyOn(Dimensions, 'get').mockReturnValue({
          width: LAYOUT_WIDTH,
          height: LAYOUT_HEIGHT,
          scale: 2,
          fontScale: 2,
        });
      });

      describe('When it does not overflow', () => {
        it('centers the tooltip in the middle of the children component', async () => {
          const {
            wrapper: { findByText },
          } = await setup();

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 254, // pageY (200) + height (50) + ANCHOR_GAP (4)
          });
        });

        it('anchors the tooltip to the wrapper when the child is absolutely positioned', async () => {
          const {
            wrapper: { findByText },
          } = await setup({
            children: (props: TooltipTriggerProps) => (
              <DummyComponent
                {...props}
                style={{ position: 'absolute', left: 10, top: 20 }}
              />
            ),
          });

          await userEvent.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210,
            top: 254,
          });
        });
      });

      describe('When the locale is RTL', () => {
        it('mirrors the position to the trailing edge', async () => {
          jest
            .spyOn(ViewPrototype, 'measure')
            .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

          const { findByText } = await render(
            <PaperProvider direction="rtl">
              <Tooltip title="some tooltip text" testID="tooltip">
                {(props: TooltipTriggerProps) => <DummyComponent {...props} />}
              </Tooltip>
            </PaperProvider>
          );

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          // `measure` reports the physical left edge, while native resolves
          // `left` from the leading (right) edge in RTL, so what the tooltip
          // needs is its distance to the trailing edge.
          expect(getTooltipContainer()).toHaveStyle({
            left: 50, // LAYOUT_WIDTH (360) - TOOLTIP_WIDTH (100) - left (210)
            top: 254,
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 8, // Math.max(EDGE_MARGIN=8, pageX=0)
            top: 254,
          });
        });

        it('keeps a wide tooltip clear of the right edge', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageX: 60 });

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: { layout: { width: 320, height: TOOLTIP_HEIGHT } },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 32, // LAYOUT_WIDTH (360) - width (320) - EDGE_MARGIN (8)
            top: 254,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 252, // Math.min(950, LAYOUT_WIDTH(360) - TOOLTIP_WIDTH(100) - EDGE_MARGIN(8))
            top: 254,
          });
        });
      });

      describe('When it is too tall for either side', () => {
        it('keeps the tooltip on screen at the top edge', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageY: 60, height: 50 });

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: { layout: { width: TOOLTIP_WIDTH, height: 700 } },
          });

          expect(getTooltipContainer()).toHaveStyle({ top: 8 }); // EDGE_MARGIN
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await user.longPress(getTrigger());

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210,
            top: 496, // pageY (600) - ANCHOR_GAP (4) - TOOLTIP_HEIGHT (100): placed above the component
          });
        });

        it('snaps the tooltip position to the physical pixel grid', async () => {
          const {
            wrapper: { findByText },
          } = await setup(
            {},
            { pageX: 220.2, pageY: 600.2, width: 80, height: 50 }
          );

          await user.longPress(getTrigger());

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: 100.1, height: 100.1 },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210,
            top: 496,
          });
        });
      });
    });
  });

  describe('Web', () => {
    beforeAll(() => {
      Platform.OS = 'web';
    });

    describe('screen size change', () => {
      it('hides the tooltip when the screen size changes', async () => {
        const {
          wrapper: { findByText, queryByText },
        } = await setup();

        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
        await runTimers(500);
        await findByText('some tooltip text');

        await changeScreenSize();
        await runTimers();

        expect(queryByText('some tooltip text')).toBeNull();
      });
    });

    describe('hoverIn', () => {
      it('stays open when the pointer comes back before it hides', async () => {
        const {
          wrapper: { getByText },
        } = await setup({ enterTouchDelay: 100, leaveTouchDelay: 1000 });

        const trigger = getTrigger();
        await fireEvent(trigger, 'pointerEnter', mousePointer);
        await runTimers(100);
        await fireEvent(trigger, 'pointerLeave', mousePointer);
        await runTimers(500);
        await fireEvent(trigger, 'pointerEnter', mousePointer);
        await runTimers(800);

        expect(getByText('some tooltip text')).toBeOnTheScreen();
      });

      it('shows once when the pointer enters twice without leaving', async () => {
        const {
          wrapper: { queryByText },
        } = await setup({ enterTouchDelay: 500, leaveTouchDelay: 0 });

        const trigger = getTrigger();
        await fireEvent(trigger, 'pointerEnter', mousePointer);
        await runTimers(300);
        await fireEvent(trigger, 'pointerEnter', mousePointer);
        await act(async () => {
          await fireEvent(trigger, 'pointerLeave', mousePointer);
        });
        await runTimers();

        expect(queryByText('some tooltip text')).toBeNull();
      });
    });

    describe('hoverOut', () => {
      it('hides the tooltip when the user stops hovering the component', async () => {
        const {
          wrapper: { queryByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
        await runTimers(50);

        await findByText('some tooltip text');

        // Settle the pointer-leave in its own act() so its state update can't
        // escape act and corrupt the renderer, then drain the fade-out timers.
        await act(async () => {
          await fireEvent(getTrigger(), 'pointerLeave', mousePointer);
        });
        await runTimers(); // leaveTouchDelay → schedules the exit fade
        await runTimers();

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });
    });

    describe('click', () => {
      it('stays open when the hovered trigger is clicked', async () => {
        const {
          wrapper: { getByText },
        } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 0 });
        const trigger = getTrigger();

        await act(async () => {
          await fireEvent(trigger, 'pointerEnter', {
            nativeEvent: { pointerType: 'mouse' },
          });
        });
        await runTimers(0);
        await act(async () => {
          await fireEvent(trigger, 'pressOut');
        });
        await runTimers();

        expect(getByText('some tooltip text')).toBeOnTheScreen();
      });
    });

    describe('keyboard focus', () => {
      it('shows the tooltip on focus and hides it on blur', async () => {
        const {
          wrapper: { getByText, queryByText },
        } = await setup({ enterTouchDelay: 500, leaveTouchDelay: 0 });

        await act(async () => {
          await fireEvent(getTrigger(), 'focus');
        });
        expect(getByText('some tooltip text')).toBeOnTheScreen();

        await act(async () => {
          await fireEvent(getTrigger(), 'blur');
        });
        await runTimers(); // leaveTouchDelay → schedules the exit fade
        await runTimers();

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });

      it("doesn't show the tooltip for the focus a tap gives the trigger", async () => {
        const {
          wrapper: { queryByText },
        } = await setup();

        await act(async () => {
          await fireEvent(getTrigger(), 'pointerDown', {
            nativeEvent: { pointerType: 'touch' },
          });
          await fireEvent(getTrigger(), 'focus');
        });

        expect(queryByText('some tooltip text')).toBeNull();
      });

      it('hides the tooltip on Escape while the trigger keeps focus', async () => {
        const listeners: Array<
          (event: { key: string; defaultPrevented: boolean }) => void
        > = [];
        Reflect.defineProperty(globalThis, 'document', {
          value: {
            addEventListener: (
              type: string,
              listener: (event: {
                key: string;
                defaultPrevented: boolean;
              }) => void
            ) => {
              if (type === 'keydown') listeners.push(listener);
            },
            removeEventListener: () => {},
          },
          configurable: true,
          writable: true,
        });

        try {
          const {
            wrapper: { getByText, queryByText },
          } = await setup({ leaveTouchDelay: 0 });

          await act(async () => {
            await fireEvent(getTrigger(), 'focus');
          });
          expect(getByText('some tooltip text')).toBeOnTheScreen();

          await act(() => {
            listeners.forEach((listener) =>
              listener({ key: 'Escape', defaultPrevented: false })
            );
          });
          await runTimers();
          await runTimers();

          expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
        } finally {
          Reflect.deleteProperty(globalThis, 'document');
        }
      });
    });

    describe('accessibility', () => {
      it('describes the trigger with the tooltip so it is announced', async () => {
        await setup({ enterTouchDelay: 0 });

        await act(async () => {
          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
        });
        await runTimers(0);

        // The id comes from `useId`, so the link is checked by reading it back.
        // eslint-disable-next-line no-restricted-syntax -- cross-check the link
        const describedBy = getTrigger().props['aria-describedby'];

        expect(describedBy).toEqual(expect.any(String));
        expect(getTooltipContainer()).toHaveProp('nativeID', describedBy);
      });
    });

    describe('Tooltip position', () => {
      const LAYOUT_WIDTH = 360;
      const LAYOUT_HEIGHT = 705;
      const TOOLTIP_WIDTH = 100;
      const TOOLTIP_HEIGHT = 100;

      beforeAll(() => {
        jest.spyOn(Dimensions, 'get').mockReturnValue({
          width: LAYOUT_WIDTH,
          height: LAYOUT_HEIGHT,
          scale: 2,
          fontScale: 2,
        });
      });

      describe('When it does not overflow', () => {
        it('centers the tooltip in the middle of the children component', async () => {
          const {
            wrapper: { findByText },
          } = await setup();

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 254, // pageY (200) + height (50) + ANCHOR_GAP (4)
          });
        });
      });

      describe('When the locale is RTL', () => {
        it('offsets the tooltip from the trailing edge where RTL places it', async () => {
          jest
            .spyOn(ViewPrototype, 'measure')
            .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

          const { findByText } = await render(
            <PaperProvider direction="rtl">
              <Tooltip title="some tooltip text" testID="tooltip">
                {(props: TooltipTriggerProps) => <DummyComponent {...props} />}
              </Tooltip>
            </PaperProvider>
          );

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          // `left` is physical on web, but the tooltip starts at the right
          // edge in RTL, so it moves left by its distance to that edge
          expect(getTooltipContainer()).toHaveStyle({
            left: -50, // -(LAYOUT_WIDTH (360) - TOOLTIP_WIDTH (100) - left (210))
            top: 254,
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 8, // Math.max(EDGE_MARGIN=8, pageX=0)
            top: 254,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 252, // Math.min(950, LAYOUT_WIDTH(360) - TOOLTIP_WIDTH(100) - EDGE_MARGIN(8))
            top: 254,
          });
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer()).toHaveStyle({
            left: 210,
            top: 496, // pageY (600) - ANCHOR_GAP (4) - TOOLTIP_HEIGHT (100): placed above the component
          });
        });
      });

      describe('When the page is scrolled', () => {
        afterEach(() => {
          Reflect.deleteProperty(window, 'scrollY');
        });

        it('stays below the trigger and moves with the page', async () => {
          Reflect.defineProperty(window, 'scrollY', {
            value: 1000,
            configurable: true,
          });
          const {
            wrapper: { findByText },
          } = await setup();

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          // `measure` is relative to the viewport, the portal to the document
          expect(getTooltipContainer()).toHaveStyle({ top: 1254 });
        });
      });

      describe('When it is too tall for either side', () => {
        it('keeps the tooltip on screen at the top edge', async () => {
          const {
            wrapper: { findByText },
          } = await setup({}, { pageY: 60, height: 50 });

          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: { layout: { width: TOOLTIP_WIDTH, height: 700 } },
          });

          expect(getTooltipContainer()).toHaveStyle({ top: 8 }); // EDGE_MARGIN
        });
      });
    });
  });
});

describe('Tooltip.Rich', () => {
  const getTrigger = () => screen.getByTestId('trigger');

  // The backdrop is hidden from screen readers
  const getBackdrop = () =>
    screen.getByTestId('rich-backdrop', { includeHiddenElements: true });

  const runTimers = async (ms = 1000) => {
    await act(async () => {
      await jest.advanceTimersByTimeAsync(ms);
    });
  };

  let user: ReturnType<typeof userEvent.setup>;
  beforeEach(() => {
    user = userEvent.setup();
  });

  const setup = async (
    propOverrides?: Partial<React.ComponentProps<typeof TooltipCompound.Rich>>
  ) => {
    jest
      .spyOn(ViewPrototype, 'measure')
      .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

    const wrapper = await render(
      <PaperProvider>
        <TooltipCompound.Rich
          content="Body text"
          testID="rich-tooltip"
          overlayTestID="rich-backdrop"
          {...propOverrides}
        >
          {(props) => <DummyComponent {...props} />}
        </TooltipCompound.Rich>
      </PaperProvider>
    );

    return { wrapper };
  };

  describe('Mobile', () => {
    beforeAll(() => {
      Platform.OS = 'android';
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('toggles title, content and actions when the trigger is pressed', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({
        title: 'Heading',
        actions: () => <Text>Learn more</Text>,
      });

      expect(queryByText('Body text')).toBeNull();

      await user.press(getTrigger());

      expect(getByText('Heading')).toBeTruthy();
      expect(getByText('Body text')).toBeTruthy();
      expect(getByText('Learn more')).toBeTruthy();
      await user.press(getTrigger());
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('is a dialog named by its title when it has actions', async () => {
      await setup({
        title: 'Heading',
        actions: () => <Text>Learn more</Text>,
      });

      await user.press(getTrigger());

      const tooltip = screen.getByTestId('rich-tooltip');
      expect(tooltip).toHaveProp('role', 'dialog');
      expect(tooltip).toHaveAccessibleName('Heading');
    });

    it('is a dialog named by its content when it has actions but no title', async () => {
      await setup({ actions: () => <Text>Learn more</Text> });

      await user.press(getTrigger());

      const tooltip = screen.getByTestId('rich-tooltip');
      expect(tooltip).toHaveProp('role', 'dialog');
      expect(tooltip).toHaveAccessibleName('Body text');
    });

    it('renders a custom element as content', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ content: <Text>Custom node</Text> });

      await user.press(getTrigger());

      expect(getByText('Custom node')).toBeTruthy();
    });

    it('renders the title and content in the onSurfaceVariant color', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ title: 'Heading' });

      await user.press(getTrigger());

      expect(getByText('Heading')).toHaveStyle({
        color: LightTheme.colors.onSurfaceVariant,
      });
      expect(getByText('Body text')).toHaveStyle({
        color: LightTheme.colors.onSurfaceVariant,
      });
    });

    it('dismisses when the backdrop is pressed', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup();

      await user.press(getTrigger());
      expect(getByText('Body text')).toBeTruthy();

      await user.press(getBackdrop());
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('hides the backdrop from screen readers', async () => {
      await setup();

      await user.press(getTrigger());

      expect(isHiddenFromAccessibility(getBackdrop())).toBe(true);
    });

    it('describes the trigger with the title and content', async () => {
      await setup({ title: 'Heading' });

      expect(screen.getByHintText('Heading. Body text')).toBe(getTrigger());
    });

    it('opens another tooltip when the backdrop is pressed over its trigger', async () => {
      // Triggers register their page coordinates, which on Android differ from
      // the window coordinates, so `measureInWindow` reports a rect to ignore
      const measure = jest
        .spyOn(ViewPrototype, 'measure')
        .mockImplementation((cb) => cb(0, 0, 80, 50, 0, 0));
      jest
        .spyOn(ViewPrototype, 'measureInWindow')
        .mockImplementation((cb) => cb(200, 320, 80, 50));

      const { getAllByText, getByText, queryByText } = await render(
        <PaperProvider>
          <TooltipCompound.Rich
            content="First tooltip"
            overlayTestID="first-backdrop"
          >
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
          <TooltipCompound.Rich content="Second tooltip">
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
        </PaperProvider>
      );
      const [firstTrigger, secondTrigger] = getAllByText('dummy component');

      await user.press(firstTrigger);
      expect(getByText('First tooltip')).toBeTruthy();

      measure.mockImplementation((cb) => cb(0, 0, 80, 50, 200, 400));
      await fireEvent(secondTrigger, 'layout', {
        nativeEvent: { layout: { x: 0, y: 0, width: 80, height: 50 } },
      });

      // userEvent can't set where the press lands
      await fireEvent(
        screen.getByTestId('first-backdrop', { includeHiddenElements: true }),
        'press',
        { nativeEvent: { pageX: 240, pageY: 425 } }
      );
      await runTimers();

      expect(queryByText('First tooltip')).toBeNull();
      expect(getByText('Second tooltip')).toBeTruthy();
    });

    it('dismisses the open tooltip when another tooltip trigger is pressed', async () => {
      jest
        .spyOn(ViewPrototype, 'measure')
        .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));
      jest
        .spyOn(ViewPrototype, 'measureInWindow')
        .mockImplementation((cb) => cb(0, 0, 0, 0));

      const { getByText, queryByText } = await render(
        <PaperProvider>
          <TooltipCompound.Rich content="First tooltip">
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
          <TooltipCompound.Rich content="Second tooltip">
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
        </PaperProvider>
      );

      const [triggerA, triggerB] = screen.getAllByTestId('trigger');

      await user.press(triggerA);
      expect(getByText('First tooltip')).toBeTruthy();

      await user.press(triggerB);
      await runTimers();

      expect(queryByText('First tooltip')).toBeNull();
      expect(getByText('Second tooltip')).toBeTruthy();
    });

    it('leaves the back button to the screen', async () => {
      const {
        wrapper: { getByText },
      } = await setup();

      await user.press(getTrigger());
      expect(getByText('Body text')).toBeTruthy();

      await act(() => {
        BackHandler.mockPressBack();
      });
      await runTimers();

      expect(getByText('Body text')).toBeTruthy();
      expect(BackHandler.exitApp).toHaveBeenCalled();
    });

    it('closes on the screen reader escape gesture', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup();

      await user.press(getTrigger());
      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(
          screen.getByTestId('rich-tooltip'),
          'accessibilityEscape'
        );
      });
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('dismisses when an action calls dismiss', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({
        actions: ({ dismiss }) => <Text onPress={dismiss}>Learn more</Text>,
      });

      await user.press(getTrigger());
      expect(getByText('Body text')).toBeTruthy();

      await user.press(getByText('Learn more'));
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    describe('onDismiss', () => {
      it('does not fire when the tooltip opens', async () => {
        const onDismiss = jest.fn();
        const {
          wrapper: { getByText },
        } = await setup({ onDismiss });

        await user.press(getTrigger());

        expect(getByText('Body text')).toBeTruthy();
        expect(onDismiss).not.toHaveBeenCalled();
      });

      it('fires when an action calls dismiss', async () => {
        const onDismiss = jest.fn();
        const {
          wrapper: { getByText },
        } = await setup({
          onDismiss,
          actions: ({ dismiss }) => <Text onPress={dismiss}>Learn more</Text>,
        });

        await user.press(getTrigger());
        await user.press(getByText('Learn more'));
        await runTimers();

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });

      it('fires when the backdrop is pressed', async () => {
        const onDismiss = jest.fn();
        await setup({ onDismiss });

        await user.press(getTrigger());
        await user.press(getBackdrop());
        await runTimers();

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });

      it('fires once when the trigger is pressed again', async () => {
        const onDismiss = jest.fn();
        await setup({ onDismiss });

        await user.press(getTrigger());
        await user.press(getTrigger());
        await runTimers();

        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Web', () => {
    beforeAll(() => {
      Platform.OS = 'web';
    });
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('opens on hover after the enter delay', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({ enterTouchDelay: 100 });

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
      });
      expect(queryByText('Body text')).toBeNull(); // still within the delay

      await runTimers(100);

      expect(getByText('Body text')).toBeTruthy();
    });

    it('opens on keyboard focus and hides on blur', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({ leaveTouchDelay: 500 });

      // Focus shows the tooltip synchronously, so settle it in act() before
      // asserting (and so its update can't escape act and corrupt the renderer).
      await act(async () => {
        await fireEvent(getTrigger(), 'focus');
      });
      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(getTrigger(), 'blur');
      });
      await runTimers(500); // leave delay → hide intent
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('keeps the tooltip open while the pointer moves into it', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 500 });

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
      });
      await runTimers(0);
      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerLeave', mousePointer);
        await fireEvent(getByText('Body text'), 'pointerEnter', mousePointer);
      });
      await runTimers(500);

      expect(getByText('Body text')).toBeTruthy();
    });

    it('hides the tooltip after the pointer leaves it', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 500 });

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
      });
      await runTimers(0);

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerLeave', mousePointer);
        await fireEvent(getByText('Body text'), 'pointerEnter', mousePointer);
      });
      await runTimers(500);

      await act(async () => {
        await fireEvent(getByText('Body text'), 'pointerLeave', mousePointer);
      });
      await runTimers(500); // leave delay → hide intent
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('keeps the tooltip open when the hovered trigger is pressed', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 500 });

      const trigger = getTrigger();
      await act(async () => {
        await fireEvent(trigger, 'pointerEnter', mousePointer);
      });
      await runTimers(0);
      expect(getByText('Body text')).toBeTruthy();

      // The pointer never left the trigger, so the click must not close the
      // tooltip: nothing would bring it back until the pointer leaves first
      await user.press(trigger);
      await runTimers(); // exit fade -> would have unmounted a closed tooltip

      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(trigger, 'pointerLeave', mousePointer);
      });
      await runTimers(500); // leave delay -> hide intent
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('describes the trigger with the tooltip so it is announced', async () => {
      await setup({ enterTouchDelay: 0 });

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
      });
      await runTimers(0);

      // The trigger points at the text so it is announced on focus. The id
      // comes from `useId`, so the link is checked by reading it back.
      // eslint-disable-next-line no-restricted-syntax -- cross-check the link
      const describedBy = getTrigger().props['aria-describedby'];

      expect(screen.getByTestId('rich-tooltip')).toHaveProp('role', 'tooltip');
      expect(screen.getByText('Body text')).toHaveProp('nativeID', describedBy);
    });

    it('marks the trigger as opening a dialog when the tooltip has actions', async () => {
      await setup({
        title: 'Heading',
        actions: () => <Text>Learn more</Text>,
      });

      expect(getTrigger()).toHaveProp('aria-haspopup', 'dialog');
      expect(getTrigger()).toHaveProp('aria-expanded', false);

      await user.press(getTrigger());

      expect(getTrigger()).toHaveProp('aria-expanded', true);
      // Described by the title and content, without the action labels
      const trigger = getTrigger();
      // eslint-disable-next-line no-restricted-syntax -- cross-check the link
      const describedBy: string = trigger.props['aria-describedby'];
      const [titleRef, contentRef, ...rest] = describedBy.split(' ');

      expect(rest).toEqual([]);
      expect(screen.getByText('Heading')).toHaveProp('nativeID', titleRef);
      expect(screen.getByText('Body text')).toHaveProp('nativeID', contentRef);
    });

    it('moves focus into the actions on the down arrow without scrolling the page', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ actions: () => <Text>Learn more</Text> });
      const preventDefault = jest.fn();

      await act(async () => {
        await fireEvent(getTrigger(), 'keyDown', {
          nativeEvent: { key: 'ArrowDown' },
          preventDefault,
        });
      });

      expect(getByText('Learn more')).toBeTruthy();
      expect(preventDefault).toHaveBeenCalled();
    });

    it('opens on keyboard focus after a touch that turned into a scroll', async () => {
      const {
        wrapper: { getByText },
      } = await setup();

      await act(async () => {
        await fireEvent(getTrigger(), 'pointerDown', {
          nativeEvent: { pointerType: 'touch' },
        });
        await fireEvent(getTrigger(), 'pointerCancel');
        await fireEvent(getTrigger(), 'focus');
      });

      expect(getByText('Body text')).toBeTruthy();
    });

    it('opens on a tap that also focuses the trigger (touch web)', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup();
      const touchDown = async () => {
        await act(async () => {
          await fireEvent(getTrigger(), 'pointerDown', {
            nativeEvent: { pointerType: 'touch' },
          });
        });
      };

      // A tap focuses the trigger before the press, and only the press toggles
      await touchDown();
      await act(async () => {
        await fireEvent(getTrigger(), 'focus');
      });
      await user.press(getTrigger());
      await runTimers();

      expect(getByText('Body text')).toBeTruthy();

      await touchDown();
      await user.press(getTrigger());
      await runTimers();

      expect(queryByText('Body text')).toBeNull();
    });

    it('lets the down arrow scroll the page when the tooltip has no actions', async () => {
      const preventDefault = jest.fn();
      const {
        wrapper: { queryByText },
      } = await setup();

      await act(async () => {
        await fireEvent(getTrigger(), 'keyDown', {
          nativeEvent: { key: 'ArrowDown' },
          preventDefault,
        });
      });

      expect(preventDefault).not.toHaveBeenCalled();
      expect(queryByText('Body text')).toBeNull();
    });

    describe('Escape', () => {
      // The tooltip listens for Escape on the document, which the native test
      // renderer has none of: stand in just enough of it, and of the DOM
      // `contains` and `focus` of the tooltip and the trigger
      const listeners: Array<
        (event: { key?: string; defaultPrevented?: boolean }) => void
      > = [];
      let activeElement: unknown = null;
      const focus = jest.fn();

      const pressEscape = async () => {
        await act(() => {
          listeners.forEach((listener) =>
            listener({ key: 'Escape', defaultPrevented: false })
          );
        });
        await runTimers(); // hide intent
        await runTimers();
      };

      beforeEach(() => {
        listeners.length = 0;
        focus.mockClear();
        Reflect.defineProperty(globalThis, 'document', {
          value: {
            get activeElement() {
              return activeElement;
            },
            addEventListener: (
              type: string,
              listener: (event: {
                key?: string;
                defaultPrevented?: boolean;
              }) => void
            ) => {
              if (type === 'keydown') listeners.push(listener);
            },
            removeEventListener: (type: string) => {
              if (type === 'keydown') listeners.length = 0;
            },
          },
          configurable: true,
          writable: true,
        });
        // Views stand in for DOM elements: the trigger takes the focus it's
        // given, and nothing inside it is tabbable
        Reflect.defineProperty(globalThis, 'HTMLElement', {
          value: View,
          configurable: true,
        });
        Reflect.defineProperty(ViewPrototype, 'contains', {
          value(this: unknown, node: unknown) {
            return node === 'inside' || node === this;
          },
          configurable: true,
        });
        Reflect.defineProperty(ViewPrototype, 'querySelectorAll', {
          value: () => [],
          configurable: true,
        });
        focus.mockImplementation(function (this: unknown) {
          activeElement = this;
        });
        Reflect.defineProperty(ViewPrototype, 'focus', {
          value: focus,
          configurable: true,
        });
      });

      afterEach(() => {
        Reflect.deleteProperty(globalThis, 'document');
        Reflect.deleteProperty(globalThis, 'HTMLElement');
        Reflect.deleteProperty(ViewPrototype, 'contains');
        Reflect.deleteProperty(ViewPrototype, 'querySelectorAll');
        Reflect.deleteProperty(ViewPrototype, 'focus');
      });

      it('opens on the next focus when the trigger refuses the focus it returns', async () => {
        activeElement = 'inside';
        focus.mockImplementation(() => {});
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup();

        await act(async () => {
          await fireEvent(getTrigger(), 'focus');
        });
        await pressEscape();

        expect(queryByText('Body text')).toBeNull();

        await act(async () => {
          await fireEvent(getTrigger(), 'focus');
        });

        expect(getByText('Body text')).toBeTruthy();

        await unmount();
      });

      it('closes and returns focus to the trigger without reopening from it', async () => {
        activeElement = 'inside';
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup({ leaveTouchDelay: 500 });
        const trigger = getTrigger();

        await act(async () => {
          await fireEvent(trigger, 'focus');
        });
        expect(getByText('Body text')).toBeTruthy();

        // As in the browser, `focus()` fires the trigger's focus event right
        // away, which would open the tooltip again unless it's ignored
        focus.mockImplementation(function (this: unknown) {
          activeElement = this;
          // eslint-disable-next-line no-restricted-syntax -- the event a browser fires
          trigger.props.onFocus?.();
        });

        await pressEscape();
        await runTimers();

        expect(queryByText('Body text')).toBeNull();
        expect(focus).toHaveBeenCalled();

        // A focus after the pointer or focus has moved elsewhere works again.
        await act(async () => {
          await fireEvent(trigger, 'blur');
          await fireEvent(trigger, 'focus');
        });

        expect(getByText('Body text')).toBeTruthy();

        // Unmount while the stand-in is still in place: the effect cleanup
        // removes the Escape listener through it.
        await unmount();
      });

      it('returns focus to the trigger when an action closes the tooltip', async () => {
        activeElement = 'inside';
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup({
          actions: ({ dismiss }) => <Text onPress={dismiss}>Learn more</Text>,
        });

        await act(async () => {
          await fireEvent(getTrigger(), 'focus');
        });
        await user.press(getByText('Learn more'));
        await runTimers();

        expect(queryByText('Body text')).toBeNull();
        expect(focus).toHaveBeenCalled();

        await unmount();
      });

      it('stays open when the pointer leaves while focus is inside it', async () => {
        activeElement = 'inside';
        const {
          wrapper: { getByText, unmount },
        } = await setup({ leaveTouchDelay: 500 });

        await act(async () => {
          await fireEvent(getTrigger(), 'focus');
        });
        await act(async () => {
          await fireEvent(getByText('Body text'), 'pointerEnter', mousePointer);
          await fireEvent(getByText('Body text'), 'pointerLeave', mousePointer);
        });
        await runTimers(500); // leave delay → hide intent
        await runTimers();

        expect(getByText('Body text')).toBeTruthy();

        await unmount();
      });

      it('leaves focus that is outside the tooltip and the trigger alone', async () => {
        activeElement = 'elsewhere';
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup({ enterTouchDelay: 0 });

        await act(async () => {
          await fireEvent(getTrigger(), 'pointerEnter', mousePointer);
        });
        await runTimers(0);
        expect(getByText('Body text')).toBeTruthy();

        await pressEscape();

        expect(queryByText('Body text')).toBeNull();
        expect(focus).not.toHaveBeenCalled();

        await unmount();
      });
    });

    it('closes on a press outside the tooltip and the trigger', async () => {
      // A tap doesn't always focus the trigger (buttons in Safari), so blur
      // can't be relied on: the tooltip listens for presses on the document
      const listeners: Array<(event: { target: unknown }) => void> = [];
      Reflect.defineProperty(globalThis, 'document', {
        value: {
          addEventListener: (
            type: string,
            listener: (event: { target: unknown }) => void
          ) => {
            if (type === 'pointerdown') listeners.push(listener);
          },
          removeEventListener: (type: string) => {
            if (type === 'pointerdown') listeners.length = 0;
          },
        },
        configurable: true,
        writable: true,
      });

      // Stand-in for the DOM `contains` of the tooltip and the trigger
      Reflect.defineProperty(ViewPrototype, 'contains', {
        value: (node: unknown) => node === 'inside',
        configurable: true,
      });

      try {
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup();

        await user.press(getTrigger());
        expect(getByText('Body text')).toBeTruthy();

        await act(() => {
          listeners.forEach((listener) => listener({ target: 'inside' }));
        });
        await runTimers();

        expect(getByText('Body text')).toBeTruthy();

        await act(() => {
          listeners.forEach((listener) => listener({ target: null }));
        });
        await runTimers();

        expect(queryByText('Body text')).toBeNull();

        await unmount();
      } finally {
        Reflect.deleteProperty(globalThis, 'document');
        Reflect.deleteProperty(ViewPrototype, 'contains');
      }
    });
  });
});

describe('singleton slot', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('dismisses the tooltip holding the slot when another takes it', () => {
    const first = jest.fn();
    takeSingletonSlot(first);
    takeSingletonSlot(jest.fn());

    expect(first).toHaveBeenCalledTimes(1);
  });

  it('forgets a released tooltip', () => {
    const first = jest.fn();
    takeSingletonSlot(first);
    releaseSingletonSlot(first);
    takeSingletonSlot(jest.fn());

    expect(first).not.toHaveBeenCalled();
  });

  it("keeps the slot when a tooltip that doesn't hold it releases", () => {
    const first = jest.fn();
    const second = jest.fn();
    takeSingletonSlot(first);
    releaseSingletonSlot(second);
    takeSingletonSlot(jest.fn());

    expect(first).toHaveBeenCalledTimes(1);
  });

  type Trigger = (props: TooltipTriggerProps) => React.ReactElement;

  it.each<[string, (children: Trigger) => React.ReactElement]>([
    [
      'Tooltip',
      (children) => <Tooltip title="some tooltip text">{children}</Tooltip>,
    ],
    [
      'Tooltip.Rich',
      (children) => (
        <TooltipCompound.Rich content="some tooltip text">
          {children}
        </TooltipCompound.Rich>
      ),
    ],
  ])(
    '%s releases the slot it took when it unmounts',
    async (_, renderTooltip) => {
      jest.replaceProperty(Platform, 'OS', 'web');
      jest
        .spyOn(ViewPrototype, 'measure')
        .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));
      const take = jest.spyOn(registry, 'takeSingletonSlot');
      const release = jest.spyOn(registry, 'releaseSingletonSlot');

      const { unmount } = await render(
        <PaperProvider>
          {renderTooltip((props) => (
            <DummyComponent {...props} />
          ))}
        </PaperProvider>
      );

      await act(async () => {
        await fireEvent(
          screen.getByTestId('trigger', { includeHiddenElements: true }),
          'focus'
        );
      });

      expect(take).toHaveBeenCalledTimes(1);
      await act(() => unmount());

      expect(release).toHaveBeenCalledWith(take.mock.calls[0][0]);
    }
  );
});
