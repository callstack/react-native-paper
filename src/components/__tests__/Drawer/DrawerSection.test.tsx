import { View } from 'react-native';

import { describe, expect, it } from '@jest/globals';

import { defaultThemes } from '../../../core/theming';
import { render, screen } from '../../../test-utils';
import DrawerSection from '../../Drawer/DrawerSection';

describe('DrawerSection', () => {
  it('renders properly', async () => {
    const tree = (
      await render(
        <DrawerSection>
          <View />
        </DrawerSection>
      )
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('separates sections with a themed divider', async () => {
    await render(
      <DrawerSection>
        <View />
      </DrawerSection>
    );

    expect(screen.getByTestId('drawer-section-divider')).toHaveStyle({
      backgroundColor: defaultThemes.light.colors.outlineVariant,
    });
  });

  it('follows a custom theme for the divider colour', async () => {
    const theme = {
      colors: { outlineVariant: 'rgb(1, 2, 3)' },
    };

    await render(
      <DrawerSection theme={theme}>
        <View />
      </DrawerSection>
    );

    expect(screen.getByTestId('drawer-section-divider')).toHaveStyle({
      backgroundColor: 'rgb(1, 2, 3)',
    });
  });

  it('omits the divider when showDivider is false', async () => {
    await render(
      <DrawerSection showDivider={false}>
        <View />
      </DrawerSection>
    );

    expect(screen.queryByTestId('drawer-section-divider')).toBeNull();
  });

  it('aligns the section title with the destination icons', async () => {
    await render(
      <DrawerSection title="Mailboxes">
        <View />
      </DrawerSection>
    );

    expect(screen.getByText('Mailboxes')).toHaveStyle({ marginStart: 28 });
  });
});
