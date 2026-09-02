import {
  DynamicColorIOS,
  Platform,
  PlatformColor,
  Pressable,
} from 'react-native';

import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { userEvent } from '@testing-library/react-native';
import {
  getAnimatedStyle,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Surface from '../Surface';

const SPOT_SHADOW_OPACITY = 0.19;
const AMBIENT_SHADOW_OPACITY = 0.039;

const AnimatedSurface = () => {
  const opacity = useSharedValue(0);
  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <>
      <Pressable
        testID="animate-surface"
        onPress={() => {
          opacity.value = 1;
        }}
      />
      <Surface testID="animated-surface" style={animatedStyle}>
        {null}
      </Surface>
    </>
  );
};

const AnimatedVisualSurface = () => {
  const borderRadius = useSharedValue(4);

  return (
    <>
      <Pressable
        testID="animate-visual-props"
        onPress={() => {
          borderRadius.value = 8;
        }}
      />
      <Surface
        mode="flat"
        testID="animated-visual-surface"
        backgroundColor="red"
        borderRadius={borderRadius}
      >
        {null}
      </Surface>
    </>
  );
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Surface', () => {
  it('updates styles when a Reanimated shared value changes', async () => {
    await render(<AnimatedSurface />);

    const surface = screen.getByTestId('animated-surface');
    expect(getAnimatedStyle(surface)).toMatchObject({ opacity: 0 });

    await userEvent.press(screen.getByTestId('animate-surface'));
    await jest.runAllTimersAsync();

    expect(getAnimatedStyle(surface)).toMatchObject({ opacity: 1 });
  });

  describe('on iOS', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'ios');
    });

    it('should render Surface with appropriate bg color but without shadow, if mode is set to "flat"', async () => {
      await render(
        <Surface mode="flat" elevation={5} testID={'surface-test'}>
          {null}
        </Surface>
      );

      // @ts-expect-error
      expect(screen.getByTestId('surface-test')).not.toHaveStyle({
        shadowOpacity: expect.any(Number),
      });
      expect(screen.getByTestId('surface-test')).toHaveStyle({
        backgroundColor: getTheme().colors.surfaceContainerHighest,
      });
    });

    it('should render a spot shadow if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID={'surface-test'}>
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-test')).toHaveStyle({
        shadowOpacity: SPOT_SHADOW_OPACITY,
      });
    });

    it('applies background and shape props in flat mode', async () => {
      const backgroundColor = 'rgba(1, 2, 3, 0.5)';
      await render(
        <Surface
          mode="flat"
          testID="surface-test"
          backgroundColor={backgroundColor}
          borderRadius={4}
          borderTopLeftRadius={8}
        >
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-test')).toHaveStyle({
        backgroundColor,
        borderRadius: 4,
        borderTopLeftRadius: 8,
      });
    });

    it('updates the animated corner radius', async () => {
      await render(<AnimatedVisualSurface />);

      const surface = screen.getByTestId('animated-visual-surface');

      expect(getAnimatedStyle(surface)).toMatchObject({
        borderRadius: 4,
      });

      await userEvent.press(screen.getByTestId('animate-visual-props'));
      await jest.runAllTimersAsync();

      expect(getAnimatedStyle(surface)).toMatchObject({
        borderRadius: 8,
      });
    });

    it('does not transition a DynamicColorIOS background', async () => {
      await render(
        <Surface
          testID="surface-test"
          backgroundColor={DynamicColorIOS({ light: 'white', dark: 'black' })}
        >
          {null}
        </Surface>
      );

      expect(
        getAnimatedStyle(screen.getByTestId('surface-test'))
      ).toMatchObject({
        transitionProperty: expect.not.arrayContaining(['backgroundColor']),
      });
    });
  });

  describe('on Android', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'android');
    });

    it('should render Surface with appropriate bg color but without shadow, if mode is set to "flat"', async () => {
      await render(
        <Surface mode="flat" elevation={5} testID="surface-container">
          {null}
        </Surface>
      );

      // @ts-expect-error
      expect(screen.getByTestId('surface-container')).not.toHaveStyle({
        elevation: expect.any(Number),
      });
      expect(screen.getByTestId('surface-container')).toHaveStyle({
        backgroundColor: getTheme().colors.surfaceContainerHighest,
      });
    });

    it('should render the dp value for the elevation level, if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID="surface-container">
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-container')).toHaveStyle({
        elevation: 12,
      });
    });

    it('does not transition a PlatformColor background', async () => {
      await render(
        <Surface
          testID="surface-container"
          backgroundColor={PlatformColor('systemBlue')}
        >
          {null}
        </Surface>
      );

      expect(
        getAnimatedStyle(screen.getByTestId('surface-container'))
      ).toMatchObject({
        transitionProperty: expect.not.arrayContaining(['backgroundColor']),
      });
    });
  });

  describe('on Web', () => {
    beforeEach(() => {
      jest.replaceProperty(Platform, 'OS', 'web');
    });

    it('should render both shadows in one box shadow, if mode is elevated', async () => {
      await render(
        <Surface elevation={5} testID="surface-container">
          {null}
        </Surface>
      );

      expect(screen.getByTestId('surface-container')).toHaveStyle({
        boxShadow:
          `0px 6.75px 19.22px rgba(0, 0, 0, ${SPOT_SHADOW_OPACITY}), ` +
          `0px 0px 6px rgba(0, 0, 0, ${AMBIENT_SHADOW_OPACITY})`,
      });
    });
  });
});
