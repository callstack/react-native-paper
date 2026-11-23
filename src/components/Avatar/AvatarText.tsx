import { StyleSheet, useWindowDimensions, View } from 'react-native';
import type {
  ColorValue,
  StyleProp,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { DEFAULT_SIZE, getAvatarRole } from './utils';
import { useInternalTheme } from '../../core/theming';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { ThemeProp } from '../../theme/types';
import { takeGraphemes } from '../../utils/takeGraphemes';
import Text from '../Typography/Text';

export type Props = Omit<ViewProps, 'style'> & {
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
  color?: ColorValue;
  /**
   * Background color of the avatar.
   */
  backgroundColor?: ColorValue;
  /**
   * Style for the text container.
   *
   * Background color should be specified via the `backgroundColor` prop instead.
   */
  style?: StyleProp<Omit<ViewStyle, 'backgroundColor'>>;
  /**
   * Style for the title.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Avatars can be used to represent people in a graphical way.
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
  size = DEFAULT_SIZE,
  style,
  labelStyle,
  color: customColor,
  backgroundColor: customBackgroundColor,
  theme: themeOverrides,
  maxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { fontScale } = useWindowDimensions();
  const avatarInitials = takeGraphemes(label, 2);
  const hasCustomLabel =
    rest.accessibilityLabel !== undefined || rest['aria-label'] !== undefined;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: cornerFull,
        },
        styles.container,
        style,
        {
          backgroundColor:
            customBackgroundColor ?? theme.colors.primaryContainer,
        },
      ]}
      {...(hasCustomLabel && {
        accessible: true,
        ...getAvatarRole(rest.accessibilityRole),
      })}
      {...rest}
    >
      <Text
        variant="titleMedium"
        theme={themeOverrides}
        style={[
          styles.text,
          {
            color: customColor ?? theme.colors.onPrimaryContainer,
            fontSize: size / 2,
            lineHeight: size / fontScale,
          },
          labelStyle,
        ]}
        numberOfLines={1}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
        {...(hasCustomLabel
          ? { 'aria-hidden': true }
          : { 'aria-label': label, role: 'img' as const })}
      >
        {avatarInitials}
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

export default AvatarText;
