import * as React from 'react';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
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
   * Accessibility label for dismissing the modal if it's `dismissable`.
   */
  dismissAccessibilityLabel?: string;
  /**
   * Accessible name for the modal.
   */
  'aria-label'?: string;
  /**
   * `nativeID` of the element which provides the accessible name for the modal,
   * such as a title. Supported on web.
   */
  'aria-labelledby'?: string;
  /**
   * testID for the overlay that is displayed behind the modal content.
   */
  overlayTestID?: string;
  /**
   * Determines Whether the modal is visible.
   */
  visible: boolean;
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
 * Give the modal an accessible name with `aria-label`.
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
 *         aria-label="Example modal"
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
  dismissAccessibilityLabel = 'Close modal',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
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
    <Portal modal={visibleInternal} theme={themeOverrides}>
      <Animated.View
        pointerEvents={visible ? 'auto' : 'none'}
        aria-live="polite"
        style={StyleSheet.absoluteFill}
        onAccessibilityEscape={dismissable ? onDismissCallback : undefined}
        testID={testID}
      >
        <AnimatedPressable
          aria-hidden
          accessible={false}
          tabIndex={-1}
          disabled={!dismissable}
          onPress={dismissable ? onDismissCallback : undefined}
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
            role="dialog"
            aria-modal
            aria-label={ariaLabel}
            aria-labelledby={
              // Only set `aria-labelledby` on web, it's ignored on iOS
              // On Android, it results in the content being read on opening the dialog,
              // and then again when the first focusable element receives focus.
              Platform.OS === 'web' ? ariaLabelledBy : undefined
            }
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
            {dismissable ? (
              // The backdrop is hidden for screen reader users,
              // so we provide a visually hidden dismiss button.
              <Pressable
                role="button"
                aria-label={dismissAccessibilityLabel}
                tabIndex={-1}
                onPress={onDismissCallback}
                style={styles.dismiss}
              />
            ) : null}
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
  dismiss: {
    position: 'absolute',
    width: 1,
    height: 1,
  },
});
