/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import withTheme from '../../core/withTheme';
import { white } from '../../styles/colors';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
  subTitle?: string,
  title: string,
  titleStyle?: any,
  theme: Theme,
  style?: any,
  subTitleStyle?: any,
};

class ToolbarContent extends Component {
  props: Props;

  render() {
    const {
      dark,
      subTitle,
      subTitleStyle,
      style,
      titleStyle,
      theme,
      title,
    } = this.props;
    const { colors, fonts } = theme;
    const { text: primaryText, secondaryText } = colors;
    const fontFamilyMedium = fonts['medium'];

    const titleColor = dark ? white : primaryText;
    const subTitleColor = dark
      ? color(white).alpha(0.7).rgbaString()
      : secondaryText;
    const titleStyles = [
      styles.text,
      { color: titleColor, fontFamily: fontFamilyMedium },
      titleStyle,
    ];

    return (
      <View style={[styles.container, style]}>
        <Text
          style={[!subTitle ? styles.title : styles.subTitle, titleStyles]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subTitle &&
          <Text
            style={[styles.subTitle, { color: subTitleColor }, subTitleStyle]}
            numberOfLines={1}
          >
            {subTitle}
          </Text>}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
  },
  subTitle: {
    fontSize: 14,
  },
});

export default withTheme(ToolbarContent);
