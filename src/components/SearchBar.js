/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput } from 'react-native';

import color from 'color';
import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableIcon from './TouchableIcon';
import Paper from './Paper';
import type { Theme } from '../types/Theme';

type Props = {
  placeholder?: string,
  icon?: string,
  value: string,
  onChangeText: (query: string) => void,
  onIconPress?: Function,
  theme: Theme,
  style?: any,
};

/**
 * SearchBar is a simple input box where users can type search queries
 */
class SearchBar extends Component<void, Props, void> {
  static propTypes = {
    /**
     * Hint text shown when the input is empty
     */
    placeholder: PropTypes.string,
    /**
     * The value of the text input
     */
    value: PropTypes.string.isRequired,
    /**
     * Callback that is called when the text input's text changes
     */
    onChangeText: PropTypes.func.isRequired,
    /**
     * Callback to execute if we want the left icon to act as button
     */
    onIconPress: PropTypes.func,
    /**
     * Icon name for the left icon button (see onIconPress)
     */
    icon: PropTypes.string,
    theme: PropTypes.object.isRequired,
    style: Paper.propTypes.style,
  };

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
    const { colors, roundness } = theme;
    const textColor = colors.text;
    const iconColor = color(textColor).alpha(0.54).rgbaString();
    const rippleColor = color(textColor).alpha(0.32).rgbaString();

    return (
      <Paper
        elevation={4}
        style={[{ borderRadius: roundness }, styles.container, style]}
      >
        {onIconPress
          ? <TouchableIcon
              borderless
              rippleColor={rippleColor}
              onPress={onIconPress}
              iconStyle={[styles.icon, { color: iconColor }]}
              name={icon || 'search'}
            />
          : <Icon
              style={[styles.icon, { color: iconColor }]}
              name="search"
              size={24}
            />}
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          value={value}
          {...rest}
        />
        {value
          ? <TouchableIcon
              borderless
              rippleColor={rippleColor}
              onPress={this._handleClearPress}
              iconStyle={[styles.icon, { color: iconColor }]}
              name="close"
            />
          : null}
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
