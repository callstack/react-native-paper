import React from 'react';
import { Dimensions, Text, View, Platform } from 'react-native';
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
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { render } from '../../test-utils';
import { LightTheme } from '../../theme/schemes';
import TooltipCompound from '../Tooltip';
import Tooltip, { type TooltipTriggerProps } from '../Tooltip/Tooltip';

const mockedRemoveEventListener = jest.fn();

jest.mock('../../utils/addEventListener', () => ({
  addEventListener: () => ({
    remove: mockedRemoveEventListener,
  }),
}));

const DummyComponent = ({
  ref,
  ...props
}: ViewProps &
  TooltipTriggerProps & {
    ref?: React.RefObject<View | null>;
  }) => (
  <View {...props} ref={ref}>
    <Text>dummy component</Text>
  </View>
);

describe('Tooltip', () => {
  const getTrigger = (
    getByText: Awaited<ReturnType<typeof render>>['getByText']
  ) => {
    const trigger = getByText('dummy component', {
      includeHiddenElements: true,
    }).parent;

    if (!trigger) {
      throw new Error('Expected Tooltip trigger wrapper');
    }

    return trigger;
  };

  const getTooltipContainer = (
    getByText: Awaited<ReturnType<typeof render>>['getByText']
  ) => {
    const container = getByText('some tooltip text').parent;

    if (!container) {
      throw new Error('Expected Tooltip container');
    }

    return container;
  };

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
      .spyOn(View.prototype, 'measure')
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
    describe('Unmount', () => {
      beforeAll(() => {
        jest.spyOn(global, 'clearTimeout');
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('removes hideTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = await setup({ enterTouchDelay: 5000 });

        await fireEvent(getTrigger(getByText), 'pressOut');

        await unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes Dimensions listener when the component unmount', async () => {
        const {
          wrapper: { getByText, findByText, unmount },
        } = await setup();

        await user.longPress(getTrigger(getByText));

        await findByText('some tooltip text');

        await unmount();

        expect(mockedRemoveEventListener).toHaveBeenCalled();
      });
    });

    describe('longPress', () => {
      beforeAll(() => {
        jest.spyOn(global, 'clearTimeout');
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('clears the hide timer when the user start pressing the component again', async () => {
        jest.spyOn(global, 'clearTimeout');

        const {
          wrapper: { getByText },
        } = await setup();

        const trigger = getTrigger(getByText);
        await user.longPress(trigger);
        await user.longPress(trigger);

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });
    });

    describe('anchor that ignores the trigger props', () => {
      it('shows the tooltip on long press as the wrapper handles it', async () => {
        jest
          .spyOn(View.prototype, 'measure')
          .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

        // An anchor like `Avatar.Text` never receives the handlers, so the
        // wrapper has to keep handling the long press for it.
        const { getByText, findByText } = await render(
          <PaperProvider>
            <Tooltip title="some tooltip text">
              {() => (
                <View>
                  <Text>dummy component</Text>
                </View>
              )}
            </Tooltip>
          </PaperProvider>
        );

        await user.longPress(getTrigger(getByText));

        expect(await findByText('some tooltip text')).toBeTruthy();
      });
    });

    describe('accessibility', () => {
      it('names the trigger with the title so it is announceable', async () => {
        const {
          wrapper: { getByText },
        } = await setup();

        expect(getTrigger(getByText)).toHaveAccessibleName('some tooltip text');

        await user.longPress(getTrigger(getByText));

        expect(getTooltipContainer(getByText)).toHaveProp('role', 'tooltip');
      });

      it('keeps the label the consumer writes after the spread', async () => {
        const {
          wrapper: { getByText },
        } = await setup({
          children: (props: TooltipTriggerProps) => (
            <DummyComponent {...props} aria-label="Own label" />
          ),
        });

        expect(getTrigger(getByText)).toHaveAccessibleName('Own label');
      });
    });

    describe('pressOut', () => {
      it('hides the tooltip when the user stop pressing the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 100 });

        // `longPress` includes the release (pressOut), which schedules the hide.
        await user.longPress(getTrigger(getByText));

        await findByText('some tooltip text');

        await runTimers(); // leaveTouchDelay → schedules the exit fade
        await runTimers(); // exit fade duration → unmounts

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });
    });

    describe('MD3 styling', () => {
      it('renders an inverseSurface container with inverseOnSurface text', async () => {
        const {
          wrapper: { getByText, findByText },
        } = await setup();

        await user.longPress(getTrigger(getByText));

        await findByText('some tooltip text');

        expect(getTooltipContainer(getByText)).toHaveStyle({
          backgroundColor: LightTheme.colors.inverseSurface,
        });

        // bodySmall (12sp) text in the inverseOnSurface role.
        expect(getByText('some tooltip text')).toHaveStyle({
          color: LightTheme.colors.inverseOnSurface,
          fontSize: 12,
        });
      });
    });

    describe('fade animation', () => {
      it('stays mounted through the exit fade before unmounting', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ leaveTouchDelay: 0 });

        // `longPress` includes the release (pressOut), which schedules the hide.
        await user.longPress(getTrigger(getByText));

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
            wrapper: { getByText, findByText },
          } = await setup();

          await user.longPress(getTrigger(getByText));

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 250, // pageY (200) + height (50)
          });
        });
      });

      describe('When the locale is RTL', () => {
        it('mirrors the position to the trailing edge', async () => {
          jest
            .spyOn(View.prototype, 'measure')
            .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));

          const { getByText, findByText } = await render(
            <PaperProvider direction="rtl">
              <Tooltip title="some tooltip text">
                {(props: TooltipTriggerProps) => <DummyComponent {...props} />}
              </Tooltip>
            </PaperProvider>
          );

          await user.longPress(getTrigger(getByText));

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          // `measure` reports the physical left edge, while native resolves
          // `left` from the leading (right) edge in RTL, so what the tooltip
          // needs is its distance to the trailing edge.
          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 50, // LAYOUT_WIDTH (360) - TOOLTIP_WIDTH (100) - left (210)
            top: 250,
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await user.longPress(getTrigger(getByText));

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 8, // Math.max(EDGE_MARGIN=8, pageX=0)
            top: 250,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await user.longPress(getTrigger(getByText));

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 252, // Math.min(950, LAYOUT_WIDTH(360) - TOOLTIP_WIDTH(100) - EDGE_MARGIN(8))
            top: 250,
          });
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await user.longPress(getTrigger(getByText));

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 210,
            top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
          });
        });

        it('snaps the tooltip position to the physical pixel grid', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup(
            {},
            { pageX: 220.2, pageY: 600.2, width: 80, height: 50 }
          );

          await user.longPress(getTrigger(getByText));

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: 100.1, height: 100.1 },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 210,
            top: 500,
          });
        });
      });
    });
  });

  describe('Web', () => {
    beforeAll(() => {
      Platform.OS = 'web';
    });

    describe('Unmount', () => {
      beforeAll(() => {
        jest.spyOn(global, 'clearTimeout');
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('removes showTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = await setup({ enterTouchDelay: 5000 });

        await fireEvent(getTrigger(getByText), 'pointerEnter');

        await unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes hideTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = await setup({ enterTouchDelay: 5000 });

        await fireEvent(getTrigger(getByText), 'pointerLeave');

        await unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes Dimensions listener when the component unmount', async () => {
        const {
          wrapper: { getByText, findByText, unmount },
        } = await setup();

        await fireEvent(getTrigger(getByText), 'pointerEnter');
        await runTimers(500);

        await findByText('some tooltip text');

        await unmount();

        expect(mockedRemoveEventListener).toHaveBeenCalled();
      });
    });

    describe('hoverIn', () => {
      beforeAll(() => {
        jest.spyOn(global, 'clearTimeout');
      });
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('clears the hide timer when the user start hovering the component again', async () => {
        jest.spyOn(global, 'clearTimeout');

        const {
          wrapper: { getByText },
        } = await setup();

        const trigger = getTrigger(getByText);
        await fireEvent(trigger, 'pointerEnter');
        await fireEvent(trigger, 'pointerLeave');
        await fireEvent(trigger, 'pointerEnter');

        expect(global.clearTimeout).toHaveBeenCalledTimes(2);
      });
    });

    describe('hoverOut', () => {
      it('hides the tooltip when the user stops hovering the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        await fireEvent(getTrigger(getByText), 'pointerEnter');
        await runTimers(50);

        await findByText('some tooltip text');

        // Settle the pointer-leave in its own act() so its state update can't
        // escape act and corrupt the renderer, then drain the fade-out timers.
        await act(async () => {
          await fireEvent(getTrigger(getByText), 'pointerLeave');
        });
        await runTimers(); // leaveTouchDelay → schedules the exit fade
        await runTimers(); // exit fade duration → unmounts

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });
    });

    describe('accessibility', () => {
      it('describes the trigger with the tooltip so it is announced', async () => {
        const {
          wrapper: { getByText },
        } = await setup({ enterTouchDelay: 0 });

        await act(async () => {
          await fireEvent(getTrigger(getByText), 'pointerEnter');
        });
        await runTimers(0);

        // The id comes from `useId`, so the link is checked by reading it back.
        // eslint-disable-next-line no-restricted-syntax -- cross-check the link
        const describedBy = getTrigger(getByText).props['aria-describedby'];

        expect(describedBy).toEqual(expect.any(String));
        expect(getTooltipContainer(getByText)).toHaveProp(
          'nativeID',
          describedBy
        );
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
            wrapper: { getByText, findByText },
          } = await setup();

          await fireEvent(getTrigger(getByText), 'pointerEnter');
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 250, // pageY (200) + height (50)
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await fireEvent(getTrigger(getByText), 'pointerEnter');
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 8, // Math.max(EDGE_MARGIN=8, pageX=0)
            top: 250,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await fireEvent(getTrigger(getByText), 'pointerEnter');
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 252, // Math.min(950, LAYOUT_WIDTH(360) - TOOLTIP_WIDTH(100) - EDGE_MARGIN(8))
            top: 250,
          });
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await fireEvent(getTrigger(getByText), 'pointerEnter');
          await runTimers(500);

          const tooltip = await findByText('some tooltip text');
          await fireEvent(tooltip, 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getTooltipContainer(getByText)).toHaveStyle({
            left: 210,
            top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
          });
        });
      });
    });
  });
});

