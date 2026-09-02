import { PlatformColor, StyleSheet } from 'react-native';

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';
import color from 'color';
import * as Reanimated from 'react-native-reanimated';

import { LocaleProvider } from '../../core/locale';
import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { ReduceMotionContext } from '../../theme/accessibility/ReduceMotionContext';
import { pink500, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import { shadow } from '../../theme/tokens/sys/elevation';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import Button from '../Button/Button';
import { Tokens } from '../Button/tokens';
import {
  getButtonColors,
  getButtonPressedRadius,
  getButtonRippleColor,
  getButtonShapeRadius,
  getButtonSizeStyle,
} from '../Button/utils';
import type { ButtonLabelVariant, ButtonSize } from '../Button/utils';

jest.mock('react-native-reanimated', () => {
  const ReanimatedModule = jest.requireActual<
    typeof import('react-native-reanimated')
  >('react-native-reanimated');

  return {
    __esModule: true,
    ...ReanimatedModule,
    default: ReanimatedModule.default,
    // Wrapped so the shape-morph tests can observe the spring targets.
    withSpring: jest.fn(ReanimatedModule.withSpring),
  };
});

const stateOpacity = tokens.md.sys.state.opacity;

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row-reverse',
  },
  scaled: {
    transform: [{ scale: 1.5 }],
  },
});

