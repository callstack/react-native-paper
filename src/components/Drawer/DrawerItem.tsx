import * as React from 'react';
import {
  ColorValue,
  GestureResponderEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Icon, { IconSource } from '../Icon';
import TouchableRipple, {
  Props as TouchableRippleProps,
} from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The label text of the item.
   */
  label: string;
  /**
   * Icon to display for the `DrawerItem`.
   */
  icon?: IconSource;
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean;
  /**
   * Whether the item is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Callback which returns a React element to display on the right side. For instance a Badge.
   */
  right?: (props: { color: string }) => React.ReactNode;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Sets additional distance outside of element in which a press can be detected.
   */
  hitSlop?: TouchableRippleProps['hitSlop'];
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component used to show an action item with an icon and a label in a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *    <Drawer.Item
 *      style={{ backgroundColor: '#64ffda' }}
 *      icon="star"
 *      label="First Item"
 *    />
 * );
 *
 * export default MyComponent;
 * ```
 */
const DrawerItem = ({
  icon,
  label,
  active,
  disabled,
  theme: themeOverrides,
  rippleColor: customRippleColor,
  style,
  onPress,
  background,
  accessibilityLabel,
  right,
  labelMaxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { roundness, colors, fonts } = theme;

  const backgroundColor = active ? colors.secondaryContainer : undefined;
  const contentColor = active
    ? colors.onSecondaryContainer
    : colors.onSurfaceVariant;

  const labelMargin = icon ? 12 : 0;
  const borderRadius = 7 * roundness;
  const rippleColor = color(contentColor).alpha(0.12).rgb().string();
  const font = fonts.labelLarge;

  return (
    <View {...rest}>
      <TouchableRipple
        borderless
        disabled={disabled}
        background={background}
        onPress={onPress}
        style={[styles.container, { backgroundColor, borderRadius }, style]}
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={accessibilityLabel}
        rippleColor={customRippleColor || rippleColor}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View style={styles.wrapper}>
          <View style={styles.content}>
            {icon ? (
              <Icon source={icon} size={24} color={contentColor} />
            ) : null}
            <Text
              variant="labelLarge"
              selectable={false}
              numberOfLines={1}
              style={[
                styles.label,
                {
                  color: contentColor,
                  marginLeft: labelMargin,
                  ...font,
                },
              ]}
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            >
              {label}
            </Text>
          </View>

          {right?.({ color: contentColor })}
        </View>
      </TouchableRipple>
    </View>
  );
};

DrawerItem.displayName = 'Drawer.Item';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    justifyContent: 'center',
    height: 56,
    marginLeft: 12,
    marginRight: 12,
    marginVertical: 0,
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginRight: 24,
    padding: 0,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginRight: 32,
  },
});

export default DrawerItem;
