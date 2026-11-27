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
import useLatestCallback from 'use-latest-callback';

import { DrawerCollapsedItemTokens } from './tokens';
import { getDestinationA11yProps } from './utils';
import { useInternalTheme } from '../../core/theming';
import {
  useMotionDuration,
  useReduceMotion,
} from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
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
   * Whether the item is disabled. Disabled items are dimmed and don't respond to touch.
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

const {
  iconSize,
  activeIndicatorWidth,
  activeIndicatorHeight,
  noLabelActiveIndicatorHeight,
} = DrawerCollapsedItemTokens;

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
  const reduceMotion = useReduceMotion();
  const getDuration = useMotionDuration();

  // MD3 rings a navigation rail item as a whole (icon and label) with a
  // rounded rectangle inside the rail, like Material Web's navigation tab
  // (inward, small corner). The `Pressable` also spans the gap below the
  // item, so the ring goes on an overlay inside it (`'descendant'`). An
  // overlay, not the item itself: an inward ring is painted under the item's
  // children, and the active indicator would cover its top edge. The overlay
  // starts above the item, so the ring clears the indicator by the usual 2dp
  // gap instead of cutting into it; the 12dp gap below the item above it
  // leaves room. It ends below the item the same way, in the item's own 12dp
  // gap, so it clears an icon-only item's round indicator and a label that
  // sets the item's height (two lines, or a large font scale) by 2dp too.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    disabled,
    theme.colors.secondary,
    'inward',
    'descendant'
  );

  const [numOfLines, setNumOfLines] = React.useState(1);

  const outlineScale = useSharedValue(active ? 1 : 0.5);

  if (reduceMotion) {
    outlineScale.value = active ? 1 : 0.5;
  }

  const expandOutline = useLatestCallback(() => {
    if (reduceMotion) {
      outlineScale.value = 1;
      return;
    }

    outlineScale.value = withTiming(1, {
      duration: getDuration(
        theme.motion.duration[DrawerCollapsedItemTokens.activeIndicatorDuration]
      ),
      easing: Easing.bezier(
        ...theme.motion.easing[DrawerCollapsedItemTokens.activeIndicatorEasing]
      ),
      reduceMotion: ReduceMotion.Never,
    });
  });

  React.useEffect(() => {
    if (active) {
      // The item can become active without a press, for example when the
      // current route changes. After a press the indicator is already at full
      // size or on its way there, and this carries on from where it is.
      expandOutline();
    } else {
      outlineScale.value = 0.5;
    }
  }, [active, expandOutline, outlineScale]);

  const iconPadding =
    ((!label ? noLabelActiveIndicatorHeight : activeIndicatorHeight) -
      iconSize) /
    2;

  const activeIndicatorRadius = resolveCornerRadius(
    theme,
    DrawerCollapsedItemTokens.activeIndicatorShape
  );

  const backgroundColor = active
    ? theme.colors[DrawerCollapsedItemTokens.activeIndicatorColor]
    : 'transparent';

  const labelColor = active
    ? theme.colors[DrawerCollapsedItemTokens.activeLabelTextColor]
    : theme.colors[DrawerCollapsedItemTokens.inactiveLabelTextColor];

  const iconColor = active
    ? theme.colors[DrawerCollapsedItemTokens.activeIconColor]
    : theme.colors[DrawerCollapsedItemTokens.inactiveIconColor];

  const onTextLayout = ({ nativeEvent }: TextLayoutEvent) => {
    setNumOfLines(nativeEvent.lines.length);
  };

  // Label is cut off on Android, when centered "labelMedium" text
  // has more than 4 lines, so there is a need to decrease the letter spacing.
  const androidLetterSpacingStyle =
    Platform.OS === 'android' && numOfLines > 4 && styles.letterSpacing;

  const labelTextStyle = {
    color: labelColor,
    ...theme.fonts[DrawerCollapsedItemTokens.labelText],
  };

  const icon =
    !active && unfocusedIcon !== undefined ? unfocusedIcon : focusedIcon;

  // Dims the icon and label only, like Menu.Item: the active indicator keeps
  // its color, so a disabled active destination still reads as active.
  const contentOpacity = {
    opacity: disabled
      ? DrawerCollapsedItemTokens.stateOpacity.disabled
      : DrawerCollapsedItemTokens.stateOpacity.enabled,
  };

  const animatedOutlineStyle = useAnimatedStyle(() => ({
    transform: [
      label ? { scaleX: outlineScale.value } : { scale: outlineScale.value },
    ],
  }));

  return (
    <View {...rest}>
      <Pressable
        onPress={onPress}
        onPressOut={onPress ? expandOutline : undefined}
        disabled={disabled}
        role="button"
        {...getDestinationA11yProps(active)}
        aria-label={ariaLabel}
        testID={testID}
        // Like Switch: a ripple drawable owns the focused state, so Android does
        // not add its grey default focus highlight on top of the ring.
        android_ripple={{ color: 'transparent' }}
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
              { backgroundColor, borderRadius: activeIndicatorRadius },
              style,
              animatedOutlineStyle,
            ]}
          />

          {/* After the indicator, so the indicator doesn't cover the ring, but
              before the icon, so a text badge that pokes above the indicator
              stays readable over it. */}
          <View
            pointerEvents="none"
            style={[
              styles.focusRing,
              { borderRadius: theme.shapes.corner.small },
              ...focusRing.style,
            ]}
            {...focusRing.dataSetProps}
          />

          <View style={[styles.icon, { top: iconPadding }, contentOpacity]}>
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
              variant={DrawerCollapsedItemTokens.labelText}
              selectable={false}
              numberOfLines={2}
              onTextLayout={onTextLayout}
              style={[
                styles.label,
                androidLetterSpacingStyle,
                labelTextStyle,
                contentOpacity,
              ]}
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
            >
              {label}
            </Text>
          ) : null}
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
    bottom: -(focusOuterOffset + focusThickness),
  },
  wrapper: {
    width: DrawerCollapsedItemTokens.containerWidth,
    marginBottom: DrawerCollapsedItemTokens.containerSpacing,
    minHeight: noLabelActiveIndicatorHeight,
    alignItems: 'center',
  },
  outline: {
    width: activeIndicatorWidth,
    height: activeIndicatorHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundedOutline: {
    height: noLabelActiveIndicatorHeight,
  },
  icon: {
    position: 'absolute',
  },
  letterSpacing: {
    letterSpacing: 0.3,
    alignSelf: 'stretch',
  },
  label: {
    marginHorizontal: DrawerCollapsedItemTokens.labelPadding,
    marginTop: DrawerCollapsedItemTokens.labelSpacing,
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
