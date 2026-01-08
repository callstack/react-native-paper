import React, { RefObject } from 'react';
import { Dimensions, Text, View, Platform } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import PaperProvider from '../../core/PaperProvider';
import Tooltip from '../Tooltip/Tooltip';

const mockedRemoveEventListener = jest.fn();

jest.mock('../../utils/addEventListener', () => ({
  addEventListener: () => ({
    remove: mockedRemoveEventListener,
  }),
}));

const DummyComponent = React.forwardRef<View>((props, ref) => (
  <View {...props} ref={ref as RefObject<View>}>
    <Text>dummy component</Text>
  </View>
));

describe('Tooltip', () => {
  const getTrigger = (getByText: (text: string) => ReactTestInstance) =>
    getByText('dummy component').parent as ReactTestInstance;

  const runTimers = (ms?: number) => {
    act(() => {
      if (ms === undefined) {
        jest.runOnlyPendingTimers();
      } else {
        jest.advanceTimersByTime(ms);
      }
    });
  };

  const setup = (
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

    const wrapper = render(
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
      beforeAll(() => jest.spyOn(global, 'clearTimeout'));
      afterEach(() => jest.clearAllMocks());

      it('removes hideTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = setup({ enterTouchDelay: 5000 });

        fireEvent(getTrigger(getByText), 'pressOut');

        unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes Dimensions listener when the component unmount', async () => {
        const {
          wrapper: { getByText, findByText, unmount },
        } = setup();

        fireEvent(getTrigger(getByText), 'longPress');

        await findByText('some tooltip text');

        unmount();

        expect(mockedRemoveEventListener).toHaveBeenCalled();
      });
    });

    describe('longPress', () => {
      beforeAll(() => jest.spyOn(global, 'clearTimeout'));
      afterEach(() => jest.clearAllMocks());

      it('clears the hide timer when the user start pressing the component again', () => {
        jest.spyOn(global, 'clearTimeout');

        const {
          wrapper: { getByText },
        } = setup();

        const trigger = getTrigger(getByText);
        fireEvent(trigger, 'longPress');
        fireEvent(trigger, 'pressOut');
        fireEvent(trigger, 'longPress');

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });
    });

    describe('pressOut', () => {
      // eslint-disable-next-line jest/valid-title
      it('hides the tooltip when the user stop pressing the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        fireEvent(getTrigger(getByText), 'longPress');

        await findByText('some tooltip text');

        fireEvent(getTrigger(getByText), 'pressOut');
        runTimers();

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
            wrapper: { getByText, getByTestId, findByText },
          } = setup();

          fireEvent(getTrigger(getByText), 'longPress');

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
              top: 250, // pageY (200) + height (50)
            },
          ]);
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          fireEvent(getTrigger(getByText), 'longPress');

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 0, // Tooltip renders starting from children's x coord
              top: 250,
            },
          ]);
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          fireEvent(getTrigger(getByText), 'longPress');

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 950, // pageX (900) + width (150) - 100 (TOOLTIP_WIDTH) // Tooltip is placed from right to left without going offscreen
              top: 250,
            },
          ]);
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageY: 600, height: 50 });

          fireEvent(getTrigger(getByText), 'longPress');

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 210,
              top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
            },
          ]);
        });
      });
    });
  });

  describe('Web', () => {
    beforeAll(() => {
      Platform.OS = 'web';
    });
    describe('Unmount', () => {
      beforeAll(() => jest.spyOn(global, 'clearTimeout'));
      afterEach(() => jest.clearAllMocks());

      it('removes showTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = setup({ enterTouchDelay: 5000 });

        fireEvent(getTrigger(getByText), 'hoverIn');

        unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes hideTooltipTimer when the component unmounts', async () => {
        const {
          wrapper: { getByText, unmount },
        } = setup({ enterTouchDelay: 5000 });

        fireEvent(getTrigger(getByText), 'hoverOut');

        unmount();

        expect(global.clearTimeout).toHaveBeenCalledTimes(1);
      });

      it('removes Dimensions listener when the component unmount', async () => {
        const {
          wrapper: { getByText, findByText, unmount },
        } = setup();

        fireEvent(getTrigger(getByText), 'hoverIn');
        runTimers(500);

        await findByText('some tooltip text');

        unmount();

        expect(mockedRemoveEventListener).toHaveBeenCalled();
      });
    });

    describe('hoverIn', () => {
      beforeAll(() => jest.spyOn(global, 'clearTimeout'));
      afterEach(() => jest.clearAllMocks());

      it('clears the hide timer when the user start hovering the component again', () => {
        jest.spyOn(global, 'clearTimeout');

        const {
          wrapper: { getByText },
        } = setup();

        const trigger = getTrigger(getByText);
        fireEvent(trigger, 'hoverIn');
        fireEvent(trigger, 'hoverOut');
        fireEvent(trigger, 'hoverIn');

        expect(global.clearTimeout).toHaveBeenCalledTimes(2);
      });
    });

    describe('hoverOut', () => {
      // eslint-disable-next-line jest/valid-title
      it('hides the tooltip when the user stops hovering the component', async () => {
        const {
          wrapper: { queryByText, getByText, findByText },
        } = setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

        fireEvent(getTrigger(getByText), 'hoverIn');
        runTimers(50);

        await findByText('some tooltip text');

        fireEvent(getTrigger(getByText), 'hoverOut');
        runTimers();

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
            wrapper: { getByText, getByTestId, findByText },
          } = setup();

          fireEvent(getTrigger(getByText), 'hoverIn');
          runTimers(500);

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 210, // pageX (220) + (width (80) - TOOLTIP_WIDTH (100)) / 2 = 210
              top: 250, // pageY (200) + height (50)
            },
          ]);
        });
      });

      describe('When it overflows to left', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageX: 0 }); // Component starting at the starting 0 X coord

          fireEvent(getTrigger(getByText), 'hoverIn');
          runTimers(500);

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 0, // Tooltip renders starting from children's x coord
              top: 250,
            },
          ]);
        });
      });

      describe('When it overflows to right', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageX: 900, width: 150 }); // Component close to the screen limit

          fireEvent(getTrigger(getByText), 'hoverIn');
          runTimers(500);

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 950, // pageX (900) + width (150) - 100 (TOOLTIP_WIDTH) // Tooltip is placed from right to left without going offscreen
              top: 250,
            },
          ]);
        });
      });

      describe('When it overflows to bottom', () => {
        it('renders the tooltip with the right placement', async () => {
          const {
            wrapper: { getByText, getByTestId, findByText },
          } = setup({}, { pageY: 600, height: 50 });

          fireEvent(getTrigger(getByText), 'hoverIn');
          runTimers(500);

          fireEvent(await findByText('some tooltip text'), 'layout', {
            nativeEvent: {
              layout: { width: TOOLTIP_WIDTH, height: TOOLTIP_HEIGHT },
            },
          });

          expect(getByTestId('tooltip-container').props.style).toMatchObject([
            {},
            {
              left: 210,
              top: 500, // pageY (600) - TOOLTIP_HEIGHT (100) // Tooltip is placed at the top of the component,
            },
          ]);
        });
      });
    });
  });
});
