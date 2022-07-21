import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext, PortalMethods } from './PortalHost';
import {
  Provider as SettingsProvider,
  Consumer as SettingsConsumer,
} from '../../core/settings';
import { ThemeProvider, withTheme } from '../../core/theming';

export type Props = {
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
class Portal extends React.Component<Props> {
  // @component ./PortalHost.tsx
  static Host = PortalHost;

  render() {
    const { children, theme } = this.props;

    return (
      <SettingsConsumer>
        {(settings) => (
          <PortalContext.Consumer>
            {(manager) => (
              <PortalConsumer manager={manager as PortalMethods}>
                <SettingsProvider value={settings}>
                  <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </SettingsProvider>
              </PortalConsumer>
            )}
          </PortalContext.Consumer>
        )}
      </SettingsConsumer>
    );
  }
}

export default withTheme(Portal);
