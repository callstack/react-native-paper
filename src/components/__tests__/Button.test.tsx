import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';

import { act, fireEvent, render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { black, pink500, white } from '../../styles/themes/v2/colors';
import Button from '../Button/Button';
import { getButtonColors } from '../Button/utils';

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row-reverse',
  },
  columnFlex: {
    flexDirection: 'column',
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
});

it('renders text button by default', () => {
  const tree = render(<Button>Text Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders text button with mode', () => {
  const tree = render(<Button mode="text">Text Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined button with mode', () => {
  const tree = render(
    <Button mode="outlined">Outlined Button</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders contained contained with mode', () => {
  const tree = render(
    <Button mode="contained">Contained Button</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon', () => {
  const tree = render(<Button icon="camera">Icon Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon in reverse order', () => {
  const tree = render(
    <Button icon="chevron-right" contentStyle={styles.flexing}>
      Right Icon
    </Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon on top', () => {
  const tree = render(
    <Button icon="camera" contentStyle={styles.columnFlex}>
      Icon on Top
    </Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading button', () => {
  const tree = render(<Button loading>Loading Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button', () => {
  const tree = render(<Button disabled>Disabled Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button if there is no touch handler passed', () => {
  const { getByTestId } = render(
    <Button testID="disabled-button">Disabled button</Button>
  );

  expect(getByTestId('disabled-button').props.accessibilityState).toMatchObject(
    {
      disabled: true,
    }
  );
});

it('renders active button if only onLongPress handler is passed', () => {
  const { getByTestId } = render(
    <Button onLongPress={() => {}} testID="active-button">
      Active button
    </Button>
  );

  expect(getByTestId('active-button').props.accessibilityState).toMatchObject({
    disabled: false,
  });
});

it('renders button with color', () => {
  const tree = render(
    <Button textColor={pink500}>Custom Button</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with button color', () => {
  const tree = render(
    <Button buttonColor={pink500}>Custom Button</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom testID', () => {
  const tree = render(
    <Button testID={'custom:testID'}>Button with custom testID</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility label', () => {
  const tree = render(
    <Button accessibilityLabel={'label'}>
      Button with accessibility label
    </Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility hint', () => {
  const tree = render(
    <Button accessibilityHint={'hint'}>Button with accessibility hint</Button>
  ).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom border radius', () => {
  const { getByTestId } = render(
    <Button testID="custom-radius" style={styles.customRadius}>
      Custom radius
    </Button>
  );

  expect(getByTestId('custom-radius-container')).toHaveStyle(
    styles.customRadius
  );
  expect(getByTestId('custom-radius')).toHaveStyle(styles.customRadius);
});

it('renders button without border radius', () => {
  const { getByTestId } = render(
    <Button testID="custom-radius" style={styles.noRadius}>
      Custom radius
    </Button>
  );

  expect(getByTestId('custom-radius-container')).toHaveStyle(styles.noRadius);
  expect(getByTestId('custom-radius')).toHaveStyle(styles.noRadius);
});

it('should execute onPressIn', () => {
  const onPressInMock = jest.fn();
  const onPress = jest.fn();

  const { getByTestId } = render(
    <Button onPress={onPress} onPressIn={onPressInMock} testID="button">
      {null}
    </Button>
  );
  fireEvent(getByTestId('button'), 'onPressIn');
  expect(onPressInMock).toHaveBeenCalledTimes(1);
});

it('should execute onPressOut', () => {
  const onPressOutMock = jest.fn();
  const onPress = jest.fn();

  const { getByTestId } = render(
    <Button onPress={onPress} onPressOut={onPressOutMock} testID="button">
      {null}
    </Button>
  );
  fireEvent(getByTestId('button'), 'onPressOut');
  expect(onPressOutMock).toHaveBeenCalledTimes(1);
});

describe('button text styles', () => {
  it('applies uppercase styles if uppercase prop is truthy', () => {
    const { getByTestId } = render(
      <Button testID="button" uppercase>
        Test
      </Button>
    );

    expect(getByTestId('button-text')).toHaveStyle({
      textTransform: 'uppercase',
    });
  });

  it('does not apply uppercase styles if uppercase prop is falsy', () => {
    const { getByTestId } = render(
      <Button testID="button" uppercase={false}>
        Test
      </Button>
    );

    expect(getByTestId('button-text')).not.toHaveStyle({
      textTransform: 'uppercase',
    });
  });
});

describe('button icon styles', () => {
  it('should return correct icon styles for compact text button', () => {
    const { getByTestId } = render(
      <Button mode={'text'} compact icon="camera" testID="compact-button">
        Compact text button
      </Button>
    );
    expect(getByTestId('compact-button-icon-container')).toHaveStyle({
      marginLeft: 6,
      marginRight: 0,
    });
  });

  (['outlined', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
      it(`should return correct icon styles for compact ${mode} button`, () => {
        const { getByTestId } = render(
          <Button mode={mode} compact icon="camera" testID="compact-button">
            Compact {mode} button
          </Button>
        );
        expect(getByTestId('compact-button-icon-container')).toHaveStyle({
          marginLeft: 8,
          marginRight: 0,
        });
      })
  );

  it('should return correct icon styles for text button', () => {
    const { getByTestId } = render(
      <Button mode={'text'} icon="camera" testID="compact-button">
        text button
      </Button>
    );
    expect(getByTestId('compact-button-icon-container')).toHaveStyle({
      marginLeft: 12,
      marginRight: -8,
    });
  });

  (['outlined', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
      it(`should return correct icon styles for compact ${mode} button`, () => {
        const { getByTestId } = render(
          <Button mode={mode} icon="camera" testID="compact-button">
            {mode} button
          </Button>
        );
        expect(getByTestId('compact-button-icon-container')).toHaveStyle({
          marginLeft: 16,
          marginRight: -16,
        });
      })
  );
});

describe('button icon on top styles', () => {
  it('should return correct content styles for icon when displayed on top', () => {
    const { getByTestId } = render(
      <Button
        mode={'contained'}
        icon="camera"
        contentStyle={styles.columnFlex}
        testID="compact-button"
      >
        Compact text button
      </Button>
    );
    expect(getByTestId('compact-button-icon-container')).toHaveStyle({
      marginTop: 8,
      marginRight: 4,
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

  (['contained', 'contained-tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: getTheme().colors.surfaceDisabled,
      });
    })
  );

  (['contained', 'contained-tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, dark theme, ${mode} mode`, () => {
      return expect(
        getButtonColors({
          customButtonColor,
          theme: getTheme(true),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: getTheme(true).colors.surfaceDisabled,
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
      backgroundColor: getTheme().colors.elevation.level1,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, elevated mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'elevated',
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.elevation.level1,
    });
  });

  it('should return correct theme color, for theme version 3, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme(true).colors.primary,
    });
  });

  it('should return correct theme color, for theme version 3, contained-tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, dark theme, contained-tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'contained-tonal',
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

  it('should return correct theme color, for theme version 2, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme(false, false).colors.primary,
    });
  });

  it('should return correct theme color, for theme version 2, when disabled, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        mode: 'contained',
        disabled: true,
      })
    ).toMatchObject({
      backgroundColor: color(black).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct theme color, for theme version 2, when disabled, dark theme, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true, false),
        mode: 'contained',
        disabled: true,
      })
    ).toMatchObject({
      backgroundColor: color(white).alpha(0.12).rgb().string(),
    });
  });

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme color, for theme version 2, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(false, false),
          mode,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme color, for theme version 2, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true, false),
          mode,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme color, for theme version 2, when disabled, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(false, false),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme color, for theme version 2, when disabled, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true, false),
          mode,
          disabled: true,
        })
      ).toMatchObject({
        backgroundColor: 'transparent',
      });
    })
  );
});

