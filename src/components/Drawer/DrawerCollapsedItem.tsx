import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  TextLayoutEventData,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../../core/theming';
import type { InternalTheme } from '../../types';
import Badge from '../Badge';
import Icon, { IconSource } from '../Icon';
import Text from '../Typography/Text';

export type Props = React.ComponentPropsWithRef<typeof View> & {
  /**
   * The label text of the item.
   */
  label?: string;
  /**
   * Badge to show on the icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  badge?: string | number | boolean;
  /**
   * Icon to use as the focused destination icon, can be a string, an image source or a react component @renamed Renamed from 'icon' to 'focusedIcon' in v5.x
   */
  focusedIcon?: IconSource;
  /**
   * Icon to use as the unfocused destination icon, can be a string, an image source or a react component @renamed Renamed from 'icon' to 'focusedIcon' in v5.x
   */
  unfocusedIcon?: IconSource;
  /**
   * Whether to highlight the drawer item as active.
   */
  active?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: InternalTheme;

  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

const badgeSize = 8;
const iconSize = 24;
const itemSize = 56;
const outlineHeight = 32;

/**
 * @supported Available in v5.x with theme version 3
 * Collapsed component used to show an action item with an icon and optionally label in a navigation drawer.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="small" src="screenshots/drawer-collapsed.png" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *    <Drawer.CollapsedItem
 *      focusedIcon="inbox"
 *      unfocusedIcon="inbox-outline"
 *      label="Inbox"
 *    />
 * );
 *
 * export default MyComponent;
 * ```
 */
const DrawerCollapsedItem = ({
  focusedIcon,
  unfocusedIcon,
  label,
  active,
  theme,
  style,
  onPress,
  accessibilityLabel,
  badge = false,
  testID = 'drawer-collapsed-item',
  ...rest
}: Props) => {
  const { isV3 } = theme;
  const { scale } = theme.animation;

  const [numOfLines, setNumOfLines] = React.useState(1);

  const { current: animScale } = React.useRef<Animated.Value>(
    new Animated.Value(active ? 1 : 0.5)
  );

  React.useEffect(() => {
    if (!active) {
      animScale.setValue(0.5);
    }
  }, [animScale, active]);

  if (!isV3) {
    return null;
  }

  const handlePressOut = () => {
    Animated.timing(animScale, {
      toValue: 1,
      duration: 150 * scale,
      useNativeDriver: true,
    }).start();
  };

  const iconPadding = ((!label ? itemSize : outlineHeight) - iconSize) / 2;

  const backgroundColor = active
    ? theme.colors.secondaryContainer
    : 'transparent';
  const labelColor = active
    ? theme.colors.onSurface
    : theme.colors.onSurfaceVariant;
  const iconColor = active
    ? theme.colors.onSecondaryContainer
    : theme.colors.onSurfaceVariant;

  const onTextLayout = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextLayoutEventData>) => {
    setNumOfLines(nativeEvent.lines.length);
  };

  // Label is cut off on Android, when centered "labelMedium" text
  // has more than 4 lines, so there is a need to decrease the letter spacing.
  const androidLetterSpacingStyle =
    Platform.OS === 'android' && numOfLines > 4 && styles.letterSpacing;

  const labelTextStyle = {
    color: labelColor,
    ...(isV3 ? theme.fonts.labelMedium : {}),
  };

  const icon =
    !active && unfocusedIcon !== undefined ? unfocusedIcon : focusedIcon;

  return (
    <View {...rest}>
      {/* eslint-disable-next-line react-native-a11y/has-accessibility-props */}
      <TouchableWithoutFeedback
        onPress={onPress}
        onPressOut={onPress ? handlePressOut : undefined}
        // @ts-expect-error We keep old a11y props for backwards compat with old RN versions
        accessibilityTraits={active ? ['button', 'selected'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityState={{ selected: active }}
        accessibilityLabel={accessibilityLabel}
        testID={testID}
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
            testID={`${testID}-outline`}
          />

          <View
            style={[styles.icon, { top: iconPadding }]}
            testID={`${testID}-container`}
          >
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
            <Icon source={icon} size={iconSize} color={iconColor} />
          </View>

          {label ? (
            <Text
              variant="labelMedium"
              selectable={false}
              numberOfLines={2}
              onTextLayout={onTextLayout}
              style={[styles.label, androidLetterSpacingStyle, labelTextStyle]}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

DrawerCollapsedItem.displayName = 'Drawer.CollapsedItem';

const styles = StyleSheet.create({
  wrapper: {
    width: 80,
    marginBottom: 12,
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
  letterSpacing: {
    letterSpacing: 0.3,
    alignSelf: 'stretch',
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

export default withInternalTheme(DrawerCollapsedItem);
