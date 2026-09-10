import { describe, expect, it } from '@jest/globals';

import { render } from '../../../test-utils';
import DrawerCollapsedItem from '../../Drawer/DrawerCollapsedItem';

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
});
