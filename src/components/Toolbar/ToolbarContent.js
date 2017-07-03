/* @flow */

import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import color from 'color';

import Paragraph from '../Typography/Paragraph';
import Title from '../Typography/Title';
import Subheading from '../Typography/Subheading';

import withTheme from '../../core/withTheme';
import { white} from '../../styles/colors';

import type { Theme } from '../../types/Theme';

type Props = {
  dark?: boolean,
  subTitle?: string,
  title: string,
  titleStyle?: any,
  theme: Theme,
  subTitleStyle?: any,
}

class ToolbarContent extends Component {
  props: Props;
  
  render() {
    const { dark, subTitle, subTitleStyle, titleStyle, theme, title } = this.props;
    const { colors, fonts } = theme;
    const { text: primaryText, secondaryText } = colors;
    const fontFamilyMedium = fonts['medium'];
    
    const titleColor = dark ? white : primaryText;
    const subTitleColor = dark ? color(white).alpha(0.7).rgbaString() : secondaryText;
    const titleStyles = [styles.text, { color: titleColor, fontFamily: fontFamilyMedium }, titleStyle];
    
    return (
      <View style={styles.container}>
        { !subTitle ?
          <Title style={titleStyles}>{title}</Title>
          :
          <Subheading style={titleStyles}>
            {title}
          </Subheading>
        }
        { subTitle &&
          <Paragraph style={[styles.text, {color: subTitleColor}, subTitleStyle]}>
            {subTitle}
          </Paragraph>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    lineHeight: null,
    marginVertical: 0,
    color: 'white',
  },
});

export default withTheme(ToolbarContent);
