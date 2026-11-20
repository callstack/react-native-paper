import * as React from 'react';
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Badge from '../Badge';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type TabsVariant = 'primary' | 'secondary';

export type TabItem = {
  /**
   * Unique key for the tab, used to determine the active tab.
   */
  key: string;
  /**
   * Text label shown on the tab.
   */
  label: string;
  /**
   * Icon shown above the label. Only rendered in the `primary` variant.
   */
  icon?: IconSource;
  /**
   * Badge to show on the tab. `true` renders a small dot.
   */
  badge?: string | number | boolean;
  /**
   * Disables the tab so it can't be selected.
   */
  disabled?: boolean;
  /**
   * Accessibility label for the tab. Falls back to `label`.
   */
  accessibilityLabel?: string;
  /**
   * testID used to build the tab's test identifiers.
   */
  testID?: string;
};

export type Props = {
  /**
   * Tabs to render.
   */
  tabs: TabItem[];
  /**
   * Key of the currently active tab (controlled).
   */
  activeKey: string;
  /**
   * Callback fired with the tab key when a tab is pressed.
   */
  onChange: (key: string) => void;
  /**
   * Material 3 tab variant. `primary` stacks an optional icon above the label;
   * `secondary` shows the label only.
   *
   * @default 'primary'
   */
  variant?: TabsVariant;
  /**
   * When `true`, tabs size to their content and scroll horizontally instead of
   * sharing the available width equally.
   *
   * @default false
   */
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
};

/**
 * A Material 3 tabs component that organises content across a horizontal set
 * of tabs, with primary (icon + label) and secondary (label only) variants,
 * an active indicator, badges and an optional scrollable layout.
 */
const Tabs = ({
  tabs,
  activeKey,
  onChange,
  variant = 'primary',
  scrollable = false,
  style,
  testID = 'tabs',
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;

  const activeColor = colors?.primary;
  const inactiveColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : colors.onSurface;
  const dividerColor = theme.isV3
    ? theme.colors.surfaceVariant
    : colors.backdrop;

  const renderTab = (tab: TabItem) => {
    const focused = tab.key === activeKey;
    const disabled = tab.disabled === true;
    const color = disabled
      ? theme.isV3
        ? theme.colors.onSurfaceDisabled
        : inactiveColor
      : focused
      ? activeColor
      : inactiveColor;
    const itemTestID = tab.testID ?? `${testID}-${tab.key}`;
    const showIcon = variant === 'primary' && tab.icon != null;
    const hasBadge = tab.badge !== undefined && tab.badge !== false;

    return (
      <TouchableRipple
        key={tab.key}
        testID={itemTestID}
        onPress={() => onChange(tab.key)}
        disabled={disabled}
        accessibilityRole="tab"
        accessibilityState={{ selected: focused, disabled }}
        accessibilityLabel={tab.accessibilityLabel ?? tab.label}
        style={[
          styles.tab,
          scrollable ? styles.tabScrollable : styles.tabFixed,
        ]}
      >
        <View style={styles.tabContent}>
          <View style={styles.labelRow}>
            {showIcon ? (
              <Icon source={tab.icon as IconSource} size={24} color={color} />
            ) : null}
            <Text
              testID={`${itemTestID}-label`}
              variant="titleSmall"
              numberOfLines={1}
              style={[
                styles.label,
                showIcon && styles.labelWithIcon,
                { color },
              ]}
            >
              {tab.label}
            </Text>
            {hasBadge ? (
              <Badge
                testID={`${itemTestID}-badge`}
                visible
                size={typeof tab.badge === 'boolean' ? 6 : 16}
                style={styles.badge}
              >
                {typeof tab.badge === 'boolean' ? undefined : tab.badge}
              </Badge>
            ) : null}
          </View>
          <View
            testID={focused ? `${itemTestID}-indicator` : undefined}
            style={[
              styles.indicator,
              variant === 'secondary' && styles.indicatorFull,
              { backgroundColor: focused ? activeColor : 'transparent' },
            ]}
          />
        </View>
      </TouchableRipple>
    );
  };

  const content = tabs.map(renderTab);

  return (
    <View
      testID={testID}
      accessibilityRole="tablist"
      style={[styles.container, { borderBottomColor: dividerColor }, style]}
    >
      {scrollable ? (
        <ScrollView
          testID={`${testID}-scroll`}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.row}>{content}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  row: {
    flexDirection: 'row',
  },
  scrollContent: {
    flexDirection: 'row',
  },
  tab: {
    justifyContent: 'flex-end',
  },
  tabFixed: {
    flex: 1,
  },
  tabScrollable: {
    minWidth: 90,
  },
  tabContent: {
    alignItems: 'center',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  label: {
    textAlign: 'center',
  },
  labelWithIcon: {
    marginLeft: 8,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -12,
  },
  indicator: {
    height: 3,
    width: '60%',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  indicatorFull: {
    width: '100%',
  },
});

export default Tabs;
