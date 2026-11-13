import * as React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  TextLayoutEvent,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../theme/types';
import { useFocusRing } from '../../utils/useFocusRing';
import Badge from '../Badge';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Text from '../Typography/Text';

export type Props = ViewProps & {
  /**
   * The label text of the item.
   */
  label?: string;
  /**
   * Badge to show on the icon, can be `true` to show a dot, `string` or `number` to show text.
   */
  badge?: string | number | boolean;
  /**
   * Whether the item is disabled.
   */
  disabled?: boolean;
  /**
   * @renamed Renamed from 'icon' to 'focusedIcon' in v5.x
   * Icon to use as the focused destination icon, can be a string, an image source or a react component
   */
  focusedIcon?: IconSource;
  /**
   * @renamed Renamed from 'icon' to 'focusedIcon' in v5.x
   * Icon to use as the unfocused destination icon, can be a string, an image source or a react component
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
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  'aria-label'?: string;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;

  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

const iconSize = 24;
const itemSize = 56;
const outlineHeight = 32;

/**
 * Note: Available in v5.x with theme version 3
 *
 * Collapsed component used to show an action item with an icon and optionally label in a navigation drawer.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Drawer } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Drawer.CollapsedItem
 *     focusedIcon="inbox"
 *     unfocusedIcon="inbox-outline"
 *     label="Inbox"
 *   />
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
  theme: themeOverrides,
  style,
  onPress,
  disabled,
  'aria-label': ariaLabel,
  badge = false,
  testID,
  labelMaxFontSizeMultiplier,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { scale } = theme.animation;

  // MD3 rings a navigation rail item as a whole (icon and label) with a
  // rounded rectangle inside the rail, like Material Web's navigation tab
  // (inward, small corner). The `Pressable` also spans the gap below the
  // item, so the ring goes on an overlay inside it (`'descendant'`). An
  // overlay, not the item itself: an inward ring is painted under the item's
  // children, and the active indicator would cover its top edge. The overlay
  // starts above the item, so the ring clears the indicator by the usual 2dp
  // gap instead of cutting into it; the 12dp gap below the item above it
  // leaves room.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    disabled,
    theme.colors.secondary,
    'inward',
    'descendant'
  );

  const [numOfLines, setNumOfLines] = React.useState(1);

  const outlineScale = useSharedValue(active ? 1 : 0.5);

  React.useEffect(() => {
    if (!active) {
      outlineScale.value = 0.5;
    }
  }, [active, outlineScale]);

  const handlePressOut = () => {
    outlineScale.value = withTiming(1, {
      duration: 150 * scale,
      easing: Easing.inOut(Easing.ease),
      reduceMotion: ReduceMotion.Never,
    });
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

  const onTextLayout = ({ nativeEvent }: TextLayoutEvent) => {
    setNumOfLines(nativeEvent.lines.length);
  };

  // Label is cut off on Android, when centered "labelMedium" text
  // has more than 4 lines, so there is a need to decrease the letter spacing.
  const androidLetterSpacingStyle =
    Platform.OS === 'android' && numOfLines > 4 && styles.letterSpacing;

  const labelTextStyle = {
    color: labelColor,
    ...theme.fonts.labelMedium,
  };

  const icon =
    !active && unfocusedIcon !== undefined ? unfocusedIcon : focusedIcon;

  const animatedOutlineStyle = useAnimatedStyle(() => ({
    transform: [
      label ? { scaleX: outlineScale.value } : { scale: outlineScale.value },
    ],
  }));

  return (
    <View {...rest}>
      <Pressable
        onPress={onPress}
        onPressOut={onPress ? handlePressOut : undefined}
        disabled={disabled}
        role="button"
        aria-selected={active}
        aria-label={ariaLabel}
        testID={testID}
        onFocus={focusTarget.onFocus}
        onBlur={focusTarget.onBlur}
        {...focusTarget.dataSetProps}
        style={focusTarget.style}
      >
        <View style={styles.wrapper}>
          <Animated.View
            style={[
              styles.outline,
              !label && styles.roundedOutline,
              { backgroundColor },
              style,
              animatedOutlineStyle,
            ]}
          />

          <View style={[styles.icon, { top: iconPadding }]}>
            {badge !== false && (
              <View style={styles.badgeContainer}>
                {typeof badge === 'boolean' ? (
                  <Badge visible={badge} />
                ) : (
                  <Badge visible={badge != null}>{badge}</Badge>
                )}
              </View>
            )}
            {icon !== undefined ? (
              <Icon source={icon} size={iconSize} color={iconColor} />
            ) : null}
          </View>

          {label ? (
            <Text
              variant="labelMedium"
              selectable={false}
              numberOfLines={2}
              onTextLayout={onTextLayout}
              style={[styles.label, androidLetterSpacingStyle, labelTextStyle]}
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            >
              {label}
            </Text>
          ) : null}

          <View
            pointerEvents="none"
            style={[
              styles.focusRing,
              { borderRadius: theme.shapes.corner.small },
              ...focusRing.style,
            ]}
            {...focusRing.dataSetProps}
          />
        </View>
      </Pressable>
    </View>
  );
};

DrawerCollapsedItem.displayName = 'Drawer.CollapsedItem';

const { thickness: focusThickness, outerOffset: focusOuterOffset } =
  tokens.md.sys.state.focusIndicator;

const styles = StyleSheet.create({
  focusRing: {
    position: 'absolute',
    top: -(focusOuterOffset + focusThickness),
    left: 0,
    right: 0,
    bottom: 0,
  },
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

export default DrawerCollapsedItem;
