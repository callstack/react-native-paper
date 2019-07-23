import * as React from 'react';
import {
  View,
  ViewStyle,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import color from 'color';
import Text from '../Typography/Text';
import { withTheme } from '../../core/theming';
import { white } from '../../styles/colors';
import { Theme } from '../../types';

const defaultSize = 64;

type Props = {
  /**
   * Initials to show as the text in the `Avatar`.
   */
  label: string;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Custom color for the text.
   */
  color?: string;
  /**
   * Style for text container
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the title.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

/**
 * Avatars can be used to represent people in a graphical way.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/avatar-text.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Avatar.Text size={24} label="XD" />
 * );
 * ```
 */
class AvatarText extends React.Component<Props> {
  static displayName = 'Avatar.Text';

  static defaultProps = {
    size: defaultSize,
  };

  render() {
    const { label, size = defaultSize, style, theme, labelStyle } = this.props;

    const { backgroundColor = theme.colors.primary, ...restStyle } =
      StyleSheet.flatten(style) || {};
    const textColor =
      this.props.color ||
      (color(backgroundColor).isLight() ? 'rgba(0, 0, 0, .54)' : white);

    return (
      <View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor,
          },
          styles.container,
          restStyle,
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: size / 2,
              lineHeight: size,
            },
            labelStyle,
          ]}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default withTheme(AvatarText);
