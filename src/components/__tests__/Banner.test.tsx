import * as React from 'react';
import { Animated, Image } from 'react-native';

import { render } from '@testing-library/react-native';

import Banner from '../Banner';

it('renders hidden banner, without action buttons and without image', () => {
  const tree = render(
    <Banner visible={false}>
      Two line text string with two actions. One to two lines is preferable on
      mobile.
    </Banner>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and without image', () => {
  const tree = render(
    <Banner visible>
      Two line text string with two actions. One to two lines is preferable on
      mobile.
    </Banner>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and without image', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, without action buttons and with image', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders visible banner, with action buttons and with image', () => {
  const tree = render(
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
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('render visible banner, with custom theme', () => {
  const tree = render(
    <Banner
      visible
      theme={{
        colors: {
          text: '#00f',
          surface: '#ccc',
          primary: '#043',
        },
      }}
      actions={[{ label: 'first', onPress: () => {} }]}
    >
      Custom theme
    </Banner>
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
    it('will fire onHideAnimationFinished on mount', () => {
      render(
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

      jest.runAllTimers();
      expect(showCallback).not.toHaveBeenCalled();
      expect(hideCallback).toHaveBeenCalled();
    });

    it('should fire onShowAnimationFinished upon opening', () => {
      const tree = render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(0);
      expect(hideCallback).toHaveBeenCalledTimes(1);

      tree.update(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );
      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when component is rendered visible', () => {
    // This behaviour is probably a bug. Needs triage before next version.
    it('will fire onShowAnimationFinished on mount', () => {
      render(
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

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalled();
      expect(hideCallback).not.toHaveBeenCalled();
    });

    it('should fire onHideAnimationFinished upon closing', () => {
      const tree = render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      tree.update(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible={false}
        >
          Text
        </Banner>
      );
      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(1);
    });
  });

  describe('when the callbacks change while the component is mounted', () => {
    it('should not cause another open/close animation', () => {
      const tree = render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      tree.update(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);
    });

    it('should use the new callbacks upon opening/closing', () => {
      const tree = render(
        <Banner
          onShowAnimationFinished={showCallback}
          onHideAnimationFinished={hideCallback}
          visible
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);

      const nextShowCallback = jest.fn();
      const nextHideCallback = jest.fn();

      tree.update(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(0);

      tree.update(
        <Banner
          onShowAnimationFinished={nextShowCallback}
          onHideAnimationFinished={nextHideCallback}
          visible={false}
        >
          Text
        </Banner>
      );

      jest.runAllTimers();
      expect(showCallback).toHaveBeenCalledTimes(1);
      expect(hideCallback).toHaveBeenCalledTimes(0);
      expect(nextShowCallback).toHaveBeenCalledTimes(0);
      expect(nextHideCallback).toHaveBeenCalledTimes(1);
    });
  });

  it('animated value changes correctly', () => {
    const value = new Animated.Value(1);
    const { getByTestId } = render(
      <Banner
        visible
        testID="banner"
        style={[{ transform: [{ scale: value }] }]}
      >
        Banner
      </Banner>
    );
    expect(getByTestId('banner-outer-layer')).toHaveStyle({
      transform: [{ scale: 1 }],
    });

    Animated.timing(value, {
      toValue: 1.5,
      useNativeDriver: false,
      duration: 200,
    }).start();

    jest.runAllTimers();

    expect(getByTestId('banner-outer-layer')).toHaveStyle({
      transform: [{ scale: 1.5 }],
    });
  });
});
