/* @flow */

import * as React from 'react';
import { View, StyleSheet, Animated, ScrollView } from 'react-native';
import Text from './Typography/Text';
import Button from './Button';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

type Props = {
  /**
   * Whether banner is currently visible
   */
  visible: boolean,
  /**
   * Array of objects that are displayed as action buttons.
   * Object should have following properties:
   * - `label`: label of the action button (required)
   * - `onPress`: callback that is called when button is pressed (required)
   */
  actions: Array<{
    label: string,
    onPress: () => mixed,
  }>,
  /**
   * Message that will be displayed inside banner
   */
  message: string,
  /**
   * Image that will be displayed inside banner
   */
  image?: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  height: ?number,
  animatedPosition: Animated.Value,
  animatedHeight: Animated.Value,
  measured: boolean,
};

type NativeEvent = {
  nativeEvent: {
    layout: {
      x: number,
      y: number,
      width: number,
      height: number,
    },
  },
};

const ANIMATION_DURATION = 250;

/**
 * Banner displays a prominent message and related optional actions.
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { View, ScrollView } from 'react-native';
 * import { Banner } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     visible: false,
 *   };
 *
 *   render() {
 *     const { visible } = this.state;
 *     return (
 *       <View style={styles.container}>
 *         <Banner
 *           actions={[
 *             {
 *               label: 'Fix it',
 *               onPress: () => {
 *                 this.setState({ visible: false });
 *               },
 *             },
 *             {
 *               label: 'Learn more',
 *               onPress: () => {
 *                 this.setState({ visible: false });
 *               },
 *             },
 *           ]}
 *           image={
 *             <Image
 *               source={{ uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4' }}
 *               style={{
 *                 width: 40,
 *                 height: 40,
 *               }}
 *             />
 *           }
 *           message="There was a problem processing a transaction on your credit card."
 *           visible={this.state.visible}
 *         />
 *         <FAB
 *           small
 *           icon="add"
 *           label="Show Banner"
 *           style={{
 *             margin: 8,
 *             position: 'absolute',
 *             bottom: 0,
 *           }}
 *           onPress={() => {
 *             this.setState({ visible: true });
 *           }}
 *         />
 *       </View>
 *     );
 *   }
 * }
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'space-between',
 *   },
 * });
 * ```
 */

class Banner extends React.Component<Props, State> {
  static defaultProps = {
    visible: true,
  };

  state = {
    height: null,
    animatedPosition: new Animated.Value(this.props.visible ? 0 : -500),
    animatedHeight: new Animated.Value(0),
    measured: false,
  };

  scrollView: ?ScrollView = null;

  componentDidUpdate(prevProps) {
    if (prevProps.visible !== this.props.visible) {
      this._toggle();
    }
  }

  onLayout = ({ nativeEvent }: NativeEvent) => {
    const { height } = nativeEvent.layout;
    const { measured } = this.state;

    this.setState({ height, measured: true }, () => {
      if (!measured) {
        // Set the appropriate initial values if height was previously unknown
        if (!this.props.visible) {
          this.state.animatedPosition.setValue(-height);
          this.state.animatedHeight.setValue(0);
        } else {
          this.state.animatedPosition.setValue(0);
          this.state.animatedHeight.setValue(height);
        }
      }
    });
  };

  _toggle = () => {
    if (this.props.visible) {
      this._show();
    } else {
      this._hide();
    }
  };

  _show = () => {
    Animated.parallel([
      Animated.timing(this.state.animatedPosition, {
        duration: ANIMATION_DURATION,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedHeight, {
        duration: ANIMATION_DURATION,
        toValue: this.state.height || 0,
      }),
    ]).start();
  };

  _hide = () => {
    Animated.parallel([
      Animated.timing(this.state.animatedPosition, {
        duration: ANIMATION_DURATION,
        toValue: -(this.state.height || 0),
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animatedHeight, {
        duration: ANIMATION_DURATION,
        toValue: 0,
      }),
    ]).start();
  };

  render() {
    const {
      image,
      actions,
      style,
      message,
      visible,
      theme: { colors },
    } = this.props;

    const { measured } = this.state;

    return (
      <Animated.View
        style={
          measured
            ? {
                height: this.state.animatedHeight,
              }
            : null
        }
      >
        <Animated.View
          onLayout={this.onLayout}
          style={[
            { position: measured || !visible ? 'absolute' : 'relative' },
            styles.container,
            {
              backgroundColor: colors.background,
              transform: [
                {
                  translateY: this.state.animatedPosition,
                },
              ],
            },
            style,
          ]}
        >
          <View style={styles.contentRow}>
            {image ? <View style={styles.imageContainer}>{image}</View> : null}
            <View style={{ flex: 1 }}>
              <Text style={styles.message}>{message}</Text>
            </View>
          </View>
          <View style={styles.actions}>
            {actions.map(({ label, onPress, ...rest }, index) => (
              <Button
                key={label}
                onPress={onPress}
                style={
                  index === actions.length - 1 ? null : styles.buttonMargin
                }
                color={colors.primary}
                compact
                mode="text"
                {...rest}
              >
                {label}
              </Button>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  imageContainer: {
    marginRight: 16,
  },
  message: {
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
    marginHorizontal: 8,
  },
  buttonMargin: {
    marginRight: 8,
  },
});

export default withTheme(Banner);
