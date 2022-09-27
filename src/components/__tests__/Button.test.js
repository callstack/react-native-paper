import * as React from 'react';
import { StyleSheet } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';
import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { pink500, black, white } from '../../styles/themes/v2/colors';
import Button from '../Button/Button.tsx';
import { getButtonColors } from '../Button/utils';

const styles = StyleSheet.create({
  flexing: {
    flexDirection: 'row-reverse',
  },
});

it('renders text button by default', () => {
  const tree = renderer.create(<Button>Text Button</Button>).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders text button with mode', () => {
  const tree = renderer
    .create(<Button mode="text">Text Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined button with mode', () => {
  const tree = renderer
    .create(<Button mode="outlined">Outlined Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders contained contained with mode', () => {
  const tree = renderer
    .create(<Button mode="contained">Contained Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon', () => {
  const tree = renderer
    .create(<Button icon="camera">Icon Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with icon in reverse order', () => {
  const tree = renderer
    .create(
      <Button icon="chevron-right" contentStyle={styles.flexing}>
        Right Icon
      </Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading button', () => {
  const tree = renderer
    .create(<Button loading>Loading Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled button', () => {
  const tree = renderer
    .create(<Button disabled>Disabled Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with color', () => {
  const tree = renderer
    .create(<Button textColor={pink500}>Custom Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with button color', () => {
  const tree = renderer
    .create(<Button buttonColor={pink500}>Custom Button</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with custom testID', () => {
  const tree = renderer
    .create(<Button testID={'custom:testID'}>Button with custom testID</Button>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility label', () => {
  const tree = renderer
    .create(
      <Button accessibilityLabel={'label'}>
        Button with accessibility label
      </Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders button with an accessibility hint', () => {
  const tree = renderer
    .create(
      <Button accessibilityHint={'hint'}>Button with accessibility hint</Button>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('should execute onPressIn', () => {
  const onPressInMock = jest.fn();
  const onPress = jest.fn();

  const { getByTestId } = render(
    <Button onPress={onPress} onPressIn={onPressInMock} testID="button" />
  );
  fireEvent(getByTestId('button'), 'onPressIn');
  expect(onPressInMock).toHaveBeenCalledTimes(1);
});

it('should execute onPressOut', () => {
  const onPressOutMock = jest.fn();
  const onPress = jest.fn();

  const { getByTestId } = render(
    <Button onPress={onPress} onPressOut={onPressOutMock} testID="button" />
  );
  fireEvent(getByTestId('button'), 'onPressOut');
  expect(onPressOutMock).toHaveBeenCalledTimes(1);
});

describe('getButtonColors - background color', () => {
  const customButtonColor = '#111111';

  it('should return custom color no matter what is the theme version, when not disabled', () => {
    expect(
      getButtonColors({
        customButtonColor,
        theme: getTheme(),
        disabled: false,
      })
    ).toMatchObject({ backgroundColor: customButtonColor });
  });

  ['outlined', 'text'].forEach((mode) =>
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

  ['outlined', 'text'].forEach((mode) =>
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

  ['contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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
      })
    ).toMatchObject({ textColor: customTextColor });
  });

  it('should return correct disabled text color, for theme version 3, no matter what the mode is', () => {
    expect(
      getButtonColors({
        customTextColor,
        theme: getTheme(),
        disabled: true,
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
      })
    ).toMatchObject({
      textColor: getTheme(true).colors.onSurfaceDisabled,
    });
  });

  ['contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['outlined', 'text', 'elevated'].forEach((mode) =>
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

  ['outlined', 'text', 'elevated'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'outlined'].forEach((mode) =>
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

  ['text', 'contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['text', 'contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['text', 'contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['text', 'contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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

  ['text', 'contained', 'contained-tonal', 'elevated'].forEach((mode) =>
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
