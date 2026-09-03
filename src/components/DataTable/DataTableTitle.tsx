import * as React from 'react';
import { PixelRatio, Pressable, StyleSheet } from 'react-native';
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
import type { ThemeProp } from '../../types';
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
   * Function to execute on press.
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
 */

const DataTableTitle = ({
  numeric,
  children,
  onPress,
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

  return (
    <Pressable
      disabled={!onPress}
      onPress={onPress}
      {...rest}
      style={[styles.container, numeric && styles.right, style]}
    >
      {icon}

      <Text
        style={[
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
        ]}
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
