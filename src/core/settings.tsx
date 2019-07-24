import * as React from 'react';
import { StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from '../components/MaterialCommunityIcon';

export type Settings = {
  icon: ({ name, color, size, direction }: IconProps) => React.ReactNode;
};

type IconProps = {
  name: string;
  color: string;
  size: number;
  direction: 'rtl' | 'ltr';
};

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

export const defaultIcon = ({ name, color, size, direction }: IconProps) => (
  <MaterialCommunityIcons
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

export const { Provider, Consumer } = React.createContext<Settings>({
  icon: defaultIcon,
});
