import * as React from 'react';
import { Text, View } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getTheme } from '../../../core/theming';
import { fireEvent, render, screen, userEvent } from '../../../test-utils';
import AppbarV3 from '../../AppbarV3';
import type { AppbarVariant } from '../../AppbarV3';

const writtenHeadlineVariants: Exclude<AppbarVariant, 'search'>[] = [
  'small',
  'medium-flexible',
  'large-flexible',
];

const decorativeHeadlineImage = (
  <View>
    <View accessible role="img" accessibilityLabel="Brand artwork" />
    <Text accessible role="heading">
      Brand words
    </Text>
  </View>
);

describe('AppbarV3 content', () => {
  it.each([
    {
      variant: 'small',
      headlineVariant: 'titleLarge',
      headlineLines: 1,
      subtitleVariant: 'labelMedium',
      subtitleSpacing: 0,
    },
    {
      variant: 'medium-flexible',
      headlineVariant: 'headlineMedium',
      headlineLines: 2,
      subtitleVariant: 'labelLarge',
      subtitleSpacing: 4,
    },
    {
      variant: 'large-flexible',
      headlineVariant: 'displaySmall',
      headlineLines: 2,
      subtitleVariant: 'titleMedium',
      subtitleSpacing: 8,
    },
  ] as const)(
    'uses the $variant content treatment',
    async ({
      variant,
      headlineVariant,
      headlineLines,
      subtitleVariant,
      subtitleSpacing,
    }) => {
      await render(
        <AppbarV3 variant={variant} headline="Inbox" subtitle="3 unread" />
      );

      expect(screen.getByTestId('appbar-content-headline-text')).toHaveStyle(
        getTheme().fonts[headlineVariant]
      );
      expect(screen.getByTestId('appbar-content-headline-text')).toHaveProp(
        'numberOfLines',
        headlineLines
      );
      expect(screen.getByTestId('appbar-content-subtitle-text')).toHaveStyle({
        ...getTheme().fonts[subtitleVariant],
        color: getTheme().colors.onSurfaceVariant,
        marginTop: subtitleSpacing,
      });
    }
  );

  it('centers text and balances asymmetric controls for centered and image layouts', async () => {
    const { rerender } = await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        subtitle="3 unread"
        headlineAlignment="center"
        leadingButton={{
          type: 'back',
          testID: 'leading-action',
        }}
        trailingActions={[
          {
            key: 'more',
            icon: 'dots-vertical',
            'aria-label': 'More options',
            testID: 'trailing-action',
          },
          {
            key: 'search',
            icon: 'magnify',
            'aria-label': 'Search inbox',
          },
        ]}
      />
    );

    expect(screen.getByTestId('appbar-content-headline-text')).toHaveStyle({
      textAlign: 'center',
    });
    expect(screen.getByTestId('appbar-content-subtitle-text')).toHaveStyle({
      textAlign: 'center',
    });
    expect(
      screen.getByTestId('leading-action-container-outer-layer').parent
    ).toHaveStyle({ width: 96 });
    expect(
      screen.getByTestId('trailing-action-container-outer-layer').parent
    ).toHaveStyle({ width: 96 });

    await rerender(
      <AppbarV3
        variant="medium-flexible"
        headline="Inbox"
        headlineImage={<View testID="brand-mark" />}
        leadingButton={{
          type: 'back',
          testID: 'leading-action',
        }}
        trailingActions={[
          {
            key: 'more',
            icon: 'dots-vertical',
            'aria-label': 'More options',
            testID: 'trailing-action',
          },
          {
            key: 'search',
            icon: 'magnify',
            'aria-label': 'Search inbox',
          },
        ]}
      />
    );

    expect(
      screen.getByTestId('leading-action-container-outer-layer').parent
    ).toHaveStyle({ width: 96 });
    expect(
      screen.getByTestId('trailing-action-container-outer-layer').parent
    ).toHaveStyle({ width: 96 });
    expect(
      screen.getByTestId('brand-mark', { includeHiddenElements: true })
    ).toBeOnTheScreen();
  });

  it('adjusts leading headline spacing when a leading button is present', async () => {
    const { rerender } = await render(
      <AppbarV3 variant="small" headline="Inbox" />
    );

    expect(screen.getByTestId('appbar-content')).toHaveStyle({
      marginStart: 12,
    });

    await rerender(
      <AppbarV3
        variant="small"
        headline="Inbox"
        leadingButton={{ type: 'back' }}
      />
    );

    expect(screen.getByTestId('appbar-content')).toHaveStyle({
      marginStart: 4,
    });
  });
});

