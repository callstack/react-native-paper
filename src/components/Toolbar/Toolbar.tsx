import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToolbarTokens } from './tokens';
import type { ColorScheme, Orientation, Variant } from './tokens';
import {
  getSpacing,
  resolveContainerColor,
  resolveElevation,
  withToolbarChildColors,
} from './utils';
import { useInternalTheme } from '../../core/theming';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { ThemeProp } from '../../types';
import Surface from '../Surface';

export type Props = {
  /**
   * Content of the toolbar, typically a row of `IconButton`s.
   */
  children: React.ReactNode;
  /**
   * `floating` is a self-positioned pill (like a `FAB`); `docked` is a
   * full-width bar anchored to the bottom edge, extending into safe-area
   * insets automatically. Defaults to `floating`.
   */
  variant?: Variant;
  /**
   * Layout axis for `floating` (`docked` is always horizontal, per spec).
   * Defaults to `horizontal`.
   */
  orientation?: Orientation;
  /**
   * Role-color preset. Sets default colors on direct, mode-less `IconButton`/`Button`
   * children, unless they already set their own. Defaults to `standard`.
   */
  colorScheme?: ColorScheme;
  /**
   * Override the container (background) color.
   */
  containerColor?: ColorValue;
  /**
   * Style for positioning `floating`'s pill, or overriding `docked`'s
   * default anchoring.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the row/column wrapping `children`. Overrides the default
   * padding/gap.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes.
   */
  testID?: string;
  /**
   * Accessibility label for the toolbar group. `children` still need
   * their own `aria-label`s.
   */
  'aria-label'?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
  ref?: React.RefObject<View>;
};

/**
 * A toolbar groups icon actions behind a shared surface.
 *
 * It comes in two `variant`s: `floating`, a self-positioned pill anchored wherever you place it
 * (similar to a `FAB`), and `docked`, a full-width bar pinned to the bottom edge that extends
 * into the safe-area insets automatically. A floating toolbar can also be laid out vertically
 * via `orientation`.
 *
 * The `colorScheme` prop controls how contained `IconButton`/`Button` children are colored. By
 * default: `standard` keeps them neutral against a surface-colored container, while `vibrant`
 * gives the toolbar itself a bold, primary-tinted container and switches selected/unselected
 * children to matching vibrant colors, making the toolbar stand out as a focal point on the
 * screen.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet, View } from 'react-native';
 * import { Toolbar, IconButton } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <View style={styles.anchor} pointerEvents="box-none">
 *     <Toolbar>
 *       <IconButton icon="format-bold" aria-label="Bold" onPress={() => {}} />
 *       <IconButton icon="format-italic" aria-label="Italic" onPress={() => {}} />
 *       <IconButton icon="format-underline" aria-label="Underline" onPress={() => {}} />
 *     </Toolbar>
 *   </View>
 * );
 *
 * const styles = StyleSheet.create({
 *   anchor: {
 *     position: 'absolute',
 *     left: 0,
 *     right: 0,
 *     bottom: 24,
 *     alignItems: 'center',
 *   },
 * });
 *
 * export default MyComponent;
 * ```
 */
const Toolbar = ({
  children,
  variant = 'floating',
  orientation = 'horizontal',
  colorScheme = 'standard',
  containerColor,
  style,
  contentContainerStyle,
  testID = 'toolbar',
  'aria-label': ariaLabel,
  theme: themeOverrides,
  ref,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const insets = useSafeAreaInsets();

  const isDocked = variant === 'docked';
  const isVertical = !isDocked && orientation === 'vertical';

  const backgroundColor = resolveContainerColor({
    theme,
    colorScheme,
    containerColor,
  });
  const borderRadius = resolveCornerRadius(
    theme,
    isDocked
      ? ToolbarTokens.docked.containerShape
      : ToolbarTokens.floating.containerShape
  );
  const elevation = resolveElevation({ isDocked });

  // Cross-axis thickness is always the spec value (64dp); insets are
  // never mixed in, so the icon band never grows/shrinks with the safe
  // area (`docked` extends into insets separately, see
  // `dockedInsetMargin` below).
  const thickness = isDocked
    ? ToolbarTokens.docked.containerHeight
    : ToolbarTokens.floating.containerHeight;
  const { paddingLeading, paddingTrailing, gap } = getSpacing({ variant });

  // `docked`'s content row is a fixed 64dp band (see `thickness` above),
  // so top/bottom padding would clip taller children (e.g. a `Button`
  // label). `floating` has no fixed-height row, so it pads every side.
  const contentPadding = isDocked
    ? { paddingLeft: paddingLeading, paddingRight: paddingTrailing }
    : {
        paddingTop: paddingLeading,
        paddingBottom: paddingLeading,
        paddingLeft: paddingLeading,
        paddingRight: paddingTrailing,
      };
  // `docked`'s background extends into the bottom/left/right insets while
  // its content stays clear of them, via margin outside `Surface`'s own
  // fixed-size box (so `Surface` grows to wrap it, keeping the icon row's
  // 64dp band untouched). `floating` doesn't self-anchor, so it has no
  // insets to account for.
  const dockedInsetMargin = isDocked
    ? {
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,
      }
    : null;

  const pill = (
    <Surface
      // Keying on the axis forces a fresh mount when `floating`'s pill
      // jumps position (e.g. bottom-center to a vertical trailing edge),
      // avoiding a stale shadow "ghost" that `Surface`'s iOS shadow can
      // leave at the old frame when an existing view is resized in place.
      key={isVertical ? 'vertical' : 'horizontal'}
      ref={isDocked ? undefined : ref}
      elevation={elevation}
      style={[
        {
          backgroundColor,
          borderRadius,
        },
        !isDocked &&
          (isVertical ? { width: thickness } : { height: thickness }),
        isDocked && styles.dockedFill,
        styles.content,
        !isDocked && style,
      ]}
      testID={testID}
    >
      <View
        role="toolbar"
        aria-label={ariaLabel}
        style={[
          styles.content,
          isVertical ? styles.column : styles.row,
          isDocked && { height: thickness },
          { ...contentPadding, gap },
          dockedInsetMargin,
          contentContainerStyle,
        ]}
      >
        {withToolbarChildColors({ children, theme, colorScheme })}
      </View>
    </Surface>
  );

  // `floating` is positioned directly via `style` (like `FAB`'s `Shell`),
  // no wrapper needed. `docked` anchors to its nearest positioned
  // ancestor, which needs the wrapping `View` below.
  if (!isDocked) {
    return pill;
  }

  return (
    <View
      ref={ref}
      // `box-none` so this anchoring box (spanning the full width of its
      // ancestor) doesn't intercept touches outside the bar itself.
      pointerEvents="box-none"
      style={[styles.dockedContainer, style]}
      testID={`${testID}-container`}
    >
      {pill}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dockedFill: {
    width: '100%',
  },
  // `docked` anchors absolutely rather than reserving layout space, so
  // consumers pad their own content to avoid it, same as `floating`.
  dockedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Toolbar;
