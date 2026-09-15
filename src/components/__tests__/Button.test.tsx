import { PlatformColor, StyleSheet } from 'react-native';

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { fireEvent } from '@testing-library/react-native';
import color from 'color';
import * as Reanimated from 'react-native-reanimated';

import { LocaleProvider } from '../../core/locale';
import { render, screen } from '../../test-utils';
import { ReduceMotionContext } from '../../theme/accessibility/ReduceMotionContext';
import { pink500, white } from '../../theme/colors';
import { DarkTheme, LightTheme } from '../../theme/schemes';
import { tokens } from '../../theme/tokens';
import { shadow } from '../../theme/tokens/sys/elevation';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import Button from '../Button/Button';
import { Tokens } from '../Button/tokens';
import {
  getButtonColors,
  getButtonHitSlop,
  getButtonPressedRadius,
  getButtonRippleColor,
  getButtonShapeRadius,
  getButtonSizeStyle,
  getButtonTransitionDuration,
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

// Button's internal layers intentionally carry no test IDs, so they are reached
// by walking up from the elements a user can actually query.
const parentOf = (
  element: ReturnType<typeof screen.getByTestId>,
  describeChild: string
) => {
  const { parent } = element;

  if (!parent) {
    throw new Error(
      `Expected ${describeChild} to be wrapped in a parent view.`
    );
  }

  return parent;
};

const labelOf = (label: string) => screen.getByText(label);
const contentOf = (label: string) =>
  parentOf(labelOf(label), `the "${label}" label`);
const containerOf = (testID: string) =>
  parentOf(screen.getByTestId(testID), `"${testID}"`);
const surfaceOf = (testID: string) =>
  parentOf(containerOf(testID), `"${testID}"'s container`);

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
  expect(contentOf('Icon')).toHaveStyle({
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
  expect(contentOf('Icon')).toHaveStyle({
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

    expect(contentOf('Press me')).toHaveStyle({
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

    expect(contentOf('Next')).toHaveStyle({
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
        theme: LightTheme,
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
          theme: LightTheme,
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
          theme: LightTheme,
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
          theme: LightTheme,
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: LightTheme.colors.onSurface,
        backgroundOpacity: stateOpacity.pressed,
      });
    })
  );

  (['filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, dark theme, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          customButtonColor,
          theme: DarkTheme,
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: DarkTheme.colors.onSurface,
        backgroundOpacity: stateOpacity.pressed,
      });
    })
  );

  it('should return correct theme color, for theme version 3, elevated mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'elevated',
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.surfaceContainerLow,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, elevated mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'elevated',
      })
    ).toMatchObject({
      backgroundColor: DarkTheme.colors.surfaceContainerLow,
    });
  });

  it('should return correct theme color, for theme version 3, filled mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, filled mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'filled',
      })
    ).toMatchObject({
      backgroundColor: DarkTheme.colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, tonal mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.secondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, tonal mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'tonal',
      })
    ).toMatchObject({
      backgroundColor: DarkTheme.colors.secondaryContainer,
    });
  });

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return transparent color, for theme version 3, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          theme: LightTheme,
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
          theme: DarkTheme,
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
        theme: LightTheme,
        disabled: false,
        mode: 'text',
      })
    ).toMatchObject({ labelColor: customLabelColor });
  });

  it('should return correct disabled text color, for theme version 3, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customLabelColor,
        theme: LightTheme,
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      labelColor: LightTheme.colors.onSurface,
      labelOpacity: stateOpacity.disabled,
    });
  });

  it('should return correct disabled text color, for theme version 3, dark theme, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customLabelColor,
        theme: DarkTheme,
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      labelColor: DarkTheme.colors.onSurface,
      labelOpacity: stateOpacity.disabled,
    });
  });

  (['filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct text color for dark prop, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: LightTheme,
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
          theme: LightTheme,
          mode,
        })
      ).toMatchObject({
        labelColor: LightTheme.colors.primary,
      });
    })
  );

  (['text', 'elevated'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 3, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: DarkTheme,
          mode,
        })
      ).toMatchObject({
        labelColor: DarkTheme.colors.primary,
      });
    })
  );

  it('should return onSurfaceVariant label color, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'outlined',
      })
    ).toMatchObject({
      labelColor: LightTheme.colors.onSurfaceVariant,
    });
  });

  it('should return onSurfaceVariant label color, for theme version 3, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'outlined',
      })
    ).toMatchObject({
      labelColor: DarkTheme.colors.onSurfaceVariant,
    });
  });

  it('should return correct theme text color, for theme version 3, filled mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'filled',
      })
    ).toMatchObject({
      labelColor: LightTheme.colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme, filled mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'filled',
      })
    ).toMatchObject({
      labelColor: DarkTheme.colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, tonal mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'tonal',
      })
    ).toMatchObject({
      labelColor: LightTheme.colors.onSecondaryContainer,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme tonal mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'tonal',
      })
    ).toMatchObject({
      labelColor: DarkTheme.colors.onSecondaryContainer,
    });
  });
});

