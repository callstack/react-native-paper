/* @flow */

import * as React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
} from 'react-native';
import { polyfill } from 'react-lifecycles-compat';
import color from 'color';
import Text from './Typography/Text';
import Card from './Card/Card';
import ThemedPortal from './Portal/ThemedPortal';
import FAB from './FAB';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Action items to display in the form of a speed dial.
   * An action item should contain the following properties:
   * - `icon`: icon to display (required)
   * - `label`: optional label text
   * - `color`: custom icon color of the action item
   * - `onPress`: callback that is called when `FAB` is pressed (required)
   */
  actions: Array<{
    icon: string,
    label?: string,
    color?: string,
    onPress: () => mixed,
  }>,
  /**
   * Icon to display for the `FAB`.
   * You can toggle it based on whether the speed dial is open to display a different icon.
   */
  icon: IconSource,
  /**
   * Custom icon color for the `FAB`.
   */
  color?: string,
  /**
   * Function to execute on pressing the `FAB`.
   */
  onPress?: () => mixed,
  /**
   * Whether the speed dial is open.
   */
  open: boolean,
  /**
   * Callback which is called on opening and closing the speed dial.
   * The open state needs to be updated when it's called, otherwise the change is dropped.
   */
  onStateChange: (state: { open: boolean }) => mixed,
  /**
   * Style for the group. You can use it to pass additional styles if you need.
   * For example, you can set an additional margin if you have a tab bar at the bottom.
   */
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  backdrop: Animated.Value,
  animations: Animated.Value[],
};

/**
 * FABGroup displays a stack of FABs with related actions in a speed dial.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab-group.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import React from 'react';
 * import { FABGroup, StyleSheet } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     open: false,
 *   };
 *
 *   render() {
 *     return (
 *       <FABGroup
 *         open={this.state.open}
 *         icon={this.state.open ? 'today' : 'add'}
 *         actions={[
 *           { icon: 'add', onPress: () => {} },
 *           { icon: 'star', label: 'Star', onPress: () => {} },
 *           { icon: 'email', label: 'Email', onPress: () => {} },
 *           { icon: 'notifications', label: 'Remind', onPress: () => {} },
 *         ]}
 *         onStateChange={({ open }) => this.setState({ open })}
 *         onPress={() => {
 *           if (this.state.open) {
 *             // do something if the speed dial is open
 *           }
 *         }}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class FABGroup extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      animations: nextProps.actions.map(
        (_, i) =>
          prevState.animations[i] || new Animated.Value(nextProps.open ? 1 : 0)
      ),
    };
  }

  state = {
    backdrop: new Animated.Value(0),
    animations: [],
  };

  componentDidUpdate(prevProps) {
    if (this.props.open === prevProps.open) {
      return;
    }

    if (this.props.open) {
      Animated.parallel([
        Animated.timing(this.state.backdrop, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.stagger(
          50,
          this.state.animations
            .map(animation =>
              Animated.timing(animation, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
              })
            )
            .reverse()
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(this.state.backdrop, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        ...this.state.animations.map(animation =>
          Animated.timing(animation, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
          })
        ),
      ]).start();
    }
  }

  _close = () => this.props.onStateChange({ open: false });

  _toggle = () => this.props.onStateChange({ open: !this.props.open });

  render() {
    const { actions, icon, open, onPress, theme, style } = this.props;

    const labelColor = theme.dark
      ? theme.colors.text
      : color(theme.colors.text)
          .fade(0.54)
          .rgb()
          .string();
    const backdropOpacity = open
      ? this.state.backdrop.interpolate({
          inputRange: [0, 0.5, 1],
          // $FlowFixMe
          outputRange: [0, 1, 1],
        })
      : this.state.backdrop;

    const opacities = this.state.animations;
    const scales = opacities.map(
      opacity =>
        open
          ? opacity.interpolate({
              inputRange: [0, 1],
              // $FlowFixMe
              outputRange: [0.8, 1],
            })
          : 1
    );

    return (
      <ThemedPortal>
        {open ? <StatusBar barStyle="light-content" /> : null}
        <View pointerEvents="box-none" style={[styles.container, style]}>
          <TouchableWithoutFeedback onPress={this._close}>
            <Animated.View
              pointerEvents={open ? 'auto' : 'none'}
              style={[
                styles.backdrop,
                {
                  opacity: backdropOpacity,
                  backgroundColor: 'rgba(0, 0, 0, 0.4)',
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <View pointerEvents={open ? 'box-none' : 'none'}>
            {actions.map((it, i) => (
              <Animated.View
                  key={i} //eslint-disable-line
                style={[
                  {
                    opacity: opacities[i],
                  },
                ]}
                pointerEvents="box-none"
              >
                <View style={styles.item} pointerEvents="box-none">
                  {it.label && (
                    <Card
                      style={[
                        styles.label,
                        {
                          transform: [{ scale: scales[i] }],
                        },
                      ]}
                      onPress={() => {
                        it.onPress();
                        this._close();
                      }}
                    >
                      <Text style={{ color: labelColor }}>{it.label}</Text>
                    </Card>
                  )}
                  <FAB
                    small
                    icon={it.icon}
                    color={it.color}
                    style={[
                      {
                        transform: [{ scale: scales[i] }],
                        backgroundColor: theme.colors.paper,
                      },
                    ]}
                    onPress={() => {
                      it.onPress();
                      this._close();
                    }}
                  />
                </View>
              </Animated.View>
            ))}
          </View>
          <FAB
            onPress={() => {
              onPress && onPress();
              this._toggle();
            }}
            icon={icon}
            color={this.props.color}
            style={styles.fab}
          />
        </View>
      </ThemedPortal>
    );
  }
}

polyfill(FABGroup);

export default withTheme(FABGroup);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  fab: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  label: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  item: {
    marginHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
