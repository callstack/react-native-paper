import * as React from 'react';
import { Dimensions, Text, View } from 'react-native';
import type { GestureResponderEvent } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getTheme } from '../../../core/theming';
import { render, screen, userEvent, waitFor } from '../../../test-utils';
import Appbar from '../../Appbar';
import type { AppbarVariant } from '../../Appbar';
import Menu from '../../Menu/Menu';
import Portal from '../../Portal/Portal';
import Tooltip from '../../Tooltip/Tooltip';

const testIDPrefix = 'appbar';

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

describe('Appbar content', () => {
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
        <Appbar
          variant={variant}
          headline="Inbox"
          subtitle="3 unread"
          testID={testIDPrefix}
        />
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
      <Appbar
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
        testID={testIDPrefix}
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
      <Appbar
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
        testID={testIDPrefix}
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
      <Appbar variant="small" headline="Inbox" testID={testIDPrefix} />
    );

    expect(screen.getByTestId('appbar-content')).toHaveStyle({
      marginStart: 12,
    });

    await rerender(
      <Appbar
        variant="small"
        headline="Inbox"
        leadingButton={{ type: 'back' }}
        testID={testIDPrefix}
      />
    );

    expect(screen.getByTestId('appbar-content')).toHaveStyle({
      marginStart: 4,
    });
  });
});

