/* @flow */

import * as React from 'react';
import { Animated, Platform, View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';

type Props = {
  /**
   * Whether checkbox is checked.
   */
  checked: boolean,
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
  /**
   * Custom color for checkbox.
   */
  color?: string,
  /**
   * @optional
   */
  theme: Theme,
};

type State = {
  scaleAnim: Animated.Value,
};

/**
 * Checkboxes allow the selection of multiple options from a set.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.android.png" />
 *     <figcaption>Android (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.android.png" />
 *     <figcaption>Android (disabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.ios.png" />
 *     <figcaption>iOS (enabled)</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.ios.png" />
 *     <figcaption>iOS (disabled)</figcaption>
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Checkbox } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     checked: false,
 *   };
 *
 *   render() {
 *     const { checked } = this.state;
 *     return (
 *       <Checkbox
 *         checked={checked}
 *         onPress={() => { this.setState({ checked: !checked }); }}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class Checkbox extends React.Component<Props, State> {
  state = {
    scaleAnim: new Animated.Value(1),
  };

  componentDidUpdate(nextProps) {
    if (nextProps.checked === this.props.checked || Platform.OS !== 'android') {
      return;
    }

    Animated.sequence([
      Animated.timing(this.state.scaleAnim, {
        toValue: 0.85,
        duration: nextProps.checked ? 0 : 200,
      }),
      Animated.timing(this.state.scaleAnim, {
        toValue: 1,
        duration: nextProps.checked ? 350 : 200,
      }),
    ]).start();
  }

  render() {
    const { checked, disabled, onPress, theme, ...rest } = this.props;
    const checkedColor = this.props.color || theme.colors.accent;
    const uncheckedColor = theme.dark
      ? 'rgba(255, 255, 255, .7)'
      : 'rgba(0, 0, 0, .54)';

    let rippleColor, checkboxColor;

    if (disabled) {
      rippleColor = 'rgba(0, 0, 0, .16)';
      checkboxColor = theme.colors.disabled;
    } else {
      rippleColor = color(checkedColor)
        .fade(0.32)
        .rgb()
        .string();
      checkboxColor = checked ? checkedColor : uncheckedColor;
    }

    const borderWidth = this.state.scaleAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [7, 0],
    });

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={disabled ? undefined : onPress}
        style={styles.container}
      >
        <Animated.View style={{ transform: [{ scale: this.state.scaleAnim }] }}>
          <Icon
            allowFontScaling={false}
            name={checked ? 'check-box' : 'check-box-outline-blank'}
            size={24}
            color={checkboxColor}
            style={styles.icon}
          />
          <View style={[StyleSheet.absoluteFill, styles.fillContainer]}>
            <Animated.View
              style={[
                styles.fill,
                { borderColor: checkboxColor },
                { borderWidth },
              ]}
            />
          </View>
        </Animated.View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    width: 36,
    height: 36,
  },
  icon: {
    margin: 6,
  },
  fillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    height: 14,
    width: 14,
  },
});

export default withTheme(Checkbox);
