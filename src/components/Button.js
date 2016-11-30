/* @flow */

import color from 'color';
import React, {
  PureComponent,
  PropTypes,
} from 'react';
import {
  ActivityIndicator,
  Animated,
  View,
  StyleSheet,
} from 'react-native';
import Icon from './Icon';
import Paper from './Paper';
import Text from './Typography/Text';
import TouchableRipple from './TouchableRipple';
import { black, white } from '../styles/colors';
import withTheme from '../core/withTheme';
import type { Theme } from '../types/Theme';

const AnimatedPaper = Animated.createAnimatedComponent(Paper);

type Props = {
  disabled?: boolean;
  compact?: boolean;
  raised?: boolean;
  primary?: boolean;
  dark?: boolean;
  loading?: boolean;
  icon?: string;
  color?: string;
  children?: string | Array<string>;
  onPress?: Function;
  style?: any;
  theme: Theme;
}

type State = {
  elevation: Animated.Value;
}

/**
 * Buttons communicate the action that will occur when the user touches them
 *
 * **Usage:**
 * ```
 * const MyComponent = () => (
 *  <Button raised onPress={() => console.log('Pressed')>}
 *    Press me
 *  </Button>
 * );
 * ```
 */
class Button extends PureComponent<void, Props, State> {
  static propTypes = {
    /**
     * Disable the button
     */
    disabled: PropTypes.bool,
    /**
     * Use a compact look, useful for flat buttons in a row
     */
    compact: PropTypes.bool,
    /**
     * Add elevation to button, as opposed to default flat appearance
     */
    raised: PropTypes.bool,
    /**
     * Use to primary color from theme
     */
    primary: PropTypes.bool,
    /**
     * Text color of button, a dark button will render light text and vice-versa
     */
    dark: PropTypes.bool,
    /**
     * Whether to show a loading indicator
     */
    loading: PropTypes.bool,
    /**
     * Icon name
     */
    icon: PropTypes.string,
    /**
     * Custom text color for flat button, or background color for raised button
     */
    color: PropTypes.string,
    /**
     * Button text
     */
    children: PropTypes.oneOfType([ PropTypes.string, PropTypes.arrayOf(PropTypes.string) ]).isRequired,
    /**
     * Function to execute on press
     */
    onPress: PropTypes.func,
    style: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      elevation: new Animated.Value(props.raised ? 2 : 0),
    };
  }

  state: State;

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
        backgroundColor = 'rgba(0, 0, 0, .12)';
      } else {
        if (buttonColor) {
          backgroundColor = buttonColor;
        } else {
          if (primary) {
            backgroundColor = colors.primary;
          } else {
            backgroundColor = dark ? black : white;
          }
        }
      }
    } else {
      backgroundColor = 'transparent';
    }

    if (typeof dark === 'boolean') {
      isDark = dark;
    } else {
      isDark = backgroundColor === 'transparent' ? false : !color(backgroundColor).light();
    }

    if (disabled) {
      textColor = 'rgba(0, 0, 0, .26)';
    } else {
      if (raised) {
        textColor = isDark ? white : black;
      } else {
        if (buttonColor) {
          textColor = buttonColor;
        } else {
          if (primary) {
            textColor = colors.primary;
          } else {
            textColor = isDark ? white : black;
          }
        }
      }
    }

    const rippleColor = color(textColor).alpha(0.32).rgbaString();
    const buttonStyle = { backgroundColor, borderRadius: roundness };
    const touchableStyle = { borderRadius: roundness };
    const textStyle = { color: textColor, fontFamily };

    const content = (
      <View style={styles.content}>
        {icon && loading !== true ?
          <Icon
            name={icon}
            size={16}
            color={textColor}
            style={styles.icon}
          /> : null
        }
        {loading ?
          <ActivityIndicator
            size='small'
            color={textColor}
            style={styles.icon}
          /> : null
        }
        <Text numberOfLines={1} style={[ styles.label, compact && styles.compactLabel, textStyle, { fontFamily } ]}>
          {children ? (Array.isArray(children) ? children.join('') : children).toUpperCase() : ''}
        </Text>
      </View>
    );

    return (
      <AnimatedPaper
        elevation={disabled ? 0 : this.state.elevation}
        style={[ styles.button, compact && styles.compact, buttonStyle, style ]}
      >
        {disabled ? content :
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
        }
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
