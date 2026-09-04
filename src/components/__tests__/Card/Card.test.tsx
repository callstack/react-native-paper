import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import { LightTheme } from '../../../theme/schemes';
import Button from '../../Button/Button';
import Card from '../../Card/Card';
import { getCardCoverStyle } from '../../Card/utils';

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
  customAction: {
    marginRight: 12,
  },
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Card', () => {
  it.each([
    {
      variant: 'filled' as const,
      colorRole: 'surfaceContainerHighest' as const,
    },
    {
      variant: 'elevated' as const,
      colorRole: 'surfaceContainerLow' as const,
    },
    { variant: 'outlined' as const, colorRole: 'surface' as const },
  ])(
    'renders the enabled $variant appearance in light and dark themes',
    async ({ variant, colorRole }) => {
      for (const isDark of [false, true] as const) {
        const theme = getTheme(isDark);
        const card =
          variant === 'elevated' ? (
            <Card variant="elevated" theme={theme} />
          ) : variant === 'outlined' ? (
            <Card variant="outlined" theme={theme} />
          ) : (
            <Card variant="filled" theme={theme} />
          );
        const { unmount } = await render(card);

        expect(screen.getByTestId('card-visual')).toHaveStyle({
          backgroundColor: theme.colors[colorRole],
        });

        await unmount();
      }
    }
  );

  it('renders the enabled outlined role in light and dark themes', async () => {
    for (const isDark of [false, true] as const) {
      const theme = getTheme(isDark);
      const { unmount } = await render(
        <Card variant="outlined" theme={theme} />
      );

      expect(screen.getByTestId('card-outline')).toHaveStyle({
        borderColor: theme.colors.outlineVariant,
        borderWidth: 1,
        opacity: 1,
      });

      await unmount();
    }
  });

  it.each(['filled', 'elevated'] as const)(
    'does not render an outline for the %s variant',
    async (variant) => {
      const card =
        variant === 'elevated' ? (
          <Card variant="elevated" />
        ) : (
          <Card variant="filled" />
        );

      await render(card);

      expect(screen.queryByTestId('card-outline')).not.toBeOnTheScreen();
    }
  );

  it('uses filled as the default and resolves deeply merged custom colors', async () => {
    await render(
      <Card
        theme={{
          colors: {
            surfaceContainerHighest: '#111111',
            onSurface: '#222222',
          },
        }}
      />
    );

    expect(screen.getByTestId('card-visual')).toHaveStyle({
      backgroundColor: '#111111',
    });
    expect(screen.getByTestId('card-state-layer')).toHaveStyle({
      backgroundColor: '#222222',
      opacity: 0,
    });
  });

  it('uses custom theme roles for elevated and outlined variants', async () => {
    const { unmount } = await render(
      <Card
        variant="elevated"
        theme={{ colors: { surfaceContainerLow: '#123456' } }}
      />
    );

    expect(screen.getByTestId('card-visual')).toHaveStyle({
      backgroundColor: '#123456',
    });
    await unmount();

    await render(
      <Card
        variant="outlined"
        theme={{
          colors: { surface: '#abcdef', outlineVariant: '#654321' },
        }}
      />
    );

    expect(screen.getByTestId('card-visual')).toHaveStyle({
      backgroundColor: '#abcdef',
    });
    expect(screen.getByTestId('card-outline')).toHaveStyle({
      borderColor: '#654321',
    });
  });

  it('lets only elevated Cards customize their resting elevation', async () => {
    jest.replaceProperty(Platform, 'OS', 'android');

    await render(<Card variant="elevated" elevation={5} />);

    expect(screen.getByTestId('card-container')).toHaveStyle({ elevation: 12 });
  });

  it.each([
    { variant: 'filled' as const, elevation: 0 },
    { variant: 'elevated' as const, elevation: 1 },
    { variant: 'outlined' as const, elevation: 0 },
  ])(
    'renders the enabled $variant elevation',
    async ({ variant, elevation }) => {
      jest.replaceProperty(Platform, 'OS', 'android');
      const card =
        variant === 'elevated' ? (
          <Card variant="elevated" />
        ) : variant === 'outlined' ? (
          <Card variant="outlined" />
        ) : (
          <Card variant="filled" />
        );

      await render(card);

      expect(screen.getByTestId('card-container')).toHaveStyle({ elevation });
      expect(screen.getByTestId('card-container')).toHaveStyle({
        backgroundColor: 'transparent',
      });
    }
  );

  it('applies the medium shape and asymmetric overrides across the shell', async () => {
    await render(
      <Card
        variant="outlined"
        borderTopLeftRadius={4}
        borderTopRightRadius={8}
        borderBottomRightRadius={16}
        borderBottomLeftRadius={20}
      />
    );

    const expectedShape = {
      borderRadius: getTheme().shapes.corner.medium,
      borderTopLeftRadius: 4,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 16,
      borderBottomLeftRadius: 20,
      borderCurve: 'continuous',
    };

    expect(screen.getByTestId('card-container')).toHaveStyle(expectedShape);
    expect(screen.getByTestId('card-visual')).toHaveStyle(expectedShape);
    expect(screen.getByTestId('card-background')).toHaveStyle(expectedShape);
    expect(screen.getByTestId('card-state-layer')).toHaveStyle(expectedShape);
    expect(screen.getByTestId('card-outline')).toHaveStyle(expectedShape);
  });

  it('renders populated slots in deterministic order without rewriting nodes', async () => {
    const CustomContent = React.memo(() => (
      <View testID="content-custom-wrapper">
        <Text>Custom content</Text>
      </View>
    ));

    await render(
      <Card
        media={<View testID="region-media" />}
        header={<View testID="region-header" />}
        content={[
          <View key="first" testID="region-content-array" />,
          null,
          <CustomContent key="second" />,
        ]}
        actions={
          <>
            {null}
            <View testID="region-actions" />
          </>
        }
      />
    );

    expect(screen.getAllByTestId(/^(region-|content-custom-wrapper)/)).toEqual([
      screen.getByTestId('region-media'),
      screen.getByTestId('region-header'),
      screen.getByTestId('region-content-array'),
      screen.getByTestId('content-custom-wrapper'),
      screen.getByTestId('region-actions'),
    ]);
  });

  it('renders omitted slots as a neutral filled grouping container', async () => {
    await render(<Card />);

    expect(screen.getByTestId('card-visual')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainerHighest,
    });
    expect(screen.queryByRole('button')).not.toBeOnTheScreen();
  });

  it('renders the convenience header inputs', async () => {
    await render(
      <Card
        title="Card title"
        subtitle="Card subtitle"
        leading={({ size }) => <Text>Leading {size}</Text>}
        trailing={({ size }) => <Text>Trailing {size}</Text>}
      />
    );

    expect(screen.getByText('Card title')).toBeOnTheScreen();
    expect(screen.getByText('Card subtitle')).toBeOnTheScreen();
    expect(screen.getByText('Leading 40')).toBeOnTheScreen();
    expect(screen.getByText('Trailing 24')).toBeOnTheScreen();
  });

  it('renders with a content style', async () => {
    await render(
      <Card content={<Text>Content</Text>} contentStyle={styles.contentStyle} />
    );

    expect(screen.getByText('Content').parent).toHaveStyle(styles.contentStyle);
  });

  it('does render a disabled accessibility state', async () => {
    await render(<Card onPress={() => {}} disabled />);

    expect(screen.getByTestId('card')).toBeDisabled();
  });
});

