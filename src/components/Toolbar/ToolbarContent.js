/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Platform, StyleSheet } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import withTheme from '../../core/withTheme';
import { white } from '../../styles/colors';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
  subtitle?: string | React.Element<*>,
  title: string | React.Element<*>,
  titleStyle?: any,
  style?: any,
  subtitleStyle?: any,
  theme: Theme,
};

class ToolbarContent extends Component<void, Props, void> {
  static propTypes = {
    /**
     * Theme color for the text, a dark toolbar will render light text and vice-versa
     */
    dark: PropTypes.bool,
    /**
     * Text for the subtitle
     */
    subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Text for the title
     */
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    /**
     * Style for the title
     */
    titleStyle: View.propTypes.style,
    style: View.propTypes.style,
    /**
     * Style for the subtitle
     */
    subtitleStyle: View.propTypes.style,
    theme: PropTypes.object.isRequired,
  };

  render() {
    const {
      dark,
      subtitle,
      subtitleStyle,
      style,
      titleStyle,
      theme,
      title,
    } = this.props;
    const { colors, fonts } = theme;
    const { text: primaryText, secondaryText } = colors;

    const titleColor = dark ? white : primaryText;
    const subtitleColor = dark
      ? color(white).alpha(0.7).rgbaString()
      : secondaryText;

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[
            styles.title,
            { color: titleColor, fontFamily: fonts.medium },
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle &&
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 18 : 20,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 12 : 14,
  },
});

export default withTheme(ToolbarContent);
