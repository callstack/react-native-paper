import * as React from 'react';
import { StyleSheet, View } from 'react-native';

import Animated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import {
  connectedButtonPositions,
  type ConnectedButtonProps as Props,
} from './types';
import {
  getConnectedButtonColors,
  getConnectedButtonSizeStyle,
  getTestID,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import Icon from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

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
  hitSlop,
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
  const cornerRadius = useSharedValue(restRadius);

  // Selection-check behaviour matches `SegmentedButtonItem` for migration
  // parity: the check scales in and takes the place of the leading icon on a
  // labelled button, while an icon-only button keeps its icon alongside it.
  const showCheck = Boolean(checked && showSelectedCheck);
  const showIcon = Boolean(icon) && !(label && showCheck);
  const checkScale = useSharedValue(showCheck ? 1 : 0);

  const reduceMotion = useReduceMotion();
  const springConfig = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.fast.spatial),
      reduceMotion: reduceMotion ? ReduceMotion.Always : ReduceMotion.Never,
    }),
    [theme.motion.spring.fast.spatial, reduceMotion]
  );

  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    // The shared values are already initialised to their resting state, so skip
    // the mount render and only animate subsequent selection / size changes.
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    cornerRadius.value = withSpring(restRadius, springConfig);
    checkScale.value = withSpring(showCheck ? 1 : 0, springConfig);
  }, [restRadius, showCheck, cornerRadius, checkScale, springConfig]);

  const handlePressIn = React.useCallback(() => {
    // Pressed takes precedence over selection: even a selected (fully-rounded)
    // button morphs its connected corner while pressed, matching the M3 spec.
    cornerRadius.value = withSpring(pressedRadius, springConfig);
  }, [cornerRadius, pressedRadius, springConfig]);
  const handlePressOut = React.useCallback(() => {
    cornerRadius.value = withSpring(restRadius, springConfig);
  }, [cornerRadius, restRadius, springConfig]);

  // The "outer" side keeps the group's fully-rounded radius; the "inner" side
  // (the connected edge) morphs between the resting, pressed and selected radii.
  const animateStart =
    position === connectedButtonPositions.last ||
    position === connectedButtonPositions.middle;
  const animateEnd =
    position === connectedButtonPositions.first ||
    position === connectedButtonPositions.middle;

  const animatedShapeStyle = useAnimatedStyle(() => {
    const morph = cornerRadius.value;
    const startRadius = animateStart ? morph : outerRadius;
    const endRadius = animateEnd ? morph : outerRadius;
    return {
      borderTopStartRadius: startRadius,
      borderBottomStartRadius: startRadius,
      borderTopEndRadius: endRadius,
      borderBottomEndRadius: endRadius,
    };
  }, [animateStart, animateEnd, outerRadius]);

  const checkIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
  }));

  // Whichever of the two mounts scales in from `checkScale`, which still holds
  // the *previous* selection state on the render that swaps them — the effect
  // above only retargets it after paint. So on select the check grows from 0,
  // and on deselect the leading icon grows from 0 as `checkScale` unwinds.
  // Do not "simplify" this to a constant: without it the icon pops back in at
  // full size the moment the check unmounts. Icon-only buttons show both at
  // once and never swap, so they stay at scale 1.
  const hasLabel = Boolean(label);
  const leadingIconStyle = useAnimatedStyle(
    () => ({
      transform: [{ scale: hasLabel ? 1 - checkScale.value : 1 }],
    }),
    [hasLabel]
  );

  // A gap is needed before the label, and between the check and the leading
  // icon when an icon-only button shows both.
  const iconGap =
    label || (showCheck && showIcon)
      ? { marginEnd: sizeStyle.iconLabelGap }
      : null;

  // When the container is translucent (disabled), the fill is drawn by the
  // overlay below, so the base view stays transparent.
  const containerBackground =
    colors.containerOpacity < 1 ? undefined : colors.containerColor;

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
        animatedShapeStyle,
        style,
      ]}
    >
      {colors.containerOpacity < 1 ? (
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
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        background={background}
        aria-label={ariaLabel}
        aria-disabled={disabled}
        aria-checked={checked}
        role={multiSelect ? 'checkbox' : 'radio'}
        hitSlop={hitSlop}
        style={styles.ripple}
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
          {showCheck ? (
            <Animated.View
              testID={getTestID(testID, 'check-icon')}
              style={[iconGap, checkIconStyle]}
            >
              <Icon
                source="check"
                size={sizeStyle.iconSize}
                color={colors.contentColor}
              />
            </Animated.View>
          ) : null}
          {showIcon ? (
            <Animated.View
              testID={getTestID(testID, 'icon')}
              style={[iconGap, leadingIconStyle]}
            >
              <Icon
                source={icon}
                size={sizeStyle.iconSize}
                color={colors.contentColor}
              />
            </Animated.View>
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
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    overflow: 'hidden',
  },
  ripple: {
    flex: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    flexShrink: 1,
    textAlign: 'center',
  },
});

export default ConnectedButton;