it('renders filled button by default', async () => {
  const tree = (await render(<Button>Filled Button</Button>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders text button with mode', async () => {
  const tree = (
    await render(<Button mode="text">Text Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined button with mode', async () => {
  const tree = (
    await render(<Button mode="outlined">Outlined Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled button with mode', async () => {
  const tree = (
    await render(<Button mode="filled">Contained Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon', async () => {
  const tree = (
    await render(<Button icon="camera">Icon Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon in reverse order', async () => {
  const tree = (
    await render(
      <Button icon="chevron-right" contentStyle={styles.flexing}>
        Right Icon
      </Button>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('swaps the icon to the trailing edge under RTL', async () => {
  await render(
    <Button icon="camera" iconPosition="leading">
      Icon
    </Button>
  );
  expect(screen.getByTestId('button-content')).toHaveStyle({
    flexDirection: 'row',
  });

  await render(
    <LocaleProvider direction="rtl">
      <Button icon="camera" iconPosition="leading">
        Icon
      </Button>
    </LocaleProvider>
  );
  // The content direction flips, so a "leading" icon sits on the right in RTL.
  expect(screen.getByTestId('button-content')).toHaveStyle({
    flexDirection: 'row-reverse',
  });
});

it('renders loading button', async () => {
  const tree = (await render(<Button loading>Loading Button</Button>)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button', async () => {
  const tree = (
    await render(<Button disabled>Disabled Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button if there is no touch handler passed', async () => {
  await render(<Button testID="disabled-button">Disabled button</Button>);

  expect(screen.getByTestId('disabled-button')).toBeDisabled();
});

it('renders active button if only onLongPress handler is passed', async () => {
  await render(
    <Button onLongPress={() => {}} testID="active-button">
      Active button
    </Button>
  );

  expect(screen.getByTestId('active-button')).toBeEnabled();
});

it('renders button with color', async () => {
  const tree = (
    await render(<Button textColor={pink500}>Custom Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with button color', async () => {
  const tree = (
    await render(<Button buttonColor={pink500}>Custom Button</Button>)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom testID', async () => {
  const tree = (
    await render(
      <Button testID={'custom:testID'}>Button with custom testID</Button>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility label', async () => {
  const tree = (
    await render(
      <Button accessibilityLabel={'label'}>
        Button with accessibility label
      </Button>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility hint', async () => {
  const tree = (
    await render(
      <Button accessibilityHint={'hint'}>Button with accessibility hint</Button>
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('should execute onPressIn', async () => {
  const onPressInMock = jest.fn();
  const onPress = jest.fn();

  await render(
    <Button onPress={onPress} onPressIn={onPressInMock} testID="button">
      {null}
    </Button>
  );
  await fireEvent(screen.getByTestId('button'), 'onPressIn');
  expect(onPressInMock).toHaveBeenCalledTimes(1);
});

it('should execute onPressOut', async () => {
  const onPressOutMock = jest.fn();
  const onPress = jest.fn();

  await render(
    <Button onPress={onPress} onPressOut={onPressOutMock} testID="button">
      {null}
    </Button>
  );
  await fireEvent(screen.getByTestId('button'), 'onPressOut');
  expect(onPressOutMock).toHaveBeenCalledTimes(1);
});

describe('icon position', () => {
  it('places the icon before the label by default', async () => {
    await render(
      <Button testID="button" mode="outlined" icon="camera">
        Press me
      </Button>
    );

    expect(screen.getByTestId('button-content')).toHaveStyle({
      flexDirection: 'row',
    });
  });

  it('places the icon after the label when iconPosition is "trailing"', async () => {
    await render(
      <Button
        testID="button"
        mode="outlined"
        icon="chevron-right"
        iconPosition="trailing"
      >
        Next
      </Button>
    );

    expect(screen.getByTestId('button-content')).toHaveStyle({
      flexDirection: 'row-reverse',
    });
  });
});

describe('getButtonColors - background color', () => {
  const customButtonColor = '#111111';

  it('should return custom color no matter what is the theme version, when not disabled', () => {
    expect(
      getButtonColors({
        customButtonColor,
        theme: getTheme(),
        disabled: false,
        mode: 'text',
      })
    ).toMatchObject({ backgroundColor: customButtonColor });
  });

  (['outlined', 'text'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({ backgroundColor: 'transparent' });
    })
  );

  (['outlined', 'text'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({ backgroundColor: 'transparent' });
    })
  );

  (['filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: getTheme().colors.onSurface,
        backgroundOpacity: stateOpacity.pressed,
      });
    })
  );

  (['filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, dark theme, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(true),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: getTheme(true).colors.onSurface,
        backgroundOpacity: stateOpacity.pressed,
      });
    })
  );

  it('should return correct theme color, for theme version 3, elevated mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'elevated',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceContainerLow,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, elevated mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'elevated',
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.surfaceContainerLow,
    });
  });

  it('should return correct theme color, for theme version 3, filled mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, filled mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.secondaryContainer,
    });
  });

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return transparent color, for theme version 3, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return transparent color, for theme version 3, dark theme, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          theme: getTheme(true),
          mode,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );
});

describe('getButtonColors - text color', () => {
  const customLabelColor = '#313131';

  it('should return custom text color no matter what is the theme version, when not disabled', () => {
    expect(
      getButtonColors({
        customLabelColor,
        theme: getTheme(),
        disabled: false,
        mode: 'text',
      })
    ).toMatchObject({ labelColor: customLabelColor });
  });

  it('should return correct disabled text color, for theme version 3, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customLabelColor,
        theme: getTheme(),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onSurface,
      labelOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct disabled text color, for theme version 3, dark theme, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customLabelColor,
        theme: getTheme(true),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      labelColor: getTheme(true).colors.onSurface,
      labelOpacity: stateOpacity.disabled,
    });
  });

  (['filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct text color for dark prop, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
          dark: true,
        })
      ).toMatchObject({
        labelColor: white,
      });
    })
  );

  (['text', 'elevated'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({
        labelColor: getTheme().colors.primary,
      });
    })
  );

  (['text', 'elevated'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 3, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true),
          mode,
        })
      ).toMatchObject({
        labelColor: getTheme(true).colors.primary,
      });
    })
  );

  it('should return onSurfaceVariant label color, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return onSurfaceVariant label color, for theme version 3, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'outlined',
      })
    ).toMatchObject({
      labelColor: getTheme(true).colors.onSurfaceVariant,
    });
  });

  it('should return correct theme text color, for theme version 3, filled mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'filled',
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme, filled mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'filled',
      })
    ).toMatchObject({
      labelColor: getTheme(true).colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'tonal',
      })
    ).toMatchObject({
      labelColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'tonal',
      })
    ).toMatchObject({
      labelColor: getTheme(true).colors.onSecondaryContainer,
    });
  });
});

