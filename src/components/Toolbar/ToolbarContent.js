/* @flow */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Platform, View, StyleSheet } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import withTheme from '../../core/withTheme';
import { white } from '../../styles/colors';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
  hasStartIcon?: boolean,
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
     * If Toolbar has a left icon, this prop will align the title accordingly
     */
    hasStartIcon: PropTypes.bool,
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
      hasStartIcon,
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
      <View
        style={[
          styles.container,
          {
            paddingHorizontal:
              Platform.OS === 'ios' ? 16 : hasStartIcon ? 22 : 16,
          },
          style,
        ]}
      >
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
    paddingHorizontal: Platform.OS === 'ios' ? 16 : 16,
  },
  title: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 14,
  },
});

export default withTheme(ToolbarContent);