describe('AppbarV3 surface', () => {
  it('uses scroll container colors unless a custom background is supplied', async () => {
    const customBackground = 'rebeccapurple';
    const { rerender } = await render(
      <AppbarV3 variant="small" headline="Inbox" />
    );

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      backgroundColor: getTheme().colors.surface,
    });

    await rerender(<AppbarV3 variant="small" headline="Inbox" isScrolled />);

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainer,
    });

    await rerender(
      <AppbarV3
        variant="small"
        headline="Inbox"
        isScrolled
        style={{ backgroundColor: customBackground }}
      />
    );

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      backgroundColor: customBackground,
    });
  });

  it('applies border clipping and resolves safe-area overrides on the surface', async () => {
    await render(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 47, left: 3, right: 8, bottom: 34 },
        }}
      >
        <AppbarV3
          variant="small"
          headline="Inbox"
          statusBarHeight={20}
          safeAreaInsets={{ left: 12 }}
          style={{
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
        />
      </SafeAreaProvider>
    );

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
      paddingTop: 20,
      paddingHorizontal: 12,
    });
  });
});

describe('AppbarV3 actions', () => {
  it('maps leading, trailing, and custom action colors', async () => {
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        leadingButton={{
          icon: ({ color }) => (
            <View
              testID="leading-icon-color"
              style={{ backgroundColor: color }}
            />
          ),
          'aria-label': 'Navigation',
        }}
        trailingActions={[
          {
            key: 'default',
            icon: ({ color }) => (
              <View
                testID="trailing-icon-color"
                style={{ backgroundColor: color }}
              />
            ),
            'aria-label': 'Default action',
          },
          {
            key: 'custom',
            icon: ({ color }) => (
              <View
                testID="custom-icon-color"
                style={{ backgroundColor: color }}
              />
            ),
            'aria-label': 'Custom action',
            color: 'rebeccapurple',
          },
        ]}
      />
    );

    expect(screen.getByTestId('leading-icon-color')).toHaveStyle({
      backgroundColor: getTheme().colors.onSurface,
    });
    expect(screen.getByTestId('trailing-icon-color')).toHaveStyle({
      backgroundColor: getTheme().colors.onSurfaceVariant,
    });
    expect(screen.getByTestId('custom-icon-color')).toHaveStyle({
      backgroundColor: 'rebeccapurple',
    });
  });

  it.each([
    { variant: 'filled', color: getTheme().colors.primary },
    { variant: 'tonal', color: getTheme().colors.secondaryContainer },
  ] as const)(
    'maps $variant actions to their selected container color',
    async ({ variant, color }) => {
      await render(
        <AppbarV3
          variant="small"
          headline="Inbox"
          trailingActions={[
            {
              key: variant,
              icon: 'star',
              'aria-label': `${variant} action`,
              variant,
              width: 'wide',
              testID: 'expressive-action',
            },
          ]}
        />
      );

      expect(screen.getByTestId('expressive-action-container')).toHaveStyle({
        backgroundColor: color,
      });
      expect(
        screen.getByTestId('expressive-action-container-outer-layer')
      ).toHaveStyle({ width: 56 });
    }
  );
});

