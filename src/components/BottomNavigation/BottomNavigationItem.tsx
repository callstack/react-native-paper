import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { renderDefaultTouchable } from './BottomNavigationTouchable';
import { NavigationBarTokens } from './tokens';
import type {
  BaseRoute,
  RenderIcon,
  RenderLabel,
  RenderTouchable,
  SceneAnimationEasing,
} from './types';
import {
  getActiveTintColor,
  getInactiveTintColor,
  getItemRippleColor,
  getLabelColor,
} from './utils';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { cornerFull } from '../../theme/tokens/sys/shape';
import type { InternalTheme } from '../../theme/types';
import Badge from '../Badge';
import Icon from '../Icon';
import type { IconSource } from '../Icon';
import Text from '../Typography/Text';

export type Props<Route extends BaseRoute> = {
  route: Route;
  focused: boolean;
  labeled: boolean;
  shifting: boolean;
  itemLayout: 'vertical' | 'horizontal';
  activeColor?: ColorValue;
  inactiveColor?: ColorValue;
  renderIcon?: RenderIcon<Route>;
  renderLabel?: RenderLabel<Route>;
  renderTouchable?: RenderTouchable<Route>;
  getLabelText: (props: { route: Route }) => string | undefined;
  getBadge: (props: { route: Route }) => boolean | number | string | undefined;
  getAccessibilityLabel: (props: { route: Route }) => string | undefined;
  getTestID: (props: { route: Route }) => string | undefined;
  onPress: () => void;
  onLongPress?: () => void;
  labelMaxFontSizeMultiplier: number;
  activeIndicatorStyle?: StyleProp<ViewStyle>;
  animationEasing?: SceneAnimationEasing;
  theme: InternalTheme;
};

const renderDefaultIcon = ({
  source,
  color,
}: {
  source: IconSource | undefined;
  color: ColorValue;
}) => {
  if (source == null) {
    return null;
  }

  return <Icon source={source} color={color} size={NavigationBarTokens.icon} />;
};

function BottomNavigationItem<Route extends BaseRoute>({
  route,
  focused,
  labeled,
  shifting,
  itemLayout,
  activeColor,
  inactiveColor,
  renderIcon,
  renderLabel,
  renderTouchable = renderDefaultTouchable,
  getLabelText,
  getBadge,
  getAccessibilityLabel,
  getTestID,
  onPress,
  onLongPress,
  labelMaxFontSizeMultiplier,
  activeIndicatorStyle,
  animationEasing,
  theme,
}: Props<Route>) {
  const reduceMotion = useReduceMotion();
  const progress = useSharedValue(focused ? 1 : 0);
  const { scale } = theme.animation;
  const isHorizontal = itemLayout === 'horizontal';
  const onIndicator = isHorizontal && focused;

  React.useEffect(() => {
    const target = focused ? 1 : 0;

    if (reduceMotion) {
      progress.value = target;
      return;
    }

    if (animationEasing) {
      progress.value = withTiming(target, {
        duration: theme.motion.duration.short3 * scale,
        easing: animationEasing,
      });
      return;
    }

    progress.value = withSpring(
      target,
      toRawSpring(theme.motion.spring.default.spatial)
    );
  }, [animationEasing, focused, progress, reduceMotion, scale, theme]);

  const indicatorStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [
      {
        scaleX: interpolate(progress.value, [0, 1], [0.4, 1]),
      },
    ],
  }));

  const activeIconStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const inactiveIconStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const labelVisibilityStyle = useAnimatedStyle(() => ({
    opacity: shifting ? progress.value : 1,
  }));

  const activeTintColor = getActiveTintColor({ activeColor, theme });
  const inactiveTintColor = getInactiveTintColor({ inactiveColor, theme });
  const labelColor = getLabelColor({
    tintColor: focused ? activeTintColor : inactiveTintColor,
    hasColor: Boolean(focused ? activeColor : inactiveColor),
    focused,
    onIndicator,
    theme,
  });
  const badge = getBadge({ route });
  const label = getLabelText({ route });
  const rippleColor = getItemRippleColor({ focused, theme });
  const labelVariant = focused ? 'labelMediumEmphasized' : 'labelMedium';
  const isLargeBadge = badge != null && typeof badge !== 'boolean';
  const indicatorBackground =
    theme.colors[NavigationBarTokens.colors.activeIndicator];

  const icon = (
    <View style={isHorizontal ? styles.horizontalIcon : styles.verticalIcon}>
      {isHorizontal ? null : (
        <Animated.View
          style={[
            styles.indicator,
            { backgroundColor: indicatorBackground },
            indicatorStyle,
            activeIndicatorStyle,
          ]}
        />
      )}
      <Animated.View style={[styles.iconLayer, activeIconStyle]}>
        {renderIcon
          ? renderIcon({
              route,
              focused: true,
              color: activeTintColor,
            })
          : renderDefaultIcon({
              source: route.focusedIcon,
              color: activeTintColor,
            })}
      </Animated.View>
      <Animated.View style={[styles.iconLayer, inactiveIconStyle]}>
        {renderIcon
          ? renderIcon({
              route,
              focused: false,
              color: inactiveTintColor,
            })
          : renderDefaultIcon({
              source: route.unfocusedIcon ?? route.focusedIcon,
              color: inactiveTintColor,
            })}
      </Animated.View>
      <View
        style={[
          styles.badge,
          isLargeBadge ? styles.largeBadge : styles.smallBadge,
        ]}
      >
        {typeof badge === 'boolean' ? (
          <Badge visible={badge} />
        ) : (
          <Badge visible={badge != null}>{badge}</Badge>
        )}
      </View>
    </View>
  );

  const labelNode = labeled ? (
    <Animated.View
      style={[
        isHorizontal ? styles.horizontalLabel : styles.verticalLabel,
        labelVisibilityStyle,
      ]}
    >
      {renderLabel ? (
        renderLabel({
          route,
          focused,
          color: labelColor,
        })
      ) : (
        <Text
          maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
          variant={labelVariant}
          selectable={false}
          style={[styles.label, { color: labelColor }]}
        >
          {label}
        </Text>
      )}
    </Animated.View>
  ) : null;

  return renderTouchable({
    key: route.key,
    route,
    borderless: true,
    centered: true,
    rippleColor,
    onPress,
    onLongPress,
    testID: getTestID({ route }),
    'aria-label': getAccessibilityLabel({ route }),
    role: Platform.OS === 'ios' ? 'button' : 'tab',
    'aria-selected': focused,
    style: [
      styles.item,
      isHorizontal ? styles.horizontalItem : styles.verticalItem,
    ],
    children: (
      <View
        pointerEvents="none"
        style={[
          isHorizontal ? styles.horizontalContent : styles.verticalContent,
          !labeled && !isHorizontal && styles.unlabeledContent,
        ]}
      >
        {isHorizontal ? (
          <Animated.View
            style={[
              styles.indicator,
              { backgroundColor: indicatorBackground },
              indicatorStyle,
              activeIndicatorStyle,
            ]}
          />
        ) : null}
        {icon}
        {labelNode}
      </View>
    ),
  });
}

