import { Animated, PlatformColor, StyleSheet } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act, fireEvent } from '@testing-library/react-native';
import color from 'color';

import { LocaleProvider } from '../../core/locale';
import { getTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import { pink500, white } from '../../theme/colors';
import { tokens } from '../../theme/tokens';
import Button from '../Button/Button';
import {
  getButtonColors,
  getButtonRippleColor,
  getButtonShapeRadius,
  getButtonSizeStyle,
} from '../Button/utils';
import type { ButtonLabelVariant, ButtonSize } from '../Button/utils';

const stateOpacity = tokens.md.sys.state.opacity;

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row-reverse',
  },
  customRadius: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 16,
  },
  noRadius: {
    borderRadius: 0,
  },
  overrideRadius: {
    borderRadius: 4,
  },
});

it('renders filled button by default', async () => {
  const tree = (await render(<Button label="Filled Button" />)).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders text button with mode', async () => {
  const tree = (
    await render(<Button mode="text" label="Text Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined button with mode', async () => {
  const tree = (
    await render(<Button mode="outlined" label="Outlined Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders filled button with mode', async () => {
  const tree = (
    await render(<Button mode="filled" label="Contained Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon', async () => {
  const tree = (
    await render(<Button icon="camera" label="Icon Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon in reverse order', async () => {
  const tree = (
    await render(
      <Button
        icon="chevron-right"
        contentStyle={styles.flexing}
        label="Right Icon"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('swaps the icon to the trailing edge under RTL', async () => {
  await render(<Button icon="camera" iconPosition="leading" label="Icon" />);
  const ltrIconStyle = StyleSheet.flatten(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('button-icon-container').props.style
  );

  await render(
    <LocaleProvider direction="rtl">
      <Button icon="camera" iconPosition="leading" label="Icon" />
    </LocaleProvider>
  );
  const rtlIconStyle = StyleSheet.flatten(
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    screen.getByTestId('button-icon-container').props.style
  );

  // The physical margins swap so a "leading" icon sits on the right in RTL.
  expect(rtlIconStyle.marginLeft).toBe(ltrIconStyle.marginRight);
  expect(rtlIconStyle.marginRight).toBe(ltrIconStyle.marginLeft);
});

it('renders loading button', async () => {
  const tree = (
    await render(<Button loading label="Loading Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button', async () => {
  const tree = (
    await render(<Button disabled label="Disabled Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button if there is no touch handler passed', async () => {
  await render(<Button testID="disabled-button" label="Disabled button" />);

  expect(screen.getByTestId('disabled-button')).toBeDisabled();
});

it('renders active button if only onLongPress handler is passed', async () => {
  await render(
    <Button
      onLongPress={() => {}}
      testID="active-button"
      label="Active button"
    />
  );

  expect(screen.getByTestId('active-button')).toBeEnabled();
});

it('renders button with color', async () => {
  const tree = (
    await render(<Button textColor={pink500} label="Custom Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with button color', async () => {
  const tree = (
    await render(<Button buttonColor={pink500} label="Custom Button" />)
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom testID', async () => {
  const tree = (
    await render(
      <Button testID={'custom:testID'} label="Button with custom testID" />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility label', async () => {
  const tree = (
    await render(
      <Button
        accessibilityLabel={'label'}
        label="Button with accessibility label"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility hint', async () => {
  const tree = (
    await render(
      <Button
        accessibilityHint={'hint'}
        label="Button with accessibility hint"
      />
    )
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom border radius', async () => {
  await render(
    <Button
      testID="custom-radius"
      style={styles.customRadius}
      label="Custom radius"
    />
  );

  expect(screen.getByTestId('custom-radius-container')).toHaveStyle(
    styles.customRadius
  );
  expect(screen.getByTestId('custom-radius')).toHaveStyle(styles.customRadius);
});

it('renders outlined button with custom border radius', async () => {
  await render(
    <Button
      mode={'outlined'}
      testID="custom-radius"
      style={styles.customRadius}
      label="Custom radius"
    />
  );

  expect(screen.getByTestId('custom-radius-container')).toHaveStyle(
    styles.customRadius
  );
  expect(screen.getByTestId('custom-radius')).toHaveStyle({
    borderTopLeftRadius: 15, // styles.customRadius - 1px outline
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 15, // styles.customRadius - 1px outline
  });
});

it('renders button without border radius', async () => {
  await render(
    <Button
      testID="custom-radius"
      style={styles.noRadius}
      label="Custom radius"
    />
  );

  expect(screen.getByTestId('custom-radius-container')).toHaveStyle(
    styles.noRadius
  );
  expect(screen.getByTestId('custom-radius')).toHaveStyle(styles.noRadius);
});

it('should execute onPressIn', async () => {
  const onPressInMock = jest.fn();
  const onPress = jest.fn();

  await render(
    <Button onPress={onPress} onPressIn={onPressInMock} testID="button" />
  );
  await fireEvent(screen.getByTestId('button'), 'onPressIn');
  expect(onPressInMock).toHaveBeenCalledTimes(1);
});

it('should execute onPressOut', async () => {
  const onPressOutMock = jest.fn();
  const onPress = jest.fn();

  await render(
    <Button onPress={onPress} onPressOut={onPressOutMock} testID="button" />
  );
  await fireEvent(screen.getByTestId('button'), 'onPressOut');
  expect(onPressOutMock).toHaveBeenCalledTimes(1);
});

describe('label prop', () => {
  it('renders the label text', async () => {
    await render(<Button testID="button" label="My label" />);

    expect(screen.getByTestId('button-text')).toHaveTextContent('My label');
  });

  it('takes precedence over children', async () => {
    await render(
      <Button testID="button" label="From label">
        From children
      </Button>
    );

    expect(screen.getByTestId('button-text')).toHaveTextContent('From label');
  });
});

describe('deprecated children prop', () => {
  it('still renders the children as the label', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(<Button testID="button">Legacy label</Button>);

    expect(screen.getByTestId('button-text')).toHaveTextContent('Legacy label');
    warn.mockRestore();
  });

  it('warns about the deprecation', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(<Button>Legacy label</Button>);

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('`children` prop is deprecated')
    );
    warn.mockRestore();
  });
});

describe('button text styles', () => {
  it('applies uppercase styles if uppercase prop is truthy', async () => {
    await render(<Button testID="button" uppercase label="Test" />);

    expect(screen.getByTestId('button-text')).toHaveStyle({
      textTransform: 'uppercase',
    });
  });

  it('does not apply uppercase styles if uppercase prop is falsy', async () => {
    await render(<Button testID="button" uppercase={false} label="Test" />);

    expect(screen.getByTestId('button-text')).not.toHaveStyle({
      textTransform: 'uppercase',
    });
  });
});

describe('button icon styles', () => {
  it('should return correct icon styles for compact text button', async () => {
    await render(
      <Button
        mode={'text'}
        compact
        icon="camera"
        testID="compact-button"
        label="Compact text button"
      />
    );
    expect(screen.getByTestId('compact-button-icon-container')).toHaveStyle({
      marginLeft: 6,
      marginRight: 0,
    });
  });

  (['outlined', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct icon styles for compact ${mode} button`, async () => {
      await render(
        <Button
          mode={mode}
          compact
          icon="camera"
          testID="compact-button"
          label={`Compact ${mode} button`}
        />
      );
      expect(screen.getByTestId('compact-button-icon-container')).toHaveStyle({
        marginLeft: 8,
        marginRight: 0,
      });
    })
  );

  it('should return correct icon styles for text button', async () => {
    await render(
      <Button
        mode={'text'}
        icon="camera"
        testID="compact-button"
        label="text button"
      />
    );
    expect(screen.getByTestId('compact-button-icon-container')).toHaveStyle({
      marginLeft: 12,
      marginRight: -8,
    });
  });

  (['outlined', 'filled', 'tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct icon styles for compact ${mode} button`, async () => {
      await render(
        <Button
          mode={mode}
          icon="camera"
          testID="compact-button"
          label={`${mode} button`}
        />
      );
      expect(screen.getByTestId('compact-button-icon-container')).toHaveStyle({
        marginLeft: 16,
        marginRight: -8,
      });
    })
  );
});

describe('icon position', () => {
  it('places the icon before the label by default', async () => {
    await render(
      <Button testID="button" mode="outlined" icon="camera" label="Press me" />
    );

    expect(screen.getByTestId('button-icon-container')).toHaveStyle({
      marginLeft: 16,
      marginRight: -8,
    });
  });

  it('places the icon after the label when iconPosition is "trailing"', async () => {
    await render(
      <Button
        testID="button"
        mode="outlined"
        icon="chevron-right"
        iconPosition="trailing"
        label="Next"
      />
    );

    expect(screen.getByTestId('button-icon-container')).toHaveStyle({
      marginLeft: -8,
      marginRight: 16,
    });
  });

  it('still flips the icon via the deprecated contentStyle row-reverse and warns', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    await render(
      <Button
        testID="button"
        mode="outlined"
        icon="chevron-right"
        contentStyle={styles.flexing}
        label="Next"
      />
    );

    expect(screen.getByTestId('button-icon-container')).toHaveStyle({
      marginLeft: -8,
      marginRight: 16,
    });
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('`contentStyle`')
    );
    warn.mockRestore();
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
      borderColor: getTheme().colors.outline,
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
      borderColor: getTheme(true).colors.outline,
    });
  });

  it('should return correct border color, for theme version 3, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return correct border color, for theme version 3, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: getTheme(true).colors.outline,
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
  paddingHorizontal: number,
  iconSize: number,
  iconGap: number,
  labelVariant: ButtonLabelVariant,
][] = [
  ['extra-small', 32, 12, 20, 4, 'labelLarge'],
  ['small', 40, 16, 20, 8, 'labelLarge'],
  ['medium', 56, 24, 24, 8, 'titleMedium'],
  ['large', 96, 48, 32, 12, 'headlineSmall'],
  ['extra-large', 136, 64, 40, 16, 'headlineLarge'],
];

describe('getButtonSizeStyle', () => {
  it.each(sizeMetrics)(
    'returns expected metrics for %s',
    (size, minHeight, paddingHorizontal, iconSize, iconGap, labelVariant) => {
      expect(getButtonSizeStyle(size)).toEqual({
        minHeight,
        paddingHorizontal,
        iconSize,
        iconGap,
        labelVariant,
      });
    }
  );
});

describe('size prop', () => {
  it('renders a button with per-size metrics', async () => {
    const tree = (
      await render(<Button size="medium" icon="camera" label="Medium" />)
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
      await render(<Button size={size} testID="button" label="X" />);
      expect(screen.getByTestId('button-text')).toHaveStyle({
        fontSize: expectedFontSize,
      });
    })
  );
});

describe('accessible touch target', () => {
  it('expands extra-small buttons to the 48dp minimum target', async () => {
    await render(<Button size="extra-small" testID="button" label="X" />);
    // (48 - 32) / 2 = 8
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toMatchObject({
      top: 8,
      bottom: 8,
    });
  });

  it('expands small buttons to the 48dp minimum target', async () => {
    await render(<Button size="small" testID="button" label="X" />);
    // (48 - 40) / 2 = 4
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toMatchObject({
      top: 4,
      bottom: 4,
    });
  });

  it('does not add hitSlop for buttons already at least 48dp tall', async () => {
    await render(<Button size="medium" testID="button" label="X" />);
    // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
    expect(screen.getByTestId('button').props.hitSlop).toBeUndefined();
  });

  it('keeps a user-supplied hitSlop axis while filling the rest', async () => {
    await render(
      <Button
        size="extra-small"
        testID="button"
        label="X"
        hitSlop={{ top: 20 }}
      />
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

  it('falls back to default radii when size is omitted', () => {
    const theme = getTheme();
    expect(getButtonShapeRadius({ shape: 'round', theme })).toBe(9999);
    expect(getButtonShapeRadius({ shape: 'square', theme })).toBe(12);
  });
});

describe('shape prop', () => {
  it('applies the round (full-pill) radius', async () => {
    await render(<Button testID="button" shape="round" label="X" />);
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 9999,
    });
  });

  it('applies the square radius (default size)', async () => {
    await render(<Button testID="button" shape="square" label="X" />);
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 12,
    });
  });

  it('uses the per-size square radius when both size and shape are set', async () => {
    await render(
      <Button testID="button" size="large" shape="square" label="X" />
    );
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 28,
    });
  });

  it('lets an explicit borderRadius in `style` override the shape', async () => {
    await render(
      <Button
        testID="button"
        shape="round"
        style={styles.overrideRadius}
        label="X"
      />
    );
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 4,
    });
  });
});

describe('selected prop', () => {
  it('marks the button as selected for screen readers', async () => {
    await render(
      <Button testID="button" selected onPress={() => {}} label="X" />
    );

    expect(screen.getByTestId('button')).toBeSelected();
  });

  it('flips a round button into the square radius when selected', async () => {
    await render(
      <Button testID="button" size="large" shape="round" selected label="X" />
    );

    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 28,
    });
  });

  it('flips a square button into the round radius when selected', async () => {
    await render(<Button testID="button" shape="square" selected label="X" />);

    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 9999,
    });
  });

  it('gives an outlined button the tonal-selected appearance', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
      labelColor: getTheme().colors.onSecondaryContainer,
      borderColor: 'transparent',
      borderWidth: 0,
    });
  });

  it('gives a text-mode button the tonal-selected appearance', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'text',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
      labelColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('does not change filled colors when selected', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'filled',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
      labelColor: getTheme().colors.onPrimary,
    });
  });
});

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <Button
      mode="elevated"
      compact
      icon="camera"
      style={[{ transform: [{ scale: value }] }]}
      label="Compact button"
    />
  );
  expect(screen.getByTestId('button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByTestId('button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});

describe('shape morph animation', () => {
  const lastSpringToValue = (spy: jest.Spied<typeof Animated.spring>) =>
    spy.mock.calls.map((call) => call[1]?.toValue);

  it('springs the corner radius to corner.small on press in', async () => {
    const spy = jest.spyOn(Animated, 'spring');
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button" />
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(lastSpringToValue(spy)).toContain(getTheme().shapes.corner.small);
    spy.mockRestore();
  });

  it('springs the corner radius back to the resting pill radius on press out', async () => {
    const spy = jest.spyOn(Animated, 'spring');
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button" />
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressOut');
    // small round resting radius = minHeight (40) / 2 = 20
    expect(lastSpringToValue(spy)).toContain(20);
    spy.mockRestore();
  });

  it('animates between round and square radii when toggled (no spring on mount)', async () => {
    const spy = jest.spyOn(Animated, 'spring');
    await render(
      <Button shape="square" size="large" onPress={() => {}} testID="button" />
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
      />
    );
    // selected flips square -> round; large round resting radius = 96 / 2 = 48
    expect(lastSpringToValue(spy)).toContain(48);
    spy.mockRestore();
  });

  it('does not morph legacy or size-only buttons', async () => {
    const spy = jest.spyOn(Animated, 'spring');
    await render(<Button onPress={() => {}} testID="button" label="Legacy" />);
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(spy).not.toHaveBeenCalled();

    await screen.rerender(
      <Button size="small" onPress={() => {}} testID="button" label="Sized" />
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('does not morph when the user pins a radius via style', async () => {
    const spy = jest.spyOn(Animated, 'spring');
    await render(
      <Button
        shape="round"
        size="small"
        style={styles.overrideRadius}
        onPress={() => {}}
        testID="button"
      />
    );
    spy.mockClear();
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: 4,
    });
    spy.mockRestore();
  });

  it('applies the pressed corner radius to the surface', async () => {
    await render(
      <Button shape="round" size="small" onPress={() => {}} testID="button" />
    );
    await fireEvent(screen.getByTestId('button'), 'onPressIn');
    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId('button-container')).toHaveStyle({
      borderRadius: getTheme().shapes.corner.small,
    });
  });
});