describe('AppbarV3 search', () => {
  it('uses the placeholder as the searchbox label unless an explicit label is supplied', async () => {
    const { rerender } = await render(
      <AppbarV3
        variant="search"
        searchBar={{ placeholder: 'Search messages', value: '' }}
      />
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search messages' })
    ).toBeOnTheScreen();
    expect(screen.getByTestId('appbar-search-container')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainer,
    });

    await rerender(
      <AppbarV3
        variant="search"
        searchBar={{
          placeholder: 'Search messages',
          value: '',
          'aria-label': 'Message search',
        }}
      />
    );

    expect(
      screen.getByRole('searchbox', { name: 'Message search' })
    ).toBeOnTheScreen();
  });

  it('configures the search field, forwards its behavior, and constrains its measured width', async () => {
    const onChangeText = jest.fn();
    const SearchAppbar = () => {
      const [value, setValue] = React.useState('');

      return (
        <AppbarV3
          variant="search"
          isScrolled
          leadingButton={{ type: 'back', 'aria-label': 'Navigate back' }}
          searchBar={{
            placeholder: 'Search messages',
            value,
            onChangeText: (nextValue) => {
              setValue(nextValue);
              onChangeText(nextValue);
            },
            testID: 'message-search',
          }}
          trailingActions={[
            {
              key: 'more',
              icon: 'dots-vertical',
              'aria-label': 'More options',
            },
          ]}
        />
      );
    };

    await render(<SearchAppbar />);

    const searchbox = screen.getByRole('searchbox', {
      name: 'Search messages',
    });
    expect(searchbox).toHaveStyle({
      color: getTheme().colors.onSurface,
      textAlign: 'center',
    });
    expect(searchbox).toHaveProp(
      'placeholderTextColor',
      getTheme().colors.onSurfaceVariant
    );
    expect(screen.getByTestId('message-search-container')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainerHighest,
    });
    expect(
      screen.getByRole('button', { name: 'Navigate back' })
    ).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'More options' })
    ).toBeOnTheScreen();

    await userEvent.type(searchbox, 'draft');
    expect(onChangeText).toHaveBeenLastCalledWith('draft');
    expect(searchbox).toHaveProp('value', 'draft');

    await fireEvent(screen.getByTestId('appbar-search-slot'), 'layout', {
      nativeEvent: { layout: { x: 0, y: 0, width: 800, height: 56 } },
    });

    expect(
      screen.getByTestId('message-search-container-outer-layer')
    ).toHaveStyle({ width: 720 });
  });
});

