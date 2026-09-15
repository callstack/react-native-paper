import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type { ColorValue, StyleProp, ViewProps, ViewStyle } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ToolbarTokens } from './tokens';
import type { ColorScheme, Orientation, Variant } from './tokens';
import { ToolbarColorContext } from './ToolbarColorContext';
import { getSpacing, resolveContainerColor, resolveElevation } from './utils';
import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

export type Props = Omit<ViewProps, 'style'> & {
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
   * Role-color preset. Sets default colors on descendant, mode-less
   * `IconButton`/`Button`s, unless they already set their own. Defaults to
   * `standard`.
   */
  colorScheme?: ColorScheme;
  /**
   * Override the container (background) color.
   */
  containerColor?: ColorValue;
  /**
   * Style for positioning `floating`'s pill, or overriding `docked`'s
   * default anchoring.
   *
   * This doesn't support all `View` style properties: background color and
   * border radius should be specified via `containerColor` and the
   * `variant`'s shape token instead - see `Surface`'s `style` prop.
   */
  style?: StyleProp<SurfaceStyle>;
  /**
   * Style for the row/column wrapping `children`. Overrides the default
   * padding/gap, and, for consumers who need full control, the fixed
   * cross-axis thickness (64dp per spec) as well.
   */
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * TestID used for testing purposes. Lands on the same node as `ref` (see
   * below) - the `Surface` pill for `floating`, or the outer positioning
   * wrapper `View` for `docked`.
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
  /**
   * For `floating`, the ref lands on the `Surface` pill itself; for
   * `docked`, it lands on the outer positioning wrapper `View`, not the
   * pill inside it.
   */
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
  testID,
  'aria-label': ariaLabel,
  theme: themeOverrides,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const insets = useSafeAreaInsets();
  const toolbarColorContextValue = React.useMemo(
    () => ({ theme, colorScheme }),
    [theme, colorScheme]
  );

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

  // Cross-axis thickness is always the spec value, insets are never mixed in,
  // so the icon band never grows/shrinks with the safe area (`docked` extends
  // into insets separately, see`dockedInsetMargin` below).
  const thickness = isDocked
    ? ToolbarTokens.docked.containerHeight
    : ToolbarTokens.floating.containerHeight;
  const { paddingLeading, paddingTrailing, paddingTop, paddingBottom, gap } =
    getSpacing({ variant });

  // `docked`'s content row is a fixed band (see `thickness` above),
  // so top/bottom padding would clip taller children.
  // `floating` has no fixed-height row, so it pads every side.
  const contentPadding = isDocked
    ? { paddingLeft: paddingLeading, paddingRight: paddingTrailing }
    : {
        paddingTop,
        paddingBottom,
        paddingLeft: paddingLeading,
        paddingRight: paddingTrailing,
      };
  const dockedInsetMargin = isDocked
    ? {
        marginBottom: insets.bottom,
        marginLeft: insets.left,
        marginRight: insets.right,
      }
    : null;

  const pill = (
    <Surface
      {...(!isDocked ? rest : null)}
      ref={isDocked ? undefined : ref}
      elevation={elevation}
      backgroundColor={backgroundColor}
      borderRadius={borderRadius}
      style={[
        isDocked && styles.dockedFill,
        styles.content,
        !isDocked && style,
      ]}
      testID={isDocked ? undefined : testID}
    >
      <View
        role="toolbar"
        aria-label={ariaLabel}
        style={[
          styles.content,
          isVertical ? styles.column : styles.row,
          { ...contentPadding, gap },
          dockedInsetMargin,
          // Cross-axis thickness is the spec default (see `thickness` above).
          // It's set here and not on `Surface` on purpose: `Surface` just
          // wraps this `View` and has no size of its own, so it hugs
          // whatever size we give this `View`. Setting an explicit
          // width/height directly on `Surface` used to leave a stale shadow
          // "ghost" on iOS whenever `floating`'s `orientation` flipped the axis.
          isDocked && { height: thickness },
          !isDocked &&
            (isVertical ? { width: thickness } : { height: thickness }),
          contentContainerStyle,
        ]}
      >
        <ToolbarColorContext.Provider value={toolbarColorContextValue}>
          {children}
        </ToolbarColorContext.Provider>
      </View>
    </Surface>
  );

  if (!isDocked) {
    return pill;
  }

  return (
    <View
      {...rest}
      ref={ref}
      pointerEvents="box-none"
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      style={[styles.dockedContainer, style as StyleProp<ViewStyle>]}
      testID={testID}
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
  dockedContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Toolbar;
