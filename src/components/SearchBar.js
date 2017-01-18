/* @flow */

import React, {
  Component,
  PropTypes,
} from 'react';
import {
  StyleSheet,
  TextInput,
} from 'react-native';

import withTheme from '../core/withTheme';
import Icon from './Icon';
import TouchableRipple from './TouchableRipple';
import Paper from './Paper';
import type { Theme } from '../types/Theme';

type Props = {
  placeholder?: string;
  value: string;
  onChangeText: (query: string) => {};
  theme: Theme;
}

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
  };

  _handleClearPress = () => {
    this.props.onChangeText('');
  };

  render() {
    const {
      placeholder,
      value,
      theme,
    } = this.props;

    return (
      <Paper
        elevation={4}
        style={styles.container}
      >
        <Icon
          style={[ styles.iconWrapper, { color: theme.colors.icon } ]}
          name='search'
          size={24}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder || ''}
          value={value}
          placeholderTextColor={theme.colors.placeholder}
          underlineColorAndroid='transparent'
          onChangeText={this.props.onChangeText}
          returnKeyType='search'
        />
        {value ?
          <TouchableRipple
            borderless
            onPress={this._handleClearPress}
            style={styles.iconWrapper}
          >
            <Icon
              style={{ color: theme.colors.icon }}
              name='close'
              size={24}
            />
          </TouchableRipple> :
          null
        }
      </Paper>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  iconWrapper: {
    padding: 16,
  },
});

export default withTheme(SearchBar);
