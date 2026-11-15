import * as React from 'react';
import { PixelRatio, Pressable, StyleSheet, View } from 'react-native';
import type {
  GestureResponderEvent,
  PressableProps,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler, {
  getNonControlA11yProps,
} from '../../utils/hasTouchHandler';
import { mergeDataSetProps, useFocusRing } from '../../utils/useFocusRing';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Text from '../Typography/Text';

export type Props = PressableProps & {
  /**
   * Text content of the `DataTableTitle`.
   */
  children: React.ReactNode;
  /**
   * Align the text to the right. Generally monetary or number fields are aligned to right.
   */
  numeric?: boolean;
  /**
   * Direction of sorting. An arrow indicating the direction is displayed when this is given.
   */
  sortDirection?: 'ascending' | 'descending';
  /**
   * The number of lines to show.
   */
  numberOfLines?: number;
  /**
   * Function to execute on press. Without it, `onLongPress`, `onPressIn`,
   * `onPressOut` and `disabled`, the title renders as a plain view that isn't a
   * control, and a press goes to its parent. To turn the title off at runtime,
   * pass `disabled` instead of removing the handler: going between having a
   * handler or `disabled` and having neither renders another element and
   * remounts the children.
   */
  onPress?: (e: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  /**
   * Text content style of the `DataTableTitle`.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

/**
 * A component to display title in table header.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { DataTable } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <DataTable>
 *     <DataTable.Header>
 *       <DataTable.Title
 *         sortDirection='descending'
 *       >
 *         Dessert
 *       </DataTable.Title>
 *       <DataTable.Title numeric>Calories</DataTable.Title>
 *       <DataTable.Title numeric>Fat (g)</DataTable.Title>
 *     </DataTable.Header>
 *   </DataTable>
 * );
 *
 * export default MyComponent;
 * ```
 *
 * @extends Pressable props https://reactnative.dev/docs/Pressable#props
 */

const DataTableTitle = ({
  numeric,
  children,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled: disabledProp,
  sortDirection,
  textStyle,
  style,
  theme: themeOverrides,
  numberOfLines = 1,
  maxFontSizeMultiplier,
  hitSlop,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();

  const { direction } = useLocale();

  const spin = useSharedValue(sortDirection === 'ascending' ? 0 : 180);

  React.useEffect(() => {
    spin.value = withTiming(sortDirection === 'ascending' ? 0 : 180, {
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      reduceMotion: reduceMotion ? ReduceMotion.Always : ReduceMotion.Never,
    });
  }, [reduceMotion, sortDirection, spin]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const textColor = theme.colors.onSurface;

  const alphaTextColor = theme.colors.onSurfaceVariant;

  const icon = sortDirection ? (
    <Animated.View style={[styles.icon, animatedStyle]}>
      <MaterialCommunityIcon
        name="arrow-up"
        size={16}
        color={textColor}
        direction={direction}
      />
    </Animated.View>
  ) : null;

  const cellStyle = [
    styles.cell,
    // height must scale with numberOfLines
    { maxHeight: 24 * PixelRatio.getFontScale() * numberOfLines },
    // if numberOfLines causes wrap, center is lost. Align directly, sensitive to numeric and RTL
    numberOfLines > 1
      ? numeric
        ? direction === 'rtl'
          ? styles.leftText
          : styles.rightText
        : styles.centerText
      : {},
    sortDirection ? styles.sorted : { color: alphaTextColor },
    textStyle,
  ];

  const containerStyle = [styles.container, numeric && styles.right];

  // Without a touch handler and without `disabled` this is a column heading,
  // not a control, so it renders as a plain View instead of a Pressable that
  // would be announced as a disabled control.
  const hasPassedTouchHandler = hasTouchHandler({
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
  });
  const isControl = hasPassedTouchHandler || Boolean(disabledProp);
  const isInteractive = hasPassedTouchHandler && !disabledProp;

  // A title with a touch handler is a control, so it gets the keyboard focus
  // ring. It is a plain `Pressable`, not a `TouchableRipple`, so it calls the
  // hook directly, above the early return below. Off whenever the title can't
  // be pressed.
  // Inward: titles sit side by side in the header row, like the rows below.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    !isInteractive,
    theme.colors.secondary,
    'inward'
  );

  const content = (
    <>
      {icon}

      <Text
        style={cellStyle}
        numberOfLines={numberOfLines}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </Text>
    </>
  );

  if (!isControl) {
    return (
      <View
        {...rest}
        // taken out of `rest` for the ring, so passed on here unchanged
        onFocus={onFocus}
        onBlur={onBlur}
        {...getNonControlA11yProps(rest)}
        style={[...containerStyle, style]}
      >
        {content}
      </View>
    );
  }

  return (
    <Pressable
      // Like Switch: a ripple drawable owns the focused state, so Android does
      // not add its grey default focus highlight on top of the ring. Before
      // `rest`, so a caller's own `android_ripple` wins, and it owns the state
      // just as well.
      android_ripple={{ color: 'transparent' }}
      {...rest}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      // `false`, not undefined, when enabled: on iOS and Android, Pressable
      // lets a caller's aria-disabled stand when `disabled` is undefined
      disabled={Boolean(disabledProp)}
      // a touch target only for something that can be pressed
      hitSlop={isInteractive ? hitSlop : undefined}
      onFocus={(e) => {
        focusTarget.onFocus?.(e);
        onFocus?.(e);
      }}
      onBlur={(e) => {
        focusTarget.onBlur?.();
        onBlur?.(e);
      }}
      {...mergeDataSetProps(rest, focusRing.dataSetProps)}
      style={[...containerStyle, style, ...focusRing.style]}
    >
      {content}
    </Pressable>
  );
};

DataTableTitle.displayName = 'DataTable.Title';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignContent: 'center',
    paddingVertical: 12,
  },

  rightText: {
    textAlign: 'right',
  },

  leftText: {
    textAlign: 'left',
  },

  centerText: {
    textAlign: 'center',
  },

  right: {
    justifyContent: 'flex-end',
  },

  cell: {
    lineHeight: 24,
    fontSize: 12,
    fontWeight: '500',
    alignItems: 'center',
  },

  sorted: {
    marginLeft: 8,
  },

  icon: {
    height: 24,
    justifyContent: 'center',
  },
});

export default DataTableTitle;

// @component-docs ignore-next-line
export { DataTableTitle };
