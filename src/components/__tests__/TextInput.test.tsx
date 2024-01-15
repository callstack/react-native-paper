/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { StyleSheet, Text, Platform, I18nManager, View } from 'react-native';

import { fireEvent, render } from '@testing-library/react-native';
import color from 'color';

import { DefaultTheme, getTheme, ThemeProvider } from '../../core/theming';
import { red500 } from '../../styles/themes/v2/colors';
import {
  getFlatInputColors,
  getOutlinedInputColors,
} from '../TextInput/helpers';
import TextInput, { Props } from '../TextInput/TextInput';

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
  lineHeight: {
    lineHeight: 22,
  },
  contentStyle: {
    paddingLeft: 20,
  },
});

const affixTextValue = '/100';
it('correctly renders left-side icon adornment, and right-side affix adornment', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
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

it('correctly renders left-side affix adornment, and right-side icon adornment', () => {
  const { getByText, getByTestId, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
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

it('correctly applies cursorColor prop', () => {
  const { toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      cursorColor={red500 as string}
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

it('contains patch spacing for flat input when ios, multiline and disabled', () => {
  Platform.OS = 'ios';
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      multiline
      placeholder="Type something"
      value={'Some test value'}
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

it('correctly applies paddingLeft from contentStyleProp', () => {
  const { toJSON } = render(
    <TextInput
      label="With padding"
      placeholder="Type something"
      value={'Some test value'}
      contentStyle={style.contentStyle}
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
      testID={'text-input-flat'}
    />
  );

  fireEvent(getByTestId('text-input-flat'), 'focus');

  expect(getByTestId('text-input-flat-label-active')).toHaveStyle({
    color: getTheme().colors.primary,
  });
});

it('renders label with correct color when inactive', () => {
  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      testID={'text-input'}
    />
  );

  expect(getByTestId('text-input-label-inactive')).toHaveStyle({
    color: getTheme().colors.onSurfaceVariant,
  });
});

it('renders input placeholder initially with an empty space character', () => {
  const { getByTestId } = render(
    <TextInput multiline label="Multiline input" testID={'text-input'} />
  );

  expect(getByTestId('text-input').props.placeholder).toBe(' ');
});

it('correctly applies padding offset to input label on Android when RTL', () => {
  Platform.OS = 'android';
  I18nManager.isRTL = true;

  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      mode="flat"
      testID="text-input-flat"
      left={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
      right={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
    />
  );

  expect(getByTestId('text-input-flat-label-active')).toHaveStyle({
    paddingLeft: 56,
    paddingRight: 16,
  });

  I18nManager.isRTL = false;
});

it('correctly applies padding offset to input label on Android when LTR', () => {
  Platform.OS = 'android';

  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      mode="flat"
      testID="text-input-flat"
      left={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
      right={
        <TextInput.Affix text={affixTextValue} textStyle={style.inputStyle} />
      }
    />
  );

  expect(getByTestId('text-input-flat-label-active')).toHaveStyle({
    paddingLeft: 16,
    paddingRight: 56,
  });
});

it('calls onLayout on right-side affix adornment', () => {
  const onLayoutMock = jest.fn();
  const nativeEventMock = {
    nativeEvent: { layout: { height: 100 } },
  };

  const { getByTestId } = render(
    <TextInput
      label="Flat input"
      placeholder="Type something"
      value={'Some test value'}
      right={<TextInput.Affix text={affixTextValue} onLayout={onLayoutMock} />}
    />
  );
  fireEvent(
    getByTestId('right-affix-adornment-text'),
    'onLayout',
    nativeEventMock
  );
  expect(onLayoutMock).toHaveBeenCalledWith(nativeEventMock);
});

(['outlined', 'flat'] as const).forEach((mode) =>
  it(`renders ${mode} input with correct line height`, () => {
    const input = render(
      <TextInput
        mode={mode}
        multiline
        label="Flat input"
        testID={`text-input-${mode}`}
        style={style.lineHeight}
      />
    );

    expect(input.getByTestId(`text-input-${mode}`)).toHaveStyle({
      lineHeight: 22,
    });
  })
);

(['outlined', 'flat'] as const).forEach((mode) =>
  it(`renders ${mode} input with passed textColor`, () => {
    const input = render(
      <TextInput
        mode={mode}
        multiline
        label="Flat input"
        testID={`text-input-${mode}`}
        style={style.lineHeight}
        textColor={'purple'}
      />
    );

    expect(input.getByTestId(`text-input-${mode}`)).toHaveStyle({
      color: 'purple',
    });
  })
);

it("correctly applies theme background to label when input's background is transparent", () => {
  const backgroundColor = 'transparent';
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'pink',
    },
  };

  const { getByTestId } = render(
    <ThemeProvider theme={theme}>
      <TextInput
        mode="outlined"
        label="Transparent input"
        value={'Some test value'}
        style={{ backgroundColor }}
        testID={'transparent-example'}
      />
    </ThemeProvider>
  );

  expect(getByTestId('transparent-example-label-background')).toHaveStyle({
    backgroundColor: 'pink',
  });
});

it('always applies line height for web, even if not specified', () => {
  Platform.OS = 'web';
  const { getByTestId } = render(
    <View>
      <TextInput
        mode="outlined"
        label="Default font outlined"
        value="Some test value"
        testID="default-font"
      />
      <TextInput
        mode="flat"
        label="Default font outlined - flat"
        value="Some test value"
        testID="default-font-flat"
      />
      <TextInput
        mode="outlined"
        label="Large font outlined"
        value="Some test value"
        testID="large-font"
        style={{
          fontSize: 30,
        }}
      />
      <TextInput
        mode="outlined"
        label="Large font outlined - flat"
        value="Some test value"
        testID="large-font-flat"
        style={{
          fontSize: 30,
        }}
      />
      <TextInput
        mode="outlined"
        label="Custom line height outlined"
        value="Some test value"
        testID="custom-line-height"
        style={{
          fontSize: 40,
          lineHeight: 29,
        }}
      />
      <TextInput
        mode="outlined"
        label="Custom line height outlined - flat"
        value="Some test value"
        testID="custom-line-height-flat"
        style={{
          fontSize: 40,
          lineHeight: 29,
        }}
      />
    </View>
  );

  expect(getByTestId('default-font')).toHaveStyle({ lineHeight: 16 * 1.2 });
  expect(getByTestId('default-font-flat')).toHaveStyle({
    lineHeight: 16 * 1.2,
  });

  expect(getByTestId('large-font')).toHaveStyle({ lineHeight: 30 * 1.2 });
  expect(getByTestId('large-font-flat')).toHaveStyle({ lineHeight: 30 * 1.2 });

  expect(getByTestId('custom-line-height')).toHaveStyle({
    lineHeight: 29,
  });
  expect(getByTestId('custom-line-height-flat')).toHaveStyle({
    lineHeight: 29,
  });
});

it('call onPress when affix adornment pressed', () => {
  const affixOnPress = jest.fn();
  const affixTextValue = '+39';
  const { getByText, toJSON } = render(
    <TextInput
      label="Flat input"
      placeholder="Enter your phone number"
      value={''}
      left={<TextInput.Affix text="+39" onPress={affixOnPress} />}
    />
  );

  fireEvent.press(getByText(affixTextValue));

  expect(getByText(affixTextValue)).toBeTruthy();
  expect(toJSON()).toMatchSnapshot();
  expect(affixOnPress).toHaveBeenCalledTimes(1);
});

describe('maxFontSizeMultiplier', () => {
  const createInput = (
    type: Exclude<Props['mode'], undefined>,
    maxFontSizeMultiplier?: Props['maxFontSizeMultiplier']
  ) => {
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
      underlineColorCustom: getTheme().colors.onSurfaceVariant,
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
  it('should return custom color, if not disabled, no matter what the theme is', () => {
    expect(
      getOutlinedInputColors({
        textColor: 'beige',
        theme: getTheme(),
      })
    ).toMatchObject({
      inputTextColor: 'beige',
    });

    expect(
      getOutlinedInputColors({
        textColor: 'beige',
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      inputTextColor: 'beige',
    });
  });

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
      inputTextColor: getTheme().colors.onSurface,
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
      backgroundColor: color(getTheme().colors.onSurface)
        .alpha(0.04)
        .rgb()
        .string(),
    });
    expect(
      getFlatInputColors({
        disabled: true,
        theme: getTheme(true),
      })
    ).toMatchObject({
      backgroundColor: color(getTheme(true).colors.onSurface)
        .alpha(0.04)
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
        theme: getTheme(false, false),
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
        theme: getTheme(false, false),
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
        theme: getTheme(false, false),
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

describe('outlineStyle - underlineStyle', () => {
  it('correctly applies outline style', () => {
    const { getByTestId } = render(
      <TextInput
        mode="outlined"
        outlineStyle={{ borderRadius: 16, borderWidth: 6 }}
      />
    );

    expect(getByTestId('text-input-outline')).toHaveStyle({
      borderRadius: 16,
      borderWidth: 6,
    });
  });

  it('correctly applies underline style', () => {
    const { getByTestId } = render(
      <TextInput
        mode="flat"
        underlineStyle={{ borderRadius: 16, borderWidth: 6 }}
      />
    );

    expect(getByTestId('text-input-underline')).toHaveStyle({
      borderRadius: 16,
      borderWidth: 6,
    });
  });
});
