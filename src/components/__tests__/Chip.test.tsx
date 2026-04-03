import * as React from 'react';
import { Animated } from 'react-native';

import { act, render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import Chip from '../Chip/Chip';
import { getChipColors } from '../Chip/helpers';

it('renders chip with onPress', () => {
  const tree = render(<Chip onPress={() => {}}>Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', () => {
  const tree = render(<Chip icon="information">Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with close button', () => {
  const tree = render(
    <Chip icon="information" onClose={() => {}}>
      Example Chip
    </Chip>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with custom close button', () => {
  const tree = render(
    <Chip icon="information" onClose={() => {}} closeIcon="arrow-down">
      Example Chip
    </Chip>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined disabled chip', () => {
  const tree = render(
    <Chip mode="outlined" disabled>
      Example Chip
    </Chip>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip', () => {
  const tree = render(<Chip selected>Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled chip if there is no touch handler passed', () => {
  const { getByTestId } = render(
    <Chip testID="disabled-chip">Disabled chip</Chip>
  );

  expect(getByTestId('disabled-chip').props.accessibilityState).toMatchObject({
    disabled: true,
  });
});

it('renders active chip if only onLongPress handler is passed', () => {
  const { getByTestId } = render(
    <Chip onLongPress={() => {}} testID="active-chip">
      Active chip
    </Chip>
  );

  expect(getByTestId('active-chip').props.accessibilityState).toMatchObject({
    disabled: false,
  });
});

it('renders chip with zero border radius', () => {
  const { getByTestId } = render(
    <Chip testID="active-chip" theme={{ roundness: 0 }}>
      Active chip
    </Chip>
  );

  expect(getByTestId('active-chip')).toHaveStyle({
    borderRadius: 0,
  });
});

describe('getChipColors - text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme(false).colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme(false).colors.onSecondaryContainer,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: 'purple',
    });
  });
});

describe('getChipColors - icon color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme(false).colors.onSurface,
      contentOpacity: 0.38,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme(false).colors.onSecondaryContainer,
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });
});

describe('getChipColor - selected background color', () => {
  it('should return custom color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return custom color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme().colors.surface,
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return custom color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: 'purple',
    });
  });

  it('should return theme color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme(false).colors.surface,
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme(false).colors.secondaryContainer,
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: getTheme(true).colors.secondaryContainer,
    });
  });
});

describe('getChipColor - background color', () => {
  it('should return custom color', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surface,
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return theme color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme(false).colors.surface,
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: getTheme(false).colors.secondaryContainer,
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.secondaryContainer,
    });
  });
});

describe('getChipColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        disabled: true,
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return custom color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        selectedColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color('purple').alpha(0.29).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: getTheme(false).colors.outlineVariant,
    });
  });

  it('should return theme color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: getTheme(true).colors.outlineVariant,
    });
  });

  it('should return theme background color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });

  it('should return theme background color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'transparent',
    });
  });
});

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <Chip
      onPress={() => {}}
      testID="chip"
      style={[{ transform: [{ scale: value }] }]}
    >
      Example Chip
    </Chip>
  );
  expect(getByTestId('chip-container-outer-layer')).toHaveStyle({
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
  expect(getByTestId('chip-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
