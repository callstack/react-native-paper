import { Text } from 'react-native';

import { expect, it, jest } from '@jest/globals';

import { LocaleProvider, useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { render, screen } from '../../test-utils';
import Portal from '../Portal/Portal';

jest.useRealTimers();

it('renders portal with siblings', async () => {
  const { toJSON } = await render(
    <Portal.Host>
      <Text>Outside content</Text>
      <Portal>
        <Text testID="content">Portal content</Text>
      </Portal>
    </Portal.Host>
  );

  await screen.findByTestId('content');

  expect(toJSON()).toMatchSnapshot();
});

const PortalThemeContent = () => {
  const theme = useInternalTheme(undefined);
  const { direction } = useLocale();

  return <Text>{`${theme.animation.scale} ${direction}`}</Text>;
};

it('passes local theme overrides and locale to portal content and updates them', async () => {
  const { rerender } = await render(
    <Portal.Host>
      <LocaleProvider direction="rtl">
        <Portal theme={{ animation: { scale: 2 } }}>
          <PortalThemeContent />
        </Portal>
      </LocaleProvider>
    </Portal.Host>
  );

  expect(screen.getByText('2 rtl')).toBeOnTheScreen();

  await rerender(
    <Portal.Host>
      <LocaleProvider direction="ltr">
        <Portal theme={{ animation: { scale: 3 } }}>
          <PortalThemeContent />
        </Portal>
      </LocaleProvider>
    </Portal.Host>
  );

  expect(screen.getByText('3 ltr')).toBeOnTheScreen();
  expect(screen.queryByText('2 rtl')).not.toBeOnTheScreen();
});
