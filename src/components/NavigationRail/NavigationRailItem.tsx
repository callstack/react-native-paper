import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  StyleProp,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { NavigationRailContext } from './context';
import { NavigationRailTokens } from './tokens';
import { getTransition, resolveItemColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import type { ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Badge from '../Badge';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type Props = {
  /**
   * Icon of the destination.
   */
  icon: IconSource;
  /**
   * Icon shown while the destination is active. Falls back to `icon`.
   */
  activeIcon?: IconSource;
  /**
   * Label of the destination. Optional in the collapsed rail.
   */
  label?: string;
  /**
   * Whether the destination is the current one.
   */
  active?: boolean;
  /**
   * Whether the destination is disabled.
   */
  disabled?: boolean;
  /**
   * Badge shown on the icon: `true` for a dot, a `string` or `number` for text.
   */
  badge?: string | number | boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label. Falls back to `label`.
   */
  'aria-label'?: string;
  /**
   * Specifies the largest possible scale a label font can reach.
   */
  labelMaxFontSizeMultiplier?: number;
  style?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const { rail, item } = NavigationRailTokens;

// Badges hang off the icon's trailing edge, far enough out to keep
// `badgeInset` clear of the collapsed indicator's edge.
const badgeEnd = -(
  item.collapsed.indicatorWidth -
  item.expanded.leading -
  item.iconSize -
  item.badgeInset
);
const { opacity: stateOpacity, focusIndicator } = tokens.md.sys.state;

// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

/**
 * A destination inside a `NavigationRail`. Renders as a stacked icon and
 * label in the collapsed rail and as a full-width row in the expanded rail,
 * morphing between the two when the rail expands or collapses.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { NavigationRail } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <NavigationRail.Item
 *     icon="inbox-outline"
 *     activeIcon="inbox"
 *     label="Inbox"
 *     badge={3}
 *     active
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */
const NavigationRailItem = ({
  icon,
  activeIcon,
  label,
  active = false,
  disabled = false,
  badge = false,
  onPress,
  onLongPress,
  'aria-label': ariaLabel = label,
  labelMaxFontSizeMultiplier,
  style,
  testID,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { expanded, expandedWidth, animated } = React.useContext(
    NavigationRailContext
  );
  const reduceMotion = useReduceMotion();
  const [focused, setFocused] = React.useState(false);

  const colors = resolveItemColors({ theme, active });
  const indicatorRadius = resolveCornerRadius(theme, item.indicatorShape);
  const contentOpacity = disabled
    ? stateOpacity.disabled
    : stateOpacity.enabled;
  const hasLabel = !!label;
  const stacked = hasLabel && !expanded;

  // Collapsed labeled items center the indicator + label block in the min height.
  const height = stacked
    ? item.collapsed.minHeight
    : item.expanded.indicatorHeight;
  const pillHeight = stacked
    ? item.collapsed.indicatorHeight
    : item.expanded.indicatorHeight;
  const labelBlock =
    theme.fonts[item.collapsed.labelTypescale].lineHeight +
    item.collapsed.iconLabelGap;
  const pillTop = stacked ? (height - pillHeight - labelBlock) / 2 : 0;
  // Fixed label widths keep text measured once; the item clips the overflow.
  const rowLabelWidth =
    expandedWidth -
    2 * rail.itemHorizontalPadding -
    item.expanded.leading -
    item.iconSize -
    item.expanded.iconLabelGap -
    item.expanded.trailing;

  const layoutTransition = getTransition(theme, ['height', 'paddingTop'], {
    instant: !animated || reduceMotion,
  });
  const fadeTransition = getTransition(theme, ['opacity'], {
    instant: !animated,
  });
  const fade = (shown: boolean) => [
    shown ? styles.shown : styles.hidden,
    fadeTransition,
  ];

  const selection = useSharedValue(active ? 1 : 0);
  const pressed = useSharedValue(false);
  const hovered = useSharedValue(false);

  React.useEffect(() => {
    const target = active ? 1 : 0;
    selection.value =
      !animated || reduceMotion
        ? target
        : withSpring(target, toRawSpring(theme.motion.spring.fast.spatial));
  }, [active, animated, reduceMotion, theme, selection]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: selection.value,
    transform: [{ scaleX: 0.5 + selection.value / 2 }],
  }));

  const stateLayerStyle = useAnimatedStyle(() => ({
    opacity: pressed.value
      ? stateOpacity.pressed
      : hovered.value
        ? stateOpacity.hovered
        : 0,
  }));

  const onFocus = (e: NativeSyntheticEvent<TargetedEvent>) => {
    if (!disabled && isKeyboardFocusEvent(e)) setFocused(true);
  };

  const dot = typeof badge === 'boolean';
  const badgeNode =
    badge === false ? null : <Badge visible>{dot ? undefined : badge}</Badge>;

  const renderLabel = (row: boolean) => (
    <Text
      variant={
        row ? item.expanded.labelTypescale : item.collapsed.labelTypescale
      }
      selectable={false}
      numberOfLines={1}
      ellipsizeMode={row ? 'clip' : 'tail'}
      maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
      style={{ color: row ? colors.expandedLabel : colors.label }}
    >
      {label}
    </Text>
  );

  return (
    <Animated.View
      style={[{ height, paddingTop: pillTop }, layoutTransition, style]}
    >
      <TouchableRipple
        borderless
        rippleColor="transparent"
        disabled={disabled}
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={() => {
          pressed.value = true;
        }}
        onPressOut={() => {
          pressed.value = false;
        }}
        onHoverIn={() => {
          hovered.value = true;
        }}
        onHoverOut={() => {
          hovered.value = false;
        }}
        onFocus={onFocus}
        onBlur={() => setFocused(false)}
        role="tab"
        aria-selected={active}
        aria-disabled={disabled}
        aria-label={ariaLabel}
        testID={testID}
        style={[styles.touchable, Platform.OS === 'web' ? webNoOutline : null]}
        theme={theme}
      >
        <Animated.View
          style={[
            styles.pill,
            { height: pillHeight, opacity: contentOpacity },
            layoutTransition,
          ]}
        >
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: colors.indicator,
                borderRadius: indicatorRadius,
              },
              indicatorStyle,
            ]}
          />
          <Animated.View
            style={[
              styles.fill,
              {
                backgroundColor: colors.stateLayer,
                borderRadius: indicatorRadius,
              },
              stateLayerStyle,
            ]}
          />
          {focused ? (
            <View
              style={[
                styles.fill,
                styles.focusRing,
                {
                  borderColor: colors.focusIndicator,
                  borderRadius: indicatorRadius + focusIndicator.outerOffset,
                },
              ]}
            />
          ) : null}
          <View style={styles.iconAnchor}>
            <Icon
              source={active ? (activeIcon ?? icon) : icon}
              size={item.iconSize}
              color={colors.icon}
            />
            {badgeNode ? (
              <Animated.View
                aria-hidden={expanded}
                style={[styles.iconBadge, ...fade(!expanded)]}
              >
                {badgeNode}
              </Animated.View>
            ) : null}
          </View>
          {hasLabel ? (
            <>
              <Animated.View
                aria-hidden={expanded}
                style={[styles.stackedLabel, ...fade(!expanded)]}
              >
                {renderLabel(false)}
              </Animated.View>
              <Animated.View
                aria-hidden={!expanded}
                style={[
                  styles.rowLabel,
                  { width: rowLabelWidth },
                  ...fade(expanded),
                ]}
              >
                {renderLabel(true)}
              </Animated.View>
            </>
          ) : null}
          {badgeNode ? (
            <Animated.View
              aria-hidden={!expanded}
              style={[styles.rowBadge, ...fade(expanded)]}
            >
              {badgeNode}
            </Animated.View>
          ) : null}
        </Animated.View>
      </TouchableRipple>
    </Animated.View>
  );
};

NavigationRailItem.displayName = 'NavigationRail.Item';

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
  },
  pill: {
    justifyContent: 'center',
    paddingStart: item.expanded.leading,
    pointerEvents: 'none',
  },
  fill: {
    ...StyleSheet.absoluteFill,
  },
  shown: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
  focusRing: {
    margin: -focusIndicator.outerOffset,
    borderWidth: focusIndicator.thickness,
  },
  stackedLabel: {
    position: 'absolute',
    top: '100%',
    start: 0,
    width: item.collapsed.indicatorWidth,
    marginTop: item.collapsed.iconLabelGap,
    alignItems: 'center',
  },
  rowLabel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: item.expanded.leading + item.iconSize + item.expanded.iconLabelGap,
    justifyContent: 'center',
  },
  iconAnchor: {
    alignSelf: 'flex-start',
  },
  iconBadge: {
    position: 'absolute',
    top: 0,
    end: badgeEnd,
    alignItems: 'flex-end',
  },
  rowBadge: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    end: item.expanded.trailing,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default NavigationRailItem;
