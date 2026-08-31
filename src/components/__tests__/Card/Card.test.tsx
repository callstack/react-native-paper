import { Platform, StyleSheet, Text } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { getTheme } from '../../../core/theming';
import { render, screen } from '../../../test-utils';
import { Palette } from '../../../theme/tokens';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import { getCardColors, getCardCoverStyle } from '../../Card/utils';

const styles = StyleSheet.create({
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

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Card', () => {
  it('renders an outlined card', async () => {
    const tree = (await render(<Card mode="outlined">{null}</Card>)).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders an outlined card with a custom outline color', async () => {
    const testID = 'custom-outline-card';

    await render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        theme={{ colors: { outline: 'purple' } }}
        testID={testID}
      >
        {null}
      </Card>
    );

    expect(screen.getByTestId(`${testID}-outline`)).toHaveStyle({
      borderColor: 'purple',
      borderWidth: 1,
    });
  });

  it('renders an outlined card with custom border color', async () => {
    const testID = 'custom-border-card';

    await render(
      <Card
        mode="outlined"
        accessibilityLabel="card"
        style={{ borderColor: Palette.error50 }}
        testID={testID}
      >
        {null}
      </Card>
    );

    expect(screen.getByTestId(`${testID}-outline`)).toHaveStyle({
      borderColor: Palette.error50,
      borderWidth: 1,
    });
  });

  it('renders with a custom theme background color', async () => {
    jest.replaceProperty(Platform, 'OS', 'web');

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
      <Card testID="card" contentStyle={styles.contentStyle}>
        <Text>Content</Text>
      </Card>
    );

    expect(screen.getByTestId('card')).toHaveStyle(styles.contentStyle);
  });

  it('does not render a disabled accessibility state', async () => {
    await render(<Card testID="card">{null}</Card>);

    expect(screen.getByTestId('card')).toBeEnabled();
  });
  it('does render a disabled accessibility state', async () => {
    await render(
      <Card testID="card" onPress={() => {}} disabled>
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
        // @ts-expect-error: Verify the runtime fallback when mode is omitted.
        mode: undefined,
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
