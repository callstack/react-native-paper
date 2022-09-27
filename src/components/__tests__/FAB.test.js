import * as React from 'react';
import { StyleSheet } from 'react-native';

import { render } from '@testing-library/react-native';
import color from 'color';
import renderer from 'react-test-renderer';

import { getTheme } from '../../core/theming';
import { black, white } from '../../styles/themes/v2/colors';
import getContrastingColor from '../../utils/getContrastingColor';
import FAB from '../FAB';
import { getFABColors } from '../FAB/utils';

const styles = StyleSheet.create({
  borderRadius: {
    borderRadius: 0,
  },
  small: {
    height: 40,
    width: 40,
    borderRadius: 12,
  },
  medium: {
    height: 56,
    width: 56,
    borderRadius: 16,
  },
  large: {
    height: 96,
    width: 96,
    borderRadius: 28,
  },
});

it('renders default FAB', () => {
  const tree = renderer.create(<FAB onPress={() => {}} icon="plus" />).toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders small FAB', () => {
  const tree = renderer
    .create(<FAB size="small" onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders large FAB', () => {
  const tree = renderer
    .create(<FAB size="large" onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders FAB with custom size prop', () => {
  const tree = renderer
    .create(<FAB customSize={100} onPress={() => {}} icon="plus" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" label="Add items" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders extended FAB with custom size prop', () => {
  const tree = renderer
    .create(
      <FAB customSize={100} onPress={() => {}} icon="plus" label="Add items" />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" loading={true} />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders loading FAB with custom size prop', () => {
  const tree = renderer
    .create(
      <FAB customSize={100} onPress={() => {}} icon="plus" loading={true} />
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders disabled FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" disabled />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders custom color for the icon and label of the FAB', () => {
  const tree = renderer
    .create(<FAB onPress={() => {}} icon="plus" color="#AA0114" />)
    .toJSON();

  expect(tree).toMatchSnapshot();
});

it('renders not visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" />
  );
  update(<FAB onPress={() => {}} icon="plus" visible={false} />);

  expect(toJSON()).toMatchSnapshot();
});

it('renders visible FAB', () => {
  const { update, toJSON } = renderer.create(
    <FAB onPress={() => {}} icon="plus" visible={false} />
  );

  update(<FAB onPress={() => {}} icon="plus" visible={true} />);

  expect(toJSON()).toMatchSnapshot();
});

it('renders FAB with custom border radius', () => {
  const { getByTestId } = render(
    <FAB
      onPress={() => {}}
      icon="plus"
      testID="fab"
      style={styles.borderRadius}
    />
  );

  expect(getByTestId('fab-container')).toHaveStyle({ borderRadius: 0 });
});

['small', 'medium', 'large'].forEach((size) => {
  it(`renders ${size} FAB with correct size and border radius`, () => {
    const { getByTestId } = render(
      <FAB onPress={() => {}} size={size} icon="plus" testID={`${size}-fab`} />
    );

    expect(getByTestId(`${size}-fab-content`)).toHaveStyle(styles[size]);
  });
});

describe('getFABColors - background color', () => {
  it('should return color from styles', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        style: { backgroundColor: 'purple' },
      })
    ).toMatchObject({
      backgroundColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2, light mode', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: color(black).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct disabled color, for theme version 2, dark mode', () => {
    expect(
      getFABColors({
        theme: getTheme(true, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: color(white).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct theme color, for theme version 3, primary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.primaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, secondary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'secondary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.secondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, tertiary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'tertiary',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.tertiaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, surface variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'surface',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.elevation.level3,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        variant: 'primary',
      })
    ).toMatchObject({
      backgroundColor: getTheme(false, false).colors.accent,
    });
  });
});

describe('getFABColors - foreground color', () => {
  it('should return custom color', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        customColor: 'purple',
      })
    ).toMatchObject({
      foregroundColor: 'purple',
    });
  });

  it('should return correct disabled color, for theme version 3', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
        disabled: true,
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onSurfaceDisabled,
    });
  });

  it('should return correct disabled color, for theme version 2, light mode', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: color(black).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct disabled color, for theme version 2, dark mode', () => {
    expect(
      getFABColors({
        theme: getTheme(true, false),
        disabled: true,
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: color(white).alpha(0.32).rgb().string(),
    });
  });

  it('should return correct theme color, for theme version 3, primary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onPrimaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, secondary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'secondary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onSecondaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, tertiary variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'tertiary',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.onTertiaryContainer,
    });
  });

  it('should return correct theme color, for theme version 3, surface variant', () => {
    expect(
      getFABColors({
        theme: getTheme(),
        variant: 'surface',
      })
    ).toMatchObject({
      foregroundColor: getTheme().colors.primary,
    });
  });

  it('should return correct theme color, for theme version 2', () => {
    expect(
      getFABColors({
        theme: getTheme(false, false),
        variant: 'primary',
      })
    ).toMatchObject({
      foregroundColor: getContrastingColor(
        getTheme(false, false).colors.accent,
        white,
        'rgba(0, 0, 0, .54)'
      ),
    });
  });
});
