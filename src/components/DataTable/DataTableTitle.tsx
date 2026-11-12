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
  ACTIVATABLE_ROLES,
} from '../../utils/hasTouchHandler';
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
   * Function to execute on press. Without it, and without `onLongPress`,
   * `onPressIn` or `onPressOut`, the title renders as a plain container and is
   * not exposed as a control. To make it unreachable at runtime, pass `disabled`
   * rather than removing this handler: switching between having a handler and
   * not having one renders another element and remounts children.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute immediately when a touch is engaged, before `onPressOut` and `onPress`.
   */
  onPressIn?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute when a touch is released.
   */
  onPressOut?: (e: GestureResponderEvent) => void;
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

  // `role` wins over `accessibilityRole` on every platform, so resolve it the
  // same way instead of testing both.
  const effectiveRole: string | undefined = rest.role ?? rest.accessibilityRole;
  const claimsActivatable =
    effectiveRole !== undefined && ACTIVATABLE_ROLES.includes(effectiveRole);

  // Without a touch handler and without an explicit disabled this is a column
  // heading, not a control, so it renders as a plain View. A Pressable is wrong
  // here either way: it is a tab stop that does nothing on web, and on native it
  // claims the touch and swallows presses meant for whatever wraps it.
  const isControl =
    hasTouchHandler({ onPress, onLongPress, onPressIn, onPressOut }) ||
    Boolean(disabledProp);

  if (!isControl) {
    return (
      <View
        {...rest}
        // Pressable defaults this to true, so keep it to preserve any role and
        // state the caller set.
        accessible={rest.accessible !== false}
        // Drop the claim, keep the element so its label is still announced.
        role={claimsActivatable ? 'none' : rest.role}
        // A consumer role of button makes react-native-web render a real
        // <button>, which is tabbable by default. Nothing to activate here.
        focusable={rest.focusable ?? false}
        style={[...containerStyle, style]}
      >
        {icon}

        <Text
          style={cellStyle}
          numberOfLines={numberOfLines}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {children}
        </Text>
      </View>
    );
  }

  return (
    <Pressable
      {...rest}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabledProp}
      style={[...containerStyle, style]}
    >
      {icon}

      <Text
        style={cellStyle}
        numberOfLines={numberOfLines}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </Text>
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
