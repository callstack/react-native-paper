import * as React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  I18nManager,
  Platform,
  ImageSourcePropType,
} from 'react-native';
import { Consumer as SettingsConsumer } from '../core/settings';

let MaterialCommunityIcons: any;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons = require('react-native-vector-icons/MaterialCommunityIcons')
    .default;
} catch (e) {
  if (
    // @ts-ignore
    global.__expo &&
    // @ts-ignore
    global.__expo.Icon &&
    // @ts-ignore
    global.__expo.Icon.MaterialCommunityIcons
  ) {
    // Snack doesn't properly bundle vector icons from subpath
    // Use icons from the __expo global if available
    // @ts-ignore
    MaterialCommunityIcons = global.__expo.Icon.MaterialCommunityIcons;
  } else {
    let isErrorLogged = false;

    // Fallback component for icons
    // @ts-ignore
    MaterialCommunityIcons = ({ name, color, size, ...rest }) => {
      /* eslint-disable no-console */
      if (!isErrorLogged) {
        if (
          !/(Cannot find module|Module not found|Cannot resolve module)/.test(
            e.message
          )
        ) {
          console.error(e);
        }

        console.warn(
          `Tried to use the icon '${name}' in a component from 'react-native-paper', but 'react-native-vector-icons' could not be loaded.`,
          `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/icons.html.`
        );

        isErrorLogged = true;
      }

      return (
        <Text
          {...rest}
          style={[styles.icon, { color, fontSize: size }]}
          pointerEvents="none"
        >
          □
        </Text>
      );
    };
  }
}

type IconSourceBase = string | ImageSourcePropType;

export type IconSource =
  | IconSourceBase
  | Readonly<{ source: IconSourceBase; direction: 'rtl' | 'ltr' | 'auto' }>
  | ((props: IconProps) => React.ReactNode);

type IconProps = {
  color: string;
  size: number;
  allowFontScaling?: boolean;
};

type Props = IconProps & {
  source: any;
};

const isImageSource = (source: any) =>
  // source is an object with uri
  (typeof source === 'object' &&
    source !== null &&
    (Object.prototype.hasOwnProperty.call(source, 'uri') &&
      typeof source.uri === 'string')) ||
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
    (Object.prototype.hasOwnProperty.call(source, 'uri') &&
      typeof source.uri === 'string')
  ) {
    return source.uri;
  }

  return source;
};

export const isValidIcon = (source: any) =>
  typeof source === 'string' || isImageSource(source);

export const isEqualIcon = (a: any, b: any) =>
  a === b || getIconId(a) === getIconId(b);

const Icon = ({ source, color, size, ...rest }: Props) => {
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

  const accessibilityProps =
    Platform.OS === 'web'
      ? {
          role: 'img',
          focusable: false,
        }
      : {
          accessibilityElementsHidden: true,
          importantForAccessibility: 'no-hide-descendants' as 'no-hide-descendants',
        };

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
          return icon ? (
            icon({
              name: s,
              color,
              size,
              style: {
                transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
                ...styles.icon,
              },
              pointerEvents: 'none',
              accessibilityProps,
            })
          ) : (
            <MaterialCommunityIcons
              {...rest}
              name={s}
              color={color}
              size={size}
              style={[
                {
                  transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
                },
                styles.icon,
              ]}
              pointerEvents="none"
              {...accessibilityProps}
            />
          );
        }}
      </SettingsConsumer>
    );
  } else if (typeof s === 'function') {
    return s({ color, size, direction });
  }

  return null;
};

export default Icon;

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});
