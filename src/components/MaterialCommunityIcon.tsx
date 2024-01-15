import * as React from 'react';
import { StyleSheet, Text, Platform, ViewProps, Role } from 'react-native';

import { black } from '../styles/themes/v2/colors';

export type IconProps = {
  name: string;
  color?: string;
  size: number;
  direction: 'rtl' | 'ltr';
  allowFontScaling?: boolean;
  testID?: string;
};

type AccessibilityProps =
  | {
      role?: Role;
      focusable?: boolean;
    }
  | {
      accessibilityElementsHidden?: boolean;
      importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
    };

let MaterialCommunityIcons: React.ComponentType<
  React.ComponentProps<
    typeof import('react-native-vector-icons/MaterialCommunityIcons').default
  > & {
    color: string;
    pointerEvents?: ViewProps['pointerEvents'];
  }
>;

try {
  // Optionally require vector-icons
  MaterialCommunityIcons =
    require('react-native-vector-icons/MaterialCommunityIcons').default;
} catch (e) {
  let isErrorLogged = false;

  // Fallback component for icons
  MaterialCommunityIcons = ({ name, color, size, ...rest }) => {
    /* eslint-disable no-console */
    if (!isErrorLogged) {
      if (
        !/(Cannot find module|Module not found|Cannot resolve module)/.test(
          (e as any).message
        )
      ) {
        console.error(e);
      }

      console.warn(
        `Tried to use the icon '${name}' in a component from 'react-native-paper', but 'react-native-vector-icons/MaterialCommunityIcons' could not be loaded.`,
        `To remove this warning, try installing 'react-native-vector-icons' or use another method to specify icon: https://callstack.github.io/react-native-paper/docs/guides/icons`
      );

      isErrorLogged = true;
    }

    return (
      <Text
        {...rest}
        style={[styles.icon, { color, fontSize: size }]}
        // @ts-expect-error: Text doesn't support this, but it seems to affect TouchableNativeFeedback
        pointerEvents="none"
        selectable={false}
      >
        □
      </Text>
    );
  };
}

export const accessibilityProps: AccessibilityProps =
  Platform.OS === 'web'
    ? {
        role: 'img',
        focusable: false,
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility:
          'no-hide-descendants' as 'no-hide-descendants',
      };

const defaultIcon = ({
  name,
  color = black,
  size,
  direction,
  allowFontScaling,
  testID,
}: IconProps) => (
  <MaterialCommunityIcons
    allowFontScaling={allowFontScaling}
    name={name}
    color={color}
    size={size}
    style={[
      {
        transform: [{ scaleX: direction === 'rtl' ? -1 : 1 }],
        lineHeight: size,
      },
      styles.icon,
    ]}
    pointerEvents="none"
    selectable={false}
    testID={testID}
    {...accessibilityProps}
  />
);

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  icon: {
    backgroundColor: 'transparent',
  },
});

export default defaultIcon;
