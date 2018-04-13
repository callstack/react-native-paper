/* @flow */

import * as React from 'react';
import { ActivityIndicator, Animated, View, StyleSheet } from 'react-native';
import color from 'color';
import Icon from './Icon';
import Paper from './Paper';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { black, white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  /**
   * Whether the button is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean,
  /**
   * Use a compact look, useful for flat buttons in a row.
   */
  compact?: boolean,
  /**
   * Add elevation to button, as opposed to default flat appearance. Typically used on a flat surface.
   */
  raised?: boolean,
  /**
   * Use to primary color from theme. Typically used to emphasize an action.
   */
  primary?: boolean,
  /**
   * Text color of button, a dark button will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean,
  /**
   * Name of the icon. Can be a string, an image source or a react component.
   */
  icon?: IconSource,
  /**
   * Custom text color for flat button, or background color for raised button.
   */
  color?: string,
  /**
   * Label text of the button.
   */
  children: string | Array<string>,
  /**
   * Function to execute on press.
   */
  onPress?: Function,
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
 * A button is component that the user can press to trigger an action.
 *
 * <div class="screenshots">
 *   <img src="screenshots/button-raised.png" />
 *   <img src="screenshots/button-primary.png" />
 *   <img src="screenshots/button-custom.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Button raised onPress={() => console.log('Pressed')}>
 *     Press me
 *   </Button>
 * );
 * ```
 */
class Button extends React.Component<Props, State> {
  state = {
    elevation: new Animated.Value(this.props.raised ? 2 : 0),
  };

  _handlePressIn = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 8,
        duration: 200,
      }).start();
    }
  };

  _handlePressOut = () => {
    if (this.props.raised) {
      Animated.timing(this.state.elevation, {
        toValue: 2,
        duration: 150,
      }).start();
    }
  };

  render() {
    const {
      disabled,
      compact,
      raised,
      primary,
      dark,
      loading,
      icon,
      color: buttonColor,
      children,
      onPress,
      style,
      theme,
    } = this.props;
    const { colors, roundness } = theme;
    const fontFamily = theme.fonts.medium;

    let backgroundColor, textColor, isDark;

    if (raised) {
      if (disabled) {
        backgroundColor = color(theme.dark ? white : black)
          .alpha(0.12)
          .rgb()
          .string();
      } else if (buttonColor) {
        backgroundColor = buttonColor;
      } else if (primary) {
        backgroundColor = colors.primary;
      } else {
        backgroundColor = theme.dark ? '#535354' : white;
      }
    } else {
      backgroundColor = 'transparent';
    }

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark =
        backgroundColor === 'transparent'
          ? false
          : !color(backgroundColor).light();
    }

    if (disabled) {
      textColor = theme.dark
        ? color(white)
            .alpha(0.3)
            .rgb()
            .string()
        : color(black)
            .alpha(0.26)
            .rgb()
            .string();
    } else if (raised) {
      textColor = isDark ? white : black;
    } else if (buttonColor) {
      textColor = buttonColor;
    } else if (primary) {
      textColor = colors.primary;
    } else {
      textColor = theme.dark ? white : black;
    }

    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();
    const buttonStyle = { backgroundColor, borderRadius: roundness };
    const touchableStyle = { borderRadius: roundness };
    const textStyle = { color: textColor, fontFamily };
    const elevation = disabled ? 0 : this.state.elevation;

    const content = (
      <View style={styles.content}>
        {icon && loading !== true ? (
          <Icon name={icon} size={16} color={textColor} style={styles.icon} />
        ) : null}
        {loading ? (
          <ActivityIndicator
            size="small"
            color={textColor}
            style={styles.icon}
          />
        ) : null}
        <Text
          numberOfLines={1}
          style={[
            styles.label,
            compact && styles.compactLabel,
            textStyle,
            { fontFamily },
          ]}
        >
          {React.Children.map(
            children,
            child => (typeof child === 'string' ? child.toUpperCase() : child)
          )}
        </Text>
      </View>
    );

    return (
      <AnimatedPaper
        style={[
          styles.button,
          compact && styles.compact,
          { elevation },
          buttonStyle,
          style,
        ]}
      >
        {disabled ? (
          content
        ) : (
          <TouchableRipple
            borderless
            delayPressIn={0}
            onPress={onPress}
            onPressIn={this._handlePressIn}
            onPressOut={this._handlePressOut}
            rippleColor={rippleColor}
            style={touchableStyle}
          >
            {content}
          </TouchableRipple>
        )}
      </AnimatedPaper>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    margin: 4,
    minWidth: 88,
  },
  compact: {
    minWidth: 64,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  icon: {
    width: 16,
    marginLeft: 12,
    marginRight: -4,
  },
  label: {
    textAlign: 'center',
    marginVertical: 9,
    marginHorizontal: 16,
  },
  compactLabel: {
    marginHorizontal: 8,
  },
});

export default withTheme(Button);
