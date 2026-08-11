import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  NativeSyntheticEvent,
  PressableAndroidRippleConfig,
  StyleProp,
  TargetedEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { DrawerItemTokens } from './tokens';
import { useInternalTheme } from '../../core/theming';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { ThemeProp } from '../../types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = ViewProps & {
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
   * Whether the item is disabled. Disabled items are dimmed and don't respond to touch.
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
  'aria-label'?: string;
  /**
   * Callback which returns a React element to display on the right side. For instance a Badge.
   */
  right?: (props: { color: ColorValue }) => React.ReactNode;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
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
 *   <Drawer.Item
 *     style={{ backgroundColor: '#64ffda' }}
 *     icon="star"
 *     label="First Item"
 *   />
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
  style,
  onPress,
  background,
  'aria-label': ariaLabel,
  right,
  labelMaxFontSizeMultiplier,
  hitSlop,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const [focused, setFocused] = React.useState(false);

  const handleFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    if (isKeyboardFocusEvent(e)) {
      setFocused(true);
    }
  };

  const backgroundColor = active
    ? theme.colors[DrawerItemTokens.activeIndicatorColor]
    : undefined;
  const contentColor = active
    ? theme.colors[DrawerItemTokens.activeIconColor]
    : theme.colors[DrawerItemTokens.inactiveIconColor];

  const borderRadius = resolveCornerRadius(
    theme,
    DrawerItemTokens.indicatorShape
  );
  const { inset } = DrawerItemTokens.focusIndicator;
  const opacity = disabled
    ? DrawerItemTokens.stateOpacity.disabled
    : DrawerItemTokens.stateOpacity.enabled;

  return (
    <View {...rest}>
      <TouchableRipple
        borderless
        disabled={disabled}
        background={background}
        onPress={onPress}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        style={[
          styles.container,
          { backgroundColor, borderRadius, opacity },
          Platform.OS === 'web' ? webNoOutline : null,
          style,
        ]}
        role="button"
        aria-selected={active}
        aria-label={ariaLabel}
        theme={theme}
        hitSlop={hitSlop}
      >
        <View style={styles.inner}>
          <View style={styles.wrapper} testID="drawer-item-content">
            <View style={styles.content}>
              {icon ? (
                <Icon
                  source={icon}
                  size={DrawerItemTokens.iconSize}
                  color={contentColor}
                />
              ) : null}
              <Text
                variant={
                  active
                    ? DrawerItemTokens.activeLabelText
                    : DrawerItemTokens.labelText
                }
                selectable={false}
                numberOfLines={1}
                style={[
                  styles.label,
                  icon ? styles.labelWithIcon : null,
                  { color: contentColor },
                ]}
                maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              >
                {label}
              </Text>
            </View>

            {right?.({ color: contentColor })}
          </View>

          {focused ? (
            <View
              testID="drawer-item-focus-ring"
              style={[
                styles.focusRing,
                {
                  borderColor:
                    theme.colors[DrawerItemTokens.focusIndicatorColor],
                  borderRadius: borderRadius - inset,
                },
              ]}
            />
          ) : null}
        </View>
      </TouchableRipple>
    </View>
  );
};

DrawerItem.displayName = 'Drawer.Item';

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

const styles = StyleSheet.create({
  container: {
    height: DrawerItemTokens.height,
    justifyContent: 'center',
    marginHorizontal: DrawerItemTokens.indicatorInset,
  },
  // Fills the active indicator so the focus ring can be positioned against
  // its bounds rather than the content's.
  inner: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: DrawerItemTokens.contentInset,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginEnd: DrawerItemTokens.labelTrailingGap,
  },
  labelWithIcon: {
    marginStart: DrawerItemTokens.iconLabelGap,
  },
  // Drawn inside the indicator: destinations sit flush, so an outer ring
  // would overlap its neighbours.
  focusRing: {
    position: 'absolute',
    top: DrawerItemTokens.focusIndicator.inset,
    bottom: DrawerItemTokens.focusIndicator.inset,
    left: DrawerItemTokens.focusIndicator.inset,
    right: DrawerItemTokens.focusIndicator.inset,
    borderWidth: DrawerItemTokens.focusIndicator.thickness,
    pointerEvents: 'none',
  },
});

export default DrawerItem;
