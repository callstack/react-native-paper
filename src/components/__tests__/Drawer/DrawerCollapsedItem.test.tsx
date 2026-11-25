import * as React from 'react';
import { Platform } from 'react-native';

import { afterEach, describe, expect, it, jest } from '@jest/globals';
import { getAnimatedStyle } from 'react-native-reanimated';

import { act, render, screen, userEvent } from '../../../test-utils';
import { tokens } from '../../../theme/tokens';
import DrawerCollapsedItem from '../../Drawer/DrawerCollapsedItem';

const stateOpacity = tokens.md.sys.state.opacity;

describe('DrawerCollapsedItem', () => {
  it('should have regular outline if label is specified', async () => {
    const tree = (
      await render(
        <DrawerCollapsedItem
          label="starred"
          focusedIcon="star"
          unfocusedIcon="star-outline"
        />
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should have rounded outline if label is not specified', async () => {
    const tree = (
      await render(
        <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should display unfocused icon in inactive state, if unfocused icon is specified', async () => {
    const tree = (
      await render(
        <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should display focused icon in inactive state, if unfocused icon is not specified', async () => {
    const tree = (
      await render(<DrawerCollapsedItem focusedIcon="star" />)
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('should display focused icon in active state', async () => {
    const tree = (
      await render(
        <DrawerCollapsedItem
          active
          focusedIcon="star"
          unfocusedIcon="star-outline"
        />
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  describe('active indicator', () => {
    const indicatorStyle = () => {
      const [indicator] = screen
        .getByRole('button')
        .queryAll((node) => 'transform' in getAnimatedStyle(node));
      return getAnimatedStyle(indicator);
    };

    it('expands to full size when the item becomes active without a press', async () => {
      await render(
        <DrawerCollapsedItem label="Inbox" focusedIcon="inbox" active={false} />
      );

      await screen.rerender(
        <DrawerCollapsedItem label="Inbox" focusedIcon="inbox" active />
      );
      await act(() => jest.advanceTimersByTimeAsync(300));

      expect(indicatorStyle().transform).toEqual([{ scaleX: 1 }]);
    });

    it('animates the expansion when a press makes the item active', async () => {
      const Item = () => {
        const [active, setActive] = React.useState(false);
        return (
          <DrawerCollapsedItem
            label="Inbox"
            focusedIcon="inbox"
            active={active}
            onPress={() => setActive(true)}
          />
        );
      };
      await render(<Item />);
      const collapsed = indicatorStyle().transform;

      await userEvent.press(screen.getByRole('button'));
      await act(() => jest.advanceTimersByTimeAsync(75));
      const midway = indicatorStyle().transform;
      await act(() => jest.advanceTimersByTimeAsync(300));
      const expanded = indicatorStyle().transform;

      expect(expanded).toEqual([{ scaleX: 1 }]);
      expect(midway).not.toEqual(collapsed);
      expect(midway).not.toEqual(expanded);
    });
  });

  it('should render at full opacity when enabled', async () => {
    await render(<DrawerCollapsedItem label="starred" focusedIcon="star" />);

    expect(screen.getByText('starred')).toHaveStyle({
      opacity: stateOpacity.enabled,
    });
  });

  it('should dim the label when disabled', async () => {
    await render(
      <DrawerCollapsedItem label="starred" focusedIcon="star" disabled />
    );

    expect(screen.getByText('starred')).toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  it('should keep the active indicator at full opacity when disabled', async () => {
    await render(
      <DrawerCollapsedItem label="starred" focusedIcon="star" active disabled />
    );

    expect(screen.getByRole('button')).not.toHaveStyle({
      opacity: stateOpacity.disabled,
    });
  });

  describe('active destination', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it.each(['ios', 'android'] as const)(
      'is a selected button on %s',
      async (os) => {
        jest.replaceProperty(Platform, 'OS', os);
        await render(
          <DrawerCollapsedItem
            label="Inbox"
            focusedIcon="inbox"
            active
            onPress={() => {}}
          />
        );

        expect(screen.getByRole('button')).toBeSelected();
      }
    );

    it('is a button marked as the current page on web', async () => {
      jest.replaceProperty(Platform, 'OS', 'web');
      await render(
        <DrawerCollapsedItem
          label="Inbox"
          focusedIcon="inbox"
          active
          onPress={() => {}}
        />
      );

      const destination = screen.getByRole('button');
      expect(destination).toHaveProp('aria-current', 'page');
      expect(destination).not.toHaveProp('aria-selected');
    });
  });
});
