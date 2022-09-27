import * as React from 'react';
import { Platform } from 'react-native';

import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import {
  white,
  black,
  grey400,
  grey50,
  grey800,
  pink500,
  grey700,
} from '../../styles/themes/v2/colors';
import Switch from '../Switch/Switch.tsx';
import { getSwitchColor } from '../Switch/utils';

it('renders on switch', () => {
  const tree = renderer.create(<Switch value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders off switch', () => {
  const tree = renderer.create(<Switch value={false} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled switch', () => {
  const tree = renderer.create(<Switch disabled value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders switch with color', () => {
  const tree = renderer.create(<Switch value color={pink500} />).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getSwitchColor - checked color', () => {
  it('should return custom color', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
        color: 'purple',
      })
    ).toMatchObject({
      checkedColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      checkedColor: getTheme().colors.primary,
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getSwitchColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      checkedColor: getTheme(false, false).colors.accent,
    });
  });
});

describe('getSwitchColor - thumb tint color', () => {
  it('should return undefined for iOS platform', () => {
    Platform.OS = 'ios';

    expect(
      getSwitchColor({
        theme: getTheme(true),
      })
    ).toMatchObject({
      thumbTintColor: undefined,
    });
  });

  it('should return correct disabled color, dark mode', () => {
    Platform.OS = 'android';

    expect(
      getSwitchColor({
        theme: getTheme(true),
        disabled: true,
      })
    ).toMatchObject({
      thumbTintColor: grey800,
    });
  });

  it('should return correct disabled color, light mode', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      thumbTintColor: grey400,
    });
  });

  it('should return correct checked color if there is value', () => {
    Platform.OS = 'android';

    expect(
      getSwitchColor({
        theme: getTheme(),
        value: true,
        color: 'purple',
      })
    ).toMatchObject({
      thumbTintColor: 'purple',
    });
  });

  it('should return theme checked color, dark mode', () => {
    Platform.OS = 'android';

    expect(
      getSwitchColor({
        theme: getTheme(true),
      })
    ).toMatchObject({
      thumbTintColor: grey400,
    });
  });

  it('should return theme checked color, light mode', () => {
    Platform.OS = 'android';

    expect(
      getSwitchColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      thumbTintColor: grey50,
    });
  });
});

describe('getSwitchColor - on tint color', () => {
  it('should return checked color for iOS platform, for theme version 3', () => {
    Platform.OS = 'ios';

    expect(
      getSwitchColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      onTintColor: getTheme().colors.primary,
    });
  });

  it('should return checked color for iOS platform, for theme version 2', () => {
    Platform.OS = 'ios';

    expect(
      getSwitchColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      onTintColor: getTheme(false, false).colors.accent,
    });
  });

  it('should return custom color for iOS platform', () => {
    Platform.OS = 'ios';

    expect(
      getSwitchColor({
        theme: getTheme(false, false),
        color: 'purple',
      })
    ).toMatchObject({
      onTintColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3, dark mode', () => {
    Platform.OS = 'android';

    expect(
      getSwitchColor({
        theme: getTheme(true),
        disabled: true,
      })
    ).toMatchObject({
      onTintColor: color(white).alpha(0.06).rgb().string(),
    });
  });

  it('should return correct disabled color, for theme version 2, dark mode', () => {
    expect(
      getSwitchColor({
        theme: getTheme(true, false),
        disabled: true,
      })
    ).toMatchObject({
      onTintColor: color(white).alpha(0.1).rgb().string(),
    });
  });

  it('should return correct disabled color, light mode', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      onTintColor: color(black).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct checked color if there is value', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
        value: true,
        color: 'purple',
      })
    ).toMatchObject({
      onTintColor: color('purple').alpha(0.5).rgb().string(),
    });
  });

  it('should return theme checked color, dark mode', () => {
    expect(
      getSwitchColor({
        theme: getTheme(true),
      })
    ).toMatchObject({
      onTintColor: grey700,
    });
  });

  it('should return theme checked color, light mode', () => {
    expect(
      getSwitchColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      onTintColor: 'rgb(178, 175, 177)',
    });
  });
});
