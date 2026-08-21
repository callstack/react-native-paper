import { StyleSheet, View } from 'react-native';
import type { ColorValue, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppbarAction from './AppbarAction';
import AppbarContent from './AppbarContent';
import type { AppbarAction as AppbarActionConfig, Props } from './types';
import { APPBAR_ACTION_SIZE, getActionsWidth, getAppbarHeight } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { Theme } from '../../types';
import { getAppbarBorders } from '../Appbar/utils';
import Surface from '../Surface';

const Appbar = ({
  actions = [],
  contentStyle,
  isScrolled = false,
  leadingAction,
  onTitlePress,
  safeAreaInsets,
  statusBarHeight,
  style,
  subtitle,
  subtitleColor,
  subtitleMaxFontSizeMultiplier,
  subtitleStyle,
  testID = 'appbar',
  theme: themeOverrides,
  title,
  titleAlignment = 'leading',
  titleColor,
  titleDisabled,
  titleImage,
  titleMaxFontSizeMultiplier,
  titleRef,
  titleStyle,
  variant,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides) as Theme;
  const detectedInsets = useSafeAreaInsets();
  const flattenedStyle = StyleSheet.flatten(style);
  const { backgroundColor: customBackground, ...restStyle } = (flattenedStyle ||
    {}) as Exclude<typeof flattenedStyle, number> & {
    backgroundColor?: ColorValue;
  };
  const backgroundColor =
    customBackground ??
    (isScrolled ? theme.colors.surfaceContainer : theme.colors.surface);
  const resolvedTitleColor = titleColor ?? theme.colors.onSurface;
  const resolvedSubtitleColor = subtitleColor ?? theme.colors.onSurfaceVariant;
  const hasSubtitle = typeof subtitle === 'string' && subtitle.length > 0;
  const minHeight = getAppbarHeight(variant, hasSubtitle);
  const topInset = statusBarHeight ?? safeAreaInsets?.top ?? detectedInsets.top;
  const leftInset = safeAreaInsets?.left ?? detectedInsets.left;
  const rightInset = safeAreaInsets?.right ?? detectedInsets.right;
  const horizontalInset = Math.max(leftInset, rightInset);
  const borderRadius = getAppbarBorders(restStyle as ViewStyle);
  const centered = titleAlignment === 'center';

  const renderLeadingAction = () =>
    leadingAction ? (
      <AppbarAction action={leadingAction} leading theme={theme} />
    ) : null;

  const renderActions = () =>
    actions.map((action, index) => (
      <AppbarAction key={action.key ?? index} action={action} theme={theme} />
    ));

  const contentProps = {
    alignment: titleAlignment,
    contentStyle,
    onTitlePress,
    subtitle,
    subtitleColor: resolvedSubtitleColor,
    subtitleMaxFontSizeMultiplier,
    subtitleStyle,
    testID: `${testID}-content`,
    theme,
    title,
    titleColor: resolvedTitleColor,
    titleDisabled,
    titleImage,
    titleMaxFontSizeMultiplier,
    titleRef,
    titleStyle,
    variant,
  };

  const renderSmallAppbar = () => {
    if (centered) {
      const sideWidth = Math.max(
        leadingAction ? APPBAR_ACTION_SIZE : 0,
        getActionsWidth(actions as readonly AppbarActionConfig[])
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

  const renderFlexibleAppbar = () => (
    <View style={styles.flexibleContainer}>
      <View style={styles.controlsRow}>
        {renderLeadingAction()}
        <View style={styles.trailingActions}>{renderActions()}</View>
      </View>
      <AppbarContent {...contentProps} />
    </View>
  );

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
        {variant === 'small' ? renderSmallAppbar() : renderFlexibleAppbar()}
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
});

export default Appbar;

// @component-docs ignore-next-line
export { Appbar };
