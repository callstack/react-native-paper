/* @flow */

import React, { Component } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import color from 'color';
import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableIcon from './TouchableIcon';
import Paper from './Paper';
import type { Theme } from '../types/Theme';
import type { IconSource } from './Icon';

type Props = {
  /**
   * Hint text shown when the input is empty
   */
  placeholder?: string,
  /**
   * Icon name for the left icon button (see onIconPress)
   */
  icon?: IconSource,
  /**
   * The value of the text input
   */
  value: string,
  /**
   * Callback that is called when the text input's text changes
   */
  onChangeText: (query: string) => void,
  /**
   * Callback to execute if we want the left icon to act as button
   */
  onIconPress?: Function,
  theme: Theme,
  style?: any,
};

/**
 * SearchBar is a simple input box where users can type search queries
 *
 * **Usage:**
 * ```
 * export default class MyComponent extends Component {
 *   state = {
 *     firstQuery: '',
 *   };
 *
 *   render() {
 *     const { firstQuery } = this.state;
 *     return (
 *       <SearchBar
 *         placeholder="Search"
 *         onChangeText={query => { this.setState({ firstQuery: query }); }}
 *         value={firstQuery}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class SearchBar extends Component<void, Props, void> {
  _handleClearPress = () => {
    this.props.onChangeText('');
  };

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
          .rgbaString();
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgbaString();

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
            iconStyle={[styles.icon, { color: iconColor }]}
            name={icon || 'search'}
          />
        ) : (
          <Icon
            style={[styles.icon, { color: iconColor }]}
            name="search"
            size={24}
          />
        )}
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          value={value}
          {...rest}
        />
        {value ? (
          <TouchableIcon
            borderless
            rippleColor={rippleColor}
            onPress={this._handleClearPress}
            iconStyle={[styles.icon, { color: iconColor }]}
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

export default withTheme(SearchBar);
