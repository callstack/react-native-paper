import * as React from 'react';
import { Animated } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import FAB from '../FAB';
import { getFABGroupColors } from '../FAB/utils';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ bottom: 34, left: 0, right: 0, top: 47 }),
}));

describe('getFABGroupColors - backdrop color', () => {
  it('should return custom color', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
        customBackdropColor: 'transparent',
      })
    ).toMatchObject({
      backdropColor: 'transparent',
    });
  });

  it('should return correct backdrop color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      backdropColor: color(getTheme().colors.background)
        .alpha(0.95)
        .rgb()
        .string(),
    });
  });

  it('should return correct backdrop color, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      backdropColor: getTheme(false, false).colors.backdrop,
    });
  });
});

describe('getFABGroupColors - label color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct theme color, dark mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      labelColor: getTheme(true, false).colors.text,
    });
  });

  it('should return correct theme color, light mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      labelColor: color(getTheme(false, false).colors.text)
        .fade(0.54)
        .rgb()
        .string(),
    });
  });
});

describe('getFABGroupColors - stacked FAB background color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      stackedFABBackgroundColor: getTheme().colors.elevation.level3,
    });
  });

  it('should return correct theme color, dark mode, for theme version 2', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      stackedFABBackgroundColor: getTheme(false, false).colors.surface,
    });
  });
});

describe('FABActions - labelStyle - containerStyle', () => {
  it('correctly applies label style', () => {
    const { getByText } = render(
      <FAB.Group
        visible
        open
        icon=""
        onStateChange={() => {}}
        actions={[
          {
            label: 'complete',
            labelStyle: {
              fontSize: 24,
              fontWeight: '500',
            },
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    expect(getByText('complete')).toHaveStyle({
      fontSize: 24,
      fontWeight: '500',
    });
  });

  it('correctly applies containerStyle style', () => {
    const { getByA11yHint } = render(
      <FAB.Group
        visible
        open
        icon=""
        onStateChange={() => {}}
        actions={[
          {
            label: 'remove',
            accessibilityHint: 'hint',
            containerStyle: {
              padding: 16,
              backgroundColor: '#687456',
              marginLeft: 16,
            },
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    expect(getByA11yHint('hint')).toHaveStyle({
      padding: 16,
      backgroundColor: '#687456',
    });
  });
});

it('correctly adds label prop', () => {
  const { getByText } = render(
    <FAB.Group
      visible
      open
      label="Label test"
      icon=""
      onStateChange={() => {}}
      actions={[
        {
          label: 'testing',
          onPress() {},
          icon: '',
        },
      ]}
    />
  );

  expect(getByText('Label test')).toBeTruthy();
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <FAB.Group
      visible
      open
      label="Label test"
      icon=""
      onStateChange={() => {}}
      testID="my-fab"
      fabStyle={[{ transform: [{ scale: value }] }]}
      actions={[
        {
          label: 'testing',
          onPress() {},
          icon: '',
        },
      ]}
    />
  );
  expect(getByTestId('my-fab-container')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  jest.advanceTimersByTime(200);

  expect(getByTestId('my-fab-container')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
