import * as React from 'react';
import { StyleSheet, Text, Platform } from 'react-native';

export type IconProps = {
  name: string;
  color: string;
  size: number;
  direction: 'rtl' | 'ltr';
  allowFontScaling?: boolean;
};

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
          // @ts-ignore
          pointerEvents="none"
        >
          □
        </Text>
      );
    };
  }
}

export const accessibilityProps =
  Platform.OS === 'web'
    ? {
        role: 'img',
        focusable: false,
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants' as 'no-hide-descendants',
      };

const defaultIcon = ({
  name,
  color,
  size,
  direction,
  allowFontScaling,
}: IconProps) => (
  <MaterialCommunityIcons
    allowFontScaling={allowFontScaling}
    name={name}
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

const styles = StyleSheet.create({
  icon: {
    backgroundColor: 'transparent',
  },
});

export default defaultIcon;
