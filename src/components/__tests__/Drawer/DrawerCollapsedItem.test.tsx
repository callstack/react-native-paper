import { describe, expect, it } from '@jest/globals';

import { render, screen } from '../../../test-utils';
import DrawerCollapsedItem from '../../Drawer/DrawerCollapsedItem';

describe('DrawerCollapsedItem', () => {
  it('should have regular outline if label is specified', async () => {
    await render(
      <DrawerCollapsedItem
        label="starred"
        focusedIcon="star"
        unfocusedIcon="star-outline"
      />
    );

    expect(screen.getByTestId('drawer-collapsed-item-outline')).toHaveStyle({
      height: 32,
    });
  });

  it('should have rounded outline if label is not specified', async () => {
    await render(
      <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
    );

    expect(screen.getByTestId('drawer-collapsed-item-outline')).toHaveStyle({
      height: 56,
    });
  });

  it('should display unfocused icon in inactive state, if unfocused icon is specified', async () => {
    await render(
      <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
    );

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('drawer-collapsed-item-container').props.children[1]
        .props.source
    ).toBe('star-outline');
  });

  it('should display focused icon in inactive state, if unfocused icon is not specified', async () => {
    await render(<DrawerCollapsedItem focusedIcon="star" />);

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('drawer-collapsed-item-container').props.children[1]
        .props.source
    ).toBe('star');
  });

  it('should display focused icon in active state', async () => {
    await render(
      <DrawerCollapsedItem
        active
        focusedIcon="star"
        unfocusedIcon="star-outline"
      />
    );

    expect(
      // eslint-disable-next-line no-restricted-syntax -- TODO: replace TestInstance props access with a user-visible assertion.
      screen.getByTestId('drawer-collapsed-item-container').props.children[1]
        .props.source
    ).toBe('star');
  });
});
