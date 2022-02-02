import color from 'color';
import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import Text from '../Typography/Text';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';

type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The label text of the item.
   */
  label?: string;
  /**
   * Icon to display for the `DrawerCollapsedItem`.
   */
  icon?: IconSource;
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  /**
   * Callback which returns a React element to display on the right side. For instance a Badge.
   */
  right?: (props: { color: string }) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
};

const DrawerCollapsedItem = ({
  icon,
  label,
  active,
  theme,
  style,
  onPress,
  accessibilityLabel,
  ...rest
}: Props) => {
  const { colors } = theme;
  const { scale } = theme.animation;

  const backgroundColor = active
    ? color(colors?.primary).alpha(0.12).rgb().string()
    : 'transparent';
  const contentColor = active
    ? colors?.primary
    : color(colors?.text).alpha(0.68).rgb().string();
  const font = theme.fonts.medium;

  const { current: animScale } = React.useRef<Animated.Value>(
    new Animated.Value(active ? 1 : 0.5)
  );

  React.useEffect(() => {
    if (!active) {
      animScale.setValue(0.5);
    }
  }, [animScale, active]);

  const handlePressOut = () => {
    Animated.timing(animScale, {
      toValue: 1,
      duration: 200 * scale,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View {...rest}>
      <TouchableRipple
        onPress={onPress}
        onPressOut={onPress ? handlePressOut : undefined}
        style={[styles.container, style]}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={active ? ['button', 'selected'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.wrapper}>
          <View style={[styles.outline, !label && styles.roundedOutline]}>
            <Animated.View
              style={[
                styles.outline,
                !label && styles.roundedOutline,
                {
                  transform: [
                    label
                      ? {
                          scaleX: animScale,
                        }
                      : { scale: animScale },
                  ],
                  backgroundColor,
                },
              ]}
            />
            <Icon source={icon} size={24} color={contentColor} />
          </View>

          {label ? (
            <Text
              selectable={false}
              numberOfLines={2}
              style={[
                {
                  color: contentColor,
                  ...font,
                },
              ]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </View>
  );
};

DrawerCollapsedItem.displayName = 'Drawer.CollapsedItem';

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginBottom: 12,
  },
  wrapper: {
    height: 56,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 3,
  },
  outline: {
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    width: 56,
    borderRadius: 28,
    position: 'absolute',
  },
  roundedOutline: {
    height: 56,
  },
});

export default withTheme(DrawerCollapsedItem);
