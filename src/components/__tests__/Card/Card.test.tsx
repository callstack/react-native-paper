import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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

    expect(screen.getByTestId('card-container')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceVariant,
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

        {/* @ts-expect-error: Arbitrary children composition was removed. */}
        <Card>
          <View />
        </Card>

        {/* @ts-expect-error: The old mode prop was removed. */}
        <Card mode="contained" />

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
