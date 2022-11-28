import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import { white } from '../../styles/themes/v2/colors';
import type { InternalTheme } from '../../types';
import getContrastingColor from '../../utils/getContrastingColor';
import Text from '../Typography/Text';

const defaultSize = 64;

export type Props = React.ComponentPropsWithRef<typeof View> & {
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
  theme: InternalTheme;
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
const AvatarText = ({
  label,
  size = defaultSize,
  style,
  theme,
  labelStyle,
  color: customColor,
  ...rest
}: Props) => {
  const { backgroundColor = theme.colors?.primary, ...restStyle } =
    StyleSheet.flatten(style) || {};
  const textColor =
    customColor ??
    getContrastingColor(backgroundColor, white, 'rgba(0, 0, 0, .54)');
  const { fontScale } = useWindowDimensions();

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
      {...rest}
    >
      <Text
        style={[
          styles.text,
          {
            color: textColor,
            fontSize: size / 2,
            lineHeight: size / fontScale,
          },
          labelStyle,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
    </View>
  );
};

AvatarText.displayName = 'Avatar.Text';

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

export default withInternalTheme(AvatarText);
