import * as React from 'react';
import PortalConsumer from './PortalConsumer';
import PortalHost, { PortalContext, PortalMethods } from './PortalHost';
import {
  Provider as SettingsProvider,
  Consumer as SettingsConsumer,
} from '../../core/settings';
import { ThemeProvider, withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = {
  /**
   * Content of the `Portal`.
   */
  children: React.ReactNode;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * Portal allows to render a component at a different place in the parent tree.
 * You can use it to render content which should appear above other elements, similar to `Modal`.
 * It requires a [`Portal.Host`](portal-host.html) component to be rendered somewhere in the parent tree.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Provider, Portal, Text } from 'react-native-paper';
 * import { View } from 'react-native';
 * 
 * export default class MyComponent extends React.Component {
 *   render() {
 *     return (
 *       <Provider>
 *       
 *         <View style={{
 *           flex: 1,
 *           justifyContent: 'center',
 *           alignContent: 'center'
 *         }}>
 *           <Text style={{
 *             textAlign: 'center'
 *           }}>This is rendered in the normal place</Text>
 *         </View>
 *       
 *        <Portal>
 *           <Text>This is rendered at a different place</Text>
 *        </Portal>
 *
 *      </Provider>
 *    );
 *  }
 * }
 * ```
 */
class Portal extends React.Component<Props> {
  // @component ./PortalHost.tsx
  static Host = PortalHost;

  render() {
    const { children, theme } = this.props;

    return (
      <SettingsConsumer>
        {settings => (
          <PortalContext.Consumer>
            {manager => (
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
