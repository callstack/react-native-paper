import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Badge from '../Badge';
import Icon, { IconSource } from '../Icon';
import TouchableRipple from '../TouchableRipple/TouchableRipple';
import Text from '../Typography/Text';

export type NavigationRailLabelType = 'all' | 'selected' | 'none';

export type NavigationRailAlignment = 'top' | 'center' | 'bottom';

export type NavigationRailDestination = {
  /**
   * Unique key for the destination, used to determine the active item.
   */
  key: string;
  /**
   * Text label shown under the icon (subject to the `labeled` prop).
   */
  label?: string;
  /**
   * Icon shown when the destination is active.
   */
  focusedIcon: IconSource;
  /**
   * Icon shown when the destination is inactive. Falls back to `focusedIcon`.
   */
  unfocusedIcon?: IconSource;
  /**
   * Badge to show on the destination. `true` renders a small dot.
   */
  badge?: string | number | boolean;
  /**
   * Accessibility label for the destination. Falls back to `label`.
   */
  accessibilityLabel?: string;
  /**
   * testID used to build the destination's test identifiers.
   */
  testID?: string;
};

export type Props = {
  /**
   * Destinations rendered by the rail (3-7 recommended by Material 3).
   */
  destinations: NavigationRailDestination[];
  /**
   * Key of the currently active destination (controlled).
   */
  activeKey: string;
  /**
   * Callback fired with the destination key when a destination is pressed.
   */
  onChange: (key: string) => void;
  /**
   * When to show destination labels: always (`all`), only the active one
   * (`selected`), or never (`none`).
   *
   * @default 'all'
   */
  labeled?: NavigationRailLabelType;
  /**
   * Vertical alignment of the destinations group within the rail.
   *
   * @default 'top'
   */
  alignment?: NavigationRailAlignment;
  /**
   * Optional header rendered above the destinations, typically a menu button
   * or a floating action button.
   */
  header?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  theme?: ThemeProp;
};

const alignmentToJustify = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
} as const;

/**
 * A vertical Material 3 navigation rail for tablet and desktop layouts. It
 * shows 3-7 destinations along the side of an app, each with an icon, an
 * optional label, and an optional badge, plus an optional header slot.
 */
const NavigationRail = ({
  destinations,
  activeKey,
  onChange,
  labeled = 'all',
  alignment = 'top',
  header,
  style,
  testID = 'navigation-rail',
  theme: themeOverrides,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;

  const activeColor = theme.isV3
    ? theme.colors.onSecondaryContainer
    : colors.primary;
  const inactiveColor = theme.isV3
    ? theme.colors.onSurfaceVariant
    : colors.onSurface;
  const indicatorColor = theme.isV3
    ? theme.colors.secondaryContainer
    : colors.primary;

  return (
    <View
      testID={testID}
      accessibilityRole="menubar"
      style={[styles.rail, { backgroundColor: colors?.surface }, style]}
    >
      {header ? (
        <View testID={`${testID}-header`} style={styles.header}>
          {header}
        </View>
      ) : null}
      <View
        testID={`${testID}-destinations`}
        style={[
          styles.destinations,
          { justifyContent: alignmentToJustify[alignment] },
        ]}
      >
        {destinations.map((destination) => {
          const focused = destination.key === activeKey;
          const color = focused ? activeColor : inactiveColor;
          const itemTestID =
            destination.testID ?? `${testID}-${destination.key}`;
          const showLabel =
            labeled === 'all' || (labeled === 'selected' && focused);
          const icon =
            !focused && destination.unfocusedIcon
              ? destination.unfocusedIcon
              : destination.focusedIcon;
          const hasBadge =
            destination.badge !== undefined && destination.badge !== false;

          return (
            <TouchableRipple
              key={destination.key}
              testID={itemTestID}
              onPress={() => onChange(destination.key)}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={
                destination.accessibilityLabel ?? destination.label
              }
              borderless
              style={styles.item}
            >
              <View style={styles.itemContent}>
                <View
                  testID={
                    focused ? `${itemTestID}-active-indicator` : undefined
                  }
                  style={[
                    styles.indicator,
                    {
                      backgroundColor: focused ? indicatorColor : 'transparent',
                    },
                  ]}
                >
                  <Icon source={icon} size={24} color={color} />
                  {hasBadge ? (
                    <Badge
                      testID={`${itemTestID}-badge`}
                      visible
                      size={typeof destination.badge === 'boolean' ? 6 : 16}
                      style={styles.badge}
                    >
                      {typeof destination.badge === 'boolean'
                        ? undefined
                        : destination.badge}
                    </Badge>
                  ) : null}
                </View>
                {showLabel && destination.label ? (
                  <Text
                    testID={`${itemTestID}-label`}
                    variant="labelMedium"
                    numberOfLines={1}
                    style={[styles.label, { color }]}
                  >
                    {destination.label}
                  </Text>
                ) : null}
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rail: {
    width: 80,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  destinations: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
  },
  item: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  itemContent: {
    alignItems: 'center',
  },
  indicator: {
    width: 56,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 12,
  },
  label: {
    marginTop: 4,
    textAlign: 'center',
  },
});

export default NavigationRail;