describe('getButtonColors - border color', () => {
  it('should return correct border color, for theme version 3, when disabled, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        disabled: true,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, when disabled, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        disabled: true,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme(true).colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme(true).colors.outlineVariant,
    });
  });

  (['text', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return transparent border, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({
        borderColor: 'transparent',
      });
    })
  );

  (['text', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return transparent border, for theme version 3, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true),
          mode,
        })
      ).toMatchObject({
        borderColor: 'transparent',
      });
    })
  );
});

describe('getButtonColors - border width', () => {
  it('should return correct border width, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderWidth: 1,
    });
  });

  (['text', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct border width, for ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({
        borderWidth: 0,
      });
    })
  );
});

describe('getButtonRippleColor', () => {
  it('returns the custom ripple color when one is provided', () => {
    expect(
      getButtonRippleColor({ labelColor: '#123456', customRippleColor: 'red' })
    ).toBe('red');
  });

  it('defaults to the label color at the pressed-state opacity', () => {
    expect(getButtonRippleColor({ labelColor: '#123456' })).toBe(
      color('#123456').alpha(stateOpacity.pressed).rgb().string()
    );
  });

  it('returns undefined when the label color is not a plain string', () => {
    expect(
      getButtonRippleColor({ labelColor: PlatformColor('?attr/colorPrimary') })
    ).toBeUndefined();
  });
});

const sizeMetrics: [
  size: ButtonSize,
  minHeight: number,
  paddingStart: number,
  paddingEnd: number,
  iconSize: number,
  iconGap: number,
  outlineWidth: number,
  labelVariant: ButtonLabelVariant,
][] = [
  ['extra-small', 32, 12, 12, 20, 4, 1, 'labelLarge'],
  ['small', 40, 16, 16, 20, 8, 1, 'labelLarge'],
  ['medium', 56, 24, 24, 24, 8, 1, 'titleMedium'],
  ['large', 96, 48, 48, 32, 12, 1, 'headlineSmall'],
  ['extra-large', 136, 64, 64, 40, 16, 1, 'headlineLarge'],
];

describe('getButtonSizeStyle', () => {
  it.each(sizeMetrics)(
    'returns expected metrics for %s',
    (
      size,
      minHeight,
      paddingStart,
      paddingEnd,
      iconSize,
      iconGap,
      outlineWidth,
      labelVariant
    ) => {
      expect(getButtonSizeStyle(size)).toEqual({
        minHeight,
        paddingStart,
        paddingEnd,
        iconSize,
        iconGap,
        outlineWidth,
        labelVariant,
      });
    }
  );
});

