import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, LayoutChangeEvent, ViewProps } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppbarButton from './AppbarButton';
import AppbarContent from './AppbarContent';
import type { Props } from './types';
import {
  APPBAR_HEADLINE_IMAGE_HEIGHT,
  APPBAR_ICON_BUTTON_SIZE,
  getAppbarHeight,
  getAppbarSearchWidth,
  getTrailingActionsWidth,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { getAppbarBorders } from '../Appbar/utils';
import Searchbar from '../Searchbar';
import Surface from '../Surface';

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
  testID = 'appbar',
  theme: themeOverrides,
  trailingActions = [],
  variant,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const detectedInsets = useSafeAreaInsets();
  const [searchSlotWidth, setSearchSlotWidth] = React.useState(0);
  const flattenedStyle = StyleSheet.flatten(style);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
  const resolvedStyle = (flattenedStyle || {}) as Exclude<
    typeof flattenedStyle,
    number
  > & {
    backgroundColor?: ColorValue;
  };
  const { backgroundColor: customBackground, ...restStyle } = resolvedStyle;
  const backgroundColor =
    customBackground ??
    (isScrolled ? theme.colors.surfaceContainer : theme.colors.surface);
  const hasSubtitle = typeof subtitle === 'string' && subtitle.length > 0;
  const minHeight = getAppbarHeight(variant, hasSubtitle);
  const topInset = statusBarHeight ?? safeAreaInsets?.top ?? detectedInsets.top;
  const leftInset = safeAreaInsets?.left ?? detectedInsets.left;
  const rightInset = safeAreaInsets?.right ?? detectedInsets.right;
  const horizontalInset = Math.max(leftInset, rightInset);
  const borderRadius = getAppbarBorders(restStyle);
  const centered = headlineAlignment === 'center';
  const {
    accessibilityLabel: _accessibilityLabel,
    accessibilityRole: _accessibilityRole,
    accessible: _accessible,
    'aria-label': _ariaLabel,
    role: _role,
    ...viewProps
  } = rest as ViewProps;

  const handleSearchSlotLayout = React.useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const nextWidth = nativeEvent.layout.width;

      setSearchSlotWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth
      );
    },
    []
  );

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
      inputStyle: searchInputStyle,
      style: searchStyle,
      testID: searchTestID = `${testID}-search`,
      ...searchProps
    } = searchBar;
    const searchWidth = searchSlotWidth
      ? getAppbarSearchWidth(searchSlotWidth)
      : '100%';
    const searchBackgroundColor = isScrolled
      ? theme.colors.surfaceContainerHighest
      : theme.colors.surfaceContainer;

    return (
      <View style={styles.searchRow}>
        {renderLeadingButton()}
        <View
          testID={`${testID}-search-slot`}
          onLayout={handleSearchSlotLayout}
          style={styles.searchSlot}
        >
          <Searchbar
            {...searchProps}
            aria-label={searchProps['aria-label'] ?? searchProps.placeholder}
            inputStyle={[
              searchInputStyle,
              styles.searchInput,
              { color: theme.colors.onSurface },
            ]}
            placeholderTextColor={
              searchProps.placeholderTextColor ?? theme.colors.onSurfaceVariant
            }
            mode="bar"
            elevation={0}
            testID={searchTestID}
            style={[
              styles.searchBar,
              { backgroundColor: searchBackgroundColor },
              searchStyle,
              { width: searchWidth },
            ]}
            theme={theme}
          />
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
      const sideWidth = Math.max(
        leadingButton ? APPBAR_ICON_BUTTON_SIZE : 0,
        getTrailingActionsWidth(trailingActions)
      );

      return (
        <View style={styles.smallRow}>
          <View style={[styles.side, { width: sideWidth }]}>
            {renderLeadingButton()}
          </View>
          <AppbarContent {...contentProps} />
          <View
            style={[styles.side, styles.trailingActions, { width: sideWidth }]}
          >
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

    const sideWidth = Math.max(
      leadingButton ? APPBAR_ICON_BUTTON_SIZE : 0,
      getTrailingActionsWidth(trailingActions)
    );

    return (
      <View style={styles.flexibleContainer}>
        {headlineImage ? (
          <View style={styles.controlsRow}>
            <View style={[styles.side, { width: sideWidth }]}>
              {renderLeadingButton()}
            </View>
            {renderFlexibleHeadlineImage()}
            <View
              style={[
                styles.side,
                styles.trailingActions,
                { width: sideWidth },
              ]}
            >
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
      style={[
        {
          backgroundColor,
          paddingTop: topInset,
          paddingHorizontal: horizontalInset,
        },
        borderRadius,
      ]}
    >
      <View
        {...viewProps}
        testID={testID}
        style={[styles.appbar, { backgroundColor, minHeight }, restStyle]}
      >
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
    maxWidth: '100%',
  },
  searchInput: {
    textAlign: 'center',
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

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
