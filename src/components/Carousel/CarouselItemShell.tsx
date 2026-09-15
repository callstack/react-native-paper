import * as React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import type { ColorValue, ViewStyle } from 'react-native';

import Animated, {
  cubicBezier,
  useAnimatedStyle,
  useDerivedValue,
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';

import type { CarouselStrategy } from './strategy';
import { CarouselTokens } from './tokens';
import type { CarouselMaskRect, CarouselRenderItemInfo } from './types';
import { resolveItemPlacement, type CarouselColors } from './utils';
import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { InternalTheme } from '../../theme/types';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Surface from '../Surface';

const { opacity: stateOpacity, focusIndicator } = tokens.md.sys.state;
const FOCUS_INSET = focusIndicator.thickness + focusIndicator.outerOffset;

export type CarouselItemShellProps<ItemT> = {
  item: ItemT;
  index: number;
  itemCount: number;
  renderItem: (info: CarouselRenderItemInfo<ItemT>) => React.ReactNode;
  strategy: CarouselStrategy;
  scrollX: SharedValue<number>;
  height: number;
  spacing: number;
  colors: CarouselColors;
  outlined: boolean;
  disabled: boolean;
  onPress?: (item: ItemT, index: number) => void;
  theme: InternalTheme;
  testID?: string;
};

/**
 * One item's box, mask and interaction states.
 *
 * The box is always the full unmasked item size; what changes as the item
 * moves through the keylines is the clipping wrapper inside it and a
 * translation. The corner radius lives on that wrapper — the mask — rather
 * than on the box, so the rounded corners travel with the visible rectangle
 * instead of with the item.
 */
function CarouselItemShell<ItemT>({
  item,
  index,
  itemCount,
  renderItem,
  strategy,
  scrollX,
  height,
  spacing,
  colors,
  outlined,
  disabled,
  onPress,
  theme: themeOverride,
  testID,
}: CarouselItemShellProps<ItemT>) {
  const theme = useInternalTheme(themeOverride);
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const [focused, setFocused] = React.useState(false);

  const { itemSize } = strategy;
  const contentWidth = Math.max(itemSize - spacing, 0);
  const borderRadius = theme.shapes.corner[CarouselTokens.containerShape];

  const placement = useDerivedValue(
    () => resolveItemPlacement(strategy, scrollX.value, index),
    [strategy, index]
  );

  // Item-local mask, measured from the visible item box rather than from the
  // spacing-inflated slot, which is what `renderItem` wants to align against.
  const maskRect = useDerivedValue<CarouselMaskRect>(() => {
    const left = (itemSize - placement.value.size) / 2;
    const width = Math.max(placement.value.size - spacing, 0);
    return { left, top: 0, right: left + width, bottom: height };
  }, [itemSize, spacing, height]);

  const expansion = useDerivedValue(() => {
    if (contentWidth <= 0) {
      return 0;
    }
    const width = maskRect.value.right - maskRect.value.left;
    return Math.min(Math.max(width / contentWidth, 0), 1);
  }, [contentWidth]);

  const boxStyle = useAnimatedStyle(
    () => ({
      // The box is drawn in container coordinates but lives inside the scrolling
      // content, so the scroll offset is added back in.
      transform: [
        { translateX: scrollX.value + placement.value.center - itemSize / 2 },
      ],
    }),
    [itemSize]
  );

  const maskStyle = useAnimatedStyle(() => {
    const { left, right } = maskRect.value;
    return {
      width: right - left,
      transform: [{ translateX: left + spacing / 2 }],
    };
  }, [spacing]);

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -maskRect.value.left }],
  }));

  const focusRingStyle = useAnimatedStyle(() => {
    const { left, right } = maskRect.value;
    return {
      width: right - left + FOCUS_INSET * 2,
      transform: [{ translateX: left + spacing / 2 - FOCUS_INSET }],
    };
  }, [spacing]);

  const transition = useTransition(theme);

  const interactive = onPress !== undefined && !disabled;
  const stateLayerOpacity = !interactive
    ? 0
    : pressed
      ? stateOpacity.pressed
      : focused
        ? stateOpacity.focused
        : hovered
          ? stateOpacity.hovered
          : 0;
  const stateLayerColor: ColorValue = pressed
    ? colors.pressedStateLayerColor
    : focused
      ? colors.focusStateLayerColor
      : colors.hoverStateLayerColor;
  const focusRingOpacity = { opacity: focused && interactive ? 1 : 0 };

  const mask = React.useMemo(
    () => ({ rect: maskRect, expansion, width: contentWidth, height }),
    [maskRect, expansion, contentWidth, height]
  );

  const content = (
    <Animated.View
      style={[
        styles.content,
        { width: contentWidth, height },
        contentStyle,
        disabled ? { opacity: CarouselTokens.disabledContainerOpacity } : null,
        // The Pressable above owns the hit area whenever the item is
        // interactive, so the content must not intercept touches.
        interactive ? styles.ignoreTouches : null,
        transition,
      ]}
    >
      {renderItem({ item, index, mask })}
    </Animated.View>
  );

  return (
    <Animated.View
      testID={testID}
      style={[
        styles.box,
        // Descending: an item that is collapsing passes under the one before it.
        { width: itemSize, height, zIndex: itemCount - index },
        boxStyle,
      ]}
    >
      <Surface
        elevation={
          hovered && interactive
            ? CarouselTokens.hoverContainerElevation
            : CarouselTokens.containerElevation
        }
        backgroundColor={colors.containerColor}
        borderRadius={borderRadius}
        style={[styles.mask, { height }, maskStyle]}
        theme={theme}
      >
        <View
          style={[
            styles.clip,
            { borderRadius },
            outlined
              ? {
                  borderWidth: CarouselTokens.outlineWidth,
                  borderColor: colors.outlineColor,
                }
              : null,
          ]}
        >
          {content}
          {interactive ? (
            <Pressable
              style={[
                StyleSheet.absoluteFill,
                Platform.OS === 'web' ? webNoOutline : undefined,
              ]}
              onPress={() => onPress(item, index)}
              onPressIn={() => setPressed(true)}
              onPressOut={() => setPressed(false)}
              onHoverIn={() => setHovered(true)}
              onHoverOut={() => setHovered(false)}
              onFocus={(event) => {
                if (!isKeyboardFocusEvent(event)) return;
                setFocused(true);
              }}
              onBlur={() => setFocused(false)}
              role="button"
              aria-disabled={disabled}
            />
          ) : null}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              styles.stateLayer,
              { backgroundColor: stateLayerColor, opacity: stateLayerOpacity },
              transition,
            ]}
          />
        </View>
      </Surface>

      <Animated.View
        style={[
          styles.focusRing,
          {
            top: -FOCUS_INSET,
            height: height + FOCUS_INSET * 2,
            borderRadius: borderRadius + FOCUS_INSET,
            borderWidth: focusIndicator.thickness,
            borderColor: colors.focusIndicatorColor,
          },
          focusRingOpacity,
          focusRingStyle,
          transition,
        ]}
      />
    </Animated.View>
  );
}

/**
 * Fades, colour changes and the elevation rise are not scroll-driven, so they
 * run as CSS transitions rather than through the imperative tier.
 */
function useTransition(theme: InternalTheme): AnimatedStyle<ViewStyle> {
  return React.useMemo(
    () => ({
      transitionProperty: ['opacity', 'backgroundColor'],
      transitionDuration: theme.motion.duration.short3 * theme.animation.scale,
      transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
    }),
    [
      theme.motion.duration.short3,
      theme.motion.easing.standard,
      theme.animation.scale,
    ]
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  mask: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  clip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  content: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  ignoreTouches: {
    pointerEvents: 'none',
  },
  stateLayer: {
    pointerEvents: 'none',
  },
  focusRing: {
    position: 'absolute',
    left: 0,
    pointerEvents: 'none',
  },
});

// Web-only style; not in StyleSheet because `outline` is outside ViewStyle.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default CarouselItemShell;
