import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, LayoutChangeEvent } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppbarAction from './AppbarAction';
import AppbarContent from './AppbarContent';
import type { Props } from './types';
import {
  APPBAR_ACTION_SIZE,
  APPBAR_TITLE_IMAGE_HEIGHT,
  getActionsWidth,
  getAppbarHeight,
  getAppbarSearchWidth,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { getAppbarBorders } from '../Appbar/utils';
import Searchbar from '../Searchbar';
import Surface from '../Surface';

const Appbar = ({
  actions = [],
  contentStyle,
  isScrolled = false,
  leadingAction,
  onTitlePress,
  safeAreaInsets,
  searchBar,
  statusBarHeight,
  style,
  subtitle,
  subtitleProps,
  testID = 'appbar',
  theme: themeOverrides,
  title,
  titleAlignment = 'leading',
  titleImage,
  titleProps,
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
  const centered = titleAlignment === 'center';

  const handleSearchSlotLayout = React.useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const nextWidth = nativeEvent.layout.width;

      setSearchSlotWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth
      );
    },
    []
  );

  const renderLeadingAction = () =>
    leadingAction ? (
      <AppbarAction action={leadingAction} leading theme={theme} />
    ) : null;

  const renderActions = () =>
    actions.map((action) => (
      <AppbarAction
        key={action.key ?? action['aria-label']}
        action={action}
        theme={theme}
      />
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
        {renderLeadingAction()}
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
        <View style={styles.trailingActions}>{renderActions()}</View>
      </View>
    );
  };

  const contentProps =
    variant !== 'search'
      ? {
          alignment: titleAlignment,
          contentStyle,
          onTitlePress,
          subtitle,
          subtitleProps,
          testID: `${testID}-content`,
          theme,
          title,
          titleImage,
          titleProps,
          variant,
        }
      : null;

  const renderFlexibleTitleImage = () =>
    titleImage ? (
      <View
        testID={`${testID}-content-title-image`}
        aria-hidden
        importantForAccessibility="no-hide-descendants"
        style={styles.flexibleTitleImage}
      >
        {titleImage}
      </View>
    ) : null;

  const renderSmallAppbar = () => {
    if (!contentProps) {
      return null;
    }

    if (centered || titleImage) {
      const sideWidth = Math.max(
        leadingAction ? APPBAR_ACTION_SIZE : 0,
        getActionsWidth(actions)
      );

      return (
        <View style={styles.smallRow}>
          <View style={[styles.side, { width: sideWidth }]}>
            {renderLeadingAction()}
          </View>
          <AppbarContent {...contentProps} />
          <View
            style={[styles.side, styles.trailingActions, { width: sideWidth }]}
          >
            {renderActions()}
          </View>
        </View>
      );
    }

    return (
      <View style={styles.smallRow}>
        {renderLeadingAction()}
        <AppbarContent
          {...contentProps}
          style={leadingAction ? styles.titleWithLeading : styles.titleLeading}
        />
        <View style={styles.trailingActions}>{renderActions()}</View>
      </View>
    );
  };

  const renderFlexibleAppbar = () => {
    if (!contentProps) {
      return null;
    }

    const sideWidth = Math.max(
      leadingAction ? APPBAR_ACTION_SIZE : 0,
      getActionsWidth(actions)
    );

    return (
      <View style={styles.flexibleContainer}>
        {titleImage ? (
          <View style={styles.controlsRow}>
            <View style={[styles.side, { width: sideWidth }]}>
              {renderLeadingAction()}
            </View>
            {renderFlexibleTitleImage()}
            <View
              style={[
                styles.side,
                styles.trailingActions,
                { width: sideWidth },
              ]}
            >
              {renderActions()}
            </View>
          </View>
        ) : (
          <View style={styles.controlsRow}>
            {renderLeadingAction()}
            <View style={styles.trailingActions}>{renderActions()}</View>
          </View>
        )}
        <AppbarContent {...contentProps} titleImage={undefined} />
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
        {...rest}
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
  titleLeading: {
    marginStart: 12,
  },
  titleWithLeading: {
    marginStart: 4,
  },
  flexibleTitleImage: {
    flex: 1,
    height: APPBAR_TITLE_IMAGE_HEIGHT,
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
