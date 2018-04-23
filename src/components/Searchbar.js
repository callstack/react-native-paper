/* @flow */

import * as React from 'react';
import { StyleSheet, TextInput } from 'react-native';

import color from 'color';
import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableIcon from './TouchableIcon';
import Paper from './Paper';
import type { Theme } from '../types';
import type { IconSource } from './Icon';

type Props = {
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
  onIconPress?: Function,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

/**
 * Searchbar is a simple input box where users can type search queries.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/searchbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import React from 'react';
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

  _root: TextInput;

  setNativeProps(...args) {
    return this._root.setNativeProps(...args);
  }

  isFocused(...args) {
    return this._root.isFocused(...args);
  }

  clear(...args) {
    return this._root.clear(...args);
  }

  focus(...args) {
    return this._root.focus(...args);
  }

  blur(...args) {
    return this._root.blur(...args);
  }

  render() {
    const {
      placeholder,
      onIconPress,
      icon,
      value,
      theme,
      style,
      ...rest
    } = this.props;
    const { colors, roundness, dark } = theme;
    const textColor = colors.text;
    const iconColor = dark
      ? textColor
      : color(textColor)
          .alpha(0.54)
          .rgb()
          .string();
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Paper
        style={[
          { borderRadius: roundness, elevation: 4 },
          styles.container,
          style,
        ]}
      >
        {onIconPress ? (
          <TouchableIcon
            borderless
            rippleColor={rippleColor}
            onPress={onIconPress}
            color={iconColor}
            iconStyle={styles.icon}
            name={icon || 'search'}
          />
        ) : (
          <Icon
            style={styles.icon}
            name={icon || 'search'}
            size={24}
            color={iconColor}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          ref={c => {
            this._root = c;
          }}
          value={value}
          {...rest}
        />
        {value ? (
          <TouchableIcon
            borderless
            color={iconColor}
            rippleColor={rippleColor}
            onPress={this._handleClearPress}
            iconStyle={styles.icon}
            name="close"
          />
        ) : null}
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
  },
  icon: {
    margin: 12,
  },
});

export default withTheme(Searchbar);
