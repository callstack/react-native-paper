/* @flow */

import * as React from 'react';
import { Animated, View, Platform, StyleSheet } from 'react-native';
import * as Colors from '../styles/colors';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = React.ElementConfig<typeof View> & {
  /**
   * Content of the `Surface`.
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  elevation: Animated.Value,
};

/**
 * Surface is a basic container that can give depth to an element with elevation shadow.
 * A shadow can be applied by specifying the `elevation` property both on Android and iOS.
 *
 * <div class="screenshots">
 *   <img src="screenshots/surface-1.png" />
 *   <img src="screenshots/surface-2.png" />
 *   <img src="screenshots/surface-3.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Surface, Text } from 'react-native-paper';
 * import { StyleSheet } from 'react-native';
 *
 * const MyComponent = () => (
 *   <Surface style={styles.surface}>
 *      <Text>Surface</Text>
 *   </Surface>
 * );
 *
 * export default MyComponent;
 *
 * const styles = StyleSheet.create({
 *   surface: {
 *     padding: 8,
 *     height: 80,
 *     width: 80,
 *     alignItems: 'center',
 *     justifyContent: 'center',
 *     elevation: 4,
 *   },
 * });
 * ```
 */
class Surface extends React.Component<Props, State> {
  constructor(props: Props, context) {
    super(props, context);

    // Set initial elevation
    /* $FlowFixMe */
    const { elevation } = StyleSheet.flatten(this.props.style || {});
    this.state = {
      elevation: new Animated.Value(elevation || 1),
    };
  }

  componentDidUpdate(prevProps: Props) {
    /* $FlowFixMe */
    const { elevation } = StyleSheet.flatten(this.props.style || {});
    /* $FlowFixMe */
    const { elevation: prevElevation } = StyleSheet.flatten(
      prevProps.style || {}
    );

    if (prevElevation !== elevation && elevation) {
      Animated.timing(this.state.elevation, {
        toValue: elevation,
        duration: 150,
      }).start(() => {
        // For some reason, on web the animation does not animate properly
        // This is just a work around and should be fixed urgently
        if (Platform.OS === 'web') {
          this.forceUpdate();
        }
      });
    }
  }

  render() {
    const { style, theme, ...rest } = this.props;
    const { elevation } = this.state;

    return (
      <Animated.View
        {...rest}
        style={[
          { backgroundColor: theme.colors.surface },
          {
            shadowColor: Colors.black,
            shadowOpacity: 0.24,
            shadowOffset: {
              width: 0,
              height: elevation.interpolate({
                inputRange: [0, 1, 2, 3, 8, 24],
                outputRange: [0, 0.5, 0.75, 2, 7, 23],
                extrapolate: 'clamp',
              }),
            },
            shadowRadius: elevation.interpolate({
              inputRange: [0, 1, 2, 3, 8, 24],
              outputRange: [0, 0.75, 1.5, 3, 8, 24],
              extrapolate: 'clamp',
            }),
          },
          style,
        ]}
      />
    );
  }
}

export default withTheme(Surface);
