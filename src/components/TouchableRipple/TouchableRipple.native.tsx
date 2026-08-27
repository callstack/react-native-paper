import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type {
  PressableAndroidRippleConfig,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
  ColorValue,
  Insets,
  LayoutChangeEvent,
} from 'react-native';

import type { PressableProps } from './Pressable';
import { Pressable } from './Pressable';
import { getTouchableRippleColors } from './utils';
import { SettingsContext } from '../../core/settings';
import type { Settings } from '../../core/settings';
import { useInternalTheme } from '../../core/theming';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../types';
import hasTouchHandler from '../../utils/hasTouchHandler';

const ANDROID_VERSION_LOLLIPOP = 21;
const ANDROID_VERSION_PIE = 28;

const { minInteractiveSize } = tokens.md.sys.state;

/**
 * The underlay fills the touchable absolutely and has no radius of its own, so
 * it paints square corners over a rounded one. A clipping ancestor used to hide
 * that, and those ancestors have to stop clipping for the expansion to work.
 */
const getUnderlayShape = (style: StyleProp<ViewStyle>): ViewStyle => {
  const flat = StyleSheet.flatten(style);

  if (!flat) {
    return {};
  }

  const {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopStartRadius,
    borderTopEndRadius,
    borderBottomStartRadius,
    borderBottomEndRadius,
  } = flat;

  return {
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomLeftRadius,
    borderBottomRightRadius,
    borderTopStartRadius,
    borderTopEndRadius,
    borderBottomStartRadius,
    borderBottomEndRadius,
  };
};

/**
 * Slop needed to bring a rendered size up to `minInteractiveSize`. Expands
 * outside the bounds rather than resizing, so a 40dp state layer keeps its 40dp
 * and gains 4dp per side. Returns undefined when the size is already enough, so
 * that case does not re-render.
 * @see https://developer.android.com/develop/ui/compose/accessibility/api-defaults
 */
const getExpansion = (width: number, height: number): Insets | undefined => {
  // A collapsed touchable would otherwise claim 24dp of slop around a point
  // where nothing is drawn.
  if (width === 0 || height === 0) {
    return undefined;
  }

  const horizontal = Math.max(0, (minInteractiveSize - width) / 2);
  const vertical = Math.max(0, (minInteractiveSize - height) / 2);

  if (horizontal === 0 && vertical === 0) {
    return undefined;
  }

  return {
    top: vertical,
    bottom: vertical,
    left: horizontal,
    right: horizontal,
  };
};

export type Props = PressableProps & {
  borderless?: boolean;
  background?: PressableAndroidRippleConfig;
  centered?: boolean;
  disabled?: boolean;
  onPress?: (e: GestureResponderEvent) => void | null;
  onLongPress?: (e: GestureResponderEvent) => void;
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
  rippleColor?: ColorValue;
  underlayColor?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  ref?: React.Ref<View>;
  theme?: ThemeProp;
};

const TouchableRipple = ({
  style,
  background,
  borderless = false,
  disabled: disabledProp,
  rippleColor,
  underlayColor,
  children,
  theme: themeOverrides,
  hitSlop,
  onLayout,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { rippleEffectEnabled } = React.useContext<Settings>(SettingsContext);

  const { onPress, onLongPress, onPressIn, onPressOut } = rest;

  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });

  const disabled = disabledProp || !hasPassedTouchHandler;

  const [expansion, setExpansion] = React.useState<Insets | undefined>(
    undefined
  );

  // Gates whether the measurement is applied, not whether it happens. RN emits
  // onLayout on mount and on layout change, so a touchable that mounts disabled,
  // or with a caller hitSlop, gets no event once that goes away and would stay
  // small. A caller hitSlop wins while it is set; `null` counts as set, it means
  // "no slop".
  const shouldExpand = hitSlop === undefined && !disabled;

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      onLayout?.(event);

      const { width, height } = event.nativeEvent.layout;
      const next = getExpansion(width, height);

      setExpansion((current) => {
        // Nothing changed, so a big enough touchable does not re-render.
        if (current === next) {
          return current;
        }
        if (
          current &&
          next &&
          current.top === next.top &&
          current.bottom === next.bottom &&
          current.left === next.left &&
          current.right === next.right
        ) {
          return current;
        }
        return next;
      });
    },
    [onLayout]
  );

  const { calculatedRippleColor, calculatedUnderlayColor } =
    getTouchableRippleColors({
      theme,
      rippleColor,
      underlayColor,
    });

  // Use foreground ripple on Android P+ to ensure visibility.
  // Background ripple requires the view to have a background drawable,
  // which isn't always present. Foreground ripple needs overflow: 'hidden'
  // to stay within bounds.
  // https://github.com/facebook/react-native/issues/6480
  const useForeground =
    Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_PIE;

  if (TouchableRipple.supported) {
    const androidRipple = rippleEffectEnabled
      ? (background ?? {
          color: calculatedRippleColor,
          borderless,
          foreground: useForeground,
        })
      : undefined;

    return (
      <Pressable
        {...rest}
        ref={ref}
        disabled={disabled}
        hitSlop={shouldExpand ? expansion : hitSlop}
        onLayout={handleLayout}
        style={[useForeground && styles.overflowHidden, style]}
        android_ripple={androidRipple}
      >
        {React.Children.only(children)}
      </Pressable>
    );
  }

  return (
    <Pressable
      {...rest}
      ref={ref}
      disabled={disabled}
      hitSlop={shouldExpand ? expansion : hitSlop}
      onLayout={handleLayout}
      style={[borderless && styles.overflowHidden, style]}
    >
      {({ pressed }) => (
        <>
          {pressed && rippleEffectEnabled && (
            <View
              testID="touchable-ripple-underlay"
              style={[
                styles.underlay,
                getUnderlayShape(style),
                { backgroundColor: calculatedUnderlayColor },
              ]}
            />
          )}
          {React.Children.only(children)}
        </>
      )}
    </Pressable>
  );
};

TouchableRipple.supported =
  Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP;

const styles = StyleSheet.create({
  overflowHidden: {
    overflow: 'hidden',
  },
  underlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
  },
});

export default TouchableRipple;
