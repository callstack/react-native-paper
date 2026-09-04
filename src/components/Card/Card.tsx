import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  cubicBezier,
  type AnimatedStyle,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

import CardActions from './CardActions';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import type { Props as CardTitleProps } from './CardTitle';
import { resolveCardVisuals } from './tokens';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens as systemTokens } from '../../theme/tokens';
import type { Elevation, ThemeProp } from '../../theme/types';
import hasTouchHandler from '../../utils/hasTouchHandler';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import type { Props as TouchableRippleProps } from '../TouchableRipple/TouchableRipple';

type ConvenienceHeaderProps = {
  /**
   * Header title.
   */
  title?: React.ReactNode;
  /**
   * Header subtitle.
   */
  subtitle?: React.ReactNode;
  /**
   * Render slot displayed before the title and subtitle.
   */
  leading?: CardTitleProps['left'];
  /**
   * Render slot displayed after the title and subtitle.
   */
  trailing?: CardTitleProps['right'];
  /**
   * A fully custom header cannot be combined with convenience header props.
   */
  header?: never;
};

type CustomHeaderProps = {
  /**
   * Fully custom header content.
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
   * Filled Card variant (default).
   */
  variant?: 'filled';
  /**
   * Filled Cards do not support custom elevation.
   */
  elevation?: never;
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
};

type CardVariantProps = FilledCardProps | ElevatedCardProps | OutlinedCardProps;

type CardBaseProps = Omit<ViewProps, 'children' | 'style'> &
  CardShapeProps & {
    /**
     * Media rendered at the start of the Card.
     */
    media?: React.ReactNode;
    /**
     * Main Card content.
     */
    content?: React.ReactNode;
    /**
     * Actions rendered at the end of the Card.
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
     * Gesture recognition and drag lifecycle remain the consumer's responsibility.
     */
    dragged?: boolean;
    /**
     * Style of card's inner content.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<SurfaceStyle>;
    /**
     * @optional
     */
    theme?: ThemeProp;
    /**
     * Test ID for the interaction node when the Card is actionable, or the
     * content node when it is neutral. The shell and clipped visual region use
     * `${testID}-container` and `${testID}-visual` respectively.
     */
    testID?: string;
    /**
     * Whether the Card's semantic target is an accessibility element.
     */
    accessible?: boolean;
    /**
     * Reference to the actionable Card interaction node.
     */
    touchableRef?: React.Ref<View>;
    /**
     * Reference to the outer Card shell.
     */
    ref?: React.Ref<View>;
  };

export type Props = CardBaseProps &
  (ConvenienceHeaderProps | CustomHeaderProps) &
  CardVariantProps;

/**
 * A Card groups related media, header content, body content, and actions.
 * Use the `filled` (default), `elevated`, or `outlined` variant to select its
 * Material 3 emphasis.
 *
 * A Card with an interaction handler represents one action. It receives button
 * semantics by default and must not contain independent controls in `actions`.
 * Use a neutral Card when its actions provide their own interaction targets.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Avatar, Button, Card, Text } from 'react-native-paper';
 *
 * const Leading = props => <Avatar.Icon {...props} icon="folder" />
 *
 * const MyComponent = () => (
 *   <Card
 *     variant="elevated"
 *     media={<Card.Cover source={{ uri: 'https://picsum.photos/700' }} />}
 *     title="Card Title"
 *     subtitle="Card Subtitle"
 *     leading={Leading}
 *     content={<Card.Content>
 *       <Text variant="titleLarge">Card title</Text>
 *       <Text variant="bodyMedium">Card content</Text>
 *     </Card.Content>}
 *     actions={<Card.Actions>
 *       <Button>Cancel</Button>
 *       <Button>Ok</Button>
 *     </Card.Actions>}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 */

