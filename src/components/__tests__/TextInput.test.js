import * as React from 'react';
import color from 'color';
import { StyleSheet, Text, Platform } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';
import TextInput from '../TextInput/TextInput';
import { red500 } from '../../styles/themes/v2/colors';
import {
  getFlatInputColors,
  getOutlinedInputColors,
} from '../TextInput/helpers';
import { getTheme } from '../../core/theming';
import { MD3LightTheme } from '../../styles/themes';

const style = StyleSheet.create({
  inputStyle: {
    color: red500,
  },
  centered: {
    textAlign: 'center',
  },
  height: {
    height: 100,
  },
});

const affixTextValue = '/100';
it('correctly renders left-side icon adornment, and right-side affix adornment', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      left={
        <TextInput.Icon
          icon="heart"
          onPress={() => {
            console.log('!@# press left');
          }}
        />
      }
      right={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
    />
  );
  expect(getByText(affixTextValue)).toBeTruthy();
  expect(getByTestId('left-icon-adornment')).toBeTruthy();
  expect(getByTestId('right-affix-adornment')).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});

it('correctly renders left-side icon adornment, and right-side affix adornment ', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      left={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
      right={
        <TextInput.Icon
          icon="heart"
          onPress={() => {
            console.log('!@# press left');
          }}
        />
      }
    />
  );
  expect(getByText(affixTextValue)).toBeTruthy();
  expect(getByTestId('right-icon-adornment')).toBeTruthy();
  expect(getByTestId('left-affix-adornment')).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies default textAlign based on default RTL', () => {
  const { toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies textAlign center', () => {
  const { toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      style={style.centered}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies height to multiline Outline TextInput', () => {
  const { toJSON } = render(
    <TextInput
      mode="outlined"
      label="Outline Input"
      placeholder="Type Something"
      value={'Some test value'}
      style={style.height}
      multiline
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('correctly applies error state Outline TextInput', () => {
  const { getByTestId } = render(
    <TextInput
      mode="outlined"
      label="Outline Input with error"
      placeholder="Type Something"
      value={'Some test value'}
      error
    />
  );

  const outline = getByTestId('text-input-outline');
  expect(outline).toHaveStyle({ borderWidth: 2 });
});

it('correctly applies focused state Outline TextInput', () => {
  const { getByTestId } = render(
    <TextInput
      mode="outlined"
      label="Outline Input with error"
      placeholder="Type Something"
      value={'Some test value'}
      error
    />
  );

  const outline = getByTestId('text-input-outline');
  expect(outline).toHaveStyle({ borderWidth: 2 });

  fireEvent(getByTestId('text-input-outlined'), 'focus');

  expect(outline).toHaveStyle({ borderWidth: 2 });
});

it('contains patch spacing for flat input when ios and multiline', () => {
  Platform.OS = 'ios';
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      multiline
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
    />
  );
  expect(getByTestId('patch-container')).toBeTruthy();
});

it('correctly applies a component as the text label', () => {
  const { toJSON } = render(
    <TextInput
      label={<Text style={style.inputStyle}>Flat input</Text>}
      placeholder="Type something"
      value={'Some test value'}
    />
  );

  expect(toJSON()).toMatchSnapshot();
});

it('renders label with correct color when active', () => {
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      testID={'text-input'}
    />
  );

  fireEvent(getByTestId('text-input-flat'), 'focus');

  expect(getByTestId('text-input-label-active')).toHaveStyle({
    color: getTheme().colors.primary,
  });
});

it('renders label with correct color when inactive', () => {
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      onChangeText={(text) => this.setState({ text })}
      testID={'text-input'}
    />
  );

  expect(getByTestId('text-input-label-inactive')).toHaveStyle({
    color: getTheme().colors.onSurfaceVariant,
  });
});

describe('maxFontSizeMultiplier', () => {
  const createInput = (type, maxFontSizeMultiplier) => {
    return (
      <TextInput mode={type} maxFontSizeMultiplier={maxFontSizeMultiplier} />
    );
  };

  it('should have default value in flat input', () => {
    const { getByTestId } = render(createInput('flat'));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(
      1.5
    );
  });

  it('should have default value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined'));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      1.5
    );
  });

  it('should have correct passed value in flat input', () => {
    const { getByTestId } = render(createInput('flat', 2));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(2);
  });

  it('should have correct passed value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined', 2));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      2
    );
  });

  it('should have passed null value in flat input', () => {
    const { getByTestId } = render(createInput('flat', null));

    expect(getByTestId('text-input-flat').props.maxFontSizeMultiplier).toBe(
      null
    );
  });

  it('should have passed null value in outlined input', () => {
    const { getByTestId } = render(createInput('outlined', null));

    expect(getByTestId('text-input-outlined').props.maxFontSizeMultiplier).toBe(
      null
    );
  });
});

describe('getFlatInputColor - underline color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      underlineColorCustom: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      underlineColorCustom: 'transparent',
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      underlineColorCustom: getTheme().colors.onSurface,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      underlineColorCustom: getTheme(false, false).colors.disabled,
    });
  });

  it('should return custom color, no matter what the theme is', () => {
    expect(
      getFlatInputColors({
        underlineColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      underlineColorCustom: 'beige',
    });

    expect(
      getFlatInputColors({
        underlineColor: 'beige',
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      underlineColorCustom: 'beige',
    });
  });
});

