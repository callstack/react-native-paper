import * as React from 'react';
import { Animated } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';

import { getTheme } from '../../core/theming';
import FAB from '../FAB';
import { getFABGroupColors } from '../FAB/utils';

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
      backdropColor: getTheme().colors.background,
    });
  });
});

describe('getFABGroupColors - backdrop opacity', () => {
  it('should return scrimAlpha when no custom backdrop color', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      backdropOpacity: 0.95,
    });
  });

  it('should return 1 when custom backdrop color is provided', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
        customBackdropColor: 'transparent',
      })
    ).toMatchObject({
      backdropOpacity: 1,
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
});

describe('getFABGroupColors - stacked FAB background color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFABGroupColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      stackedFABBackgroundColor: getTheme().colors.surfaceContainerHigh,
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
  expect(getByTestId('my-fab-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(getByTestId('my-fab-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

describe('FAB.Group events', () => {
  it('onPress passes event', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        label="Stack test"
        icon=""
        onStateChange={jest.fn()}
        onPress={onPress}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onPress', { key: 'value' });
    });

    expect(onPress).toHaveBeenCalledWith({ key: 'value' });
  });

  it('onLongPress passes event', () => {
    const onLongPress = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        label="Stack test"
        icon=""
        onStateChange={jest.fn()}
        onLongPress={onLongPress}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onLongPress', { key: 'value' });
    });

    expect(onLongPress).toHaveBeenCalledWith({ key: 'value' });
  });
});

describe('Toggle Stack visibility', () => {
  it('toggles stack visibility on press', () => {
    const onStateChange = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onPress');
    });

    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('does not toggle stack visibility on long press', () => {
    const onStateChange = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onLongPress');
    });

    expect(onStateChange).toHaveBeenCalledTimes(0);
  });

  it('toggles stack visibility on long press with toggleStackOnLongPress prop', () => {
    const onStateChange = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        toggleStackOnLongPress
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onLongPress');
    });

    expect(onStateChange).toHaveBeenCalledTimes(1);
  });

  it('does not toggle stack visibility on press with toggleStackOnLongPress prop', () => {
    const onStateChange = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={false}
        toggleStackOnLongPress
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onPress');
    });

    expect(onStateChange).toHaveBeenCalledTimes(0);
  });

  it('does not trigger onLongPress when stack is opened', () => {
    const onStateChange = jest.fn();
    const onLongPress = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={true}
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        onLongPress={onLongPress}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onLongPress');
    });

    expect(onLongPress).toHaveBeenCalledTimes(0);
  });

  it('does trigger onLongPress when stack is opened and enableLongPressWhenStackOpened is true', () => {
    const onStateChange = jest.fn();
    const onLongPress = jest.fn();
    const { getByText } = render(
      <FAB.Group
        visible
        open={true}
        enableLongPressWhenStackOpened
        label="Stack test"
        icon=""
        onStateChange={onStateChange}
        onLongPress={onLongPress}
        actions={[
          {
            label: 'testing',
            onPress() {},
            icon: '',
          },
        ]}
      />
    );

    act(() => {
      fireEvent(getByText('Stack test'), 'onLongPress');
    });

    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
