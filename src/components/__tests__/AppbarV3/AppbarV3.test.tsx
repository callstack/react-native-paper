import { Text, View } from 'react-native';

import { describe, expect, it, jest } from '@jest/globals';

import { render, screen } from '../../../test-utils';
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
