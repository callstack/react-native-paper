import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  cubicBezier,
  type AnimatedStyle,
} from 'react-native-reanimated';

import CardActions from './CardActions';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import type { Props as CardTitleProps } from './CardTitle';
import { resolveCardVisuals } from './tokens';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { Elevation, ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import { mergeDataSetProps, useFocusRing } from '../../utils/useFocusRing';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

type ConvenienceHeaderProps = {
  /**
   * Title rendered in the Card's header region.
   */
  title?: React.ReactNode;
  /**
   * Subtitle rendered below `title` in the Card's header region.
   */
  subtitle?: React.ReactNode;
  /**
   * Render slot displayed before `title` and `subtitle`.
   */
  leading?: CardTitleProps['left'];
  /**
   * Render slot displayed after `title` and `subtitle`.
   */
  trailing?: CardTitleProps['right'];
  /**
   * Fully custom header region. This cannot be combined with `title`,
   * `subtitle`, `leading`, or `trailing`.
   */
  header?: never;
};

type CustomHeaderProps = {
  /**
   * Fully custom header region. This cannot be combined with `title`,
   * `subtitle`, `leading`, or `trailing`.
   */
  header: React.ReactNode;
  /**
   * Unavailable when a custom header is supplied.
   */
  title?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  subtitle?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  leading?: never;
  /**
   * Unavailable when a custom header is supplied.
   */
  trailing?: never;
};

type CardShapeProps = {
  /**
   * Radius of every Card corner.
   */
  borderRadius?: ViewStyle['borderRadius'];
  /**
   * Radius of the Card's bottom-end corner.
   */
  borderBottomEndRadius?: ViewStyle['borderBottomEndRadius'];
  /**
   * Radius of the Card's bottom-left corner.
   */
  borderBottomLeftRadius?: ViewStyle['borderBottomLeftRadius'];
  /**
   * Radius of the Card's bottom-right corner.
   */
  borderBottomRightRadius?: ViewStyle['borderBottomRightRadius'];
  /**
   * Radius of the Card's bottom-start corner.
   */
  borderBottomStartRadius?: ViewStyle['borderBottomStartRadius'];
  /**
   * Radius of the Card's end-end corner.
   */
  borderEndEndRadius?: ViewStyle['borderEndEndRadius'];
  /**
   * Radius of the Card's end-start corner.
   */
  borderEndStartRadius?: ViewStyle['borderEndStartRadius'];
  /**
   * Radius of the Card's start-end corner.
   */
  borderStartEndRadius?: ViewStyle['borderStartEndRadius'];
  /**
   * Radius of the Card's start-start corner.
   */
  borderStartStartRadius?: ViewStyle['borderStartStartRadius'];
  /**
   * Radius of the Card's top-end corner.
   */
  borderTopEndRadius?: ViewStyle['borderTopEndRadius'];
  /**
   * Radius of the Card's top-left corner.
   */
  borderTopLeftRadius?: ViewStyle['borderTopLeftRadius'];
  /**
   * Radius of the Card's top-right corner.
   */
  borderTopRightRadius?: ViewStyle['borderTopRightRadius'];
  /**
   * Radius of the Card's top-start corner.
   */
  borderTopStartRadius?: ViewStyle['borderTopStartRadius'];
  /**
   * Corner curve used by the Card on iOS.
   */
  borderCurve?: ViewStyle['borderCurve'];
};

type FilledCardProps = {
  /**
   * Material Card variant. `filled` is the default, `elevated` adds hierarchy
   * with a shadow, and `outlined` adds a visible boundary.
   */
  variant?: 'filled';
  /**
   * Resting elevation. Available only when `variant="elevated"`.
   */
  elevation?: never;
  /**
   * Outline color. Available only when `variant="outlined"`.
   */
  borderColor?: never;
};

type ElevatedCardProps = {
  /**
   * Elevated Card variant.
   */
  variant: 'elevated';
  /**
   * Resting shadow elevation for an elevated Card.
   */
  elevation?: Elevation;
  /**
   * Outline color. Available only when `variant="outlined"`.
   */
  borderColor?: never;
};

type OutlinedCardProps = {
  /**
   * Outlined Card variant.
   */
  variant: 'outlined';
  /**
   * Outlined Cards do not support custom elevation.
   */
  elevation?: never;
  /**
   * Color of the outline. It replaces the theme color in every state; the
   * state opacities still apply, so a disabled outline stays at 12%.
   */
  borderColor?: ColorValue;
};

type CardVariantProps = FilledCardProps | ElevatedCardProps | OutlinedCardProps;

export type Props = Omit<ViewProps, 'children' | 'style'> &
  CardShapeProps & {
    /**
     * Media rendered as the first Card region. Use `Card.Cover` for responsive
     * edge-to-edge image media, or pass any React node, array, or fragment.
     */
    media?: React.ReactNode;
    /**
     * Main content rendered after the header. Use `Card.Content` when the
     * standard Card padding is desired.
     */
    content?: React.ReactNode;
    /**
     * Actions rendered as the final Card region. Independent controls belong
     * here only when the Card itself is neutral, without interaction handlers.
     * `Card.Actions` provides the standard action-row layout.
     */
    actions?: React.ReactNode;
    /**
     * Function to execute on long press.
     */
    onLongPress?: () => void;
    /**
     * Function to execute on press.
     */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
     */
    onPressIn?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute as soon as the touch is released even before onPress.
     */
    onPressOut?: (e: GestureResponderEvent) => void;
    /**
     * Function called when the pointer starts hovering over an actionable Card.
     */
    onHoverIn?: TouchableRippleProps['onHoverIn'];
    /**
     * Function called when the pointer stops hovering over an actionable Card.
     */
    onHoverOut?: TouchableRippleProps['onHoverOut'];
    /**
     * The number of milliseconds a user must touch the element before executing `onLongPress`.
     */
    delayLongPress?: number;
    /**
     * If true, disable all interactions for this component.
     */
    disabled?: boolean;
    /**
     * Whether to show the Card's controlled Material dragged presentation.
     * This controls visuals only; gesture recognition, drag lifecycle, list
     * reordering, and drop behavior remain the consumer's responsibility.
     */
    dragged?: boolean;
    /**
     * Style of the inner region that contains all Card slots.
     */
    contentStyle?: StyleProp<ViewStyle>;
    /**
     * Layout style for the outer Card shell. Use the dedicated shape props and
     * `variant` or `elevation` for Card visuals.
     */
    style?: StyleProp<SurfaceStyle>;
    /**
     * @optional
     */
    theme?: ThemeProp;
    /**
     * Test ID for the interaction node when the Card is actionable, or the
     * content node when it is neutral.
     */
    testID?: string;
    /**
     * Whether the Card's semantic target is an accessibility element. For an
     * actionable Card this applies to its single interaction target; otherwise
     * it applies to the neutral outer shell.
     */
    accessible?: boolean;
    /**
     * Reference to the actionable Card interaction node.
     */
    touchableRef?: React.Ref<React.ComponentRef<typeof View>>;
    /**
     * Reference to the outer Card shell.
     */
    ref?: React.Ref<React.ComponentRef<typeof View>>;
  } & (ConvenienceHeaderProps | CustomHeaderProps) &
  CardVariantProps;

/**
 * A Card groups related media, header content, body content, and actions. It
 * renders populated regions in the fixed order `media`, header, `content`, and
 * `actions`, regardless of prop order. Slots accept React nodes, including
 * arrays and fragments, and Card does not clone or rewrite them.
 *
 * The header region can be created directly with `title`, `subtitle`, `leading`,
 * and `trailing`, or replaced completely with `header`; the two forms are
 * mutually exclusive. `Card.Title`, `Card.Content`, `Card.Cover`, and
 * `Card.Actions` remain optional layout helpers for their corresponding slots.
 *
 * Use `filled` (the default), `elevated`, or `outlined` for Material 3 emphasis.
 * Only an elevated Card accepts `elevation`. Every variant uses the theme's
 * medium shape by default; the dedicated corner props consistently shape the
 * shadow shell, clipped visual region, outline, state layer, ripple, focus
 * indicator, and edge media.
 *
 * Supplying `onPress`, `onLongPress`, `onPressIn`, or `onPressOut` makes the
 * whole Card one actionable target. It receives button semantics by default,
 * routes accessibility props and `touchableRef` to that target, and must not
 * contain independent controls in `actions`. Keep the Card neutral when the
 * controls in `actions` are the interaction targets. A neutral Card remains a
 * grouping container unless accessibility semantics are supplied explicitly.
 * Disabled Cards expose disabled semantics and suppress interaction callbacks.
 *
 * `ref` targets the outer shadow shell. On an actionable Card, `testID` targets
 * the interaction node; on a neutral Card it targets the slot-content node.
 * `dragged` controls Material dragged visuals only; the consumer remains
 * responsible for gesture recognition and drag lifecycle.
 *
 * ## Usage
 *
 * An actionable filled Card represents one action and contains no independent
 * controls:
 *
 * ```tsx
 * import * as React from 'react';
 * import { Avatar, Button, Card, Text } from 'react-native-paper';
 * import { View } from 'react-native';
 *
 * const CardExamples = () => (
 *   <View>
 *   <Card
 *     accessibilityLabel="Open trip details"
 *     onPress={() => console.log('Open trip details')}
 *     media={<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />}
 *     title="Weekend trip"
 *     subtitle="Actionable filled Card"
 *     leading={(props) => <Avatar.Icon {...props} icon="folder" />}
 *     content={<Card.Content>
 *       <Text variant="bodyMedium">View the itinerary.</Text>
 *     </Card.Content>}
 *   />
 *
 *   <Card
 *     variant="elevated"
 *     title="Draft itinerary"
 *     content={<Card.Content>
 *       <Text variant="bodyMedium">Review before saving.</Text>
 *     </Card.Content>}
 *     actions={<Card.Actions>
 *       <Button onPress={() => console.log('Discard')}>Discard</Button>
 *       <Button mode="filled" onPress={() => console.log('Save')}>Save</Button>
 *     </Card.Actions>}
 *   />
 *
 *   <Card
 *     variant="outlined"
 *     header={<Card.Title title="Custom header" subtitle="Outlined Card" />}
 *     content={<Card.Content>
 *       <Text variant="bodyMedium">Supply any React node as the header.</Text>
 *     </Card.Content>}
 *   />
 *   </View>
 * );
 *
 * export default CardExamples;
 * ```
 */

const Card = ({
  variant: cardVariant = 'filled',
  elevation: customElevation,
  borderColor: customBorderColor,
  delayLongPress,
  onPress,
  onLongPress,
  onPressOut,
  onPressIn,
  media,
  header,
  title,
  subtitle,
  leading,
  trailing,
  content: cardContent,
  actions,
  style,
  contentStyle,
  theme: themeOverrides,
  testID,
  accessible,
  disabled,
  dragged = false,
  accessibilityActions,
  role,
  accessibilityRole,
  'aria-label': ariaLabel,
  accessibilityLabel,
  accessibilityHint,
  accessibilityState,
  accessibilityValue,
  'aria-busy': ariaBusy,
  'aria-checked': ariaChecked,
  'aria-disabled': ariaDisabled,
  'aria-expanded': ariaExpanded,
  'aria-hidden': ariaHidden,
  'aria-labelledby': ariaLabelledBy,
  'aria-live': ariaLive,
  'aria-modal': ariaModal,
  'aria-selected': ariaSelected,
  'aria-valuemax': ariaValueMax,
  'aria-valuemin': ariaValueMin,
  'aria-valuenow': ariaValueNow,
  'aria-valuetext': ariaValueText,
  accessibilityLabelledBy,
  accessibilityLiveRegion,
  accessibilityElementsHidden,
  accessibilityViewIsModal,
  accessibilityIgnoresInvertColors,
  accessibilityLanguage,
  accessibilityShowsLargeContentViewer,
  accessibilityLargeContentTitle,
  accessibilityRespondsToUserInteraction,
  importantForAccessibility,
  screenReaderFocusable,
  onAccessibilityAction,
  onAccessibilityEscape,
  onAccessibilityTap,
  onMagicTap,
  focusable,
  tabIndex,
  hitSlop,
  onFocus,
  onBlur,
  onHoverIn,
  onHoverOut,
  touchableRef,
  borderRadius,
  borderBottomEndRadius,
  borderBottomLeftRadius,
  borderBottomRightRadius,
  borderBottomStartRadius,
  borderEndEndRadius,
  borderEndStartRadius,
  borderStartEndRadius,
  borderStartStartRadius,
  borderTopEndRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderTopStartRadius,
  borderCurve = 'continuous',
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();

  const isDisabled = Boolean(
    disabled || ariaDisabled || accessibilityState?.disabled
  );

  // Hover, focus and press are changes between fixed states, so they live in
  // React state: Reanimated CSS transitions start when React commits the new
  // style, which a value written from a worklet would never do.
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  React.useEffect(() => {
    if (isDisabled) {
      setHovered(false);
      setFocused(false);
      setPressed(false);
    }
  }, [isDisabled]);

  const visuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    disabled: isDisabled,
    dragged,
    pressed,
    focused,
    hovered,
  });
  const transitionDuration = reduceMotion
    ? 0
    : theme.motion.duration.short3 * theme.animation.scale;
  const transitionTimingFunction = cubicBezier(...theme.motion.easing.standard);
  // TouchableRipple already draws the pressed state layer (the ripple on
  // Android, the underlay elsewhere), so a second one would double it.
  const stateLayerOpacity =
    visuals.state === 'pressed' ? 0 : visuals.stateLayerOpacity;
  const outlineColor = customBorderColor ?? visuals.outlineColor;
  const stateLayerTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionProperty: 'opacity',
    transitionDuration,
    transitionTimingFunction,
  };
  const outlineTransitionStyle: AnimatedStyle<ViewStyle> = {
    // A PlatformColor outline cannot be interpolated.
    transitionProperty:
      typeof outlineColor === 'string' ? ['borderColor', 'opacity'] : 'opacity',
    transitionDuration,
    transitionTimingFunction,
  };

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });
  // The ring goes on the Surface, the Card's visible box (`scope: 'within'`),
  // not on the interaction node: the caller's `style` sizes and pads the
  // Surface, so a ring on the interaction node would stop short of a taller
  // Card's edge or sit inside its padding. On web the ring lights only for a
  // focused direct child, so the interaction node is the Surface's only child.
  //
  // Off without a touch handler too: the interaction node unmounts then, and a
  // focused one sends no blur, so the ring would come back with the handler.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    isDisabled || !hasPassedTouchHandler,
    theme.colors.secondary,
    'outward',
    'within'
  );
  const hasWarnedAboutActions = React.useRef(false);
  const hasActions =
    actions !== null && actions !== undefined && actions !== false;

  React.useEffect(() => {
    if (
      process.env.NODE_ENV !== 'production' &&
      hasPassedTouchHandler &&
      hasActions &&
      !hasWarnedAboutActions.current
    ) {
      console.warn(
        'An actionable Card cannot contain actions. Remove the Card interaction handlers or move the independent actions outside the Card.'
      );
      hasWarnedAboutActions.current = true;
    }
  }, [hasActions, hasPassedTouchHandler]);

  const shapeStyle = Object.fromEntries(
    Object.entries({
      borderRadius: borderRadius ?? visuals.shape,
      borderBottomEndRadius,
      borderBottomLeftRadius,
      borderBottomRightRadius,
      borderBottomStartRadius,
      borderEndEndRadius,
      borderEndStartRadius,
      borderStartEndRadius,
      borderStartStartRadius,
      borderTopEndRadius,
      borderTopLeftRadius,
      borderTopRightRadius,
      borderTopStartRadius,
      borderCurve,
    }).filter(([, value]) => value !== undefined)
  );
  const hasConvenienceHeader =
    title != null || subtitle != null || leading != null || trailing != null;

  const content = (
    <View
      style={[
        styles.content,
        { opacity: visuals.contentOpacity },
        contentStyle,
      ]}
      testID={hasPassedTouchHandler ? undefined : testID}
    >
      {media}
      {header ??
        (hasConvenienceHeader ? (
          <CardTitle
            title={title}
            subtitle={subtitle}
            left={leading}
            right={trailing}
          />
        ) : null)}
      {cardContent}
      {actions}
    </View>
  );

  const actionableRole =
    role ?? (accessibilityRole === undefined ? 'button' : undefined);
  const accessibilityProps = {
    accessible,
    accessibilityActions,
    role,
    accessibilityRole,
    'aria-label': ariaLabel,
    accessibilityLabel,
    accessibilityHint,
    accessibilityState,
    accessibilityValue,
    'aria-busy': ariaBusy,
    'aria-checked': ariaChecked,
    'aria-disabled': ariaDisabled,
    'aria-expanded': ariaExpanded,
    'aria-hidden': ariaHidden,
    'aria-labelledby': ariaLabelledBy,
    'aria-live': ariaLive,
    'aria-modal': ariaModal,
    'aria-selected': ariaSelected,
    'aria-valuemax': ariaValueMax,
    'aria-valuemin': ariaValueMin,
    'aria-valuenow': ariaValueNow,
    'aria-valuetext': ariaValueText,
    accessibilityLabelledBy,
    accessibilityLiveRegion,
    accessibilityElementsHidden,
    accessibilityViewIsModal,
    accessibilityIgnoresInvertColors,
    accessibilityLanguage,
    accessibilityShowsLargeContentViewer,
    accessibilityLargeContentTitle,
    accessibilityRespondsToUserInteraction,
    importantForAccessibility,
    screenReaderFocusable,
    onAccessibilityAction,
    onAccessibilityEscape,
    onAccessibilityTap,
    onMagicTap,
  };
  const actionableAccessibilityProps = {
    ...accessibilityProps,
    role: actionableRole,
    'aria-disabled': isDisabled,
    accessibilityActions: isDisabled ? undefined : accessibilityActions,
    onAccessibilityAction: isDisabled ? undefined : onAccessibilityAction,
    onAccessibilityEscape: isDisabled ? undefined : onAccessibilityEscape,
    onAccessibilityTap: isDisabled ? undefined : onAccessibilityTap,
    onMagicTap: isDisabled ? undefined : onMagicTap,
  };
  const neutralAccessibilityProps = {
    ...accessibilityProps,
    'aria-disabled': isDisabled || ariaDisabled,
  };
  const handlePressIn = React.useCallback(
    (event: GestureResponderEvent) => {
      setPressed(true);
      onPressIn?.(event);
    },
    [onPressIn]
  );
  const handlePressOut = React.useCallback(
    (event: GestureResponderEvent) => {
      setPressed(false);
      onPressOut?.(event);
    },
    [onPressOut]
  );
  const handleFocus: NonNullable<TouchableRippleProps['onFocus']> =
    React.useCallback(
      (event) => {
        focusTarget.onFocus?.(event);
        setFocused(isKeyboardFocusEvent(event));
        onFocus?.(event);
      },
      [focusTarget, onFocus]
    );
  const handleBlur: NonNullable<TouchableRippleProps['onBlur']> =
    React.useCallback(
      (event) => {
        focusTarget.onBlur?.();
        setFocused(false);
        setPressed(false);
        onBlur?.(event);
      },
      [focusTarget, onBlur]
    );
  const handleHoverIn: NonNullable<TouchableRippleProps['onHoverIn']> =
    React.useCallback(
      (event) => {
        setHovered(true);
        onHoverIn?.(event);
      },
      [onHoverIn]
    );
  const handleHoverOut: NonNullable<TouchableRippleProps['onHoverOut']> =
    React.useCallback(
      (event) => {
        setHovered(false);
        onHoverOut?.(event);
      },
      [onHoverOut]
    );

  const layers = (
    <>
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          shapeStyle,
          {
            backgroundColor: visuals.containerColor,
            opacity: visuals.containerOpacity,
          },
        ]}
      />
      {content}
      {/* Material draws state layers over the whole Card, media included. */}
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          shapeStyle,
          {
            backgroundColor: visuals.stateLayerColor,
            opacity: stateLayerOpacity,
          },
          stateLayerTransitionStyle,
        ]}
      />
      {visuals.outlineWidth > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            shapeStyle,
            {
              borderWidth: visuals.outlineWidth,
              borderColor: outlineColor,
              opacity: visuals.outlineOpacity,
            },
            outlineTransitionStyle,
          ]}
        />
      ) : null}
    </>
  );
  const visualStyle = [
    styles.visual,
    shapeStyle,
    visuals.containerOpacity === 1 && {
      backgroundColor: visuals.containerColor,
    },
  ];

  return (
    <Surface
      ref={ref}
      {...shapeStyle}
      backgroundColor="transparent"
      style={[style, ...focusRing.style]}
      theme={theme}
      elevation={visuals.elevation}
      transitionDuration={transitionDuration}
      {...(!hasPassedTouchHandler && neutralAccessibilityProps)}
      onFocus={!hasPassedTouchHandler ? onFocus : undefined}
      onBlur={!hasPassedTouchHandler ? onBlur : undefined}
      focusable={!hasPassedTouchHandler ? focusable : undefined}
      tabIndex={!hasPassedTouchHandler ? tabIndex : undefined}
      hitSlop={!hasPassedTouchHandler ? hitSlop : undefined}
      {...rest}
      {...mergeDataSetProps(rest, focusRing.dataSetProps)}
    >
      {hasPassedTouchHandler ? (
        <TouchableRipple
          {...actionableAccessibilityProps}
          ref={touchableRef}
          testID={testID}
          borderless={false}
          hoverColor="transparent"
          // Card draws the ring on its Surface instead.
          focusRing="none"
          style={visualStyle}
          theme={theme}
          focusable={isDisabled ? false : focusable}
          tabIndex={isDisabled ? -1 : tabIndex}
          hitSlop={hitSlop}
          unstable_pressDelay={0}
          disabled={isDisabled}
          delayLongPress={delayLongPress}
          onLongPress={isDisabled ? undefined : onLongPress}
          onPress={isDisabled ? undefined : onPress}
          onPressIn={isDisabled ? undefined : handlePressIn}
          onPressOut={isDisabled ? undefined : handlePressOut}
          onFocus={isDisabled ? undefined : handleFocus}
          onBlur={isDisabled ? undefined : handleBlur}
          onHoverIn={isDisabled ? undefined : handleHoverIn}
          onHoverOut={isDisabled ? undefined : handleHoverOut}
        >
          {layers}
        </TouchableRipple>
      ) : (
        <View style={visualStyle}>{layers}</View>
      )}
    </Surface>
  );
};

Card.displayName = 'Card';

// @component ./CardContent.tsx
Card.Content = CardContent;
// @component ./CardActions.tsx
Card.Actions = CardActions;
// @component ./CardCover.tsx
Card.Cover = CardCover;
// @component ./CardTitle.tsx
Card.Title = CardTitle;

const styles = StyleSheet.create({
  visual: {
    flexShrink: 1,
    overflow: 'hidden',
  },
  content: {
    flexShrink: 1,
    position: 'relative',
  },
});

export default Card;
