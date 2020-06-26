import * as React from 'react';
import {
  Image,
  I18nManager,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { Consumer as SettingsConsumer } from '../core/settings';
import { accessibilityProps } from './MaterialCommunityIcon';
import { withTheme } from '../core/theming';

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps & { color: string }) => React.ReactNode);

type IconProps = {
  size: number;
  allowFontScaling?: boolean;
};

type Props = IconProps & {
  color?: string;
  source: any;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
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

const Icon = ({ source, color, size, theme, ...rest }: Props) => {
  const direction =
    // @ts-ignore
    typeof source === 'object' && source.direction && source.source
      ? source.direction === 'auto'
        ? I18nManager.isRTL
          ? 'rtl'
          : 'ltr'
        : source.direction
      : null;
  const s =
    // @ts-ignore
    typeof source === 'object' && source.direction && source.source
      ? source.source
      : source;
  const iconColor = color || theme.colors.text;

  if (isImageSource(s)) {
    return (
      <Image
        {...rest}
        source={s}
        style={[
          {
            transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
          },
          // eslint-disable-next-line react-native/no-inline-styles
          {
            width: size,
            height: size,
            tintColor: color,
            resizeMode: 'contain',
          },
        ]}
        {...accessibilityProps}
      />
    );
  } else if (typeof s === 'string') {
    return (
      <SettingsConsumer>
        {({ icon }) => {
          return icon({
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

export default withTheme(Icon);
