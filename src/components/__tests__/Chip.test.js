import * as React from 'react';

import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import Chip from '../Chip/Chip.tsx';
import { getChipColors } from '../Chip/helpers';

it('renders chip with onPress', () => {
  const tree = renderer
    .create(<Chip onPress={() => {}}>Example Chip</Chip>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with icon', () => {
  const tree = renderer
    .create(<Chip icon="information">Example Chip</Chip>)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with close button', () => {
  const tree = renderer
    .create(
      <Chip icon="information" onClose={() => {}}>
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders chip with custom close button', () => {
  const tree = renderer
    .create(
      <Chip icon="information" onClose={() => {}} closeIcon="arrow-down">
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders outlined disabled chip', () => {
  const tree = renderer
    .create(
      <Chip mode="outlined" disabled>
        Example Chip
      </Chip>
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders selected chip', () => {
  const tree = renderer.create(<Chip selected>Example Chip</Chip>).toJSON();

  expect(tree).toMatchSnapshot();
});

describe('getChipColors - text color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      textColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      textColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      textColor: color(getTheme(false, false).colors.text)
        .alpha(0.87)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      textColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      textColor: color('purple').alpha(0.87).rgb().string(),
    });
  });
});

describe('getChipColors - icon color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(),
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2', () => {
    expect(
      getChipColors({
        disabled: true,
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      iconColor: getTheme(false, false).colors.disabled,
    });
  });

  it('should return correct theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      iconColor: getTheme().colors.onSurfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      iconColor: color(getTheme(false, false).colors.text)
        .alpha(0.54)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      iconColor: 'purple',
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      iconColor: color('purple').alpha(0.54).rgb().string(),
    });
  });
});

describe('getChipColors - underlay color', () => {
  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      underlayColor: color(getTheme().colors.onSecondaryContainer)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      underlayColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      underlayColor: color('purple').alpha(0.12).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      underlayColor: color('purple').fade(0.5).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, outline mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      underlayColor: color('purple').lighten(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, flat mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      underlayColor: color('purple').lighten(0.4).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, outline mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      underlayColor: color('purple').darken(0.08).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, flat mode, customBackgroundColor', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      underlayColor: color('purple').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      underlayColor: color(getTheme(false, false).colors.surface)
        .darken(0.08)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      underlayColor: color('#ebebeb').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, outline mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: true,
      })
    ).toMatchObject({
      underlayColor: color(getTheme(true, false).colors.surface)
        .lighten(0.2)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      underlayColor: color('#383838').lighten(0.4).rgb().string(),
    });
  });
});

describe('getChipColor - selected background color', () => {
  it('should return custom color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSurfaceVariant), 0)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSecondaryContainer), 0)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3, outlined mode, show selected overlay', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        showSelectedOverlay: true,
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSurfaceVariant), 0.12)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3, flat mode, show selected overlay', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
        showSelectedOverlay: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple')
        .mix(color(getTheme().colors.onSecondaryContainer), 0.12)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme().colors.surface)
        .mix(color(getTheme().colors.onSurfaceVariant), 0)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme().colors.secondaryContainer)
        .mix(color(getTheme().colors.onSecondaryContainer), 0)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').darken(0.08).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').darken(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').lighten(0.2).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      selectedBackgroundColor: color('purple').lighten(0.4).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      selectedBackgroundColor: color(getTheme(false, false).colors.surface)
        .darken(0.08)
        .rgb()
        .string(),
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      selectedBackgroundColor: color('#ebebeb').darken(0.2).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      selectedBackgroundColor: color('#383838').lighten(0.4).rgb().string(),
    });
  });
});

describe('getChipColor - background color', () => {
  it('should return custom color', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  it('should return theme color, for theme version 3, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surface,
    });
  });

  it('should return theme color, for theme version 3, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return theme color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      backgroundColor: getTheme(false, false).colors.surface,
    });
  });

  it('should return theme color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      backgroundColor: '#ebebeb',
    });
  });

  it('should return theme color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      backgroundColor: '#383838',
    });
  });
});

describe('getChipColor - border color', () => {
  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        disabled: true,
      })
    ).toMatchObject({
      borderColor: color(getTheme().colors.onSurfaceVariant)
        .alpha(0.12)
        .rgb()
        .string(),
    });
  });

  it('should return custom color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
        selectedColor: 'purple',
      })
    ).toMatchObject({
      borderColor: color('purple').alpha(0.29).rgb().string(),
    });
  });

  it('should return theme color, for theme version 3', () => {
    expect(
      getChipColors({
        theme: getTheme(),
      })
    ).toMatchObject({
      borderColor: getTheme().colors.outline,
    });
  });

  it('should return custom color, for theme version 2, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        selectedColor: 'purple',
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color('purple').alpha(0.29).rgb().string(),
    });
  });

  it('should return custom color, for theme version 2, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        customBackgroundColor: 'purple',
      })
    ).toMatchObject({
      borderColor: 'purple',
    });
  });

  it('should return theme color, for theme version 2, light mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.29).rgb().string(),
    });
  });

  it('should return theme color, for theme version 2, dark mode, outlined mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
        isOutlined: true,
      })
    ).toMatchObject({
      borderColor: color(white).alpha(0.29).rgb().string(),
    });
  });

  it('should return theme background color, for theme version 2, light mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      borderColor: '#ebebeb',
    });
  });

  it('should return theme background color, for theme version 2, dark mode, flat mode', () => {
    expect(
      getChipColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      borderColor: '#383838',
    });
  });
});
