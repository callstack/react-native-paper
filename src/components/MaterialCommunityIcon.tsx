import * as React from 'react';
import {
  ColorValue,
  Platform,
  Role,
  StyleSheet,
  Text,
  ViewProps,
} from 'react-native';

import { black } from '../theme/colors';

export type IconProps = {
  name: string;
  color?: ColorValue;
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

export const accessibilityProps: AccessibilityProps =
  Platform.OS === 'web'
    ? {
        role: 'img',
        focusable: false,
      }
    : {
        accessibilityElementsHidden: true,
        importantForAccessibility: 'no-hide-descendants',
      };

const loadIconModule = () => {
  try {
    return require('@react-native-vector-icons/material-design-icons').default;
  } catch (e) {
    return null;
  }
};

type IconModuleType = React.ComponentType<
  Omit<
    React.ComponentProps<
      typeof import('@react-native-vector-icons/material-design-icons').default
    >,
    'name'
  > & {
    name: string;
    color: ColorValue;
    pointerEvents?: ViewProps['pointerEvents'];
  }
>;

const IconModule = loadIconModule();

const FallbackIcon = ({ name, color, size, ...rest }: IconProps) => {
  console.warn(
    `Tried to use the icon '${name}' in a component from 'react-native-paper', but the required icon library is not installed.`,
    `To fix this, please install '@react-native-vector-icons/material-design-icons'.\n\n` +
      `You can also use another method to specify icon: https://callstack.github.io/react-native-paper/docs/guides/icons`
  );

  return (
    <Text
      {...rest}
      style={[styles.icon, { color, fontSize: size }]}
      selectable={false}
    >
      □
    </Text>
  );
};

const MaterialCommunityIcons: IconModuleType = IconModule || FallbackIcon;

/**
 * Default icon component that handles icon rendering with proper styling and accessibility
 */
const DefaultIcon = ({
  name,
  color = black,
  size,
  direction,
  allowFontScaling,
  testID,
}: IconProps) => {
  return (
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
};

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  icon: {
    backgroundColor: 'transparent',
  },
});

export default DefaultIcon;