const Card = ({
  variant: cardVariant = 'filled',
  elevation: customElevation,
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
  testID = 'card',
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

  const visuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    disabled: isDisabled,
    dragged,
  });

  const enabledVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
  });
  const hoveredVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    hovered: true,
  });
  const focusedVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    focused: true,
  });
  const pressedVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    pressed: true,
  });
  const draggedVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    dragged: true,
  });
  const disabledVisuals = resolveCardVisuals({
    theme,
    variant: cardVariant,
    elevation: customElevation,
    disabled: true,
  });
  const disabledState = useSharedValue(isDisabled);
  const draggedState = useSharedValue(dragged);
  const hovered = useSharedValue(false);
  const focused = useSharedValue(false);
  const pressed = useSharedValue(false);
  const currentInteractiveVisuals = useDerivedValue(() => {
    if (disabledState.value) {
      return disabledVisuals;
    }
    if (draggedState.value) {
      return draggedVisuals;
    }
    if (pressed.value) {
      return pressedVisuals;
    }
    if (focused.value) {
      return focusedVisuals;
    }
    if (hovered.value) {
      return hoveredVisuals;
    }
    return enabledVisuals;
  }, [
    disabledState,
    disabledVisuals,
    draggedState,
    draggedVisuals,
    enabledVisuals,
    focusedVisuals,
    hoveredVisuals,
    pressedVisuals,
  ]);
  const interactiveElevation = useDerivedValue<Elevation>(() => {
    return currentInteractiveVisuals.value.elevation;
  });
  const transitionDuration = reduceMotion
    ? 0
    : theme.motion.duration.short3 * theme.animation.scale;
  const transitionTimingFunction = cubicBezier(...theme.motion.easing.standard);
  // Parametrized timing functions are class instances and cannot cross the
  // worklet boundary, so keep them in regular styles.
  const stateLayerTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionTimingFunction,
  };
  const outlineTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionTimingFunction,
  };
  const focusIndicatorTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionTimingFunction,
  };
  const stateLayerAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: currentInteractiveVisuals.value.stateLayerOpacity,
      transitionDuration,
      transitionProperty: ['opacity'],
    }),
    [currentInteractiveVisuals, transitionDuration]
  );
  const outlineAnimatedStyle = useAnimatedStyle(() => {
    const outlineColor = currentInteractiveVisuals.value.outlineColor;

    return {
      borderColor: outlineColor,
      opacity: currentInteractiveVisuals.value.outlineOpacity,
      transitionDuration,
      transitionProperty:
        typeof outlineColor === 'string'
          ? ['borderColor', 'opacity']
          : ['opacity'],
    };
  }, [currentInteractiveVisuals, transitionDuration]);
  const focusIndicatorAnimatedStyle = useAnimatedStyle(
    () => ({
      opacity: disabledState.value ? 0 : focused.value ? 1 : 0,
      transitionDuration,
      transitionProperty: ['opacity'],
    }),
    [disabledState, transitionDuration]
  );

  React.useEffect(() => {
    disabledState.value = isDisabled;
    draggedState.value = dragged;

    if (isDisabled) {
      hovered.value = false;
      focused.value = false;
      pressed.value = false;
    }
  }, [
    disabledState,
    dragged,
    draggedState,
    focused,
    hovered,
    isDisabled,
    pressed,
  ]);

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });
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
  const focusIndicatorInset =
    systemTokens.md.sys.state.focusIndicator.outerOffset +
    systemTokens.md.sys.state.focusIndicator.thickness;
  const focusIndicatorShapeStyle = Object.fromEntries(
    Object.entries(shapeStyle).map(([property, value]) => [
      property,
      property !== 'borderCurve' && typeof value === 'number'
        ? value + focusIndicatorInset
        : value,
    ])
  );
  const hasConvenienceHeader =
    title != null || subtitle != null || leading != null || trailing != null;

  const content = (
    <View
      style={[styles.content, contentStyle]}
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
      pressed.value = true;
      onPressIn?.(event);
    },
    [onPressIn, pressed]
  );
  const handlePressOut = React.useCallback(
    (event: GestureResponderEvent) => {
      pressed.value = false;
      onPressOut?.(event);
    },
    [onPressOut, pressed]
  );
  const handleFocus: NonNullable<TouchableRippleProps['onFocus']> =
    React.useCallback(
      (event) => {
        focused.value = isKeyboardFocusEvent(event);
        onFocus?.(event);
      },
      [focused, onFocus]
    );
  const handleBlur: NonNullable<TouchableRippleProps['onBlur']> =
    React.useCallback(
      (event) => {
        focused.value = false;
        pressed.value = false;
        onBlur?.(event);
      },
      [focused, onBlur, pressed]
    );
  const handleHoverIn: NonNullable<TouchableRippleProps['onHoverIn']> =
    React.useCallback(
      (event) => {
        hovered.value = true;
        onHoverIn?.(event);
      },
      [hovered, onHoverIn]
    );
  const handleHoverOut: NonNullable<TouchableRippleProps['onHoverOut']> =
    React.useCallback(
      (event) => {
        hovered.value = false;
        onHoverOut?.(event);
      },
      [hovered, onHoverOut]
    );

  return (
    <Surface
      ref={ref}
      {...shapeStyle}
      backgroundColor="transparent"
      style={style}
      theme={theme}
      elevation={interactiveElevation}
      transitionDuration={transitionDuration}
      testID={`${testID}-container`}
      {...(!hasPassedTouchHandler && neutralAccessibilityProps)}
      onFocus={!hasPassedTouchHandler ? onFocus : undefined}
      onBlur={!hasPassedTouchHandler ? onBlur : undefined}
      focusable={!hasPassedTouchHandler ? focusable : undefined}
      tabIndex={!hasPassedTouchHandler ? tabIndex : undefined}
      hitSlop={!hasPassedTouchHandler ? hitSlop : undefined}
      {...rest}
    >
      <View
        testID={`${testID}-visual`}
        style={[
          styles.visual,
          shapeStyle,
          visuals.containerOpacity === 1 && {
            backgroundColor: visuals.containerColor,
          },
        ]}
      >
        <View
          pointerEvents="none"
          testID={`${testID}-background`}
          style={[
            StyleSheet.absoluteFill,
            shapeStyle,
            {
              backgroundColor: visuals.containerColor,
              opacity: visuals.containerOpacity,
            },
          ]}
        />
        <Animated.View
          pointerEvents="none"
          testID={`${testID}-state-layer`}
          style={[
            StyleSheet.absoluteFill,
            shapeStyle,
            {
              backgroundColor: visuals.stateLayerColor,
            },
            stateLayerTransitionStyle,
            stateLayerAnimatedStyle,
          ]}
        />
        {hasPassedTouchHandler ? (
          <TouchableRipple
            {...actionableAccessibilityProps}
            ref={touchableRef}
            testID={testID}
            borderless={false}
            hoverColor="transparent"
            style={[
              shapeStyle,
              Platform.OS === 'web' ? webNoOutline : undefined,
            ]}
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
            {content}
          </TouchableRipple>
        ) : (
          content
        )}
        {visuals.outlineWidth > 0 ? (
          <Animated.View
            pointerEvents="none"
            testID={`${testID}-outline`}
            style={[
              StyleSheet.absoluteFill,
              shapeStyle,
              { borderWidth: visuals.outlineWidth },
              outlineTransitionStyle,
              outlineAnimatedStyle,
            ]}
          />
        ) : null}
      </View>
      {hasPassedTouchHandler ? (
        <Animated.View
          pointerEvents="none"
          testID={`${testID}-focus-indicator`}
          style={[
            styles.focusIndicator,
            {
              top: -focusIndicatorInset,
              right: -focusIndicatorInset,
              bottom: -focusIndicatorInset,
              left: -focusIndicatorInset,
              borderColor: theme.colors.secondary,
              borderWidth: systemTokens.md.sys.state.focusIndicator.thickness,
            },
            focusIndicatorShapeStyle,
            focusIndicatorTransitionStyle,
            focusIndicatorAnimatedStyle,
          ]}
        />
      ) : null}
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
  focusIndicator: {
    position: 'absolute',
    pointerEvents: 'none',
  },
});

// React Native Web otherwise draws its browser-default outline in addition to
// the Material focus indicator.
// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
const webNoOutline = { outline: 'none' } as unknown as ViewStyle;

export default Card;
