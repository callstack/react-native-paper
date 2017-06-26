/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, TextInput } from 'react-native';
import color from 'color';
import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import Paper from './Paper';
import { white } from '../styles/colors';
import type { Theme } from '../types/Theme';

type Props = {
  placeholder?: string,
  value: string,
  onChangeText: (query: string) => void,
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
    theme: PropTypes.object.isRequired,
    style: Paper.propTypes.style,
  };

  _handleClearPress = () => {
    this.props.onChangeText('');
  };

  render() {
    const { placeholder, value, theme, style, ...rest } = this.props;
    const { colors, roundness } = theme;
    const textColor = colors.text;
    const iconColor = color(textColor).alpha(0.54).rgbaString();
    const rippleColor = color(textColor).alpha(0.32).rgbaString();

    return (
      <Paper
        elevation={4}
        style={[{ borderRadius: roundness }, styles.container, style]}
      >
        <Icon
          style={[styles.icon, { color: iconColor }]}
          name="search"
          size={24}
        />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          {...rest}
        />
        {value
          ? <TouchableRipple
              borderless
              rippleColor={rippleColor}
              onPress={this._handleClearPress}
            >
              <Icon
                style={[styles.icon, { color: iconColor }]}
                name="close"
                size={24}
              />
            </TouchableRipple>
          : null}
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: white,
    margin: 4,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  icon: {
    margin: 12,
  },
});

export default withTheme(SearchBar);
