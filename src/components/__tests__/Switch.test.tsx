import * as React from 'react';
import { Platform } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';

import { getTheme } from '../../core/theming';
import { Colors } from '../../styles/themes/tokens';
import Switch from '../Switch/Switch';
import {
  white,
  black,
  grey400,
  grey50,
  grey800,
  grey700,
} from '../Switch/utils';
import { getSwitchColor } from '../Switch/utils';

it('renders on switch', () => {
  const tree = render(<Switch value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders off switch', () => {
  const tree = render(<Switch value={false} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled switch', () => {
  const tree = render(<Switch disabled value />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders switch with color', () => {
  const tree = render(<Switch value color={Colors.error50} />).toJSON();

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

  it('should return custom color for iOS platform', () => {
    Platform.OS = 'ios';

    expect(
      getSwitchColor({
        theme: getTheme(),
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
