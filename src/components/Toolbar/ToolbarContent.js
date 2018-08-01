/* @flow */

import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import withTheme from '../../core/withTheme';
import { white, black } from '../../styles/colors';

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

/**
 * The ToolbarContent component is used for displaying a title and optional subtitle in a toolbar.
 */
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
    const { fonts } = theme;

    const titleColor = dark ? white : black;
    const subtitleColor = color(titleColor)
      .alpha(0.7)
      .rgb()
      .string();

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[
            { color: titleColor, fontFamily: fonts.medium },
            styles.title,
            titleStyle,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            style={[styles.subtitle, { color: subtitleColor }, subtitleStyle]}
            numberOfLines={1}
          >
            {subtitle}
          </Text>
        ) : null}
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
