import { Text, View } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import AppbarV3 from '../../AppbarV3';
import type { AppbarVariant } from '../../AppbarV3';

const writtenTitleVariants: Exclude<AppbarVariant, 'search'>[] = [
  'small',
  'medium-flexible',
  'large-flexible',
];

const decorativeTitleImage = (
  <View>
    <View accessible role="img" accessibilityLabel="Brand artwork" />
    <Text accessible role="heading">
      Brand words
    </Text>
  </View>
);

describe('AppbarV3 accessibility', () => {
  it.each(writtenTitleVariants)(
    'exposes a written %s title as a heading',
    async (variant) => {
      await render(<AppbarV3 variant={variant} title="Inbox" />);

      expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
    }
  );

  it('hides a small title image behind one named heading', async () => {
    await render(
      <AppbarV3
        variant="small"
        title="Inbox"
        titleImage={decorativeTitleImage}
      />
    );

    expect(screen.getAllByRole('heading')).toHaveLength(1);
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
    expect(screen.queryByRole('img')).not.toBeOnTheScreen();
    expect(screen.queryByText('Brand words')).not.toBeOnTheScreen();
  });

  it.each(['medium-flexible', 'large-flexible'] as const)(
    'does not expose duplicate content for a %s title image',
    async (variant) => {
      await render(
        <AppbarV3
          variant={variant}
          title="Inbox"
          titleImage={decorativeTitleImage}
        />
      );

      expect(screen.getAllByRole('heading', { name: 'Inbox' })).toHaveLength(1);
      expect(screen.queryByRole('img')).not.toBeOnTheScreen();
      expect(screen.queryByLabelText('Brand artwork')).not.toBeOnTheScreen();
    }
  );

  it('exposes a pressable written title as a named button and heading', async () => {
    const onTitlePress = jest.fn();
    await render(
      <AppbarV3 variant="small" title="Inbox" onTitlePress={onTitlePress} />
    );

    expect(screen.getByRole('button', { name: 'Inbox' })).toBeOnTheScreen();
    expect(screen.getByRole('heading', { name: 'Inbox' })).toBeOnTheScreen();
  });

  it('forwards custom title button accessibility props', async () => {
    const onAccessibilityAction = jest.fn();
    await render(
      <AppbarV3
        variant="small"
        title="Inbox"
        onTitlePress={() => {}}
        titleActionProps={{
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

  it('uses default and custom labels for back actions', async () => {
    await render(
      <View>
        <AppbarV3
          testID="default-back-appbar"
          variant="small"
          title="Inbox"
          leadingAction={{ type: 'back' }}
        />
        <AppbarV3
          testID="custom-back-appbar"
          variant="small"
          title="Archive"
          leadingAction={{ type: 'back', 'aria-label': 'Return to inbox' }}
        />
      </View>
    );

    expect(screen.getByRole('button', { name: 'Back' })).toBeOnTheScreen();
    expect(
      screen.getByRole('button', { name: 'Return to inbox' })
    ).toBeOnTheScreen();
  });

  it('preserves icon action labels, hints, disabled state, and busy state', async () => {
    await render(
      <AppbarV3
        variant="small"
        title="Inbox"
        actions={[
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

    const action = screen.getByRole('button', {
      name: 'Save message',
      busy: true,
      disabled: true,
    });

    expect(action).toHaveProp('accessibilityHint', 'Saves the current draft');
    expect(action).toBeDisabled();
    expect(action).toBeBusy();
  });

  it.each(['small', 'medium-flexible'] as const)(
    'hides decorative descendants of a %s title image',
    async (variant) => {
      await render(
        variant === 'small' ? (
          <AppbarV3
            variant="small"
            title="Inbox"
            titleImage={decorativeTitleImage}
          />
        ) : (
          <AppbarV3
            variant="medium-flexible"
            title="Inbox"
            titleImage={decorativeTitleImage}
          />
        )
      );

      const imageContainer = screen.getByTestId('appbar-content-title-image', {
        includeHiddenElements: true,
      });

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

  it('exposes leading, title, and trailing elements in source order', async () => {
    await render(
      <AppbarV3
        variant="small"
        title="Inbox"
        leadingAction={{ type: 'back', 'aria-label': 'Navigate back' }}
        actions={[
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

  it('does not remount a surviving action when its configuration changes', async () => {
    const { rerender } = await render(
      <AppbarV3
        variant="small"
        title="Inbox"
        actions={[
          { key: 'keep', icon: 'star', 'aria-label': 'Keep action' },
          { key: 'remove', icon: 'delete', 'aria-label': 'Remove action' },
        ]}
      />
    );
    const survivingAction = screen.getByRole('button', {
      name: 'Keep action',
    });

    await rerender(
      <AppbarV3
        variant="small"
        title="Inbox"
        actions={[
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
      survivingAction
    );
  });
});
