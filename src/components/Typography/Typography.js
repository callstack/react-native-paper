/* @flow */
import React, { Component } from 'react'

import { withTheme } from '../../core/theming';
import type { Theme } from '../../types'

import StyledText from './StyledText';

export type Variant = 'display4' | 'display3' | 'display2' | 'display1' | 'headline' | 'title' | 'subheading' | 'body1' | 'body2' | 'caption'
export type Align = 'left' | 'center' | 'right' | 'justify'

type Props = {
  theme: Theme,
  align?: Align,
  variant?: Variant,
  color?: string,
  gutterBottom?: boolean,
  headlineMapping?: object,
  noWrap?: boolean,
  paragraph?: boolean,
  style?: any,
}

export class Typography extends Component<Props> {
  render () {
    const {
      theme, align, color, gutterBottom, headlineMapping,
      noWrap, paragraph, variant, style, ...rest
    } = this.props;

    return (
      <StyledText
        numberOfLines={noWrap ? null : 1}
        style={[
          styles[variant],
          {
            fontFamily: theme.fonts.regular,
            color: color != null ? color : theme.colors.text,
            textAlign: align != null ? align : 'inherit',
            marginBottom: gutterBottom || paragraph ? '0.35em' : 'auto',
          },
          style
        ]}
        {...rest}
      />
    )
  }
}

export default withTheme(Typography);

const styles = StyleSheet.create({
  display4: {
    fontSize: "7rem",
    fontWeight: 300,
    lineHeight: "1.14286em",
    letterSpacing: "-0.04em",
    marginLeft: "-0.04em",
  },
  display3: {
    fontSize: "3.5rem",
    fontWeight: 400,
    lineHeight: "1.30357em",
    letterSpacing: "-0.02em",
    marginLeft: "-0.02em",
  },
  display2: {
    fontSize: "2.8125rem",
    fontWeight: 400,
    lineHeight: "1.13333em",
    marginLeft: "-0.02em",
  },
  display1: {
    fontSize: "2.125rem",
    fontWeight: 400,
    lineHeight: "1.20588em",
  },
  headline: {
    fontSize: "1.5rem",
    fontWeight: 400,
    lineHeight: "1.35417em",
  },
  title: {
    fontSize: "1.3125rem",
    fontWeight: 500,
    lineHeight: "1.16667em",
  },
  subheading: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: "1.5em",
  },
  body1: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: "1.46429em",
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: "1.71429em",
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: "1.375em",
  }
})