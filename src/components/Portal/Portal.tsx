import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext, PortalMethods } from './PortalHost';
import { SettingsContext } from '../../core/settings';
import { ThemeProvider, withTheme } from '../../core/theming';

type Props = {
  /**
   * Content of the `Portal`.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

/**
 * Portal allows to render a component at a different place in the parent tree.
 * You can use it to render content which should appear above other elements, similar to `Modal`.
 * It requires a [`Portal.Host`](portal-host.html) component to be rendered somewhere in the parent tree.
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
const Portal = ({ children, theme }: Props) => {
  const settings = React.useContext(SettingsContext);
  const manager = React.useContext(PortalContext);
  return (
    <PortalConsumer manager={manager as PortalMethods}>
      <SettingsContext.Provider value={settings}>
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </SettingsContext.Provider>
    </PortalConsumer>
  );
};

// @component ./PortalHost.tsx
Portal.Host = PortalHost;

export default withTheme(Portal);