describe('Card types', () => {
  it('rejects the removed API and mixed header forms', () => {
    const typeCases = (
      <>
        <Card />
        <Card
          title="Title"
          subtitle="Subtitle"
          leading={({ size }) => <View accessibilityLabel={`${size}`} />}
          trailing={({ size }) => <View accessibilityLabel={`${size}`} />}
        />
        <Card header={<View />} />
        <Card
          content={<Text>Content</Text>}
          actions={[<View key="action" />]}
        />
        <Card variant="filled" />
        <Card variant="outlined" />
        <Card variant="elevated" />
        <Card variant="elevated" elevation={5} />

        {/* @ts-expect-error: Arbitrary children composition was removed. */}
        <Card>
          <View />
        </Card>

        {/* @ts-expect-error: The old mode prop was removed. */}
        <Card mode="contained" />

        {/* @ts-expect-error: Contained is not a Card variant. */}
        <Card variant="contained" />

        {/* @ts-expect-error: The default filled Card cannot be elevated. */}
        <Card elevation={1} />

        {/* @ts-expect-error: Filled Cards cannot be elevated. */}
        <Card variant="filled" elevation={1} />

        {/* @ts-expect-error: Outlined Cards cannot be elevated. */}
        <Card variant="outlined" elevation={1} />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card header={<View />} title="Title" />

        {/* @ts-expect-error: Custom and convenience headers are mutually exclusive. */}
        <Card header={<View />} leading={() => <View />} />
      </>
    );

    expect(typeCases).toBeDefined();
  });
});