describe('getButtonColors - text color', () => {
  const customTextColor = '#313131';

  it('should return custom text color no matter what is the theme version, when not disabled', () => {
    expect(
      getButtonColors({
        customTextColor,
        theme: getTheme(),
        disabled: false,
        mode: 'text',
      })
    ).toMatchObject({ textColor: customTextColor });
  });

  it('should return correct disabled text color, for theme version 3, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customTextColor,
        theme: getTheme(),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled text color, for theme version 3, dark theme, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customTextColor,
        theme: getTheme(true),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      textColor: getTheme(true).colors.onSurfaceDisabled,
    });
  });

  (['contained', 'contained-tonal', 'elevated'] as const).forEach((mode) =>
    it(`should return correct text color for dark prop, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
          dark: true,
        })
      ).toMatchObject({
        textColor: white,
      });
    })
  );

  (['outlined', 'text', 'elevated'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 3, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({
        textColor: getTheme().colors.primary,
      });
    })
  );

  (['outlined', 'text', 'elevated'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 3, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true),
          mode,
        })
      ).toMatchObject({
        textColor: getTheme(true).colors.primary,
      });
    })
  );

  it('should return correct theme text color, for theme version 3, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      textColor: getTheme().colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'contained',
      })
    ).toMatchObject({
      textColor: getTheme(true).colors.onPrimary,
    });
  });

  it('should return correct theme text color, for theme version 3, contained-tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme text color, for theme version 3, dark theme contained-tonal mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      textColor: getTheme(true).colors.onSecondaryContainer,
    });
  });

  it('should return correct theme text color, for theme version 2, when disabled, no matter what the mode is', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      textColor: color(black).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct theme text color, for theme version 2, when disabled, dark theme, no matter what the mode is', () => {
    expect(
      getButtonColors({
        theme: getTheme(true, false),
        disabled: true,
        mode: 'text',
      })
    ).toMatchObject({
      textColor: color(white).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct theme text color, for theme version 2, contained mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        mode: 'contained',
        dark: true,
      })
    ).toMatchObject({
      textColor: '#ffffff',
    });
  });

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 2, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(false, false),
          mode,
        })
      ).toMatchObject({
        textColor: getTheme(false, false).colors.primary,
      });
    })
  );

  (['text', 'outlined'] as const).forEach((mode) =>
    it(`should return correct theme text color, for theme version 2, dark theme, ${mode} mode`, () => {
      expect(
        getButtonColors({
          theme: getTheme(true, false),
          mode,
        })
      ).toMatchObject({
        textColor: getTheme(true, false).colors.primary,
      });
    })
  );
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
      borderColor: getTheme().colors.surfaceDisabled,
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
      borderColor: getTheme(true).colors.surfaceDisabled,
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

  (['text', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
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

  (['text', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
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

  it('should return correct border color, for theme version 2, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.29).rgb().string(),
    });
  });

  it('should return correct border color, for theme version 2, dark theme, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(true, false),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderColor: color(white).alpha(0.29).rgb().string(),
    });
  });

  (['text', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
      it(`should return transparent border, for theme version 2, ${mode} mode`, () => {
        expect(
          getButtonColors({
            theme: getTheme(false, false),
            mode,
          })
        ).toMatchObject({
          borderColor: 'transparent',
        });
      })
  );

  (['text', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
      it(`should return transparent border, for theme version 2, dark theme, ${mode} mode`, () => {
        expect(
          getButtonColors({
            theme: getTheme(false, false),
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

  it('should return correct border width, for theme version 2, outlined mode', () => {
    expect(
      getButtonColors({
        theme: getTheme(false, false),
        mode: 'outlined',
      })
    ).toMatchObject({
      borderWidth: StyleSheet.hairlineWidth,
    });
  });

  (['text', 'contained', 'contained-tonal', 'elevated'] as const).forEach(
    (mode) =>
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

it('animated value changes correctly', () => {
  const value = new Animated.Value(1);
  const { getByTestId } = render(
    <Button
      mode="elevated"
      compact
      icon="camera"
      style={[{ transform: [{ scale: value }] }]}
    >
      Compact button
    </Button>
  );
  expect(getByTestId('button-container-outer-layer')).toHaveStyle({
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
  expect(getByTestId('button-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
