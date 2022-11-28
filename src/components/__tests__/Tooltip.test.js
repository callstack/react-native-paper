import React from 'react';
import { Dimensions, Text, View } from 'react-native';

import {
  fireEvent,
  render,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';

import Provider from '../../core/Provider';
import Tooltip from '../Tooltip/Tooltip';

const mockedRemoveEventListener = jest.fn();

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.Dimensions.addEventListener = () => ({
    remove: mockedRemoveEventListener,
  });

  return RN;
});

const DummyComponent = React.forwardRef((props, ref) => (
  <View {...props} ref={ref}>
    <Text>dummy component</Text>
  </View>
));

describe('Tooltip', () => {
  const setup = (propOverrides, measure = {}) => {
    const defaultProps = {
      children: <DummyComponent />,
      title: 'some tooltip text',
      ...propOverrides,
    };

    const { x, y, width, height, pageX, pageY } = {
      x: null,
      y: null,
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
      <Provider>
        <Tooltip {...defaultProps} />
      </Provider>
    );

    return { wrapper };
  };

  describe('Unmount', () => {
    beforeAll(() => jest.spyOn(global, 'clearTimeout'));
    afterEach(() => jest.clearAllMocks());

    it('removes showTooltipTimer when the component unmounts', async () => {
      const {
        wrapper: { getByText, unmount },
      } = setup({ enterTouchDelay: 5000 });

      fireEvent(getByText('dummy component'), 'touchStart');

      unmount();

      expect(global.clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('removes hideTooltipTimer when the component unmounts', async () => {
      const {
        wrapper: { getByText, unmount },
      } = setup({ enterTouchDelay: 5000 });

      fireEvent(getByText('dummy component'), 'touchEnd');

      unmount();

      expect(global.clearTimeout).toHaveBeenCalledTimes(1);
    });

    it('removes Dimensions listener when the component unmount', async () => {
      const {
        wrapper: { getByText, findByText, unmount },
      } = setup();

      fireEvent(getByText('dummy component'), 'touchStart');

      await findByText('some tooltip text');

      unmount();

      expect(mockedRemoveEventListener).toHaveBeenCalled();
    });
  });

  describe('touchStart', () => {
    beforeAll(() => jest.spyOn(global, 'clearTimeout'));
    afterEach(() => jest.clearAllMocks());

    it('clears the hide timer when the user start pressing the component again', () => {
      jest.spyOn(global, 'clearTimeout');

      const {
        wrapper: { getByText },
      } = setup();

      fireEvent(getByText('dummy component'), 'touchStart');
      fireEvent(getByText('dummy component'), 'touchEnd');
      fireEvent(getByText('dummy component'), 'touchStart');

      expect(global.clearTimeout).toHaveBeenCalledTimes(2);
    });
  });

  describe.each([
    ['touchEnd', 'hides the tooltip when the user stop pressing the component'],
    ['touchCancel', 'hides the tooltip when the user cancel the touch action'],
  ])('%s', (eventName, testDescription) => {
    // eslint-disable-next-line jest/valid-title
    it(testDescription, async () => {
      const {
        wrapper: { queryByText, getByText, findByText },
      } = setup({ enterTouchDelay: 50, leaveTouchDelay: 0 });

      fireEvent(getByText('dummy component'), 'touchStart');

      await findByText('some tooltip text');

      fireEvent(getByText('dummy component'), eventName);

      await waitForElementToBeRemoved(() => getByText('some tooltip text'));

      expect(queryByText('some tooltip text')).toBeNull();
    });
  });

  describe('Tooltip position', () => {
    const LAYOUT_WIDTH = 360;
    const LAYOUT_HEIGHT = 705;
    const TOOLTIP_WIDTH = 100;
    const TOOLTIP_HEIGHT = 100;

    beforeAll(() => {
      jest
        .spyOn(Dimensions, 'get')
        .mockReturnValue({ width: LAYOUT_WIDTH, height: LAYOUT_HEIGHT });
    });

    describe('When it does not overflow', () => {
      it('centers the tooltip in the middle of the children component', async () => {
        const {
          wrapper: { getByText, getByTestId, findByText },
        } = setup();

        fireEvent(getByText('dummy component'), 'touchStart');

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

        fireEvent(getByText('dummy component'), 'touchStart');

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

        fireEvent(getByText('dummy component'), 'touchStart');

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

        fireEvent(getByText('dummy component'), 'touchStart');

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