describe('getButtonColors - border color', () => {
  it('should return correct border color, for theme version 3, when disabled, outlined mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        disabled: true,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: LightTheme.colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, when disabled, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        disabled: true,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: DarkTheme.colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: LightTheme.colors.outlineVariant,
    });
  });

  it('should return correct border color, for theme version 3, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: DarkTheme,
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: DarkTheme.colors.outlineVariant,
    });
  });

  (['text', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return transparent border, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: LightTheme,
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
          theme: DarkTheme,
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
        theme: LightTheme,
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
          theme: LightTheme,
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
  outerBoundHeight: number,
][] = [
  ['extra-small', 32, 12, 12, 20, 4, 1, 'labelLarge', 48],
  ['small', 40, 16, 16, 20, 8, 1, 'labelLarge', 48],
  ['medium', 56, 24, 24, 24, 8, 1, 'titleMedium', 64],
  ['large', 96, 48, 48, 32, 12, 2, 'headlineSmall', 104],
  ['extra-large', 136, 64, 64, 40, 16, 3, 'headlineLarge', 144],
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
      labelVariant,
      outerBoundHeight
    ) => {
      expect(getButtonSizeStyle(size)).toEqual({
        minHeight,
        paddingStart,
        paddingEnd,
        iconSize,
        iconGap,
        outlineWidth,
        labelVariant,
        outerBoundHeight,
      });
    }
  );
});

describe('getButtonHitSlop', () => {
  // The slop closes the gap between the drawn container and the outer bound,
  // halved because it applies to both edges.
  it.each(sizeMetrics)('reaches the %s outer bound', (size) => {
    const { containerHeight, outerBoundHeight } = Tokens.sizes[size];
    const slop = getButtonHitSlop(size);

    expect(containerHeight + (slop?.top ?? 0) + (slop?.bottom ?? 0)).toBe(
      outerBoundHeight
    );
  });

  // The outer bound is a height; width comes off the 64dp minimum, which
  // already clears the target.
  it.each(sizeMetrics)('leaves the %s width alone', (size) => {
    expect(getButtonHitSlop(size)).toMatchObject({ left: 0, right: 0 });
  });
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
      expect(labelOf('X')).toHaveStyle({
        fontSize: expectedFontSize,
      });
    })
  );
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
      const theme = LightTheme;
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
      expect(getButtonPressedRadius({ size, theme: LightTheme })).toBe(pressed);
    }
  );
});

describe('getButtonTransitionDuration', () => {
  const theme = LightTheme;
  const opaque = theme.colors.primary;
  const scaled = (key: 'short3' | 'short4') =>
    theme.motion.duration[key] * theme.animation.scale;

  it('cross-fades between two opaque containers', () => {
    expect(
      getButtonTransitionDuration({
        theme,
        pressed: false,
        containerColor: opaque,
        previousContainerColor: theme.colors.secondaryContainer,
      })
    ).toBe(scaled('short3'));
  });

  it('uses the longer duration while pressed', () => {
    expect(
      getButtonTransitionDuration({
        theme,
        pressed: true,
        containerColor: opaque,
        previousContainerColor: opaque,
      })
    ).toBe(scaled('short4'));
  });

  // Fading to or from `transparent` interpolates through gray, which is what
  // made a mode switch leave `outlined` looking like a filled gray button.
  it('snaps when the container becomes transparent', () => {
    expect(
      getButtonTransitionDuration({
        theme,
        pressed: false,
        containerColor: 'transparent',
        previousContainerColor: opaque,
      })
    ).toBe(0);
  });

  it('snaps when the container was transparent', () => {
    expect(
      getButtonTransitionDuration({
        theme,
        pressed: false,
        containerColor: opaque,
        previousContainerColor: 'transparent',
      })
    ).toBe(0);
  });
});

