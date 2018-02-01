/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import withTheme from '../../core/withTheme';
import { white } from '../../styles/colors';

import type { Theme } from '../../types';

type Props = {
  /**
   * Theme color for the text, a dark toolbar will render light text and vice-versa.
   */
  dark?: boolean,
  /**
   * Text for the title.
   */
  title: string | React.Node,
  /**
   * Style for the title.
   */
  titleStyle?: any,
  /**
   * Text for the subtitle.
   */
  subtitle?: string | React.Node,
  /**
   * Style for the subtitle.
   */
  subtitleStyle?: any,
  style?: any,
  /**
   * @optional
   */
  theme: Theme,
};

class ToolbarContent extends React.Component<Props> {
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
      ? color(white)
          .alpha(0.7)
          .rgb()
          .string()
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
        {subtitle && (
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        )}
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
