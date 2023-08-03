import * as React from 'react';
import {
  I18nManager,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native';

import { Consumer as SettingsConsumer } from '../core/settings';
import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';
import { accessibilityProps } from './MaterialCommunityIcon';

type IconBase = string | ImageSourcePropType;

export type IconSource =
  | IconBase
  | Readonly<{ icon: IconBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  /**
   * Size of icon.
   */
  size: number;
  allowFontScaling?: boolean;
};

const isImageIcon = (icon: any) =>
  // icon is an object with uri
  (typeof icon === 'object' &&
    icon !== null &&
    Object.prototype.hasOwnProperty.call(icon, 'uri') &&
    typeof icon.uri === 'string') ||
  // icon is a module, e.g. - require('image')
  typeof icon === 'number' ||
  // image url on web
  (Platform.OS === 'web' &&
    typeof icon === 'string' &&
    (icon.startsWith('data:image') ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(icon)));

const getIconId = (icon: any) => {
  if (
    typeof icon === 'object' &&
    icon !== null &&
    Object.prototype.hasOwnProperty.call(icon, 'uri') &&
    typeof icon.uri === 'string'
  ) {
    return icon.uri;
  }

  return icon;
};

export const isValidIcon = (icon: any) =>
  typeof icon === 'string' || typeof icon === 'function' || isImageIcon(icon);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

export type Props = IconProps & {
  /**
   * Icon to display.
   */
  icon: any;
  /**
   *
   * Color of the icon.
   */
  color?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * An icon component which renders icon from vector library
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Icon, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Icon
 *     icon="camera"
 *     color={MD3Colors.error50}
 *     size={20}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends TouchableRipple props https://callstack.github.io/react-native-paper/docs/components/TouchableRipple
 */

const Icon = ({ icon, color, size, theme: themeOverrides, ...rest }: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const direction =
    typeof icon === 'object' && icon.direction && icon.icon
      ? icon.direction === 'auto'
        ? I18nManager.getConstants().isRTL
          ? 'rtl'
          : 'ltr'
        : icon.direction
      : null;

  const i =
    typeof icon === 'object' && icon.direction && icon.icon ? icon.icon : icon;
  const iconColor =
    color || (theme.isV3 ? theme.colors.onSurface : theme.colors.text);

  if (isImageIcon(i)) {
    return (
      <Image
        {...rest}
        source={i}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: `contain`,
          },
        ]}
        {...accessibilityProps}
        accessibilityIgnoresInvertColors
      />
    );
  } else if (typeof i === 'string') {
    return (
      <SettingsConsumer>
        {({ icon }) => {
          return icon?.({
            name: i,
            color: iconColor,
            size,
            direction,
          });
        }}
      </SettingsConsumer>
    );
  } else if (typeof i === 'function') {
    return i({ color: iconColor, size, direction });
  }

  return null;
};

export default Icon;
