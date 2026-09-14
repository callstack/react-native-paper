import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import Animated from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import { NavigationRailContext } from './context';
import { NavigationRailTokens } from './tokens';
import type { Alignment } from './tokens';
import { clampExpandedWidth, getTransition } from './utils';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import type { ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Navigation destinations, typically `NavigationRail.Item` elements.
   */
  children: React.ReactNode;
  /**
   * Whether the rail is expanded (icon + label rows, 220–360dp wide) or
   * collapsed (stacked icon + label, 96dp wide). The width animates on change.
   */
  expanded?: boolean;
  /**
   * Width of the expanded rail. Clamped to the spec range of 220–360dp.
   */
  expandedWidth?: number;
  /**
   * Vertical placement of the destinations. Defaults to `top`.
   */
  alignment?: Alignment;
  /**
   * Content pinned above the destinations, e.g. a menu button and a `FAB`.
   */
  header?: React.ReactNode;
  /**
   * Whether the expanded rail floats above the content behind a scrim instead
   * of pushing it. The rail keeps its collapsed footprint in the layout.
   */
  overlay?: boolean;
  /**
   * Called when the scrim is pressed. Only used with `overlay`.
   */
  onDismiss?: () => void;
  /**
   * TestID for the scrim rendered behind the rail.
   */
  overlayTestID?: string;
  /**
   * Whether expanding and collapsing is animated. Defaults to `true`.
   */
  animated?: boolean;
  /**
   * Container color override. Defaults to `theme.colors.surface` when
   * collapsed and `theme.colors.surfaceContainer` when expanded.
   */
  containerColor?: ColorValue;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

const { rail, colors } = NavigationRailTokens;
const scrimAlpha = tokens.md.sys.scrim.alpha;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const justifyContent = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
} as const satisfies Record<Alignment, ViewStyle['justifyContent']>;

/**
 * Navigation rails let people switch between UI views on mid-sized devices.
 * The rail is placed at the start edge of the screen and can be collapsed
 * (icons with short labels) or expanded (icons with full labels).
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet, View } from 'react-native';
 * import { FAB, IconButton, NavigationRail } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [expanded, setExpanded] = React.useState(false);
 *   const [active, setActive] = React.useState('inbox');
 *
 *   return (
 *     <View style={styles.screen}>
 *       <NavigationRail
 *         expanded={expanded}
 *         header={
 *           <>
 *             <IconButton
 *               animated
 *               icon={expanded ? 'menu-open' : 'menu'}
 *               onPress={() => setExpanded((e) => !e)}
 *             />
 *             <FAB.Extended
 *               icon="pencil"
 *               label="Compose"
 *               expanded={expanded}
 *               onPress={() => {}}
 *             />
 *           </>
 *         }
 *       >
 *         <NavigationRail.Item
 *           icon="inbox-outline"
 *           activeIcon="inbox"
 *           label="Inbox"
 *           badge={12}
 *           active={active === 'inbox'}
 *           onPress={() => setActive('inbox')}
 *         />
 *         <NavigationRail.Item
 *           icon="send-outline"
 *           activeIcon="send"
 *           label="Sent"
 *           active={active === 'sent'}
 *           onPress={() => setActive('sent')}
 *         />
 *       </NavigationRail>
 *     </View>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   screen: { flex: 1, flexDirection: 'row' },
 * });
 *
 * export default MyComponent;
 * ```
 *
 * ## Theming
 * Customize by overriding these `theme.colors` roles:
 * - `surface`: collapsed container
 * - `surfaceContainer`: expanded container
 * - `secondaryContainer` / `onSecondaryContainer`: active indicator / active icon
 * - `secondary`: active label (collapsed), focus indicator
 * - `onSurfaceVariant`: inactive icon and label
 * - `scrim`: backdrop behind the floating rail (`overlay`)
 */
const NavigationRail = ({
  children,
  expanded = false,
  expandedWidth = rail.expandedMinWidth,
  alignment = 'top',
  header,
  overlay = false,
  onDismiss,
  overlayTestID,
  animated = true,
  containerColor,
  style,
  testID,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const reduceMotion = useReduceMotion();
  const { width: windowWidth } = useWindowDimensions();

  const targetWidth = clampExpandedWidth(expandedWidth);
  const width = expanded ? targetWidth : rail.collapsedWidth;
  const floating = overlay && expanded;
  const endRadius = floating ? resolveCornerRadius(theme, rail.modalShape) : 0;
  const backgroundColor =
    containerColor ??
    theme.colors[expanded ? colors.expandedContainer : colors.container];

  const context = React.useMemo(
    () => ({ expanded, expandedWidth: targetWidth, animated }),
    [expanded, targetWidth, animated]
  );

  const panel = (
    <Animated.View
      style={[
        styles.panel,
        overlay && styles.floating,
        {
          width,
          backgroundColor,
          borderTopEndRadius: endRadius,
          borderBottomEndRadius: endRadius,
        },
        getTransition(
          theme,
          [
            'width',
            'borderTopEndRadius',
            'borderBottomEndRadius',
            // Reanimated can't interpolate PlatformColor / DynamicColorIOS.
            ...(typeof backgroundColor === 'string'
              ? (['backgroundColor'] as const)
              : []),
          ],
          { instant: !animated || reduceMotion }
        ),
        style,
      ]}
      testID={testID}
      {...rest}
    >
      {header ? <View style={styles.header}>{header}</View> : null}
      <ScrollView
        style={styles.items}
        contentContainerStyle={[
          styles.itemsContent,
          { justifyContent: justifyContent[alignment] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <NavigationRailContext.Provider value={context}>
          {children}
        </NavigationRailContext.Provider>
      </ScrollView>
    </Animated.View>
  );

  if (!overlay) {
    return panel;
  }

  return (
    <View style={styles.anchor}>
      <AnimatedPressable
        onPress={onDismiss}
        role="button"
        aria-label="Close navigation rail"
        importantForAccessibility="no"
        style={[
          styles.scrim,
          expanded ? styles.scrimShown : styles.scrimHidden,
          { width: windowWidth, backgroundColor: theme.colors.scrim },
          getTransition(theme, ['opacity'], { instant: !animated }),
        ]}
        testID={overlayTestID}
      />
      {panel}
    </View>
  );
};

const styles = StyleSheet.create({
  anchor: {
    width: rail.collapsedWidth,
    height: '100%',
    zIndex: 1,
  },
  scrim: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
  },
  scrimShown: {
    opacity: scrimAlpha,
    pointerEvents: 'auto',
  },
  scrimHidden: {
    opacity: 0,
    pointerEvents: 'none',
  },
  panel: {
    height: '100%',
    paddingTop: rail.topSpace,
    overflow: 'hidden',
  },
  floating: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
  },
  header: {
    alignItems: 'flex-start',
    gap: rail.itemSpace,
    marginBottom: rail.headerSpace,
    paddingHorizontal: rail.itemHorizontalPadding,
  },
  items: {
    flex: 1,
  },
  itemsContent: {
    flexGrow: 1,
    gap: rail.itemSpace,
    paddingHorizontal: rail.itemHorizontalPadding,
  },
});

export default NavigationRail;

// @component-docs ignore-next-line
export { NavigationRail };