describe('Appbar surface', () => {
  it('uses scroll container colors unless a custom background is supplied', async () => {
    const customBackground = 'rebeccapurple';
    const { rerender } = await render(
      <Appbar variant="small" headline="Inbox" testID={testIDPrefix} />
    );

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      backgroundColor: getTheme().colors.surface,
    });

    await rerender(
      <Appbar
        variant="small"
        headline="Inbox"
        isScrolled
        testID={testIDPrefix}
      />
    );

    expect(screen.getByTestId('appbar-root-layer')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainer,
    });

    await rerender(
      <Appbar
        variant="small"
        headline="Inbox"
        isScrolled
        style={{ backgroundColor: customBackground }}
        testID={testIDPrefix}
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
        <Appbar
          variant="small"
          headline="Inbox"
          statusBarHeight={20}
          safeAreaInsets={{ left: 12 }}
          style={{
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
          }}
          testID={testIDPrefix}
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

describe('Appbar actions', () => {
  it('maps leading, trailing, and custom action colors', async () => {
    await render(
      <Appbar
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
        testID={testIDPrefix}
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
        <Appbar
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
          testID={testIDPrefix}
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

  it('decorates an action with a working tooltip without losing its press handler', async () => {
    const onPress = jest.fn<(event: GestureResponderEvent) => void>();

    await render(
      <Portal.Host>
        <Appbar
          variant="small"
          headline="Files"
          trailingActions={[
            {
              key: 'print',
              icon: 'printer',
              'aria-label': 'Print',
              onPress,
              decorate: (button) => (
                <Tooltip title="Print shortcut">{button}</Tooltip>
              ),
            },
          ]}
        />
      </Portal.Host>
    );

    const action = screen.getByRole('button', { name: 'Print' });

    await userEvent.press(action);
    expect(onPress).toHaveBeenCalledTimes(1);

    await userEvent.longPress(action);
    expect(await screen.findByText('Print shortcut')).toBeOnTheScreen();
  });

  it('decorates an action with a menu anchored to the resolved button', async () => {
    const dimensionsSpy = jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 400,
      height: 800,
      scale: 2,
      fontScale: 2,
    });
    const measureSpy = jest
      .spyOn(View.prototype, 'measureInWindow')
      .mockImplementation((callback) => callback(100, 100, 80, 32));
    const MenuAppbar = () => {
      const [visible, setVisible] = React.useState(false);

      return (
        <Portal.Host>
          <Appbar
            variant="small"
            headline="Files"
            trailingActions={[
              {
                key: 'more',
                icon: 'dots-vertical',
                'aria-label': 'More options',
                onPress: () => setVisible(true),
                decorate: (button) => (
                  <Menu
                    visible={visible}
                    onDismiss={() => setVisible(false)}
                    anchor={button}
                    anchorPosition="bottom"
                  >
                    <Menu.Item title="Undo" onPress={() => {}} />
                  </Menu>
                ),
              },
            ]}
          />
        </Portal.Host>
      );
    };

    await render(<MenuAppbar />);

    await userEvent.press(screen.getByRole('button', { name: 'More options' }));

    await waitFor(() => {
      expect(screen.getByText('Undo')).toBeOnTheScreen();
      expect(screen.getByTestId('menu-view')).toHaveStyle({
        position: 'absolute',
        left: 100,
        top: 132,
      });
    });
    expect(measureSpy).toHaveBeenCalled();

    measureSpy.mockRestore();
    dimensionsSpy.mockRestore();
  });
});

describe('Appbar search', () => {
  it('uses the placeholder as the searchbox label unless an explicit label is supplied', async () => {
    const { rerender } = await render(
      <Appbar
        variant="search"
        searchBar={{ placeholder: 'Search messages', value: '' }}
        testID={testIDPrefix}
      />
    );

    expect(
      screen.getByRole('searchbox', { name: 'Search messages' })
    ).toBeOnTheScreen();
    expect(screen.getByTestId('appbar-search-container')).toHaveStyle({
      backgroundColor: getTheme().colors.surfaceContainer,
    });

    await rerender(
      <Appbar
        variant="search"
        searchBar={{
          placeholder: 'Search messages',
          value: '',
          'aria-label': 'Message search',
        }}
        testID={testIDPrefix}
      />
    );

    expect(
      screen.getByRole('searchbox', { name: 'Message search' })
    ).toBeOnTheScreen();
  });

  it('configures the search field, forwards its behavior, and constrains its width', async () => {
    const onChangeText = jest.fn();
    const SearchAppbar = () => {
      const [value, setValue] = React.useState('');

      return (
        <Appbar
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
          testID={testIDPrefix}
        />
      );
    };

    await render(<SearchAppbar />);

    const searchbox = screen.getByRole('searchbox', {
      name: 'Search messages',
    });
    expect(searchbox).toHaveStyle({
      color: getTheme().colors.onSurface,
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

    expect(
      screen.getByTestId('message-search-container-outer-layer')
    ).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('appbar-search-width-limiter')).toHaveStyle({
      width: '100%',
      maxWidth: 720,
    });
  });
});

describe('Appbar accessibility', () => {
  it.each(writtenHeadlineVariants)(
    'exposes a written %s headline as a heading',
    async (variant) => {
      await render(<Appbar variant={variant} headline="Inbox" />);

      expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
    }
  );

  it('hides a small headline image behind one named heading', async () => {
    await render(
      <Appbar
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
        <Appbar
          variant={variant}
          headline="Inbox"
          headlineImage={decorativeHeadlineImage}
          testID={testIDPrefix}
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
      <Appbar
        variant="small"
        headline="Inbox"
        onHeadlinePress={onHeadlinePress}
        testID={testIDPrefix}
      />
    );

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('does not invoke a disabled headline action', async () => {
    const onHeadlinePress = jest.fn();
    await render(
      <Appbar
        variant="small"
        headline="Inbox"
        onHeadlinePress={onHeadlinePress}
        headlinePressableProps={{ disabled: true }}
        testID={testIDPrefix}
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
      <Appbar
        variant="small"
        headline="Inbox"
        headlineImage={decorativeHeadlineImage}
        onHeadlinePress={() => {}}
        testID={testIDPrefix}
      />
    );

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('forwards custom headline button accessibility props', async () => {
    await render(
      <Appbar
        variant="small"
        headline="Inbox"
        onHeadlinePress={() => {}}
        headlinePressableProps={{
          accessibilityHint: 'Opens the inbox menu',
          accessibilityLabel: 'Inbox options',
          accessibilityState: { busy: true, expanded: true },
        }}
        testID={testIDPrefix}
      />
    );

    const titleButton = screen.getByRole('button', {
      name: 'Inbox options',
      busy: true,
      expanded: true,
    });

    expect(titleButton).toHaveProp('accessibilityHint', 'Opens the inbox menu');
  });

  it('uses default and custom labels for back buttons', async () => {
    await render(
      <View>
        <Appbar
          testID="default-back-appbar"
          variant="small"
          headline="Inbox"
          leadingButton={{ type: 'back' }}
        />
        <Appbar
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
      <Appbar
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
          <Appbar
            variant="small"
            headline="Inbox"
            headlineImage={decorativeHeadlineImage}
            testID={testIDPrefix}
          />
        ) : (
          <Appbar
            variant="medium-flexible"
            headline="Inbox"
            headlineImage={decorativeHeadlineImage}
            testID={testIDPrefix}
          />
        )
      );

      const imageContainer = screen.getByTestId(
        'appbar-content-headline-image',
        { includeHiddenElements: true }
      );

      expect(imageContainer).toHaveProp('aria-hidden', true);
      expect(
        screen.queryByRole('heading', { name: 'Brand words' })
      ).not.toBeOnTheScreen();
    }
  );

  it('exposes the leading button, headline, and trailing actions in source order', async () => {
    await render(
      <Appbar
        variant="small"
        headline="Inbox"
        leadingButton={{ type: 'back', 'aria-label': 'Navigate back' }}
        trailingActions={[
          { key: 'search', icon: 'magnify', 'aria-label': 'Search inbox' },
          { key: 'more', icon: 'dots-vertical', 'aria-label': 'More options' },
        ]}
        testID={testIDPrefix}
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
      <Appbar
        variant="small"
        headline="Inbox"
        trailingActions={[
          { key: 'keep', icon: 'star', 'aria-label': 'Keep action' },
          { key: 'remove', icon: 'delete', 'aria-label': 'Remove action' },
        ]}
        testID={testIDPrefix}
      />
    );
    const survivingTrailingAction = screen.getByRole('button', {
      name: 'Keep action',
    });

    await rerender(
      <Appbar
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
        testID={testIDPrefix}
      />
    );

    expect(screen.getByRole('button', { name: 'Keep action' })).toBe(
      survivingTrailingAction
    );
  });
});
