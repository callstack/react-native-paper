import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  NativeSyntheticEvent,
  TargetedEvent,
  ViewStyle,
} from 'react-native';

import Animated, { cubicBezier, type CSSStyle } from 'react-native-reanimated';

import type { ConnectedButtonProps as Props } from './types';
import {
  getConnectedButtonColors,
  getConnectedButtonSizeStyle,
  getTestID,
  morphingCorners,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import { isKeyboardFocusEvent } from '../../utils/isKeyboardFocusEvent';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

const FOCUS_RING_THICKNESS = tokens.md.sys.state.focusIndicator.thickness;

const getCornerRadiusProps = () =>
  Platform.OS === 'web'
    ? ({
        topStart: 'borderStartStartRadius',
        bottomStart: 'borderEndStartRadius',
        topEnd: 'borderStartEndRadius',
        bottomEnd: 'borderEndEndRadius',
      } as const)
    : ({
        topStart: 'borderTopStartRadius',
        bottomStart: 'borderBottomStartRadius',
        topEnd: 'borderTopEndRadius',
        bottomEnd: 'borderBottomEndRadius',
      } as const);

/**
 * A single button within a {@link ConnectedButtonGroup}. Not exported on its
 * own — render it through the group's `buttons` prop.
 */
const ConnectedButton = ({
  checked,
  multiSelect,
  position,
  size,
  icon,
  label,
  disabled,
  showSelectedCheck,
  checkedColor,
  uncheckedColor,
  background,
  'aria-label': ariaLabel,
  onPress,
  labelMaxFontSizeMultiplier,
  style,
  labelStyle,
  testID,
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);

  const sizeStyle = React.useMemo(
    () => getConnectedButtonSizeStyle({ size, theme }),
    [size, theme]
  );
  const colors = React.useMemo(
    () =>
      getConnectedButtonColors({
        theme,
        selected: checked,
        disabled,
        checkedColor,
        uncheckedColor,
      }),
    [theme, checked, disabled, checkedColor, uncheckedColor]
  );

  const { outerRadius, innerRadius, pressedRadius } = sizeStyle;
  const restRadius = checked ? outerRadius : innerRadius;
  const [pressed, setPressed] = React.useState(false);

  // Selection-check behaviour matches `SegmentedButtonItem` for migration
  // parity: the check scales in and takes the place of the leading icon on a
  // labelled button, while an icon-only button keeps its icon alongside it.
  const showCheck = Boolean(checked && showSelectedCheck);
  const swapsIcon = Boolean(icon && label && showSelectedCheck);
  const revealsCheck = Boolean(showSelectedCheck) && !swapsIcon;

  const reduceMotion = useReduceMotion();
  const transition = {
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short3,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };
  const getShownStyle = (shown: boolean): CSSStyle<ViewStyle> => ({
    opacity: shown ? 1 : 0,
    transform: [{ scale: shown ? 1 : 0 }],
    transitionProperty: ['opacity', 'transform'],
    ...transition,
  });

  // Only the pressed flag is tracked here; the radius is derived from it and
  // the props below, so no handler writes a radius directly.
  const handlePressIn = React.useCallback(() => {
    setPressed(true);
  }, []);
  const handlePressOut = React.useCallback(() => {
    setPressed(false);
  }, []);
  // Clearing on press as well as press-out matters: re-pressing the already
  // selected button reports the same value, so the group never re-renders and
  // nothing else would restore the shape. A press-out swallowed by a gesture
  // race used to leave the button stuck at its pressed corner indefinitely.
  const handlePress = React.useCallback(
    (event: GestureResponderEvent) => {
      setPressed(false);
      onPress?.(event);
    },
    [onPress]
  );

  const [focusVisible, setFocusVisible] = React.useState(false);
  const handleFocus = React.useCallback(
    (event: NativeSyntheticEvent<TargetedEvent>) => {
      setFocusVisible(isKeyboardFocusEvent(event));
    },
    []
  );
  const handleBlur = React.useCallback(() => {
    setFocusVisible(false);
  }, []);

  const focusRingStyle: ViewStyle | null =
    focusVisible && !disabled
      ? {
          outlineWidth: FOCUS_RING_THICKNESS,
          outlineStyle: 'solid',
          outlineColor: theme.colors.secondary,
          outlineOffset: -FOCUS_RING_THICKNESS,
        }
      : null;

  const { start: animateStart, end: animateEnd } = morphingCorners[position];

  const morphRadius = pressed ? pressedRadius : restRadius;
  const startRadius = animateStart ? morphRadius : outerRadius;
  const endRadius = animateEnd ? morphRadius : outerRadius;

  const { topStart, bottomStart, topEnd, bottomEnd } = getCornerRadiusProps();
  const shapeStyle: CSSStyle<ViewStyle> = {
    [topStart]: startRadius,
    [bottomStart]: startRadius,
    [topEnd]: endRadius,
    [bottomEnd]: endRadius,
    transitionProperty: [topStart, bottomStart, topEnd, bottomEnd],
    ...transition,
  };

  // A gap is needed before the label, and between the check and the leading
  // icon when an icon-only button shows both. The last element in the row
  // never gets one, or the content would sit off-centre.
  const gap = { marginEnd: sizeStyle.iconLabelGap };
  const leadingIconGap = label ? gap : null;

  const checkRevealStyle: CSSStyle<ViewStyle> = {
    width: showCheck ? sizeStyle.iconSize + sizeStyle.iconLabelGap : 0,
    transitionProperty: ['width'],
    ...transition,
  };

  // When the container is translucent (disabled), the fill is drawn by the
  // overlay below, so the base view stays transparent.
  const hasContainerOverlay = colors.containerOpacity < 1;
  const containerBackground = hasContainerOverlay
    ? undefined
    : colors.containerColor;

  return (
    <Animated.View
      testID={getTestID(testID, 'container')}
      style={[
        styles.container,
        {
          height: sizeStyle.containerHeight,
          minWidth: sizeStyle.minWidth,
          backgroundColor: containerBackground,
        },
        shapeStyle,
        focusRingStyle,
        style,
      ]}
    >
      {hasContainerOverlay ? (
        // Opacity is applied as a style so PlatformColor container values
        // (Android dynamic themes) render at the MD3 disabled 12% correctly.
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: colors.containerColor,
              opacity: colors.containerOpacity,
            },
          ]}
        />
      ) : null}
      <TouchableRipple
        borderless
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        background={background}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role={multiSelect ? 'checkbox' : 'radio'}
        style={[styles.ripple, Platform.OS === 'web' && styles.webNoOutline]}
        theme={theme}
        testID={testID}
      >
        <View
          style={[
            styles.content,
            {
              height: sizeStyle.containerHeight,
              paddingStart: sizeStyle.leadingSpace,
              paddingEnd: sizeStyle.trailingSpace,
              opacity: colors.contentOpacity,
            },
          ]}
        >
          {swapsIcon ? (
            <View style={gap}>
              <Animated.View
                testID={getTestID(testID, 'icon')}
                style={getShownStyle(!showCheck)}
              >
                <Icon
                  source={icon}
                  size={sizeStyle.iconSize}
                  color={colors.contentColor}
                />
              </Animated.View>
              <Animated.View
                testID={getTestID(testID, 'check-icon')}
                style={[StyleSheet.absoluteFill, getShownStyle(showCheck)]}
              >
                <Icon
                  source="check"
                  size={sizeStyle.iconSize}
                  color={colors.contentColor}
                />
              </Animated.View>
            </View>
          ) : null}
          {revealsCheck ? (
            <Animated.View style={[styles.checkReveal, checkRevealStyle]}>
              <Animated.View
                testID={getTestID(testID, 'check-icon')}
                style={[gap, getShownStyle(showCheck)]}
              >
                <Icon
                  source="check"
                  size={sizeStyle.iconSize}
                  color={colors.contentColor}
                />
              </Animated.View>
            </Animated.View>
          ) : null}
          {icon && !swapsIcon ? (
            <View testID={getTestID(testID, 'icon')} style={leadingIconGap}>
              <Icon
                source={icon}
                size={sizeStyle.iconSize}
                color={colors.contentColor}
              />
            </View>
          ) : null}
          {label ? (
            <Text
              variant={sizeStyle.labelVariant}
              selectable={false}
              numberOfLines={1}
              ellipsizeMode="tail"
              maxFontSizeMultiplier={labelMaxFontSizeMultiplier}
              style={[styles.label, { color: colors.contentColor }, labelStyle]}
              testID={getTestID(testID, 'label')}
            >
              {label}
            </Text>
          ) : null}
        </View>
      </TouchableRipple>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    // `flex: 1` (basis 0), like `SegmentedButtonItem`, so every button in the
    // group is the same width. With a content-derived basis the row reflows
    // whenever the selection check appears or disappears, which reads as the
    // buttons snapping to a new width on every tap.
    flex: 1,
    overflow: 'hidden',
  },
  ripple: {
    flex: 1,
  },
  webNoOutline: {
    outlineStyle: 'solid',
    outlineWidth: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkReveal: {
    alignItems: 'flex-start',
    overflow: 'hidden',
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default ConnectedButton;
