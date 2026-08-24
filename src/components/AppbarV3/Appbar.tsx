import { StyleSheet, View } from 'react-native';
import type { ColorValue } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppbarAction from './AppbarAction';
import AppbarContent from './AppbarContent';
import type { Props } from './types';
import {
  APPBAR_ACTION_SIZE,
  APPBAR_TITLE_IMAGE_HEIGHT,
  getActionsWidth,
  getAppbarHeight,
} from './utils';
import { useInternalTheme } from '../../core/theming';
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
  const theme = useInternalTheme(themeOverrides);
  const detectedInsets = useSafeAreaInsets();
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
  const resolvedTitleColor = titleColor ?? theme.colors.onSurface;
  const resolvedSubtitleColor = subtitleColor ?? theme.colors.onSurfaceVariant;
  const hasSubtitle = typeof subtitle === 'string' && subtitle.length > 0;
  const minHeight = getAppbarHeight(variant, hasSubtitle);
  const topInset = statusBarHeight ?? safeAreaInsets?.top ?? detectedInsets.top;
  const leftInset = safeAreaInsets?.left ?? detectedInsets.left;
  const rightInset = safeAreaInsets?.right ?? detectedInsets.right;
  const horizontalInset = Math.max(leftInset, rightInset);
  const borderRadius = getAppbarBorders(restStyle);
  const centered = titleAlignment === 'center';

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