describe('shape prop', () => {
  it('applies the round (full-pill) radius', async () => {
    await render(
      <Button testID="button" shape="round">
        X
      </Button>
    );
    // Half the small container height (40dp) is the real pill radius.
    expect(containerOf('button')).toHaveStyle({
      borderRadius: 20,
    });
  });

  it('applies the square radius (default size)', async () => {
    await render(
      <Button testID="button" shape="square">
        X
      </Button>
    );
    expect(containerOf('button')).toHaveStyle({
      borderRadius: 12,
    });
  });

  it('uses the per-size square radius when both size and shape are set', async () => {
    await render(
      <Button testID="button" size="large" shape="square">
        X
      </Button>
    );
    expect(containerOf('button')).toHaveStyle({
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

    expect(containerOf('button')).toHaveStyle({
      borderRadius: 28,
    });
  });

  it('flips a square button into the round radius when selected', async () => {
    await render(
      <Button testID="button" shape="square" selected>
        X
      </Button>
    );

    expect(containerOf('button')).toHaveStyle({
      borderRadius: 20,
    });
  });

  it('drops the outline when an outlined toggle is selected', () => {
    expect(
      getButtonColors({
        theme: LightTheme,
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      borderColor: 'transparent',
      borderWidth: 0,
    });
  });

  // MD3 gives the text style no toggle, so `selected` is inert there.
  it('ignores `selected` entirely on a text button', async () => {
    const plain = getButtonColors({ theme: LightTheme, mode: 'text' });

    expect(
      getButtonColors({ theme: LightTheme, mode: 'text', selected: false })
    ).toMatchObject(plain);
    expect(
      getButtonColors({ theme: LightTheme, mode: 'text', selected: true })
    ).toMatchObject(plain);

    await render(
      <Button testID="button" mode="text" shape="round" selected>
        X
      </Button>
    );
    // No shape flip: a round text button stays the pill, 40 / 2 = 20.
    expect(containerOf('button')).toHaveStyle({
      borderRadius: 20,
    });
    // And no toggle state is announced.
    expect(screen.getByTestId('button')).not.toBeSelected();
  });

  it('leaves a plain button untouched when `selected` is omitted', () => {
    expect(
      getButtonColors({ theme: LightTheme, mode: 'filled' })
    ).toMatchObject({
      backgroundColor: LightTheme.colors.primary,
      labelColor: LightTheme.colors.onPrimary,
    });
  });
});

describe('toggle colors', () => {
  // From the MD3 {Filled,Elevated,Tonal,Outlined}ButtonTokens Unselected*/
  // Selected* sets.
  type Role = keyof (typeof LightTheme)['colors'];
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
      const theme = LightTheme;

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
    const theme = LightTheme;
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
    const theme = LightTheme;

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
  const [spotShadow] = shadow(1, LightTheme.colors.shadow);

  await render(
    <Button mode="elevated" testID="elevated">
      Elevated
    </Button>
  );
  expect(surfaceOf('elevated')).toHaveStyle(spotShadow);

  await render(
    <Button mode="filled" testID="filled">
      Filled
    </Button>
  );
  expect(surfaceOf('filled')).toHaveStyle({
    shadowOpacity: 0,
  });
});

it('drops the shadow when an elevated button is disabled', async () => {
  await render(
    <Button mode="elevated" disabled testID="elevated">
      Elevated
    </Button>
  );

  expect(surfaceOf('elevated')).toHaveStyle({
    shadowOpacity: 0,
  });
});

it('forwards `style` to the shadow host', async () => {
  await render(
    <Button mode="elevated" icon="camera" style={styles.scaled} testID="button">
      Elevated button
    </Button>
  );

  expect(surfaceOf('button')).toHaveStyle(styles.scaled);
});

describe('container height', () => {
  const MODES = ['filled', 'tonal', 'elevated', 'outlined', 'text'] as const;
  // The outlined stroke thickens with the size (1dp up to M, 2dp L, 3dp XL),
  // so every size has to be checked against its own token metrics.
  const SIZES = [
    'extra-small',
    'small',
    'medium',
    'large',
    'extra-large',
  ] as const;
  const { containerHeight, leadingSpace } = Tokens.sizes.small;

  // The rendered container is the content box plus the outline Yoga draws
  // around it, so those two have to add up to the token height in every mode.
  const renderedBox = (testID: string) => {
    const content = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      contentOf('X').props.style
    );
    const clip = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      containerOf(testID).props.style
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

  it.each(SIZES)(
    'insets the %s outline so the box stays on the token metrics',
    async (size) => {
      await render(
        <Button mode="outlined" size={size} testID="button">
          X
        </Button>
      );

      expect(renderedBox('button')).toEqual({
        height: Tokens.sizes[size].containerHeight,
        leading: Tokens.sizes[size].leadingSpace,
      });
    }
  );

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

describe('touch target', () => {
  const styleOf = (element: ReturnType<typeof containerOf>) =>
    StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      element.props.style
    );

  it('leaves no clipping ancestor to swallow the expanded target', async () => {
    await render(
      <Button onPress={() => {}} testID="button">
        X
      </Button>
    );

    // The slop expands past the container, so an ancestor sized to the
    // container must not clip. This is what made the previous `hitSlop`
    // inert, and a passed-through prop alone would not catch it.
    expect(styleOf(surfaceOf('button')).overflow).not.toBe('hidden');
    expect(styleOf(containerOf('button')).overflow).not.toBe('hidden');
  });

  it('still clips the ripple to the container radius', async () => {
    await render(
      <Button onPress={() => {}} size="small" shape="round" testID="button">
        X
      </Button>
    );

    // Clipping moved onto the touchable, so the ripple keeps the pill shape
    // now that the clip view above it no longer hides the overflow.
    const style = styleOf(screen.getByTestId('button'));
    expect(style.overflow).toBe('hidden');
    expect(style.borderRadius).toBe(Tokens.sizes.small.containerHeight / 2);
  });

  // An outlined button's children sit inside the outline, so they round a
  // border width tighter than the container. Given the outer radius instead,
  // their corners overshoot the outline's inner edge and the background shows
  // through the gap — worst on XL, which has the thickest stroke.
  it.each(sizeMetrics)(
    'insets the %s ripple radius by the outline width',
    async (size) => {
      await render(
        <Button
          mode="outlined"
          onPress={() => {}}
          size={size}
          shape="square"
          testID="button"
        >
          X
        </Button>
      );

      const outer = StyleSheet.flatten(
        // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
        containerOf('button').props.style
      );

      expect(styleOf(screen.getByTestId('button')).borderRadius).toBe(
        outer.borderRadius - Tokens.sizes[size].outlinedOutlineWidth
      );
    }
  );

  it('leaves the ripple radius alone when there is no outline', async () => {
    await render(
      <Button mode="filled" onPress={() => {}} shape="square" testID="button">
        X
      </Button>
    );

    const outer = StyleSheet.flatten(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      containerOf('button').props.style
    );

    expect(styleOf(screen.getByTestId('button')).borderRadius).toBe(
      outer.borderRadius
    );
  });

  it.each(sizeMetrics)(
    'expands the %s target to the outer bound',
    async (size) => {
      await render(
        <Button onPress={() => {}} size={size} testID="button">
          X
        </Button>
      );

      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      const { hitSlop } = screen.getByTestId('button').props;
      const { containerHeight, outerBoundHeight } = Tokens.sizes[size];

      expect(containerHeight + hitSlop.top + hitSlop.bottom).toBe(
        outerBoundHeight
      );
    }
  );

  it('lets a caller hitSlop win', async () => {
    await render(
      <Button onPress={() => {}} hitSlop={12} testID="button">
        X
      </Button>
    );

    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toBe(12);
  });

  it('takes `null` as an opt out', async () => {
    await render(
      <Button onPress={() => {}} hitSlop={null} testID="button">
        X
      </Button>
    );

    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    const { hitSlop } = screen.getByTestId('button').props;

    expect(hitSlop).toBeNull();
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
    expect(springTargets(spy)).toContain(LightTheme.shapes.corner.small);
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
    expect(springTargets(spy)).toContain(LightTheme.shapes.corner.small);
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
    expect(springTargets(spy)).toContain(LightTheme.shapes.corner.large);
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
      LightTheme.motion.spring.fast.spatial
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
    expect(Reanimated.getAnimatedStyle(containerOf('button'))).toMatchObject({
      borderRadius: 48,
    });
    spy.mockClear();
  });
});
