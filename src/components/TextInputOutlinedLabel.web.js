/* @flow */

import * as React from 'react';
//  We import createElement wich does not exist in react-native but does in
//  react-native-web
//  $FlowFixMe
import { createElement, View, Animated, StyleSheet } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';

import { withTheme } from '../core/theming';
import type { Theme } from '../types';

//  We use a legend web versions because we don't need a background
//  to remove the border so it fixes autocomplete issues

const MINIMIZED_LABEL_FONT_SIZE = 12;

type Props = React.ElementConfig<typeof View> & {|
  /**
   * Labeled will be used to animate the border removed
   */
  labeled: Animated.Value,
  /**
   * Label of the input to calculate which part of outline will be removed
   */
  label?: string,
  /**
   * The color of border around the input.
   */
  borderColor?: null | string,
  /**
   * The width of the border around the input.
   */
  borderWidth?: number,
  /**
   * @optional
   */
  theme: Theme,
|};

class TextInputOutlinedLabel extends React.Component<Props> {
  static defaultProps = {};

  render() {
    const { theme, label, labeled, borderWidth, borderColor } = this.props;

    const { fonts } = theme;
    const fontFamily = fonts.regular;

    return (
      <Fieldset
        pointerEvents="none"
        style={[
          styles.outline,
          {
            borderRadius: theme.roundness,
            borderWidth,
            borderColor,
          },
        ]}
      >
        {label ? (
          // When mode == 'outlined', the input label stays on top of the outline
          // The background of the label covers the outline so it looks cut off
          // To achieve the effect, we position the actual label with a background on top of it
          // We set the color of the text to transparent so only the background is visible
          <AnimatedText
            pointerEvents="none"
            style={[
              styles.outlinedLabelBackground,
              {
                fontFamily,
                fontSize: MINIMIZED_LABEL_FONT_SIZE,
                maxWidth: labeled.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['100%', '0%'],
                }),
                paddingRight: labeled.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, 0],
                }),
                paddingLeft: labeled.interpolate({
                  inputRange: [0, 1],
                  outputRange: [6, 0],
                }),
                // Hide the background when scale will be 0
                // There's a bug in RN which makes scale: 0 act weird
                opacity: labeled.interpolate({
                  inputRange: [0, 0.9, 1],
                  outputRange: [1, 1, 0],
                }),
                transform: [
                  {
                    // Animate the scale when label is moved up
                    scaleX: labeled.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 0],
                    }),
                  },
                ],
              },
            ]}
            numberOfLines={1}
          >
            {label}
          </AnimatedText>
        ) : null}
      </Fieldset>
    );
  }
}

polyfill(TextInputOutlinedLabel);

export default withTheme(TextInputOutlinedLabel);

const styles = StyleSheet.create({
  outline: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    top: 0,
    left: 0,
    margin: 0,
    padding: 0,
    paddingLeft: 6,
  },
  outlinedLabelBackground: {
    color: 'transparent',
    textAlign: 'left',
    padding: 0,
    overflow: 'hidden',
    height: 11,
    lineHeight: 11,
  },
});

const Fieldset = props => createElement('fieldset', props);
//  eslint-disable-next-line
class Legend extends React.Component<Props> {
  render() {
    return createElement('legend', this.props);
  }
}
//  eslint-disable-next-line
const AnimatedText = Animated.createAnimatedComponent(Legend);