describe('getFlatInputColor - input text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      inputTextColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      inputTextColor: color(getTheme(false, false).colors?.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      inputTextColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      inputTextColor: getTheme(false, false).colors.text,
    });
  });
});

describe('getFlatInputColor - placeholder color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      placeholderColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      placeholderColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      placeholderColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      placeholderColor: getTheme(false, false).colors.placeholder,
    });
  });
});

describe('getFlatInputColor - background color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      backgroundColor: color(MD3LightTheme.colors.onSecondaryContainer)
        .alpha(0.08)
        .rgb()
        .string(),
    });
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(true),
      })
    ).toMatchObject({
      backgroundColor: color(MD3LightTheme.colors.onSecondaryContainer)
        .alpha(0.08)
        .rgb()
        .string(),
    });
  });

  it('should return undefined when disabled, for theme version 2', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      backgroundColor: undefined,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2, light mode', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      backgroundColor: color(getTheme(false, false).colors?.background)
        .darken(0.06)
        .rgb()
        .string(),
    });
  });

  it('should return correct theme color, for theme version 2, dark mode', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      backgroundColor: color(getTheme(true, false).colors?.background)
        .lighten(0.24)
        .rgb()
        .string(),
    });
  });
});

describe('getFlatInputColor - error color', () => {
  it('should return correct error color, no matter what the theme is', () => {
    expect(
      getFlatInputColors({
        error: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      errorColor: getTheme().colors.error,
    });

    expect(
      getFlatInputColors({
        error: true,
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      errorColor: getTheme(false, true).colors.error,
    });
  });
});

describe('getFlatInputColor - active color', () => {
  it('should return disabled color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return disabled color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      activeColor: color(getTheme(false, false).colors?.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });

  it('should return correct active color, if error, no matter what the theme is', () => {
    expect(
      getFlatInputColors({
        error: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.error,
    });

    expect(
      getFlatInputColors({
        error: true,
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: getTheme(false, true).colors.error,
    });
  });

  it('should return custom active color, no matter what the theme is', () => {
    expect(
      getFlatInputColors({
        activeUnderlineColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: 'beige',
    });

    expect(
      getFlatInputColors({
        activeUnderlineColor: 'beige',
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: 'beige',
    });
  });

  it('should return theme active color, for theme version 3', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.primary,
    });
  });

  it('should return theme active color, for theme version 2', () => {
    expect(
      getFlatInputColors({
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: getTheme(false, true).colors.primary,
    });
  });
});

describe('getOutlinedInputColors - outline color', () => {
  it('should return correct disabled color, for theme version 3, light theme', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      outlineColor: getTheme().colors.surfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 3, dark theme', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(true),
      })
    ).toMatchObject({
      outlineColor: 'transparent',
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      outlineColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return custom color as disabled, when it is transparent, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        customOutlineColor: 'transparent',
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      outlineColor: 'transparent',
    });
  });

  it('should return custom color, if not disabled, no matter what the theme is', () => {
    expect(
      getOutlinedInputColors({
        customOutlineColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      outlineColor: 'beige',
    });

    expect(
      getOutlinedInputColors({
        customOutlineColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      outlineColor: 'beige',
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      outlineColor: getTheme().colors.outline,
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      outlineColor: getTheme(false, false).colors.placeholder,
    });
  });
});

describe('getOutlinedInputColors - input text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      inputTextColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      inputTextColor: color(getTheme(false, false).colors?.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      inputTextColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      inputTextColor: getTheme(false, false).colors.text,
    });
  });
});

describe('getOutlinedInputColors - placeholder color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      placeholderColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      placeholderColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return correct theme color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      placeholderColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      placeholderColor: getTheme(false, false).colors.placeholder,
    });
  });
});

describe('getOutlinedInputColors - error color', () => {
  it('should return correct error color, no matter what the theme is', () => {
    expect(
      getOutlinedInputColors({
        error: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      errorColor: getTheme().colors.error,
    });

    expect(
      getOutlinedInputColors({
        error: true,
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      errorColor: getTheme(false, true).colors.error,
    });
  });
});

describe('getOutlinedInputColors - active color', () => {
  it('should return disabled color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return disabled color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      activeColor: color(getTheme(false, false).colors?.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });

  it('should return correct active color, if error, no matter what the theme is', () => {
    expect(
      getOutlinedInputColors({
        error: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.error,
    });

    expect(
      getOutlinedInputColors({
        error: true,
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: getTheme(false, true).colors.error,
    });
  });

  it('should return custom active color, no matter what the theme is', () => {
    expect(
      getOutlinedInputColors({
        activeOutlineColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: 'beige',
    });

    expect(
      getOutlinedInputColors({
        activeOutlineColor: 'beige',
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: 'beige',
    });
  });

  it('should return theme active color, for theme version 3', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      activeColor: getTheme().colors.primary,
    });
  });

  it('should return theme active color, for theme version 2', () => {
    expect(
      getOutlinedInputColors({
        theme: getTheme(false, true),
      })
    ).toMatchObject({
      activeColor: getTheme(false, true).colors.primary,
    });
  });
});
