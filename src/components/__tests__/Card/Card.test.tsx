import { Animated, StyleSheet, Text } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { act } from '@testing-library/react-native';

import { getTheme } from '../../../core/theming';
import { render, screen } from '../../../test-utils';
import { Palette } from '../../../theme/tokens';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import { getCardColors, getCardCoverStyle } from '../../Card/utils';

const styles = StyleSheet.create({
  customBorderRadius: {
    borderRadius: 32,
  },
  customCoverRadius: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 2,
  },
  contentStyle: {
    flexDirection: 'column-reverse',
  },
});

describe('Card', () => {
  it('renders an outlined card', async () => {
    const tree = (await render(<Card mode="outlined">{null}</Card>)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders an outlined card with custom border radius and color', async () => {
    await render(
      <Card
        mode="outlined"
        theme={{ colors: { outline: 'purple' } }}
        style={styles.customBorderRadius}
      >
        {null}
      </Card>
    );

    expect(screen.getByTestId('card-outline')).toHaveStyle({
      borderRadius: 32,
      borderColor: 'purple',
    });
  });

  it('renders an outlined card with custom border color', async () => {
    await render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        style={{ borderColor: Palette.error50 }}
      >
        {null}
      </Card>
    );

    expect(screen.getByLabelText('card')).toHaveStyle({
      borderColor: Palette.error50,
    });
  });

  it('renders with a custom theme', async () => {
    await render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        theme={{ colors: { surface: '#0000FF' } }}
      >
        {null}
      </Card>
    );

    expect(screen.getByLabelText('card')).toHaveStyle({
      backgroundColor: '#0000FF',
    });
  });

  it('renders with a content style', async () => {
    await render(
      <Card contentStyle={styles.contentStyle}>
        <Text>Content</Text>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveStyle(styles.contentStyle);
  });

  it('does not render a disabled accessibility state', async () => {
    await render(<Card>{null}</Card>);

    expect(screen.getByTestId('card')).toBeEnabled();
  });
  it('does render a disabled accessibility state', async () => {
    await render(
      <Card onPress={() => {}} disabled>
        {null}
      </Card>
    );

    expect(screen.getByTestId('card')).toBeDisabled();
  });
});

describe('CardCover', () => {
  it('renders with custom border radius', async () => {
    await render(
      <Card>
        <Card.Cover
          source={{ uri: 'https://picsum.photos/700' }}
          testID="card-cover"
          style={styles.customCoverRadius}
        />
      </Card>
    );

    expect(screen.getByTestId('card-cover')).toHaveStyle(
      styles.customCoverRadius
    );
  });
});

describe('CardActions', () => {
  it('renders button with passed mode', async () => {
    await render(
      <Card>
        <Card.Actions testID="card-actions">
          <Button mode="contained">Agree</Button>
        </Card.Actions>
      </Card>
    );

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('card-actions').props.children[0].props.mode
    ).toBe('contained');
  });

  it('renders button with custom styles', async () => {
    await render(
      <Card>
        <Card.Actions>
          <Button
            testID="card-actions-button"
            mode="contained"
            style={styles.customBorderRadius}
          >
            Agree
          </Button>
        </Card.Actions>
      </Card>
    );

    expect(screen.getByTestId('card-actions-button')).toHaveStyle({
      borderRadius: 32,
    });
  });
});

describe('getCardColors - background color', () => {
  it('should return correct theme color, for theme version 3, contained mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'contained',
      })
    ).toMatchObject({
      backgroundColor: getTheme().colors.surfaceVariant,
    });
  });

  it('should return correct theme color, for theme version 3, outlined mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'outlined',
      })
    ).toMatchObject({ backgroundColor: getTheme().colors.surface });
  });

  it('should return undefined, for theme version 3, elevated mode', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: 'elevated',
      })
    ).toMatchObject({ backgroundColor: undefined });
  });
});

describe('getCardColors - border color', () => {
  it('should return correct theme color, for theme version 3', () => {
    expect(
      getCardColors({
        theme: getTheme(),
        mode: undefined as any,
      })
    ).toMatchObject({ borderColor: getTheme().colors.outline });
  });
});

describe('getCardCoverStyle - border radius', () => {
  it('should return custom border radius', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(),
        borderRadiusStyles: styles.customCoverRadius,
      })
    ).toMatchObject(styles.customCoverRadius);
  });

  it('should return correct border radius based on roundness, for theme version 3', () => {
    expect(
      getCardCoverStyle({
        theme: getTheme(),
        borderRadiusStyles: {},
      })
    ).toMatchObject({ borderRadius: getTheme().shapes.corner.medium });
  });
});

it('animated value changes correctly', async () => {
  const value = new Animated.Value(1);
  await render(
    <Card
      mode="outlined"
      accessibilityLabel="card"
      style={[{ transform: [{ scale: value }] }]}
    >
      {null}
    </Card>
  );
  expect(screen.getByTestId('card-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1 }],
  });

  Animated.timing(value, {
    toValue: 1.5,
    useNativeDriver: false,
    duration: 200,
  }).start();

  await act(() => {
    jest.advanceTimersByTime(200);
  });
  expect(screen.getByTestId('card-container-outer-layer')).toHaveStyle({
    transform: [{ scale: 1.5 }],
  });
});