describe('size prop', () => {
  it('renders a button with per-size metrics', async () => {
    const tree = (
      await render(
        <Button size="medium" icon="camera">
          Medium
        </Button>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  (
    [
      ['extra-small', 14],
      ['small', 14],
      ['medium', 16],
      ['large', 24],
      ['extra-large', 32],
    ] as const
  ).forEach(([size, expectedFontSize]) =>
    it(`applies the ${size} typescale to the label`, async () => {
      await render(
        <Button size={size} testID="button">
          X
        </Button>
      );
      expect(screen.getByTestId('button-text')).toHaveStyle({
        fontSize: expectedFontSize,
      });
    })
  );
});

describe('accessible touch target', () => {
  it('expands extra-small buttons to the 48dp minimum target', async () => {
    await render(
      <Button size="extra-small" testID="button">
        X
      </Button>
    );
    // (48 - 32) / 2 = 8
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toMatchObject({
      top: 8,
      bottom: 8,
    });
  });

  it('expands small buttons to the 48dp minimum target', async () => {
    await render(
      <Button size="small" testID="button">
        X
      </Button>
    );
    // (48 - 40) / 2 = 4
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toMatchObject({
      top: 4,
      bottom: 4,
    });
  });

  it('does not add hitSlop for buttons already at least 48dp tall', async () => {
    await render(
      <Button size="medium" testID="button">
        X
      </Button>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toBeUndefined();
  });

  it('keeps a user-supplied hitSlop axis while filling the rest', async () => {
    await render(
      <Button size="extra-small" testID="button" hitSlop={{ top: 20 }}>
        X
      </Button>
    );
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toMatchObject({
      top: 20,
      bottom: 8,
    });
  });
});

const shapeRadii: [size: ButtonSize, round: number, square: number][] = [
  ['extra-small', 9999, 12],
  ['small', 9999, 12],
  ['medium', 9999, 16],
  ['large', 9999, 28],
  ['extra-large', 9999, 28],
];

describe('getButtonShapeRadius', () => {
  it.each(shapeRadii)(
    'returns expected radii for size=%s',
    (size, round, square) => {
      const theme = getTheme();
      expect(getButtonShapeRadius({ size, shape: 'round', theme })).toBe(round);
      expect(getButtonShapeRadius({ size, shape: 'square', theme })).toBe(
        square
      );
    }
  );
});

// The pressed corner tightens with the size, per the MD3 corner table.
const pressedRadii: [size: ButtonSize, pressed: number][] = [
  ['extra-small', 8],
  ['small', 8],
  ['medium', 12],
  ['large', 16],
  ['extra-large', 16],
];

describe('getButtonPressedRadius', () => {
  it.each(pressedRadii)(
    'returns the pressed radius for size=%s',
    (size, pressed) => {
      expect(getButtonPressedRadius({ size, theme: getTheme() })).toBe(pressed);
    }
  );
});

describe('shape prop', () => {
  it('applies the round (full-pill) radius', async () => {
    await render(
      <Button testID="button" shape="round">
        X
      </Button>
    );
    // Half the small container height (40dp) is the real pill radius.
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 20,
    });
  });

  it('applies the square radius (default size)', async () => {
    await render(
      <Button testID="button" shape="square">
        X
      </Button>
    );
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 12,
    });
  });

  it('uses the per-size square radius when both size and shape are set', async () => {
    await render(
      <Button testID="button" size="large" shape="square">
        X
      </Button>
    );
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 28,
    });
  });
});

describe('selected prop', () => {
  it('marks the button as selected for screen readers', async () => {
    await render(
      <Button testID="button" selected onPress={() => {}}>
        X
      </Button>
    );

    expect(screen.getByTestId('button')).toBeSelected();
  });

  it('flips a round button into the square radius when selected', async () => {
    await render(
      <Button testID="button" size="large" shape="round" selected>
        X
      </Button>
    );

    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 28,
    });
  });

  it('flips a square button into the round radius when selected', async () => {
    await render(
      <Button testID="button" shape="square" selected>
        X
      </Button>
    );

    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 20,
    });
  });

  it('drops the outline when an outlined toggle is selected', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      borderColor: 'transparent',
      borderWidth: 0,
    });
  });

  it('keeps a text button on its plain colors, having no toggle colours', async () => {
    const plain = getButtonColors({ theme: getTheme(), mode: 'text' });

    expect(
      getButtonColors({ theme: getTheme(), mode: 'text', selected: false })
    ).toMatchObject(plain);
    expect(
      getButtonColors({ theme: getTheme(), mode: 'text', selected: true })
    ).toMatchObject(plain);

    // `selected` is still honoured for the shape flip and for screen readers.
    await render(
      <Button testID="button" mode="text" shape="round" selected>
        X
      </Button>
    );
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 12,
    });
    expect(screen.getByTestId('button')).toBeSelected();
  });

  it('leaves a plain button untouched when `selected` is omitted', () => {
    expect(
      getButtonColors({ theme: getTheme(), mode: 'filled' })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
      labelColor: getTheme().colors.onPrimary,
    });
  });
});

