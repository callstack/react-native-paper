import * as React from 'react';
import {
  I18nManager,
  Image,
  ImageSourcePropType,
  Platform,
} from 'react-native';

import { accessibilityProps } from './MaterialCommunityIcon';
import { Consumer as SettingsConsumer } from '../core/settings';
import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  /**
   * Size of icon.
   */
  size: number;
  allowFontScaling?: boolean;
};

const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string') ||
  // source is a module, e.g. - require('image')
  typeof source === 'number' ||
  // image url on web
  (Platform.OS === 'web' &&
    typeof source === 'string' &&
    (source.startsWith('data:image') ||
      /\.(bmp|jpg|jpeg|png|gif|svg)$/.test(source)));

const getIconId = (source: any) => {
  if (
    typeof source === 'object' &&
    source !== null &&
    Object.prototype.hasOwnProperty.call(source, 'uri') &&
    typeof source.uri === 'string'
  ) {
    return source.uri;
  }

  return source;
};

export const isValidIcon = (source: any) =>
  typeof source === 'string' ||
  typeof source === 'function' ||
  isImageSource(source);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

export type Props = IconProps & {
  /**
   * Icon to display.
   */
  source: any;
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
 * An icon component which renders icon from vector library.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Icon, MD3Colors } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Icon
 *     source="camera"
 *     color={MD3Colors.error50}
 *     size={20}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */

const Icon = ({
  source,
  color,
  size,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const direction =
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.getConstants().isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;

  const s =
    typeof source === 'object' && source.direction && source.source
      ? source.source
      : source;
  const iconColor =
    color || (theme.isV3 ? theme.colors.onSurface : theme.colors.text);

  if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
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
  } else if (typeof s === 'string') {
    return (
      <SettingsConsumer>
        {({ icon }) => {
          return icon?.({
            name: s,
            color: iconColor,
            size,
            direction,
          });
        }}
      </SettingsConsumer>
    );
  } else if (typeof s === 'function') {
    return s({ color: iconColor, size, direction });
  }

  return null;
};

export default Icon;
