import color from 'color';
import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Animated } from 'react-native';
import Text from '../Typography/Text';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import { withTheme } from '../../core/theming';
import type { Theme } from '../../types';
import Badge from '../Badge';

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
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
  /**
   * Badge to show on the icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  badge?: string | number | boolean;
};

const badgeSize = 8;
const iconSize = 24;
const itemSize = 56;
const outlineHeight = 32;

const DrawerCollapsedItem = ({
  icon,
  label,
  active,
  theme,
  style,
  onPress,
  accessibilityLabel,
  badge = false,
  ...rest
}: Props) => {
  const { colors, isV3, md } = theme;
  const { scale } = theme.animation;

  const backgroundColor = active
    ? isV3
      ? (md('md.sys.color.secondary-container') as string)
      : color(colors?.primary).alpha(0.12).rgb().string()
    : 'transparent';
  const contentColor = active
    ? isV3
      ? (md('md.sys.color.on-secondary-container') as string)
      : colors?.primary
    : isV3
    ? (md('md.sys.color.on-surface-variant') as string)
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

  const iconPadding = ((!label ? itemSize : outlineHeight) - iconSize) / 2;

  return (
    <View {...rest}>
      <TouchableRipple
        onPress={onPress}
        onPressOut={onPress ? handlePressOut : undefined}
        style={styles.container}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={active ? ['button', 'selected'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={accessibilityLabel}
      >
        <View style={styles.wrapper}>
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
              style,
            ]}
          />

          <View style={[styles.icon, { top: iconPadding }]}>
            {badge && (
              <View style={styles.badgeContainer}>
                {typeof badge === 'boolean' ? (
                  <Badge visible={badge} size={badgeSize} />
                ) : (
                  <Badge visible={badge != null} size={2 * badgeSize}>
                    {badge}
                  </Badge>
                )}
              </View>
            )}
            <Icon source={icon} size={iconSize} color={contentColor} />
          </View>

          {label ? (
            <Text
              selectable={false}
              numberOfLines={2}
              style={[
                styles.label,
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
    minHeight: itemSize,
    alignItems: 'center',
  },
  outline: {
    width: itemSize,
    height: outlineHeight,
    borderRadius: itemSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedOutline: {
    height: itemSize,
  },
  icon: {
    position: 'absolute',
  },
  label: {
    marginHorizontal: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  badgeContainer: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    zIndex: 2,
  },
});

export default withTheme(DrawerCollapsedItem);
