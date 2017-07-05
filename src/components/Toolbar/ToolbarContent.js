/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet } from 'react-native';
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
    const fontFamilyMedium = fonts.medium;

    const titleColor = dark ? white : primaryText;
    const subtitleColor = dark
      ? color(white).alpha(0.7).rgbaString()
      : secondaryText;
    const titleStyles = [
      { color: titleColor, fontFamily: fontFamilyMedium },
      titleStyle,
    ];

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[!subtitle ? styles.title : styles.subtitle, titleStyles]}
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
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default withTheme(ToolbarContent);
