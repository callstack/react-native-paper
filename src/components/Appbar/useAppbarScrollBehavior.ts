import * as React from 'react';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export type AppbarScrollBehavior = {
  /**
   * Whether the appbar is currently in an elevated state (e.g. scrolled under).
   */
  isElevated: boolean;
  /**
   * Whether the appbar is currently in a collapsed state.
   */
  isCollapsed: boolean;
  /**
   * Current scroll offset in pixels along the vertical axis.
   */
  scrollOffset: number;
  /**
   * Scroll progress toward collapsed state, ranging from 0 (expanded) to 1 (collapsed).
   */
  collapseProgress: number;
  /**
   * Elevation level (0 when flat, 2 when elevated).
   */
  elevation: 0 | 2;
  /**
   * Threshold at which the appbar becomes elevated.
   */
  elevationThreshold: number;
  /**
   * Threshold at which flexible appbars collapse.
   */
  collapseThreshold: number;
};

export type TopAppBarScrollBehavior = AppbarScrollBehavior;

export type UseAppbarScrollBehaviorOptions = {
  /**
   * Threshold in pixels after which the Appbar transitions to elevated (surfaceContainer).
   * Defaults to 0.
   */
  elevationThreshold?: number;
  /**
   * Threshold in pixels after which flexible Appbars collapse into the small height.
   * Defaults to 56.
   */
  collapseThreshold?: number;
};

/**
 * Hook providing scroll-reactive behavior for MD3 Top App Bars.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { ScrollView } from 'react-native';
 * import { Appbar, useAppbarScrollBehavior } from 'react-native-paper';
 *
 * const MyScreen = () => {
 *   const { scrollHandler, scrollBehavior } = useAppbarScrollBehavior();
 *
 *   return (
 *     <>
 *       <Appbar.Header mode="medium-flexible" scrollBehavior={scrollBehavior}>
 *         <Appbar.BackAction onPress={() => {}} />
 *         <Appbar.Content title="Inbox" subtitle="3 unread messages" />
 *       </Appbar.Header>
 *       <ScrollView onScroll={scrollHandler} scrollEventThrottle={16}>
 *         {...}
 *       </ScrollView>
 *     </>
 *   );
 * };
 * ```
 */
export const useAppbarScrollBehavior = ({
  elevationThreshold = 0,
  collapseThreshold = 56,
}: UseAppbarScrollBehaviorOptions = {}) => {
  const [scrollOffset, setScrollOffset] = React.useState(0);
  const [isElevated, setIsElevated] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const onScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = Math.max(0, event.nativeEvent.contentOffset.y);
      setScrollOffset(y);
      setIsElevated(y > elevationThreshold);
      setIsCollapsed(y >= collapseThreshold);
    },
    [elevationThreshold, collapseThreshold]
  );

  const reset = React.useCallback(() => {
    setScrollOffset(0);
    setIsElevated(false);
    setIsCollapsed(false);
  }, []);

  const collapseProgress =
    collapseThreshold > 0
      ? Math.min(1, Math.max(0, scrollOffset / collapseThreshold))
      : scrollOffset > 0
        ? 1
        : 0;

  const scrollBehavior: AppbarScrollBehavior = React.useMemo(
    () => ({
      isElevated,
      isCollapsed,
      scrollOffset,
      collapseProgress,
      elevation: isElevated ? 2 : 0,
      elevationThreshold,
      collapseThreshold,
    }),
    [
      isElevated,
      isCollapsed,
      scrollOffset,
      collapseProgress,
      elevationThreshold,
      collapseThreshold,
    ]
  );

  return {
    onScroll,
    scrollHandler: onScroll,
    isElevated,
    isCollapsed,
    scrollOffset,
    collapseProgress,
    elevation: isElevated ? 2 : 0,
    scrollBehavior,
    reset,
  };
};

export const useTopAppBarScrollBehavior = useAppbarScrollBehavior;
export default useAppbarScrollBehavior;