describe('toggle colors', () => {
  // From the MD3 {Filled,Elevated,Tonal,Outlined}ButtonTokens Unselected*/
  // Selected* sets.
  type Role = keyof ReturnType<typeof getTheme>['colors'];
  // `null` = the spec leaves the container unfilled.
  const toggleColors: [
    mode: 'filled' | 'tonal' | 'elevated' | 'outlined',
    unselectedContainer: Role | null,
    unselectedLabel: Role,
    selectedContainer: Role,
    selectedLabel: Role,
  ][] = [
    ['filled', 'surfaceContainer', 'onSurfaceVariant', 'primary', 'onPrimary'],
    [
      'tonal',
      'secondaryContainer',
      'onSecondaryContainer',
      'secondary',
      'onSecondary',
    ],
    ['elevated', 'surfaceContainerLow', 'primary', 'primary', 'onPrimary'],
    [
      'outlined',
      null,
      'onSurfaceVariant',
      'inverseSurface',
      'inverseOnSurface',
    ],
  ];

  it.each(toggleColors)(
    '%s toggle uses the spec roles for both states',
    (mode, uContainer, uLabel, sContainer, sLabel) => {
      const theme = getTheme();

      expect(getButtonColors({ theme, mode, selected: false })).toMatchObject({
        backgroundColor:
          uContainer === null ? 'transparent' : theme.colors[uContainer],
        labelColor: theme.colors[uLabel],
      });

      expect(getButtonColors({ theme, mode, selected: true })).toMatchObject({
        backgroundColor: theme.colors[sContainer],
        labelColor: theme.colors[sLabel],
      });
    }
  );

  it('an unselected toggle differs from the same mode as a plain button', () => {
    const theme = getTheme();
    const plain = getButtonColors({ theme, mode: 'filled' });
    const unselected = getButtonColors({
      theme,
      mode: 'filled',
      selected: false,
    });

    expect(unselected.backgroundColor).not.toBe(plain.backgroundColor);
    expect(unselected.labelColor).not.toBe(plain.labelColor);
  });

  it('ignores the toggle table when disabled', () => {
    const theme = getTheme();

    expect(
      getButtonColors({ theme, mode: 'filled', selected: true, disabled: true })
    ).toMatchObject({
      backgroundColor: theme.colors.onSurface,
      labelColor: theme.colors.onSurface,
    });
  });
});

it('gives an elevated button a resting shadow, and other modes none', async () => {
  // Level 1 at rest, drawn by `Surface`.
  const [spotShadow] = shadow(1, getTheme().colors.shadow);

  await render(
    <Button mode="elevated" testID="elevated">
      Elevated
    </Button>
  );
  expect(screen.getByTestId('elevated-container-outer-layer')).toHaveStyle(
    spotShadow
  );

  await render(
    <Button mode="filled" testID="filled">
      Filled
    </Button>
  );
  expect(screen.getByTestId('filled-container-outer-layer')).toHaveStyle({
    shadowOpacity: 0,
  });
});

it('drops the shadow when an elevated button is disabled', async () => {
  await render(
    <Button mode="elevated" disabled testID="elevated">
      Elevated
    </Button>
  );

  expect(screen.getByTestId('elevated-container-outer-layer')).toHaveStyle({
    shadowOpacity: 0,
  });
});

it('forwards `style` to the shadow host', async () => {
  await render(
    <Button mode="elevated" icon="camera" style={styles.scaled}>
      Elevated button
    </Button>
  );

  expect(screen.getByTestId('button-container-outer-layer')).toHaveStyle(
    styles.scaled
  );
});

describe('container height', () => {
  const MODES = ['filled', 'tonal', 'elevated', 'outlined', 'text'] as const;
  const { containerHeight, leadingSpace } = Tokens.sizes.small;

  // The rendered container is the content box plus the outline Yoga draws
  // around it, so those two have to add up to the token height in every mode.
  const renderedBox = (testID: string) => {
    const content = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId(`${testID}-content`).props.style
    );
    const clip = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId(`${testID}-container`).props.style
    );
    const outline = clip.borderWidth ?? 0;
    return {
      height: content.minHeight + outline * 2,
      leading: content.paddingStart + outline,
    };
  };

  it.each(MODES)('renders %s at the token height', async (mode) => {
    await render(
      <Button mode={mode} testID="button">
        X
      </Button>
    );

    expect(renderedBox('button')).toEqual({
      height: containerHeight,
      leading: leadingSpace,
    });
  });

  it('keeps an outlined toggle the same size in both states', async () => {
    await render(
      <Button mode="outlined" selected={false} testID="button">
        X
      </Button>
    );
    const unselected = renderedBox('button');

    await render(
      <Button mode="outlined" selected testID="button">
        X
      </Button>
    );

    // Selecting drops the outline; without the inset this shrank by 2dp.
    expect(renderedBox('button')).toEqual(unselected);
  });
});

