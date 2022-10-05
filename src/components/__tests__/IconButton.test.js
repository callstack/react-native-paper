import * as React from 'react';

import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { pink500 } from '../../styles/themes/v2/colors';
import IconButton from '../IconButton/IconButton.tsx';
import { getIconButtonColor } from '../IconButton/utils';

it('renders icon button by default', () => {
  const tree = renderer.create(<IconButton icon="camera" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with color', () => {
  const tree = renderer
    .create(<IconButton icon="camera" iconColor={pink500} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon button with size', () => {
  const tree = renderer.create(<IconButton icon="camera" size={30} />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled icon button', () => {
  const tree = renderer.create(<IconButton icon="camera" disabled />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders icon change animated', () => {
  const tree = renderer.create(<IconButton icon="camera" animated />).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getIconButtonColor - icon color', () => {
  it('should return custom icon color', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        customIconColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onPrimary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.inverseOnSurface,
    });
  });

  it('should return theme icon color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        selected: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.primary,
    });
  });

  it('should return theme icon color, for theme version 2', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      iconColor: getTheme(false, false).colors.text,
    });
  });
});

describe('getIconButtonColor - background color', () => {
  it('should return custom background color', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        customContainerColor: 'purple',
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  ['contained', 'contained-tonal'].forEach((mode) =>
    it(`should return correct disabled color, for theme version 3, ${mode} mode`, () => {
      expect(
        getIconButtonColor({
          theme: getTheme(),
          mode,
          disabled: true,
        })
      ).toMatchObject({ backgroundColor: getTheme().colors.surfaceDisabled });
    })
  );

  it('should return theme icon color, for theme version 3, mode contained', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primary,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return theme icon color, for theme version 3, mode contained-tonal, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'contained-tonal',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return theme icon color, for theme version 3, mode outlined, selected', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        mode: 'outlined',
        selected: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.inverseSurface,
    });
  });

  it('should return undefined, for theme version 3, if mode not specified', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      backgroundColor: undefined,
    });
  });
});

describe('getIconButtonColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      borderColor: getTheme().colors.surfaceDisabled,
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return undefined, for theme version 2', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      borderColor: undefined,
    });
  });
});

describe('getIconButtonColor - ripple color', () => {
  it('should return theme color, for theme version 3', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(),
      })
    ).toMatchObject({
      rippleColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2', () => {
    expect(
      getIconButtonColor({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      rippleColor: color(getTheme(false, false).colors.text)
        .alpha(0.32)
        .rgb()
        .string(),
    });
  });
});