describe('Tooltip.Rich', () => {
  const getTrigger = (
    getByText: Awaited<ReturnType<typeof render>>['getByText']
  ) => {
    const trigger = getByText('dummy component').parent;

    if (!trigger) {
      throw new Error('Expected Tooltip.Rich trigger');
    }

    return trigger;
  };

  const getSurface = (
    getByText: Awaited<ReturnType<typeof render>>['getByText']
  ) => {
    const surface = getByText('Body text').parent;

    if (!surface) {
      throw new Error('Expected Tooltip.Rich surface');
    }

    return surface;
  };

  const getTooltipElement = (
    getByText: Awaited<ReturnType<typeof render>>['getByText']
  ) => getSurface(getByText).parent?.parent;

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
      .spyOn(View.prototype, 'measure')
      .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));
    jest
      .spyOn(View.prototype, 'measureInWindow')
      .mockImplementation((cb) => cb(0, 0, 0, 0));

    const wrapper = await render(
      <PaperProvider>
        <TooltipCompound.Rich content="Body text" {...propOverrides}>
          {(props) => <DummyComponent {...props} />}
        </TooltipCompound.Rich>
      </PaperProvider>
    );

    return { wrapper };
  };

  it('is exposed as a compound component on Tooltip', () => {
    expect(TooltipCompound.Rich).toBeDefined();
  });

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

      await user.press(getTrigger(getByText));

      expect(getByText('Heading')).toBeTruthy();
      expect(getByText('Body text')).toBeTruthy();
      expect(getByText('Learn more')).toBeTruthy();
      // Pressing again toggles it back off.
      await user.press(getTrigger(getByText));
      await runTimers(); // exit fade → unmount

      expect(queryByText('Body text')).toBeNull();
    });

    it('renders a custom element as content', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ content: <Text>Custom node</Text> });

      await user.press(getTrigger(getByText));

      expect(getByText('Custom node')).toBeTruthy();
    });

    it('uses the surfaceContainer container with MD3 title/content roles', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ title: 'Heading' });

      await user.press(getTrigger(getByText));

      expect(getByText('Heading')).toHaveStyle({
        color: LightTheme.colors.onSurfaceVariant,
      });
      expect(getByText('Body text')).toHaveStyle({
        color: LightTheme.colors.onSurfaceVariant,
      });

      // Surface (container) uses the surfaceContainer color.
      expect(getSurface(getByText)).toHaveStyle({
        backgroundColor: LightTheme.colors.surfaceContainer,
      });
    });

    it('fades the Android shadow with the elevated surface', async () => {
      const {
        wrapper: { getByText },
      } = await setup();

      await user.press(getTrigger(getByText));
      await fireEvent(getByText('Body text'), 'layout', {
        nativeEvent: {
          layout: { width: 100, height: 100 },
        },
      });

      expect(getSurface(getByText)).toHaveStyle({
        elevation: 3,
        opacity: 1,
      });
    });

    it('dismisses when the backdrop is pressed', async () => {
      const {
        wrapper: { getByText, getByRole, queryByText },
      } = await setup();

      await user.press(getTrigger(getByText));
      expect(getByText('Body text')).toBeTruthy();

      await user.press(getByRole('button', { name: 'Close' }));
      await runTimers(); // exit fade → unmount

      expect(queryByText('Body text')).toBeNull();
    });

    it('names the trigger with the title and content', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ title: 'Heading' });

      expect(getTrigger(getByText)).toHaveAccessibleName('Heading. Body text');
    });

    it('registers the trigger with page coordinates', async () => {
      const {
        wrapper: { getByText },
      } = await setup();

      const measureInWindow = jest.spyOn(View.prototype, 'measureInWindow');

      await user.press(getTrigger(getByText));

      expect(measureInWindow).not.toHaveBeenCalled();
    });

    it('dismisses the open tooltip when another tooltip trigger is pressed', async () => {
      jest
        .spyOn(View.prototype, 'measure')
        .mockImplementation((cb) => cb(0, 0, 80, 50, 220, 200));
      jest
        .spyOn(View.prototype, 'measureInWindow')
        .mockImplementation((cb) => cb(0, 0, 0, 0));

      const { getAllByText, getByText, queryByText } = await render(
        <PaperProvider>
          <TooltipCompound.Rich content="First tooltip">
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
          <TooltipCompound.Rich content="Second tooltip">
            {(props) => <DummyComponent {...props} />}
          </TooltipCompound.Rich>
        </PaperProvider>
      );

      const [textA, textB] = getAllByText('dummy component');
      const triggerA = textA.parent;
      const triggerB = textB.parent;

      if (!triggerA || !triggerB) {
        throw new Error('Expected both Tooltip.Rich triggers');
      }

      await user.press(triggerA);
      expect(getByText('First tooltip')).toBeTruthy();

      await user.press(triggerB);
      await runTimers(); // exit fade → unmount

      expect(queryByText('First tooltip')).toBeNull();
      expect(getByText('Second tooltip')).toBeTruthy();
    });

    it('dismisses when an action calls dismiss', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({
        actions: ({ dismiss }) => <Text onPress={dismiss}>Learn more</Text>,
      });

      await user.press(getTrigger(getByText));
      expect(getByText('Body text')).toBeTruthy();

      await user.press(getByText('Learn more'));
      await runTimers(); // exit fade → unmount

      expect(queryByText('Body text')).toBeNull();
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
        await fireEvent(getTrigger(getByText), 'pointerEnter');
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
        await fireEvent(getTrigger(getByText), 'focus');
      });
      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(getTrigger(getByText), 'blur');
      });
      await runTimers(500); // leave delay → hide intent
      await runTimers(); // exit fade → unmount

      expect(queryByText('Body text')).toBeNull();
    });

    it('keeps the tooltip open while the pointer moves into it (gap bridge)', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 500 });

      await act(async () => {
        await fireEvent(getTrigger(getByText), 'pointerEnter');
      });
      await runTimers(0);
      expect(getByText('Body text')).toBeTruthy();

      // Leaving the trigger schedules a hide...
      await act(async () => {
        await fireEvent(getTrigger(getByText), 'pointerLeave');
        // ...but entering the tooltip cancels it.
        await fireEvent(getByText('Body text'), 'hoverIn');
      });
      await runTimers(500);

      expect(getByText('Body text')).toBeTruthy();
    });

    it('keeps the tooltip open when the hovered trigger is pressed', async () => {
      const {
        wrapper: { getByText, queryByText },
      } = await setup({ enterTouchDelay: 0, leaveTouchDelay: 500 });

      const trigger = getTrigger(getByText);
      await act(async () => {
        await fireEvent(trigger, 'pointerEnter');
      });
      await runTimers(0);
      expect(getByText('Body text')).toBeTruthy();

      // The pointer never left the trigger, so the click must not close the
      // tooltip: nothing would bring it back until the pointer leaves first
      await user.press(trigger);
      await runTimers(); // exit fade -> would have unmounted a closed tooltip

      expect(getByText('Body text')).toBeTruthy();

      await act(async () => {
        await fireEvent(trigger, 'pointerLeave');
      });
      await runTimers(500); // leave delay -> hide intent
      await runTimers(); // exit fade -> unmount

      expect(queryByText('Body text')).toBeNull();
    });

    it('describes the trigger with the tooltip so it is announced', async () => {
      const {
        wrapper: { getByText },
      } = await setup({ enterTouchDelay: 0 });

      await act(async () => {
        await fireEvent(getTrigger(getByText), 'pointerEnter');
      });
      await runTimers(0);

      // The tooltip element is what a screen reader reads and the trigger
      // points at it so it is announced on focus
      expect(getTrigger(getByText)).toHaveProp(
        'aria-describedby',
        expect.any(String)
      );
      expect(getTooltipElement(getByText)).toHaveProp('role', 'tooltip');
      expect(getTooltipElement(getByText)).toHaveProp(
        'nativeID',
        expect.any(String)
      );
    });

    it('closes on Escape without reopening from the focus it returns', async () => {
      // The tooltip listens for Escape on the document, which the native test
      // renderer has none of: stand in just enough of it to reach the listener
      const listeners: Array<(event: { key?: string }) => void> = [];
      Reflect.defineProperty(globalThis, 'document', {
        value: {
          addEventListener: (
            type: string,
            listener: (event: { key?: string }) => void
          ) => {
            if (type === 'keyup') listeners.push(listener);
          },
          removeEventListener: (type: string) => {
            if (type === 'keyup') listeners.length = 0;
          },
        },
        configurable: true,
        writable: true,
      });

      try {
        const {
          wrapper: { getByText, queryByText, unmount },
        } = await setup({ leaveTouchDelay: 500 });
        const trigger = getTrigger(getByText);

        await act(async () => {
          await fireEvent(trigger, 'focus');
        });
        expect(getByText('Body text')).toBeTruthy();

        await act(() => {
          listeners.forEach((listener) => listener({ key: 'Escape' }));
        });
        await runTimers(); // hide intent
        await runTimers(); // exit fade -> unmount

        expect(queryByText('Body text')).toBeNull();

        // Dismissing puts focus back on the trigger, whose `onFocus` opens the
        // tooltip again unless that one focus is ignored.
        await act(async () => {
          await fireEvent(trigger, 'focus');
        });
        await runTimers();

        expect(queryByText('Body text')).toBeNull();

        // A focus after the pointer or focus has moved elsewhere works again.
        await act(async () => {
          await fireEvent(trigger, 'blur');
          await fireEvent(trigger, 'focus');
        });

        expect(getByText('Body text')).toBeTruthy();

        // Unmount while the stand-in is still in place: the effect cleanup
        // removes the Escape listener through it.
        await unmount();
      } finally {
        Reflect.deleteProperty(globalThis, 'document');
      }
    });
  });
});
