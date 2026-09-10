import * as React from 'react';

import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext } from './PortalHost';
import { LocaleProvider, useLocale } from '../../core/locale';
import {
  SettingsContext,
  Provider as SettingsProvider,
} from '../../core/settings';
import { ThemeProvider, useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';

export type Props = {
  /**
   * Content of the `Portal`.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Portal allows rendering a component at a different place in the parent tree.
 * You can use it to render content which should appear above other elements, similar to `Modal`.
 * It requires a [`Portal.Host`](PortalHost) component to be rendered somewhere in the parent tree.
 * Note that if you're using the `Provider` component, this already includes a `Portal.Host`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Portal, Text } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Portal>
 *     <Text>This is rendered at a different place</Text>
 *   </Portal>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Portal = ({ children, theme: themeOverrides }: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const settings = React.useContext(SettingsContext);
  const manager = React.useContext(PortalContext);

  return (
    <PortalConsumer manager={manager}>
      <SettingsProvider value={settings}>
        <LocaleProvider direction={direction}>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </LocaleProvider>
      </SettingsProvider>
    </PortalConsumer>
  );
};

// @component ./PortalHost.tsx
Portal.Host = PortalHost;

export default Portal;
