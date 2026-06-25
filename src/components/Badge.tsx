import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import { useInternalTheme } from '../core/theming';
import { cornerFull } from '../theme/tokens/sys/shape';
import type { ThemeProp } from '../types';

const SMALL_SIZE = 6;
const LARGE_SIZE = 16;
const MAX_LARGE_WIDTH = 36;
const LARGE_PADDING = 4;

export type Props = TextProps & {
  /**
   * Whether the badge is visible
   */
  visible?: boolean;
  /**
   * Content of the `Badge`.
   */
  children?: string | number;
  style?: StyleProp<TextStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * The badge is styled differently based on whether `children` is passed:
 * - Small dot when it doesn't have `children`
 * - Larger pill when it has `children`
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Badge } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Badge>3</Badge>
 * );
 *
 * export default MyComponent;
 * ```
 */
const Badge = ({
  children,
  style,
  theme: themeOverrides,
  visible = true,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const {
    animation: { scale },
  } = theme;

  const textColor = theme.colors.onError;

  const isLarge = children != null;
  const badgeSize = isLarge ? LARGE_SIZE : SMALL_SIZE;
  const labelFont = theme.fonts.labelSmall;

  const transitionStyle = {
    opacity: visible ? 1 : 0,
    transitionDuration: 150 * scale,
    transitionProperty: 'opacity',
  };

  return (
    <Animated.Text
      numberOfLines={1}
      allowFontScaling={false}
      style={[
        styles.container,
        transitionStyle,
        {
          backgroundColor: theme.colors.error,
          color: textColor,
          borderRadius: cornerFull,
          height: badgeSize,
          minWidth: badgeSize,
        },
        isLarge && [
          labelFont,
          {
            lineHeight: LARGE_SIZE,
            maxWidth: MAX_LARGE_WIDTH,
            paddingHorizontal: LARGE_PADDING,
          },
        ],
        style,
      ]}
      {...rest}
    >
      {children}
    </Animated.Text>
  );
};

export default Badge;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-end',
    textAlign: 'center',
    textAlignVertical: 'center',
    overflow: 'hidden',
  },
});