function routeVisualsEqual<Route extends BaseRoute>(
  previous: Route,
  next: Route
) {
  return (
    previous.key === next.key &&
    previous.title === next.title &&
    previous.badge === next.badge &&
    previous.focusedIcon === next.focusedIcon &&
    previous.unfocusedIcon === next.unfocusedIcon &&
    previous['aria-label'] === next['aria-label'] &&
    previous.testID === next.testID
  );
}

function propsAreEqual<Route extends BaseRoute>(
  previous: Props<Route>,
  next: Props<Route>
) {
  return (
    previous.focused === next.focused &&
    previous.labeled === next.labeled &&
    previous.shifting === next.shifting &&
    previous.itemLayout === next.itemLayout &&
    previous.activeColor === next.activeColor &&
    previous.inactiveColor === next.inactiveColor &&
    previous.labelMaxFontSizeMultiplier === next.labelMaxFontSizeMultiplier &&
    previous.activeIndicatorStyle === next.activeIndicatorStyle &&
    previous.animationEasing === next.animationEasing &&
    previous.theme === next.theme &&
    routeVisualsEqual(previous.route, next.route)
  );
}

// React.memo erases the generic; restore it so callers keep Route inference.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
export default React.memo(
  BottomNavigationItem,
  propsAreEqual
) as typeof BottomNavigationItem;

const styles = StyleSheet.create({
  item: {
    paddingVertical: 0,
  },
  verticalItem: {
    flex: 1,
  },
  horizontalItem: {
    flexGrow: 0,
    flexShrink: 1,
    marginHorizontal: NavigationBarTokens.itemHorizontalGap / 2,
  },
  verticalContent: {
    alignItems: 'center',
    paddingTop: NavigationBarTokens.itemVerticalSpace,
    paddingBottom: NavigationBarTokens.itemVerticalSpace,
  },
  unlabeledContent: {
    height: NavigationBarTokens.containerHeight,
    justifyContent: 'center',
    paddingTop: 0,
    paddingBottom: 0,
  },
  horizontalContent: {
    alignItems: 'center',
    flexDirection: 'row',
    height: NavigationBarTokens.horizontalIndicatorHeight,
    paddingEnd: NavigationBarTokens.horizontalIndicatorTrailing,
    paddingStart: NavigationBarTokens.horizontalIndicatorLeading,
  },
  verticalIcon: {
    alignItems: 'center',
    height: NavigationBarTokens.verticalIndicatorHeight,
    justifyContent: 'center',
    width: NavigationBarTokens.verticalIndicatorWidth,
  },
  horizontalIcon: {
    alignItems: 'center',
    height: NavigationBarTokens.icon,
    justifyContent: 'center',
    width: NavigationBarTokens.icon,
  },
  indicator: {
    ...StyleSheet.absoluteFill,
    borderRadius: cornerFull,
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
  },
  smallBadge: {
    end: -NavigationBarTokens.smallBadgeOffset,
    top: -NavigationBarTokens.smallBadgeOffset,
  },
  largeBadge: {
    end: -NavigationBarTokens.largeBadgeOffset,
    top: -NavigationBarTokens.largeBadgeOffset,
  },
  verticalLabel: {
    marginTop: NavigationBarTokens.iconLabelSpace,
  },
  horizontalLabel: {
    marginStart: NavigationBarTokens.iconLabelSpace,
  },
  label: {
    textAlign: 'center',
    ...(Platform.OS === 'web'
      ? {
          whiteSpace: 'nowrap',
        }
      : null),
  },
});
