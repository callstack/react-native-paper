/* @flow */

import * as React from 'react';
import { StyleSheet, TextInput, I18nManager } from 'react-native';
import color from 'color';
import IconButton from './IconButton';
import Surface from './Surface';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = React.ElementConfig<typeof TextInput> & {|
  /**
   * Hint text shown when the input is empty.
   */
  placeholder?: string,
  /**
   * The value of the text input.
   */
  value: string,
  /**
   * Icon name for the left icon button (see `onIconPress`).
   */
  icon?: IconSource,
  /**
   * Callback that is called when the text input's text changes.
   */
  onChangeText?: (query: string) => void,
  /**
   * Callback to execute if we want the left icon to act as button.
   */
  onIconPress?: () => mixed,
  /**
   * Set style of the TextInput component inside the searchbar
   */
  inputStyle?: any,
  style?: any,

  /**
   * @optional
   */
  theme: Theme,
  /**
   * Custom color for icon, default will be derived from theme
   */
  iconColor?: string,
  /**
   * Custom icon for clear button, default will be icon close
   */
  clearIcon?: IconSource,
|};

/**
 * Searchbar is a simple input box where users can type search queries.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/searchbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Searchbar } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     firstQuery: '',
 *   };
 *
 *   render() {
 *     const { firstQuery } = this.state;
 *     return (
 *       <Searchbar
 *         placeholder="Search"
 *         onChangeText={query => { this.setState({ firstQuery: query }); }}
 *         value={firstQuery}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class Searchbar extends React.Component<Props> {
  _handleClearPress = () => {
    this.clear();
    this.props.onChangeText && this.props.onChangeText('');
  };

  _root: ?TextInput;

  /**
   * @internal
   */
  setNativeProps(...args) {
    return this._root && this._root.setNativeProps(...args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this._root && this._root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this._root && this._root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this._root && this._root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this._root && this._root.blur();
  }

  render() {
    const {
      placeholder,
      onIconPress,
      icon,
      value,
      theme,
      style,
      iconColor: customIconColor,
      clearIcon,
      inputStyle,
      ...rest
    } = this.props;
    const { colors, roundness, dark, fonts } = theme;
    const textColor = colors.text;
    const fontFamily = fonts.regular;
    const iconColor =
      customIconColor ||
      (dark
        ? textColor
        : color(textColor)
            .alpha(0.54)
            .rgb()
            .string());
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Surface
        style={[
          { borderRadius: roundness, elevation: 4 },
          styles.container,
          style,
        ]}
      >
        <IconButton
          borderless
          rippleColor={rippleColor}
          onPress={onIconPress}
          color={iconColor}
          icon={icon || 'search'}
        />
        <TextInput
          style={[styles.input, { color: textColor, fontFamily }, inputStyle]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          keyboardAppearance={dark ? 'dark' : 'light'}
          accessibilityTraits="search"
          accessibilityRole="search"
          ref={c => {
            this._root = c;
          }}
          value={value}
          {...rest}
        />
        <IconButton
          borderless
          disabled={!value}
          color={value ? iconColor : 'rgba(255, 255, 255, 0)'}
          rippleColor={rippleColor}
          onPress={this._handleClearPress}
          icon={clearIcon || 'close'}
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
        />
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    alignSelf: 'stretch',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    minWidth: 0,
  },
});

export default withTheme(Searchbar);
