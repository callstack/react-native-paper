import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, ViewProps } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppbarButton from './AppbarButton';
import AppbarContent from './AppbarContent';
import type { Props } from './types';
import {
  APPBAR_HEADLINE_IMAGE_HEIGHT,
  APPBAR_ICON_BUTTON_SIZE,
  APPBAR_SEARCH_MAX_WIDTH,
  getAppbarBorders,
  getAppbarHeight,
  getTrailingActionsWidth,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import Searchbar from '../Searchbar';
import Surface from '../Surface';

const EMPTY_TRAILING_ACTIONS = [] as const;

/**
 * A Material Design app bar for displaying a page headline, navigation, and
 * contextual actions. Appbar supports small, medium flexible, large flexible,
 * and search variants. Its surface color automatically changes when content
 * has scrolled, and it accounts for safe-area insets.
 *
 * ## Variants
 *
 * | `variant` | Purpose |
 * | --- | --- |
 * | `small` | A compact 64dp app bar with a one-line headline. |
 * | `medium-flexible` | A flexible app bar with a two-line headline and optional subtitle or image. |
 * | `large-flexible` | A prominent flexible app bar with a two-line headline and optional subtitle or image. |
 * | `search` | An app bar containing a centered Paper `Searchbar`. |
 *
 * ## Main props
 *
 * | Prop | Description |
 * | --- | --- |
 * | `headline` | Required accessible headline for every non-search variant. |
 * | `subtitle` | Optional supporting text for written headlines. |
 * | `headlineAlignment` | Aligns headline content to `leading` (default) or `center`. |
 * | `headlineImage` | Replaces the visible small headline, or appears above a flexible headline. Images should fit within 32dp height. |
 * | `onHeadlinePress` | Makes the headline area interactive; use `headlinePressableProps` for its accessibility state. |
 * | `leadingButton` | A back button (`{ type: 'back' }`) or standard icon-button configuration. Use `decorate` to wrap it with components such as `Tooltip` or `Menu`. |
 * | `trailingActions` | Standard icon-button configurations, or exactly one `filled`/`tonal` action with optional `wide` width. Every action requires a stable `key` and `aria-label`, and can use `decorate` to wrap its resolved button. |
 * | `searchBar` | Required for the `search` variant. Accepts Paper `Searchbar` props except `mode`, `elevation`, `showDivider`, and `theme`. |
 * | `isScrolled` | Uses `surfaceContainer` instead of `surface` when content has scrolled. |
 * | `safeAreaInsets` | Overrides detected top, left, or right safe-area insets. |
 * | `statusBarHeight` | Overrides only the automatic top inset. |
 * | `contentStyle` | Styles the headline and subtitle area. |
 * | `style` | Styles the app bar and can override its background color. |
 *
 * ## Migrating from the compound API
 *
 * `Appbar.Header`, `Appbar.Content`, `Appbar.Action`, and
 * `Appbar.BackAction` have been removed. Render one `Appbar` and provide its
 * headline, leading button, and trailing actions as props. The former
 * `mode="medium"` and `mode="large"` values are now
 * `variant="medium-flexible"` and `variant="large-flexible"`; centered
 * content uses `headlineAlignment="center"`.
 *
 * ## Usage
 *
 * ### Small app bar
 * ```js
 * import * as React from 'react';
 * import { Appbar } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <Appbar
 *     variant="small"
 *     headline="Inbox"
 *     leadingButton={{ type: 'back', onPress: () => {} }}
 *     trailingActions={[
 *       {
 *         key: 'search',
 *         icon: 'magnify',
 *         'aria-label': 'Search',
 *         onPress: () => {},
 *       },
 *       {
 *         key: 'more',
 *         icon: 'dots-vertical',
 *         'aria-label': 'More options',
 *         onPress: () => {},
 *       },
 *     ]}
 *   />
 * );
 *
 * export default MyComponent;
 * ```
 *
 * ### Decorated action
 * ```js
 * import { Appbar, Tooltip } from 'react-native-paper';
 *
 * <Appbar
 *   variant="small"
 *   headline="Files"
 *   trailingActions={[
 *     {
 *       key: 'print',
 *       icon: 'printer',
 *       'aria-label': 'Print',
 *       onPress: () => {},
 *       decorate: (button) => (
 *         <Tooltip title="Print shortcut">{button}</Tooltip>
 *       ),
 *     },
 *   ]}
 * />
 * ```
 *
 * ### Flexible app bar
 * ```js
 * <Appbar
 *   variant="large-flexible"
 *   headline="Photos"
 *   subtitle="Summer holiday"
 *   headlineAlignment="center"
 *   isScrolled={isScrolled}
 * />
 * ```
 *
 * ### Search app bar
 * ```js
 * <Appbar
 *   variant="search"
 *   leadingButton={{ type: 'back', onPress: () => {} }}
 *   searchBar={{
 *     placeholder: 'Search messages',
 *     value: query,
 *     onChangeText: setQuery,
 *   }}
 * />
 * ```
 */
const Appbar = ({
  contentStyle,
  headline,
  headlineAlignment = 'leading',
  headlineImage,
  headlinePressableProps,
  headlineProps,
  isScrolled = false,
  leadingButton,
  onHeadlinePress,
  safeAreaInsets,
  searchBar,
  statusBarHeight,
  style,
  subtitle,
  subtitleProps,
  testID,
  theme: themeOverrides,
  trailingActions = EMPTY_TRAILING_ACTIONS,
  variant,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const detectedInsets = useSafeAreaInsets();
  const { customBackground, restStyle, borderRadius } = React.useMemo(() => {
    const flattenedStyle = StyleSheet.flatten(style);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    const resolvedStyle = (flattenedStyle || {}) as Exclude<
      typeof flattenedStyle,
      number
    > & {
      backgroundColor?: ColorValue;
    };
    const { backgroundColor, ...remainingStyle } = resolvedStyle;

    return {
      customBackground: backgroundColor,
      restStyle: remainingStyle,
      borderRadius: getAppbarBorders(remainingStyle),
    };
  }, [style]);
  const backgroundColor =
    customBackground ??
    (isScrolled ? theme.colors.surfaceContainer : theme.colors.surface);
  const hasSubtitle = typeof subtitle === 'string' && subtitle.length > 0;
  const minHeight = getAppbarHeight(variant, hasSubtitle);
  const topInset = statusBarHeight ?? safeAreaInsets?.top ?? detectedInsets.top;
  const leftInset = safeAreaInsets?.left ?? detectedInsets.left;
  const rightInset = safeAreaInsets?.right ?? detectedInsets.right;
  const horizontalInset = Math.max(leftInset, rightInset);
  const centered = headlineAlignment === 'center';
  const sideWidth = Math.max(
    leadingButton ? APPBAR_ICON_BUTTON_SIZE : 0,
    getTrailingActionsWidth(trailingActions)
  );
  const sideStyle = React.useMemo(() => ({ width: sideWidth }), [sideWidth]);
  const surfaceStyle = React.useMemo(
    () => [
      {
        backgroundColor,
        paddingTop: topInset,
        paddingHorizontal: horizontalInset,
      },
      borderRadius,
    ],
    [backgroundColor, borderRadius, horizontalInset, topInset]
  );
  const appbarStyle = React.useMemo(
    () => [styles.appbar, { backgroundColor, minHeight }, restStyle],
    [backgroundColor, minHeight, restStyle]
  );
  const resolvedSearchInputStyle = React.useMemo(
    () => [{ color: theme.colors.onSurface }, searchBar?.inputStyle],
    [searchBar?.inputStyle, theme.colors.onSurface]
  );
  const searchBackgroundColor = isScrolled
    ? theme.colors.surfaceContainerHighest
    : theme.colors.surfaceContainer;
  const resolvedSearchStyle = React.useMemo(
    () => [
      styles.searchBar,
      { backgroundColor: searchBackgroundColor },
      searchBar?.style,
    ],
    [searchBackgroundColor, searchBar?.style]
  );
  const {
    accessibilityLabel: _accessibilityLabel,
    accessibilityRole: _accessibilityRole,
    accessible: _accessible,
    'aria-label': _ariaLabel,
    role: _role,
    ...viewProps
  } = rest as ViewProps;

  const renderLeadingButton = () =>
    leadingButton ? (
      <AppbarButton button={leadingButton} leading theme={theme} />
    ) : null;

  const renderTrailingActions = () =>
    trailingActions.map((action) => (
      <AppbarButton key={action.key} button={action} theme={theme} />
    ));

  const renderSearchAppbar = () => {
    if (!searchBar) {
      return null;
    }

    const {
      inputStyle: _searchInputStyle,
      style: _searchStyle,
      testID: searchTestID = `${testID}-search`,
      ...searchProps
    } = searchBar;

    return (
      <View style={styles.searchRow}>
        {renderLeadingButton()}
        <View testID={`${testID}-search-slot`} style={styles.searchSlot}>
          <View
            testID={`${testID}-search-width-limiter`}
            style={styles.searchWidthLimiter}
          >
            <Searchbar
              {...searchProps}
              aria-label={searchProps['aria-label'] ?? searchProps.placeholder}
              inputStyle={resolvedSearchInputStyle}
              placeholderTextColor={
                searchProps.placeholderTextColor ??
                theme.colors.onSurfaceVariant
              }
              mode="bar"
              elevation={0}
              testID={searchTestID}
              style={resolvedSearchStyle}
              theme={theme}
            />
          </View>
        </View>
        <View style={styles.trailingActions}>{renderTrailingActions()}</View>
      </View>
    );
  };

  const contentProps =
    variant !== 'search'
      ? {
          alignment: headlineAlignment,
          contentStyle,
          headline,
          headlineImage,
          headlinePressableProps,
          headlineProps,
          onHeadlinePress,
          subtitle,
          subtitleProps,
          testID: `${testID}-content`,
          theme,
          variant,
        }
      : null;

  const renderFlexibleHeadlineImage = () =>
    headlineImage ? (
      <View
        testID={`${testID}-content-headline-image`}
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        style={styles.flexibleHeadlineImage}
      >
        {headlineImage}
      </View>
    ) : null;

  const renderSmallAppbar = () => {
    if (!contentProps) {
      return null;
    }

    if (centered || headlineImage) {
      return (
        <View style={styles.smallRow}>
          <View style={[styles.side, sideStyle]}>{renderLeadingButton()}</View>
          <AppbarContent {...contentProps} />
          <View style={[styles.side, styles.trailingActions, sideStyle]}>
            {renderTrailingActions()}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.smallRow}>
        {renderLeadingButton()}
        <AppbarContent
          {...contentProps}
          style={
            leadingButton ? styles.headlineWithLeading : styles.headlineLeading
          }
        />
        <View style={styles.trailingActions}>{renderTrailingActions()}</View>
      </View>
    );
  };

  const renderFlexibleAppbar = () => {
    if (!contentProps) {
      return null;
    }

    return (
      <View style={styles.flexibleContainer}>
        {headlineImage ? (
          <View style={styles.controlsRow}>
            <View style={[styles.side, sideStyle]}>
              {renderLeadingButton()}
            </View>
            {renderFlexibleHeadlineImage()}
            <View style={[styles.side, styles.trailingActions, sideStyle]}>
              {renderTrailingActions()}
            </View>
          </View>
        ) : (
          <View style={styles.controlsRow}>
            {renderLeadingButton()}
            <View style={styles.trailingActions}>
              {renderTrailingActions()}
            </View>
          </View>
        )}
        <AppbarContent {...contentProps} headlineImage={undefined} />
      </View>
    );
  };

  return (
    <Surface
      ref={ref}
      testID={`${testID}-root-layer`}
      elevation={0}
      container
      theme={theme}
      style={surfaceStyle}
    >
      <View {...viewProps} testID={testID} style={appbarStyle}>
        {variant === 'search'
          ? renderSearchAppbar()
          : variant === 'small'
            ? renderSmallAppbar()
            : renderFlexibleAppbar()}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  appbar: {
    paddingHorizontal: 4,
  },
  smallRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchSlot: {
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  searchBar: {
    width: '100%',
  },
  searchWidthLimiter: {
    width: '100%',
    maxWidth: APPBAR_SEARCH_MAX_WIDTH,
  },
  flexibleContainer: {
    flex: 1,
  },
  controlsRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  trailingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  side: {
    flexDirection: 'row',
  },
  headlineLeading: {
    marginStart: 12,
  },
  headlineWithLeading: {
    marginStart: 4,
  },
  flexibleHeadlineImage: {
    flex: 1,
    height: APPBAR_HEADLINE_IMAGE_HEIGHT,
    maxWidth: '100%',
    marginTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

const MemoizedAppbar = React.memo(Appbar);

export default MemoizedAppbar;

// @component-docs ignore-next-line
export { MemoizedAppbar as Appbar };
