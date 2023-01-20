import * as React from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
} from 'react-native';

import { useInternalTheme } from '../core/theming';
import { black, white } from '../styles/themes/v2/colors';
import type { ThemeProp } from '../types';
import getContrastingColor from '../utils/getContrastingColor';

const defaultSize = 20;

export type Props = React.ComponentProps<typeof Animated.Text> & {
  /**
   * Whether the badge is visible
   */
  visible?: boolean;
  /**
   * Content of the `Badge`.
   */
  children?: string | number;
  /**
   * Size of the `Badge`.
   */
  size?: number;
  style?: StyleProp<TextStyle>;
  ref?: React.RefObject<typeof Animated.Text>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * Badges are small status descriptors for UI elements.
 * A badge consists of a small circle, typically containing a number or other short set of characters, that appears in proximity to another object.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/badge-1.png" />
 *     <figcaption>Badge with content</figcaption>
 *   </figure>
 *   <figure>
 *     <img class="small" src="screenshots/badge-2.png" />
 *     <figcaption>Badge without content</figcaption>
 *   </figure>
 * </div>
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
  size = defaultSize,
  style,
  theme: themeOverrides,
  visible = true,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const { fontScale } = useWindowDimensions();

  const isFirstRendering = React.useRef<boolean>(true);

  const {
    animation: { scale },
  } = theme;

  React.useEffect(() => {
    // Do not run animation on very first rendering
    if (isFirstRendering.current) {
      isFirstRendering.current = false;
      return;
    }

    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 150 * scale,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity, scale]);

  const {
    backgroundColor = theme.isV3
      ? theme.colors.error
      : theme.colors?.notification,
    ...restStyle
  } = (StyleSheet.flatten(style) || {}) as TextStyle;

  const textColor = theme.isV3
    ? theme.colors.onError
    : getContrastingColor(backgroundColor, white, black);

  const borderRadius = size / 2;

  const paddingHorizontal = theme.isV3 ? 3 : 4;

  return (
    <Animated.Text
      numberOfLines={1}
      style={[
        {
          opacity,
          backgroundColor,
          color: textColor,
          fontSize: size * 0.5,
          ...(!theme.isV3 && theme.fonts.regular),
          lineHeight: size / fontScale,
          height: size,
          minWidth: size,
          borderRadius,
          paddingHorizontal,
        },
        styles.container,
        restStyle,
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
