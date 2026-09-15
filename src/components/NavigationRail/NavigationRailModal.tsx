import * as React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Animated from 'react-native-reanimated';

import NavigationRail from './NavigationRail';
import type { Props as NavigationRailProps } from './NavigationRail';
import { NavigationRailTokens } from './tokens';
import { clampExpandedWidth, getTransition } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { tokens } from '../../theme/tokens';
import { resolveCornerRadius } from '../../theme/utils/shape';
import { addEventListener } from '../../utils/addEventListener';
import { BackHandler } from '../../utils/BackHandler/BackHandler';
import Surface from '../Surface';

export type Props = Omit<
  NavigationRailProps,
  'expanded' | 'overlay' | 'onDismiss' | 'containerColor' | 'style'
> & {
  /**
   * Whether the modal rail is visible.
   */
  visible: boolean;
  /**
   * Callback that is called when the user dismisses the rail.
   */
  onDismiss?: () => void;
  /**
   * Determines whether tapping the scrim or pressing the hardware back
   * button dismisses the rail.
   */
  dismissable?: boolean;
  /**
   * Accessibility label for the scrim.
   */
  overlayAccessibilityLabel?: string;
  style?: NavigationRailProps['style'];
};

const { rail, colors } = NavigationRailTokens;
const scrimAlpha = tokens.md.sys.scrim.alpha;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * An expanded navigation rail shown above the content with a scrim, for
 * layouts where the rail is not permanently visible. Slides in from the
 * start edge and out again on dismiss. Wrap it in a `Portal` to render above
 * other components.
 *
 * ## Theming
 * The container uses `theme.colors.surfaceContainer`, the scrim
 * `theme.colors.scrim`.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Button, NavigationRail, Portal } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   return (
 *     <>
 *       <Portal>
 *         <NavigationRail.Modal
 *           visible={visible}
 *           onDismiss={() => setVisible(false)}
 *         >
 *           <NavigationRail.Item icon="inbox" label="Inbox" active />
 *           <NavigationRail.Item icon="send" label="Sent" />
 *         </NavigationRail.Modal>
 *       </Portal>
 *       <Button onPress={() => setVisible(true)}>Open</Button>
 *     </>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const NavigationRailModal = ({
  visible,
  onDismiss,
  dismissable = true,
  overlayAccessibilityLabel = 'Close navigation rail',
  expandedWidth = rail.expandedMinWidth,
  animated = true,
  style,
  overlayTestID,
  testID,
  theme: themeOverrides,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const reduceMotion = useReduceMotion();
  const [mounted, setMounted] = React.useState(visible);
  const [shown, setShown] = React.useState(false);

  if (visible && !mounted) {
    setMounted(true);
  }

  const { duration, easing } = theme.motion;
  const enter = {
    duration: duration.medium4,
    easing: easing.emphasizedDecelerate,
  };
  const exit = {
    duration: duration.short4,
    easing: easing.emphasizedAccelerate,
  };
  const motion = { ...(shown ? enter : exit), instant: !animated };

  React.useEffect(() => {
    const timeout = setTimeout(() => setShown(visible), 0);
    return () => clearTimeout(timeout);
  }, [visible]);

  React.useEffect(() => {
    if (visible || !mounted) return undefined;
    const timeout = setTimeout(
      () => setMounted(false),
      animated ? exit.duration : 0
    );
    return () => clearTimeout(timeout);
  }, [visible, mounted, animated, exit.duration]);

  React.useEffect(() => {
    if (!visible || !dismissable) return undefined;
    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      () => {
        onDismiss?.();
        return true;
      }
    );
    return () => subscription.remove();
  }, [visible, dismissable, onDismiss]);

  if (!mounted) {
    return null;
  }

  const width = clampExpandedWidth(expandedWidth);
  const offscreen = direction === 'rtl' ? width : -width;
  const endRadius = resolveCornerRadius(theme, rail.modalShape);

  return (
    <Animated.View
      style={StyleSheet.absoluteFill}
      pointerEvents={visible ? 'auto' : 'none'}
      aria-modal
      aria-live="polite"
      onAccessibilityEscape={onDismiss}
      testID={testID}
    >
      <AnimatedPressable
        onPress={dismissable ? onDismiss : undefined}
        disabled={!dismissable}
        role="button"
        aria-label={overlayAccessibilityLabel}
        importantForAccessibility="no"
        style={[
          StyleSheet.absoluteFill,
          shown ? styles.scrim : styles.hidden,
          { backgroundColor: theme.colors.scrim },
          getTransition(theme, ['opacity'], motion),
        ]}
        testID={overlayTestID}
      />
      <Surface
        elevation={rail.modalElevation}
        backgroundColor={theme.colors[colors.modalContainer]}
        borderTopEndRadius={endRadius}
        borderBottomEndRadius={endRadius}
        transitionDuration={animated ? motion.duration : 0}
        style={[
          styles.panel,
          { width },
          reduceMotion
            ? shown
              ? styles.shown
              : styles.hidden
            : { transform: [{ translateX: shown ? 0 : offscreen }] },
          getTransition(
            theme,
            [reduceMotion ? 'opacity' : 'transform'],
            motion
          ),
        ]}
        theme={theme}
      >
        <NavigationRail
          {...rest}
          expanded
          expandedWidth={width}
          animated={animated}
          containerColor="transparent"
          style={style}
          theme={theme}
        />
      </Surface>
    </Animated.View>
  );
};

NavigationRailModal.displayName = 'NavigationRail.Modal';

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    start: 0,
  },
  scrim: {
    opacity: scrimAlpha,
  },
  shown: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
});

export default NavigationRailModal;