describe('CardCover', () => {
  it('renders with custom border radius', async () => {
    await render(
      <Card.Cover
        source={{ uri: 'https://picsum.photos/700' }}
        testID="card-cover"
        style={styles.customCoverRadius}
      />
    );

    expect(screen.getByTestId('card-cover')).toHaveStyle(
      styles.customCoverRadius
    );
  });
});

describe('CardContent', () => {
  it('uses fixed padding when rendered standalone', async () => {
    await render(
      <Card.Content testID="card-content">
        <Text>Content</Text>
      </Card.Content>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 16,
      paddingVertical: 16,
    });
  });

  it('uses fixed padding regardless of neighboring card elements', async () => {
    await render(
      <>
        <Card.Title title="Title" />
        <View>
          <Card.Content testID="card-content">
            <Text>Content</Text>
          </Card.Content>
        </View>
        <Card.Actions>
          <Button>Action</Button>
        </Card.Actions>
      </>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 16,
      paddingVertical: 16,
    });
  });

  it('lets consumer styles override the default padding', async () => {
    await render(
      <Card.Content
        testID="card-content"
        style={{ paddingHorizontal: 24, paddingVertical: 12 }}
      >
        <Text>Content</Text>
      </Card.Content>
    );

    expect(screen.getByTestId('card-content')).toHaveStyle({
      paddingHorizontal: 24,
      paddingVertical: 12,
    });
  });
});

describe('CardActions', () => {
  it('lays out heterogeneous nodes with container-owned spacing', async () => {
    await render(
      <Card.Actions testID="card-actions">
        <Button>Agree</Button>
        <View testID="custom-action" />
        <Text>Details</Text>
      </Card.Actions>
    );

    expect(screen.getByTestId('card-actions')).toHaveStyle({
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: 8,
      gap: 8,
    });
    expect(screen.getByTestId('custom-action')).toBeOnTheScreen();
    expect(screen.getByText('Details')).toBeOnTheScreen();
  });

  it('lets consumer styles override the default layout', async () => {
    await render(
      <Card.Actions
        testID="card-actions"
        style={{ justifyContent: 'flex-start', padding: 4, gap: 12 }}
      >
        <Text>Action</Text>
      </Card.Actions>
    );

    expect(screen.getByTestId('card-actions')).toHaveStyle({
      justifyContent: 'flex-start',
      padding: 4,
      gap: 12,
    });
  });

  it('preserves consumer-configured child props', async () => {
    const Action = ({
      compact,
      mode,
      style,
    }: {
      compact?: boolean;
      mode?: string;
      style?: StyleProp<ViewStyle>;
    }) => (
      <View
        accessibilityLabel={`${mode ?? 'unset'}:${compact ?? 'unset'}`}
        style={style}
      />
    );

    await render(
      <Card.Actions testID="card-actions">
        <Action style={styles.customAction} />
        <Action mode="contained" compact style={styles.customAction} />
        <View testID="custom-action" style={styles.customAction} />
      </Card.Actions>
    );

    expect(screen.getByLabelText('unset:unset')).toHaveStyle(
      styles.customAction
    );
    expect(screen.getByLabelText('contained:true')).toHaveStyle(
      styles.customAction
    );
    expect(screen.getByLabelText('unset:unset')).not.toHaveStyle({
      marginLeft: 8,
    });
    expect(screen.getByTestId('custom-action')).not.toHaveStyle({
      marginLeft: 8,
    });
  });
});

describe('getCardCoverStyle - border radius', () => {
  it('should return custom border radius', () => {
    expect(
      getCardCoverStyle({
        theme: LightTheme,
        borderRadiusStyles: styles.customCoverRadius,
      })
    ).toMatchObject(styles.customCoverRadius);
  });

  it('should return correct border radius based on roundness, for theme version 3', () => {
    expect(
      getCardCoverStyle({
        theme: LightTheme,
        borderRadiusStyles: {},
      })
    ).toMatchObject({ borderRadius: LightTheme.shapes.corner.medium });
  });
});
