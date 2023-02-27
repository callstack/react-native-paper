import React from 'react';

import { render } from '@testing-library/react-native';

import DrawerCollapsedItem from '../../Drawer/DrawerCollapsedItem';

describe('DrawerCollapsedItem', () => {
  it('should have regular outline if label is specified', () => {
    const { getByTestId } = render(
      <DrawerCollapsedItem
        label="starred"
        focusedIcon="star"
        unfocusedIcon="star-outline"
      />
    );

    expect(getByTestId('drawer-collapsed-item-outline')).toHaveStyle({
      height: 32,
    });
  });

  it('should have rounded outline if label is not specified', () => {
    const { getByTestId } = render(
      <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
    );

    expect(getByTestId('drawer-collapsed-item-outline')).toHaveStyle({
      height: 56,
    });
  });

  it('should display unfocused icon in inactive state, if unfocused icon is specified', () => {
    const { getByTestId } = render(
      <DrawerCollapsedItem focusedIcon="star" unfocusedIcon="star-outline" />
    );

    expect(
      getByTestId('drawer-collapsed-item-container').props.children[1].props
        .source
    ).toBe('star-outline');
  });

  it('should display focused icon in inactive state, if unfocused icon is not specified', () => {
    const { getByTestId } = render(<DrawerCollapsedItem focusedIcon="star" />);

    expect(
      getByTestId('drawer-collapsed-item-container').props.children[1].props
        .source
    ).toBe('star');
  });

  it('should display focused icon in active state', () => {
    const { getByTestId } = render(
      <DrawerCollapsedItem
        active
        focusedIcon="star"
        unfocusedIcon="star-outline"
      />
    );

    expect(
      getByTestId('drawer-collapsed-item-container').props.children[1].props
        .source
    ).toBe('star');
  });
});