describe('shape morph animation', () => {
  beforeEach(() => {
    jest.mocked(Reanimated.withSpring).mockClear();
  });

  const springTargets = (
    spy: jest.MockedFunction<typeof Reanimated.withSpring>
  ) => spy.mock.calls.map((call) => call[0]);

  it('springs the corner radius to corner.small on press in', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button">
        {null}
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(springTargets(spy)).toContain(getTheme().shapes.corner.small);
    spy.mockClear();
  });

  it('springs the corner radius back to the resting pill radius on press out', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button">
        {null}
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressOut');
    // small round resting radius = minHeight (40) / 2 = 20
    expect(springTargets(spy)).toContain(20);
    spy.mockClear();
  });

  it('animates between round and square radii when toggled (no spring on mount)', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="square" size="large" onPress={() => {}} testID="button">
        {null}
      </Button>
    );
    // Mount snaps to the resting radius — no spring.
    expect(spy).not.toHaveBeenCalled();
    await screen.rerender(
      <Button
        shape="square"
        size="large"
        selected
        onPress={() => {}}
        testID="button"
      >
        {null}
      </Button>
    );
    // selected flips square -> round; large round resting radius = 96 / 2 = 48
    expect(springTargets(spy)).toContain(48);
    spy.mockClear();
  });

  it('morphs a default button, with no size or shape passed', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button onPress={() => {}} testID="button">
        Default
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(springTargets(spy)).toContain(getTheme().shapes.corner.small);
    spy.mockClear();
  });

  it('reads the pressed corner from the size tokens', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="round" size="large" onPress={() => {}} testID="button">
        {null}
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    // A large button presses to `large` (16dp), not the small sizes' 8dp.
    expect(springTargets(spy)).toContain(getTheme().shapes.corner.large);
    spy.mockClear();
  });

  it('springs with the same spatial config as the rest of the library', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button">
        {null}
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');

    // Same spring FAB and Switch use, so the overshoot matches them.
    const { damping, stiffness } = toRawSpring(
      getTheme().motion.spring.fast.spatial
    );
    expect(spy).toHaveBeenCalledWith(
      expect.any(Number),
      expect.objectContaining({ damping, stiffness })
    );
    spy.mockClear();
  });

  it('skips the press morph under reduce motion', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <ReduceMotionContext.Provider value={true}>
        <Button shape="round" size="small" onPress={() => {}} testID="button">
          {null}
        </Button>
      </ReduceMotionContext.Provider>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  });

  it('does not morph when animateShape is false', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button
        shape="round"
        size="small"
        animateShape={false}
        onPress={() => {}}
        testID="button"
      >
        {null}
      </Button>
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
  });

  it('snaps instead of springing when animateShape is false and selected flips', async () => {
    const spy = jest.mocked(Reanimated.withSpring);
    await render(
      <Button shape="square" size="large" animateShape={false} testID="button">
        {null}
      </Button>
    );
    await screen.rerender(
      <Button
        shape="square"
        size="large"
        animateShape={false}
        selected
        testID="button"
      >
        {null}
      </Button>
    );

    // The shape still changes to the flipped radius, it just doesn't animate.
    expect(spy).not.toHaveBeenCalled();
    // A direct shared-value write reaches the style on the next frame.
    await jest.runAllTimersAsync();
    expect(
      Reanimated.getAnimatedStyle(screen.getByTestId('button-container'))
    ).toMatchObject({ borderRadius: 48 });
    spy.mockClear();
  });
});