describe('AppbarV3 accessibility', () => {
  it.each(writtenHeadlineVariants)(
    'exposes a written %s headline as a heading',
    async (variant) => {
      await render(<AppbarV3 variant={variant} headline="Inbox" />);

      expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
    }
  );

  it('hides a small headline image behind one named heading', async () => {
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        headlineImage={decorativeHeadlineImage}
      />
    );

    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
    expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    expect(screen.queryByText('Brand words')).not.toBeOnTheScreen();
  });

  it.each(['medium-flexible', 'large-flexible'] as const)(
    'does not expose duplicate content for a %s headline image',
    async (variant) => {
      await render(
        <AppbarV3
          variant={variant}
          headline="Inbox"
          headlineImage={decorativeHeadlineImage}
        />
      );

      expect(screen.getAllByRole('heading', { name: 'Inbox' })).toHaveLength(1);
      expect(screen.queryByRole('img')).not.toBeOnTheScreen();
      expect(screen.queryByLabelText('Brand artwork')).not.toBeOnTheScreen();
    }
  );

  it('exposes a pressable written headline as a named button and heading', async () => {
    const onHeadlinePress = jest.fn();
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        onHeadlinePress={onHeadlinePress}
      />
    );

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('does not invoke a disabled headline action', async () => {
    const onHeadlinePress = jest.fn();
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        onHeadlinePress={onHeadlinePress}
        headlinePressableProps={{ disabled: true }}
      />
    );

    const headlineButton = screen.getByRole('button', {
      name: 'Inbox',
      disabled: true,
    });
    await userEvent.press(headlineButton);

    expect(onHeadlinePress).not.toHaveBeenCalled();
  });

  it('names a pressable small headline image from its fallback headline', async () => {
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        headlineImage={decorativeHeadlineImage}
        onHeadlinePress={() => {}}
      />
    );

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('forwards custom headline button accessibility props', async () => {
    const onAccessibilityAction = jest.fn();
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        onHeadlinePress={() => {}}
        headlinePressableProps={{
          accessibilityActions: [{ name: 'activate', label: 'Open inbox' }],
          accessibilityHint: 'Opens the inbox menu',
          accessibilityLabel: 'Inbox options',
          accessibilityState: { busy: true, expanded: true },
          accessibilityValue: { text: 'Unread messages available' },
          onAccessibilityAction,
        }}
      />
    );

    const titleButton = screen.getByRole('button', {
      name: 'Inbox options',
      busy: true,
      expanded: true,
    });

    expect(titleButton).toHaveProp(
      'accessibilityActions',
      expect.arrayContaining([
        expect.objectContaining({ name: 'activate', label: 'Open inbox' }),
      ])
    );
    expect(titleButton).toHaveProp('accessibilityHint', 'Opens the inbox menu');
    expect(titleButton).toHaveAccessibilityValue({
      text: 'Unread messages available',
    });
    expect(titleButton).toHaveProp(
      'onAccessibilityAction',
      onAccessibilityAction
    );
  });

  it('uses default and custom labels for back buttons', async () => {
    await render(
      <View>
        <AppbarV3
          testID="default-back-appbar"
          variant="small"
          headline="Inbox"
          leadingButton={{ type: 'back' }}
        />
        <AppbarV3
          testID="custom-back-appbar"
          variant="small"
          headline="Archive"
          leadingButton={{ type: 'back', 'aria-label': 'Return to inbox' }}
        />
      </View>
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Return to inbox' })
    ).toBeOnTheScreen();
  });

  it('preserves trailing action labels, hints, disabled state, and busy state', async () => {
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        trailingActions={[
          {
            key: 'save',
            icon: 'content-save',
            'aria-label': 'Save message',
            accessibilityHint: 'Saves the current draft',
            'aria-busy': true,
            disabled: true,
          },
        ]}
      />
    );

    const trailingAction = screen.getByRole('button', {
      name: 'Save message',
      busy: true,
      disabled: true,
    });

    expect(trailingAction).toHaveProp(
      'accessibilityHint',
      'Saves the current draft'
    );
    expect(trailingAction).toBeDisabled();
    expect(trailingAction).toBeBusy();
  });

  it.each(['small', 'medium-flexible'] as const)(
    'hides decorative descendants of a %s headline image',
    async (variant) => {
      await render(
        variant === 'small' ? (
          <AppbarV3
            variant="small"
            headline="Inbox"
            headlineImage={decorativeHeadlineImage}
          />
        ) : (
          <AppbarV3
            variant="medium-flexible"
            headline="Inbox"
            headlineImage={decorativeHeadlineImage}
          />
        )
      );

      const imageContainer = screen.getByTestId(
        'appbar-content-headline-image',
        { includeHiddenElements: true }
      );

      expect(imageContainer).toHaveProp('aria-hidden', true);
      expect(imageContainer).toHaveProp(
        'importantForAccessibility',
        'no-hide-descendants'
      );
      expect(
        screen.queryByRole('heading', { name: 'Brand words' })
      ).not.toBeOnTheScreen();
    }
  );

  it('exposes the leading button, headline, and trailing actions in source order', async () => {
    await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        leadingButton={{ type: 'back', 'aria-label': 'Navigate back' }}
        trailingActions={[
          { key: 'search', icon: 'magnify', 'aria-label': 'Search inbox' },
          { key: 'more', icon: 'dots-vertical', 'aria-label': 'More options' },
        ]}
      />
    );

    expect(screen.getAllByRole(/button|heading/)).toEqual([
      screen.getByRole('button', { name: 'Navigate back' }),
      screen.getByRole('heading', { name: 'Inbox' }),
      screen.getByRole('button', { name: 'Search inbox' }),
      screen.getByRole('button', { name: 'More options' }),
    ]);
  });

  it('does not remount a surviving trailing action when its configuration changes', async () => {
    const { rerender } = await render(
      <AppbarV3
        variant="small"
        headline="Inbox"
        trailingActions={[
          { key: 'keep', icon: 'star', 'aria-label': 'Keep action' },
          { key: 'remove', icon: 'delete', 'aria-label': 'Remove action' },
        ]}
      />
    );
    const survivingTrailingAction = screen.getByRole('button', {
      name: 'Keep action',
    });

    await rerender(
      <AppbarV3
        variant="small"
        headline="Inbox"
        trailingActions={[
          { key: 'new', icon: 'plus', 'aria-label': 'New action' },
          {
            key: 'keep',
            icon: 'star-outline',
            'aria-label': 'Keep action',
            accessibilityHint: 'Updated hint',
          },
        ]}
      />
    );

    expect(screen.getByRole('button', { name: 'Keep action' })).toBe(
      survivingTrailingAction
    );
  });
});
