import * as React from 'react';
import {
  AccessibilityInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
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

import type { ColumnLayoutProps } from './columns';
import { useAlignStyles, useColumn } from './DataTableColumnsContext';
import {
  LINE_HEIGHT,
  SORT_ICON_SIZE,
  TITLE_FONT_SIZE,
  TITLE_VERTICAL_PADDING,
} from './tokens';
import useReflowedNumberOfLines from './useReflowedNumberOfLines';
import { defaultSortAccessibilityLabels, getElementLabel } from './utils';
import type { SortAccessibilityLabels } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { ThemeProp } from '../../types';
import webAriaProps from '../../utils/webAriaProps';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Text from '../Typography/Text';

export type Props = PressableProps &
  ColumnLayoutProps & {
    /**
     * Text content of the `DataTableTitle`.
     */
    children: React.ReactNode;
    /**
     * Whether the column holds numbers. Numeric content aligns to the end of
     * the column unless `align` says otherwise.
     */
    numeric?: boolean;
    /**
     * Direction of sorting. An arrow indicating the direction is displayed when this is given.
     */
    sortDirection?: 'ascending' | 'descending';
    /**
     * Wording used to announce the sort state, both as part of the column's
     * accessible name and in the announcement made when sorting changes.
     */
    sortAccessibilityLabels?: SortAccessibilityLabels;
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
  sortAccessibilityLabels = defaultSortAccessibilityLabels,
  textStyle,
  style,
  theme: themeOverrides,
  column,
  flex,
  width,
  minWidth,
  maxWidth,
  align,
  numberOfLines,
  maxFontSizeMultiplier,
  'aria-label': ariaLabel,
  // Must not reach the plain view a static title renders as.
  android_ripple,
  android_disableSound,
  delayLongPress,
  pressRetentionOffset,
  unstable_pressDelay,
  testOnly_pressed,
  disabled,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const reduceMotion = useReduceMotion();

  const resolved = useColumn({
    column,
    flex,
    width,
    minWidth,
    maxWidth,
    align,
    numeric,
  });
  const alignStyles = useAlignStyles(resolved.align, resolved.numeric);
  const lines = useReflowedNumberOfLines(numberOfLines);

  const rotation = useSharedValue(sortDirection === 'ascending' ? 0 : 180);
  const isFirstRender = React.useRef(true);

  const { duration, easing } = theme.motion;

  const timingConfig = React.useMemo(
    () => ({
      duration: duration.short3,
      easing: Easing.bezier(...easing.standard),
      reduceMotion: reduceMotion ? ReduceMotion.Always : ReduceMotion.Never,
    }),
    [duration.short3, easing.standard, reduceMotion]
  );

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    rotation.value = withTiming(
      sortDirection === 'ascending' ? 0 : 180,
      timingConfig
    );
  }, [sortDirection, rotation, timingConfig]);

  const columnLabel = getElementLabel({ 'aria-label': ariaLabel, children });

  const previousSortDirection = React.useRef(sortDirection);

  React.useEffect(() => {
    const previous = previousSortDirection.current;
    previousSortDirection.current = sortDirection;

    if (previous === sortDirection || Platform.OS === 'web') {
      return;
    }

    // Only the column that gained a direction announces, or a toggle would
    // announce twice.
    if (!sortDirection || !columnLabel) {
      return;
    }

    AccessibilityInfo.announceForAccessibility(
      `${columnLabel}, ${sortAccessibilityLabels[sortDirection]}`
    );
  }, [sortDirection, columnLabel, sortAccessibilityLabels]);

  const textColor = theme.colors.onSurface;

  const alphaTextColor = theme.colors.onSurfaceVariant;

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const icon = sortDirection ? (
    <Animated.View
      style={[styles.icon, iconAnimatedStyle]}
      {...(Platform.OS === 'web'
        ? { 'aria-hidden': true }
        : { importantForAccessibility: 'no-hide-descendants' as const })}
    >
      <MaterialCommunityIcon
        name="arrow-up"
        size={SORT_ICON_SIZE}
        color={textColor}
        direction={direction}
      />
    </Animated.View>
  ) : null;

  const role =
    Platform.OS === 'web'
      ? ('columnheader' as const)
      : onPress
        ? ('button' as const)
        : undefined;

  const structuralProps = {
    role,
    // Native has no column-header semantics, so a title that is not already a
    // pressable has to opt in, or its text is absorbed by whichever ancestor
    // happens to be focusable and the columns read as one run-on stop.
    accessible: Platform.OS === 'web' ? undefined : true,
    ...webAriaProps({
      'aria-colindex': resolved.index == null ? undefined : resolved.index + 1,
      // `none` is what advertises a column as sortable but currently unsorted.
      'aria-sort': sortDirection ?? (onPress ? ('none' as const) : undefined),
    }),
    'aria-label':
      ariaLabel ??
      // On native the sort state has nowhere to go but the name.
      (Platform.OS !== 'web' && sortDirection && columnLabel
        ? `${columnLabel}, ${sortAccessibilityLabels[sortDirection]}`
        : undefined),
  };

  const containerStyle = [
    styles.container,
    resolved.style,
    alignStyles.container,
    style,
  ];

  const content = (
    <>
      {icon}

      <Text
        style={[
          styles.cell,
          alignStyles.text,
          sortDirection ? styles.sorted : { color: alphaTextColor },
          textStyle,
        ]}
        numberOfLines={lines}
        maxFontSizeMultiplier={maxFontSizeMultiplier}
      >
        {children}
      </Text>
    </>
  );

  if (!onPress) {
    return (
      <View {...structuralProps} {...rest} style={containerStyle}>
        {content}
      </View>
    );
  }

  return (
    <Pressable
      {...structuralProps}
      {...rest}
      onPress={onPress}
      disabled={disabled}
      android_ripple={android_ripple}
      android_disableSound={android_disableSound}
      delayLongPress={delayLongPress}
      pressRetentionOffset={pressRetentionOffset}
      unstable_pressDelay={unstable_pressDelay}
      testOnly_pressed={testOnly_pressed}
      style={containerStyle}
    >
      {content}
    </Pressable>
  );
};

DataTableTitle.displayName = 'DataTable.Title';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: TITLE_VERTICAL_PADDING,
  },

  cell: {
    lineHeight: LINE_HEIGHT,
    fontSize: TITLE_FONT_SIZE,
    fontWeight: '500',
  },

  sorted: {
    marginLeft: 8,
  },

  icon: {
    height: LINE_HEIGHT,
    justifyContent: 'center',
  },
});

export default DataTableTitle;

// @component-docs ignore-next-line
export { DataTableTitle };
