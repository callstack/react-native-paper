/* @flow */

import * as React from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { polyfill } from 'react-lifecycles-compat';

import Text from './Typography/Text';
import { withTheme } from '../core/theming';
import type { Theme } from '../types';

const AnimatedText = Animated.createAnimatedComponent(Text);

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
   * The color of border remover (will be placed above border)
   */
  backgroundColor?: null | string,
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
    const {
      theme,
      label,
      labeled,
      backgroundColor,
      borderWidth,
      borderColor,
    } = this.props;

    const { fonts } = theme;
    const fontFamily = fonts.regular;

    return [
      <View
        key="background"
        pointerEvents="none"
        style={[
          styles.outline,
          {
            borderRadius: theme.roundness,
            borderWidth,
            borderColor,
          },
        ]}
      />,
      label && (
        // When mode == 'outlined', the input label stays on top of the outline
        // The background of the label covers the outline so it looks cut off
        // To achieve the effect, we position the actual label with a background on top of it
        // We set the color of the text to transparent so only the background is visible
        <AnimatedText
          key="label-text"
          pointerEvents="none"
          style={[
            styles.outlinedLabelBackground,
            {
              backgroundColor,
              fontFamily,
              fontSize: MINIMIZED_LABEL_FONT_SIZE,
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
      ),
    ];
  }
}

polyfill(TextInputOutlinedLabel);

export default withTheme(TextInputOutlinedLabel);

const styles = StyleSheet.create({
  outline: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 6,
    bottom: 0,
  },
  outlinedLabelBackground: {
    position: 'absolute',
    top: 0,
    left: 8,
    paddingHorizontal: 4,
    color: 'transparent',
  },
});
