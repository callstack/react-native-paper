import * as React from 'react';
import renderer from 'react-test-renderer';
import color from 'color';
import Checkbox from '../../Checkbox';
import {
  getCheckboxAndroidColor,
  getCheckboxIOSColor,
} from '../../Checkbox/utils';

import MD3LightTheme from '../../../styles/themes/v3/LightTheme';
import MD2LightTheme from '../../../styles/themes/v2/LightTheme';
import MD3DarkTheme from '../../../styles/themes/v3/DarkTheme';
import MD2DarkTheme from '../../../styles/themes/v2/DarkTheme';

const getTheme = (isDark = false, isV3 = true) => {
  const theme = isDark
    ? isV3
      ? MD3DarkTheme
      : MD2DarkTheme
    : isV3
    ? MD3LightTheme
    : MD2LightTheme;
  return {
    ...theme,
    isV3,
  };
};

it('renders checked Checkbox with onPress', () => {
  const tree = renderer
    .create(<Checkbox status="checked" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with onPress', () => {
  const tree = renderer
    .create(<Checkbox status="unchecked" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox', () => {
  const tree = renderer
    .create(<Checkbox status="indeterminate" onPress={() => {}} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders checked Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="checked" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders unchecked Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="checked" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders indeterminate Checkbox with color', () => {
  const tree = renderer
    .create(<Checkbox status="indeterminate" color="red" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders Checkbox with custom testID', () => {
  const tree = renderer
    .create(<Checkbox status="checked" testID={'custom:testID'} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getCheckboxAndroidColor - ripple color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurface)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.text)
        .alpha(0.16)
        .rgb()
        .string(),
    });
  });

  it('should return custom color', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        customColor: 'purple',
      })
    ).toMatchObject({
      rippleColor: color('purple').fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.primary).fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.accent)
        .fade(0.32)
        .rgb()
        .string(),
    });
  });
});

describe('getCheckboxAndroidColor - checkbox color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      checkboxColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      checkboxColor: getTheme(false, false).colors.text,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        checked: true,
        customColor: 'purple',
      })
    ).toMatchObject({
      checkboxColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, checked', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      checkboxColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2, checked', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(false, false),
        checked: true,
      })
    ).toMatchObject({
      checkboxColor: getTheme(false, false).colors.accent,
    });
  });

  it('should return custom color, unchecked', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        checked: false,
        customUncheckedColor: 'purple',
      })
    ).toMatchObject({
      checkboxColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, unchecked', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(),
        checked: false,
      })
    ).toMatchObject({
      checkboxColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme color, for theme version 2, unchecked, dark mode', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(true, false),
        checked: false,
      })
    ).toMatchObject({
      checkboxColor: color(getTheme(true, false).colors.text)
        .alpha(0.7)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, unchecked, light mode', () => {
    expect(
      getCheckboxAndroidColor({
        theme: getTheme(false, false),
        checked: false,
      })
    ).toMatchObject({
      checkboxColor: color(getTheme(false, false).colors.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });
});

describe('getCheckboxIOSColor - ripple color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: getTheme().colors.onSurface,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      rippleColor: getTheme(false, false).colors.text,
    });
  });

  it('should return custom color', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
        customColor: 'purple',
      })
    ).toMatchObject({
      rippleColor: color('purple').fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.primary).fade(0.32).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.accent)
        .fade(0.32)
        .rgb()
        .string(),
    });
  });
});

describe('getCheckboxIOSColor - checked color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(false, false),
        disabled: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return custom color, checked', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
        checked: true,
        customColor: 'purple',
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, checked', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(),
        checked: true,
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2, checked', () => {
    expect(
      getCheckboxIOSColor({
        theme: getTheme(false, false),
        checked: true,
      })
    ).toMatchObject({
      checkedColor: getTheme(false, false).colors.accent,
    });
  });
});
