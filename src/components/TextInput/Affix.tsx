import React from 'react';
import color from 'color';
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  LayoutChangeEvent,
  Animated,
} from 'react-native';

import { withTheme } from '../../core/theming';
import { Theme } from '../../types';

type Props = {
  text: string;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  visible?: Animated.Value;
  /**
   * @optional
   */
  theme: Theme;
};

class TextInputAffix extends React.Component<Props> {
  static displayName = 'TextInput.Affix';

  render() {
    const { text, style, textStyle, onLayout, theme, visible } = this.props;

    const textColor = color(theme.colors.text)
      .alpha(theme.dark ? 0.7 : 0.54)
      .rgb()
      .string();

    return (
      <Animated.View
        style={[
          styles.container,
          style,
          {
            opacity:
              visible?.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }) || 1,
          },
        ]}
        onLayout={onLayout}
      >
        <Text style={[{ color: textColor }, textStyle]}>{text}</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default withTheme(TextInputAffix);

export { TextInputAffix };
