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
  /**
   * Content we want to display under banner
   */
  children: React.Node,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  height: ?number,
  position: Animated.Value,
  contentPosition: Animated.Value,
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

class Banner extends React.Component<Props, State> {
  static defaultProps = {
    visible: true,
  };

  state = {
    height: null,
    position: new Animated.Value(-1000),
    contentPosition: new Animated.Value(0),
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
      if (measured) {
        if (!this.props.visible) {
          // If height changed and Banner was hidden, adjust the translate to keep it hidden
          this.state.position.setValue(-height);
          this.state.contentPosition.setValue(height);
        }
      } else {
        // Set the appropriate initial values if height was previously unknown
        this.state.contentPosition.setValue(height);

        // Perform the animation only if we're showing
        if (this.props.visible) {
          this._show();
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
      Animated.timing(this.state.position, {
        duration: 300,
        toValue: 0,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.contentPosition, {
        duration: 300,
        toValue: this.state.height || 0,
      }),
    ]).start();
  };

  _hide = () => {
    Animated.parallel([
      Animated.timing(this.state.position, {
        duration: 300,
        toValue: -(this.state.height || 0),
        useNativeDriver: true,
      }),
      Animated.timing(this.state.contentPosition, {
        duration: 300,
        toValue: 0,
      }),
    ]).start();
  };

  render() {
    const {
      image,
      children,
      actions,
      style,
      message,
      theme: { colors },
    } = this.props;

    return (
      <View style={[{ flex: 1 }]}>
        <Animated.View
          style={{
            height: this.state.contentPosition,
          }}
        />
        <View
          style={{
            flex: 1,
          }}
        >
          {children}
        </View>
        <Animated.View
          onLayout={this.onLayout}
          style={[
            styles.container,
            {
              backgroundColor: colors.background,
              transform: [
                {
                  translateY: this.state.position,
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
                style={index === actions.length - 1 ? {} : styles.buttonMargin}
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
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
