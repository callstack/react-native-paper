import React, { RefObject } from 'react';
import { Dimensions, StyleSheet, Text, View, Platform } from 'react-native';

import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act, fireEvent, userEvent } from '@testing-library/react-native';

import PaperProvider from '../../core/PaperProvider';
import { getTheme } from '../../core/theming';
import { render } from '../../test-utils';
import Tooltip from '../Tooltip/Tooltip';

const mockedRemoveEventListener = jest.fn();

jest.mock('../../utils/addEventListener', () => ({
  addEventListener: () => ({
    remove: mockedRemoveEventListener,
  }),
}));

const DummyComponent = ({
  ref,
  ...props
}: ViewProps & {
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

  const runTimers = async (ms?: number) => {
    await act(() => {
      if (ms === undefined) {
        jest.runOnlyPendingTimers();
      } else {
        jest.advanceTimersByTime(ms);
      }
    });
  };

  const setup = async (
    propOverrides?: Partial<React.ComponentProps<typeof Tooltip>>,
    measure = {}
  ) => {
    const defaultProps = {
      children: <DummyComponent />,
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

        await userEvent.longPress(getTrigger(getByText));

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
        await userEvent.longPress(trigger);
        await userEvent.longPress(trigger);

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });
    });

    describe('pressOut', () => {
      it('hides the tooltip when the user stop pressing the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        await userEvent.longPress(getTrigger(getByText));

        await findByText('some tooltip text');

        await runTimers();

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
      });
    });

    describe('MD3 styling', () => {
      it('renders an inverseSurface container with inverseOnSurface text', async () => {
        const {
          wrapper: { getByText, getByTestId, findByText },
        } = setup();

        fireEvent(getTrigger(getByText), 'longPress');

        await findByText('some tooltip text');

        expect(getByTestId('tooltip-container').props.style).toMatchObject([
          {},
          { backgroundColor: getTheme().colors.inverseSurface },
        ]);

        // bodySmall (12sp) text in the inverseOnSurface role.
        expect(
          StyleSheet.flatten(getByText('some tooltip text').props.style)
        ).toMatchObject({
          color: getTheme().colors.inverseOnSurface,
          fontSize: 12,
        });
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
            wrapper: { getByText, getByTestId, findByText },
          } = await setup();

          await userEvent.longPress(getTrigger(getByText));

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 250, // pageY (200) + height (50)
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await userEvent.longPress(getTrigger(getByText));

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 0, // Tooltip renders starting from children's x coord
            top: 250,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await userEvent.longPress(getTrigger(getByText));

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 950, // pageX (900) + width (150) - 100 (TOOLTIP_WIDTH) // Tooltip is placed from right to left without going offscreen
            top: 250,
          });
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await userEvent.longPress(getTrigger(getByText));

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 210,
            top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
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

        await fireEvent(getTrigger(getByText), 'hoverIn');

        await unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes hideTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = await setup({ enterTouchDelay: 5000 });

        await fireEvent(getTrigger(getByText), 'hoverOut');

        await unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes Dimensions listener when the component unmount', async () => {
        const {
          wrapper: { getByText, findByText, unmount },
        } = await setup();

        await fireEvent(getTrigger(getByText), 'hoverIn');
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
        await fireEvent(trigger, 'hoverIn');
        await fireEvent(trigger, 'hoverOut');
        await fireEvent(trigger, 'hoverIn');

        expect(global.clearTimeout).toHaveBeenCalledTimes(2);
      });
    });

    describe('hoverOut', () => {
      it('hides the tooltip when the user stops hovering the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = await setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        await fireEvent(getTrigger(getByText), 'hoverIn');
        await runTimers(50);

        await findByText('some tooltip text');

        await fireEvent(getTrigger(getByText), 'hoverOut');
        await runTimers();

        expect(queryByText('some tooltip text')).not.toBeOnTheScreen();
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
            wrapper: { getByText, getByTestId, findByText },
          } = await setup();

          await fireEvent(getTrigger(getByText), 'hoverIn');
          await runTimers(500);

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
            top: 250, // pageY (200) + height (50)
          });
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          await fireEvent(getTrigger(getByText), 'hoverIn');
          await runTimers(500);

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 0, // Tooltip renders starting from children's x coord
            top: 250,
          });
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          await fireEvent(getTrigger(getByText), 'hoverIn');
          await runTimers(500);

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 950, // pageX (900) + width (150) - 100 (TOOLTIP_WIDTH) // Tooltip is placed from right to left without going offscreen
            top: 250,
          });
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = await setup({}, { pageY: 600, height: 50 });

          await fireEvent(getTrigger(getByText), 'hoverIn');
          await runTimers(500);

          await fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container')).toHaveStyle({
            left: 210,
            top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
          });
        });
      });
    });
  });
});
