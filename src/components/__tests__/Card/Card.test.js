import React from 'react';
import renderer from 'react-test-renderer';
import { render } from 'react-native-testing-library';
import color from 'color';
import Card from '../../Card/Card';
import { black, white } from '../../../styles/themes/v2/colors';
import { getCardColors } from '../../Card/utils';
import { getTheme } from '../../../core/theming';

describe('Card', () => {
  it('renders an outlined card', () => {
    const tree = renderer.create(<Card mode="outlined" />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders with a custom theme', () => {
    const { getByA11yLabel } = render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        theme={{ colors: { surface: '#0000FF' } }}
      />
    );

    expect(getByA11yLabel('card').props.style.backgroundColor).toEqual(
      '#0000FF'
    );
  });
});

describe('getCardColors - background color', () => {
  it('should return correct theme color, for theme version 3, contained mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({ backgroundColor: getTheme().colors.surfaceVariant });
  });

  ['elevated', 'outlined'].forEach((mode) =>
    it(`should return correct theme color, for theme version 3, ${mode} mode`, () => {
      expect(
        getCardColors({
          theme: getTheme(),
          mode,
        })
      ).toMatchObject({ backgroundColor: getTheme().colors.surface });
    })
  );

  it('should return undefined, for theme version 2', () => {
    expect(
      getCardColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({ backgroundColor: undefined });
  });
});

describe('getCardColors - border color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getCardColors({
        theme: getTheme(),
      })
    ).toMatchObject({ borderColor: getTheme().colors.outline });
  });

  it('should return correct color, for theme version 2, dark mode', () => {
    expect(
      getCardColors({
        theme: getTheme(true, false),
      })
    ).toMatchObject({
      borderColor: color(white).alpha(0.12).rgb().string(),
    });
  });

  it('should return correct color, for theme version 2, light mode', () => {
    expect(
      getCardColors({
        theme: getTheme(false, false),
      })
    ).toMatchObject({
      borderColor: color(black).alpha(0.12).rgb().string(),
    });
  });
});
