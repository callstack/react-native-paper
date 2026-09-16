import { Image } from 'react-native';

import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { act } from '@testing-library/react-native';

import { render } from '../../test-utils';
import Banner from '../Banner';

it('renders hidden banner, without action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner visible={false}>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner visible>
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and without image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        actions={[
          { label: 'first', onPress: () => {} },
          { label: 'second', onPress: () => {} },
        ]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and with image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        icon={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
            accessibilityIgnoresInvertColors
          />
        )}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and with image', async () => {
  const tree = (
    await render(
      <Banner
        visible
        icon={({ size }) => (
          <Image
            source={{ uri: 'https://callstack.com/images/team/Satya.png' }}
            style={{ width: size, height: size }}
            accessibilityIgnoresInvertColors
          />
        )}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Two line text string with two actions. One to two lines is preferable on
        mobile.
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('render visible banner, with custom theme', async () => {
  const tree = (
    await render(
      <Banner
        visible
        theme={{
          colors: {
            onSurface: '#00f',
            surface: '#ccc',
            primary: '#043',
          },
        }}
        actions={[{ label: 'first', onPress: () => {} }]}
      >
        Custom theme
      </Banner>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('animations', () => {
  let showCallback: (() => void) | undefined,
    hideCallback: (() => void) | undefined;

  beforeEach(() => {
    showCallback = jest.fn();
    hideCallback = jest.fn();
  });

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
    showCallback = undefined;
    hideCallback = undefined;
  });

  describe('when component is rendered hidden', () => {
    // This behaviour is probably a bug. Needs triage before next version.
    it('will fire onHideAnimationFinished on mount', async () => {
      await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).toHaveBeenCalled();
    });

    it('should fire onShowAnimationFinished upon opening', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(1);

      await view.rerender(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );
      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when component is rendered visible', () => {
    // This behaviour is probably a bug. Needs triage before next version.
    it('will fire onShowAnimationFinished on mount', async () => {
      await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();
    });

    it('should fire onHideAnimationFinished upon closing', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      await view.rerender(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );
      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the callbacks change while the component is mounted', () => {
    it('should not cause another open/close animation', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);
    });

    it('should use the new callbacks upon opening/closing', async () => {
      const view = await render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);

      await view.rerender(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      await act(() => {
        jest.runAllTimers();
      });
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(1);
    });
  });
});
