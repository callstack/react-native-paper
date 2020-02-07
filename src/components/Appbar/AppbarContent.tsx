import * as React from 'react';
import {
  Platform,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import color from 'color';

import Text from '../Typography/Text';

import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';

import { Theme, $RemoveChildren } from '../../types';

type Props = $RemoveChildren<typeof View> & {
  /**
   * Custom color for the text.
   */
  color?: string;
  /**
   * Text for the title.
   */
  title: React.ReactNode;
  /**
   * Style for the title.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Reference for the title.
   */
  titleRef?: React.RefObject<Text>;
  /**
   * Text for the subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * Style for the subtitle.
   */
  subtitleStyle?: StyleProp<TextStyle>;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * A component used to display a title and optional subtitle in a appbar.
 */
class AppbarContent extends React.Component<Props> {
  static displayName = 'Appbar.Content';

  render() {
    const {
      color: titleColor = white,
      subtitle,
      subtitleStyle,
      onPress,
      style,
      titleRef,
      titleStyle,
      theme,
      title,
      ...rest
    } = this.props;
    const { fonts } = theme;

    const subtitleColor = color(titleColor)
      .alpha(0.7)
      .rgb()
      .string();

    return (
      <TouchableWithoutFeedback onPress={onPress} disabled={!onPress}>
        <View style={[styles.container, style]} {...rest}>
          <Text
            ref={titleRef}
            style={[
              {
                color: titleColor,
                ...(Platform.OS === 'ios' ? fonts.regular : fonts.medium),
              },
              styles.title,
              titleStyle,
            ]}
            numberOfLines={1}
            accessible
            accessibilityTraits="header"
            // @ts-ignore
            accessibilityRole={Platform.OS === 'web' ? 'heading' : 'header'}
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
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 17 : 20,
  },
  subtitle: {
    fontSize: Platform.OS === 'ios' ? 11 : 14,
  },
});

export default withTheme(AppbarContent);

// @component-docs ignore-next-line
export { AppbarContent };
