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

import Animated, { cubicBezier, type CSSStyle } from 'react-native-reanimated';

import type { ColumnLayoutProps } from './columns';
import { useAlignStyles, useColumn } from './DataTableColumnsContext';
import { DataTableContext } from './DataTableContext';
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
import type { ThemeProp } from '../../theme/types';
import hasTouchHandler, {
  getNonControlA11yProps,
} from '../../utils/hasTouchHandler';
import { mergeDataSetProps, useFocusRing } from '../../utils/useFocusRing';
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
     * Function to execute on press. Without it, `onLongPress`, `onPressIn`,
     * `onPressOut` and `disabled`, the title renders as a plain view that isn't
     * a control, and a press goes to its parent. To turn the title off at
     * runtime, pass `disabled` instead of removing the handler: going between
     * having a handler or `disabled` and having neither renders another element
     * and remounts the children.
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
  hitSlop,
  onFocus,
  onBlur,
  ...rest
}: Props) => {
  const {
    android_ripple,
    android_disableSound,
    delayLongPress,
    pressRetentionOffset,
    unstable_pressDelay,
    testOnly_pressed,
    ...viewProps
  } = rest;

  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();

  const { direction } = useLocale();
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

  const columnLabel = getElementLabel({ 'aria-label': ariaLabel, children });

  const registerColumnLabel =
    React.useContext(DataTableContext)?.registerColumnLabel;
  const columnIndex = resolved.index;

  React.useLayoutEffect(() => {
    if (registerColumnLabel && columnIndex != null && columnLabel != null) {
      return registerColumnLabel(columnIndex, columnLabel);
    }

    return undefined;
  }, [registerColumnLabel, columnIndex, columnLabel]);

  const describable = !React.Children.toArray(children).some(
    React.isValidElement
  );

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

  const iconStyle: CSSStyle<ViewStyle> = {
    transform: [{ rotate: sortDirection === 'ascending' ? '0deg' : '180deg' }],
    transitionProperty: 'transform',
    transitionDuration: reduceMotion ? 0 : theme.motion.duration.short3,
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };

  const icon = sortDirection ? (
    <Animated.View
      style={[styles.icon, iconStyle]}
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
  // hook directly, above the early returns below. Off whenever the title can't
  // be pressed.
  // Inward: titles sit side by side in the header row, like the rows below.
  const { target: focusTarget, ring: focusRing } = useFocusRing(
    !isInteractive,
    theme.colors.secondary,
    'inward'
  );

  const role =
    Platform.OS === 'web'
      ? ('columnheader' as const)
      : isControl
        ? ('button' as const)
        : undefined;

  const structuralProps = {
    role,
    // Native has no column-header semantics, so a title that is not already a
    // pressable has to opt in, or its text is absorbed by whichever ancestor
    // happens to be focusable and the columns read as one run-on stop.
    accessible:
      Platform.OS === 'web' || !(isControl || describable) ? undefined : true,
    ...webAriaProps({
      'aria-colindex': resolved.index == null ? undefined : resolved.index + 1,
      // `none` is what advertises a column as sortable but currently unsorted.
      'aria-sort':
        sortDirection ??
        (hasPassedTouchHandler ? ('none' as const) : undefined),
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

  const focusHandlers = {
    onFocus: (e: Parameters<NonNullable<typeof onFocus>>[0]) => {
      focusTarget.onFocus?.(e);
      onFocus?.(e);
    },
    onBlur: (e: Parameters<NonNullable<typeof onBlur>>[0]) => {
      focusTarget.onBlur?.();
      onBlur?.(e);
    },
  };

  const pressProps = {
    onPress,
    onLongPress,
    onPressIn,
    onPressOut,
    // `false`, not undefined, when enabled: on iOS and Android, Pressable
    // lets a caller's aria-disabled stand when `disabled` is undefined
    disabled: Boolean(disabledProp),
    // a touch target only for something that can be pressed
    hitSlop: isInteractive ? hitSlop : undefined,
    android_disableSound,
    delayLongPress,
    pressRetentionOffset,
    unstable_pressDelay,
    testOnly_pressed,
  };

  const content = (
    <>
      {icon}

      {React.isValidElement(children) ? (
        // An element, such as a select-all Checkbox, renders as written, like
        // in DataTable.Cell. Inside a Text it would be inlined into the text:
        // clipped by `numberOfLines` and unreachable on iOS.
        children
      ) : (
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
      )}
    </>
  );

  if (!isControl) {
    return (
      <View
        {...structuralProps}
        {...viewProps}
        // taken out of `rest` for the ring, so passed on here unchanged
        onFocus={onFocus}
        onBlur={onBlur}
        // Drops an activatable role a caller passed, since nothing answers to
        // it. `accessible` goes in as `false` when the title left it unset, so
        // a title holding its own controls stays out of the way.
        {...getNonControlA11yProps({
          ...structuralProps,
          accessible: structuralProps.accessible ?? false,
          ...viewProps,
        })}
        style={containerStyle}
      >
        {content}
      </View>
    );
  }

  if (Platform.OS === 'web') {
    const { 'aria-label': buttonLabel, ...headerProps } = structuralProps;
    const { testID, ...buttonProps } = viewProps;

    return (
      <View
        {...headerProps}
        testID={testID}
        style={[styles.header, resolved.style, style]}
      >
        <Pressable
          {...buttonProps}
          {...pressProps}
          {...focusHandlers}
          {...mergeDataSetProps(buttonProps, focusRing.dataSetProps)}
          role="button"
          aria-label={buttonLabel}
          style={[
            styles.container,
            styles.button,
            alignStyles.container,
            ...focusRing.style,
          ]}
        >
          {content}
        </Pressable>
      </View>
    );
  }

  return (
    <Pressable
      {...structuralProps}
      {...viewProps}
      {...pressProps}
      // Like Switch: a ripple drawable owns the focused state, so Android does
      // not add its grey default focus highlight on top of the ring. A
      // caller's own `android_ripple` wins, and it owns the state just as well.
      android_ripple={android_ripple ?? { color: 'transparent' }}
      {...focusHandlers}
      {...mergeDataSetProps(viewProps, focusRing.dataSetProps)}
      style={[...containerStyle, ...focusRing.style]}
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

  header: {
    flexDirection: 'row',
  },

  button: {
    flexGrow: 1,
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
