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
  placeholder: string;
  value: string;
  onChangeSearch: (query: string) => {};
  theme: Theme;
}

/**
 * Search allows users to locate app content quickly
 */
class SearchBar extends Component<void, Props, void> {
  
  static propTypes = {
    /**
     * The string that will be rendered before text input has been entered
     */
    placeholder: PropTypes.string,
    /**
     * The value to show for the text input.
     */
    value: PropTypes.string.isRequired,
    /**
     * Callback that is called when the text input's text changes
     */
    onChangeSearch: PropTypes.func.isRequired,
    theme: PropTypes.object.isRequired,
  };
  
  constructor(props: Props) {
    super(props);
    this._styles = getStyles(this.props.theme);
  }
  
  _styles = {};
  
  _handleClearPress = () => {
    this.props.onChangeSearch('');
  };
  
  render() {
    const {
      placeholder,
      value,
      theme,
    } = this.props;
    
    const styles = this._styles;
    
    return (
      <Paper
        elevation={4}
        style={styles.container}
      >
        <Icon
          style={[ styles.iconWrapper, styles.icon ]}
          name='search'
          size={24}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          placeholderTextColor={theme.colors.hint}
          underlineColorAndroid='transparent'
          onChangeText={this.props.onChangeSearch}
          returnKeyType='search'
        />
        {value ?
          <TouchableRipple
            borderless
            onPress={this._handleClearPress}
            style={styles.iconWrapper}
          >
            <Icon
              style={styles.icon}
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

const getStyles = (theme: Theme) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  icon: {
    alignSelf: 'center',
    color: theme.colors.icon,
  },
  iconWrapper: {
    padding: 16,
  },
});

export default withTheme(SearchBar);
