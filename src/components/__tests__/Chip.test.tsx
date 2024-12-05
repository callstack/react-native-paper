import * as React from 'react';
import { Animated } from 'react-native';

import { act, render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
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
      textColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: getTheme(false, false).colors.disabled,
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
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: color(getTheme(false, false).colors.text)
        .alpha(0.87)
        .rgb()
        .string(),
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
        theme: getTheme(false, false),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      textColor: color('purple').alpha(0.87).rgb().string(),
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
      iconColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: getTheme(false, false).colors.disabled,
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
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: color(getTheme(false, false).colors.text)
        .alpha(0.54)
        .rgb()
        .string(),
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
        theme: getTheme(false, false),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      iconColor: color('purple').alpha(0.54).rgb().string(),
    });
  });
});

describe('getChipColors - ripple color', () => {
  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSecondaryContainer)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
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
      rippleColor: color('purple').alpha(0.12).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        selectedColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color('purple').fade(0.5).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, outline mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: color('purple').lighten(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, flat mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color('purple').lighten(0.4).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, outline mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: color('purple').darken(0.08).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, flat mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color('purple').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.surface)
        .darken(0.08)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color('#ebebeb').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme(true, false).colors.surface)
        .lighten(0.2)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: false,
      })
    ).toMatchObject({
      rippleColor: color('#383838').lighten(0.4).rgb().string(),
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
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSurfaceVariant), 0)
        .rgb()
        .string(),
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
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSecondaryContainer), 0)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3, outlined mode, show selected overlay', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        showSelectedOverlay: true,
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSurfaceVariant), 0.12)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3, flat mode, show selected overlay', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        showSelectedOverlay: true,
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSecondaryContainer), 0.12)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme().colors.surface)
        .mix(color(getTheme().colors.onSurfaceVariant), 0)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme().colors.secondaryContainer)
        .mix(color(getTheme().colors.onSecondaryContainer), 0)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').darken(0.08).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').darken(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').lighten(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').lighten(0.4).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme(false, false).colors.surface)
        .darken(0.08)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('#ebebeb').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: false,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('#383838').lighten(0.4).rgb().string(),
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
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme(false, false).colors.surface,
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: '#ebebeb',
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: false,
      })
    ).toMatchObject({
      backgroundColor: '#383838',
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
      borderColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
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
      borderColor: color('purple').alpha(0.29).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return custom color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
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
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: 'purple',
    });
  });

  it('should return theme color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.29).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color(white).alpha(0.29).rgb().string(),
    });
  });

  it('should return theme background color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: '#ebebeb',
    });
  });

  it('should return theme background color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: false,
      })
    ).toMatchObject({
      borderColor: '#383838',
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
