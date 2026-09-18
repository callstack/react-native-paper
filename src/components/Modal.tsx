import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import Animated, {
  cubicBezier,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';

import Portal from './Portal/Portal';
import Surface from './Surface';
import type { Props as SurfaceProps, SurfaceStyle } from './Surface';
import { useInternalTheme } from '../core/theming';
import { tokens } from '../theme/tokens';
import type { Elevation, ThemeProp } from '../theme/types';
import { useOverlayDismiss } from '../utils/useOverlayDismiss';
import { useOverlayFocus } from '../utils/useOverlayFocus';

const scrimAlpha = tokens.md.sys.scrim.alpha;

export type Props = {
  /**
   * Determines whether clicking outside the modal dismisses it.
   */
  dismissable?: boolean;
  /**
   * Determines whether clicking Android hardware back button dismisses the dialog.
   */
  dismissableBackButton?: boolean;
  /**
   * Callback that is called when the user dismisses the modal.
   */
  onDismiss?: () => void;
  /**
   * Accessibility label for the overlay. This is read by the screen reader when the user taps outside the modal.
   */
  overlayAccessibilityLabel?: string;
  /**
   * testID for the overlay that is displayed behind the modal content.
   */
  overlayTestID?: string;
  /**
   * Determines Whether the modal is visible.
   */
  visible: boolean;
  /**
   * Element to focus when the modal opens.
   */
  initialFocusRef?: React.RefObject<View | null>;
  /**
   * Element to focus when the modal closes.
   */
  restoreFocusRef?: React.RefObject<View | null>;
  // TODO_REMOVE: both the prop and its default belong to #5125.
  /**
   * Accessibility label of the modal's content.
   */
  'aria-label'?: string;
  /**
   * Content of the `Modal`.
   */
  children: React.ReactNode;
  /**
   * Style for the content of the modal.
   *
   * Background color and border radius should be specified via props instead:
   * - `contentBackgroundColor`
   * - `contentBorderRadius`
   */
  contentContainerStyle?: StyleProp<SurfaceStyle>;
  /**
   * Background color of the modal content. Defaults to transparent.
   */
  contentBackgroundColor?: SurfaceProps['backgroundColor'];
  /**
   * Border radius of the modal content.
   */
  contentBorderRadius?: SurfaceProps['borderRadius'];
  /**
   * Elevation level of the modal content. Defaults to level 1.
   */
  contentElevation?: Elevation;
  /**
   * Style for the wrapper of the modal.
   * Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * testID to be used on tests.
   */
  testID?: string;
};

const DEFAULT_DURATION = 220;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * The Modal component is a simple way to present content above an enclosing view.
 * It renders itself in a [`Portal`](./Portal), so it appears above the rest of the app.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Modal, Text, Button, PaperProvider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const showModal = () => setVisible(true);
 *   const hideModal = () => setVisible(false);
 *
 *   const containerStyle = { padding: 20 };
 *
 *   return (
 *     <PaperProvider>
 *       <Modal
 *         visible={visible}
 *         onDismiss={hideModal}
 *         contentBackgroundColor="white"
 *         contentContainerStyle={containerStyle}
 *       >
 *         <Text>Example Modal.  Click outside this area to dismiss.</Text>
 *       </Modal>
 *       <Button style={{ marginTop: 30 }} onPress={showModal}>
 *         Show
 *       </Button>
 *     </PaperProvider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
function Modal({
  dismissable = true,
  dismissableBackButton = dismissable,
  visible = false,
  initialFocusRef,
  restoreFocusRef,
  // TODO_REMOVE: both the prop and its default belong to #5125.
  'aria-label': ariaLabel = 'Dialog',
  overlayAccessibilityLabel = 'Close modal',
  overlayTestID,
  onDismiss = () => {},
  children,
  contentContainerStyle,
  contentBackgroundColor = 'transparent',
  contentBorderRadius,
  contentElevation,
  style,
  theme: themeOverrides,
  testID,
}: Props) {
  const theme = useInternalTheme(themeOverrides);

  const onDismissCallback = useLatestCallback(onDismiss);

  const { top, bottom } = useSafeAreaInsets();

  const [visibleInternal, setVisibleInternal] = React.useState(visible);
  const [animatedVisible, setAnimatedVisible] = React.useState(visible);

  if (visible && !visibleInternal) {
    setVisibleInternal(true);
  }

  const { scale } = theme.animation;

  React.useEffect(() => {
    const timeout = setTimeout(() => setAnimatedVisible(visible), 0);

    return () => clearTimeout(timeout);
  }, [visible]);

  React.useEffect(() => {
    if (visible || !visibleInternal) {
      return undefined;
    }

    const timeout = setTimeout(
      () => setVisibleInternal(false),
      scale * DEFAULT_DURATION
    );

    return () => clearTimeout(timeout);
  }, [scale, visible, visibleInternal]);

  useOverlayDismiss({
    enabled: visible,
    dismissable: dismissableBackButton,
    onDismiss: onDismissCallback,
  });

  const contentRef = React.useRef<View>(null);

  const { focusInitialTarget } = useOverlayFocus({
    visible: visibleInternal,
    containerRef: contentRef,
    initialFocusRef,
    restoreFocusRef,
  });

  React.useEffect(() => {
    if (!animatedVisible) {
      return undefined;
    }

    // Transparent views are not in the accessibility tree, so focus has to
    // wait for the fade to finish.
    const timeout = setTimeout(focusInitialTarget, scale * DEFAULT_DURATION);

    return () => clearTimeout(timeout);
  }, [animatedVisible, focusInitialTarget, scale]);

  const transitionTimingFunction = cubicBezier(1 / 3, 1, 2 / 3, 1);

  const backdropTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionDuration: scale * DEFAULT_DURATION,
    transitionProperty: 'opacity',
    transitionTimingFunction,
  };

  const contentTransitionStyle: AnimatedStyle<ViewStyle> = {
    transitionProperty: 'opacity',
    transitionTimingFunction,
  };

  const backdropStyle: AnimatedStyle<ViewStyle> = {
    backgroundColor: theme.colors.scrim,
    opacity: animatedVisible ? scrimAlpha : 0,
  };

  const contentStyle: AnimatedStyle<ViewStyle> = {
    opacity: animatedVisible ? 1 : 0,
  };

  if (!visible && !visibleInternal) {
    return null;
  }

  return (
    <Portal modal={visible} theme={theme}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        aria-modal
        style={StyleSheet.absoluteFill}
        onAccessibilityEscape={onDismissCallback}
        testID={testID}
      >
        <AnimatedPressable
          aria-label={overlayAccessibilityLabel}
          role="button"
          disabled={!dismissable}
          onPress={dismissable ? onDismissCallback : undefined}
          importantForAccessibility="no"
          style={[styles.backdrop, backdropStyle, backdropTransitionStyle]}
          testID={overlayTestID}
        />
        <View
          style={[
            styles.wrapper,
            { marginTop: top, marginBottom: bottom },
            style,
          ]}
          pointerEvents="box-none"
        >
          <Surface
            ref={contentRef}
            /* TODO_REMOVE: #5125 owns the modal's role and name, and moves
               `aria-modal` off the wrapper above onto this surface. Until it
               lands, moving focus here announces nothing, which leaves this
               impossible to verify with VoiceOver and TalkBack. */
            role="dialog"
            aria-modal
            aria-label={ariaLabel}
            theme={theme}
            backgroundColor={contentBackgroundColor}
            borderRadius={contentBorderRadius}
            style={[
              styles.content,
              contentStyle,
              contentTransitionStyle,
              contentContainerStyle,
            ]}
            elevation={contentElevation}
            transitionDuration={scale * DEFAULT_DURATION}
          >
            {children}
          </Surface>
        </View>
      </Animated.View>
    </Portal>
  );
}

export default Modal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  wrapper: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
  },
  content: {
    justifyContent: 'center',
  },
});
