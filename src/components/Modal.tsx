import * as React from 'react';
import { StyleSheet, Pressable, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

import Animated, {
  cubicBezier,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';

import Surface from './Surface';
import type { Props as SurfaceProps, SurfaceStyle } from './Surface';
import { useInternalTheme } from '../core/theming';
import { tokens } from '../theme/tokens';
import type { Elevation, ThemeProp } from '../types';
import { addEventListener } from '../utils/addEventListener';
import { BackHandler } from '../utils/BackHandler/BackHandler';

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
   * Accessibility label for the dialog. This is read by the screen reader when the user opens a dialog.
   */
  'aria-label'?: string;
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
 * To render the `Modal` above other components, you'll need to wrap it with the [`Portal`](./Portal) component.
 * Note that this modal is NOT accessible by default; if you need an accessible modal, please use the React Native Modal.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';
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
 *       <Portal>
 *         <Modal
 *           visible={visible}
 *           onDismiss={hideModal}
 *           contentBackgroundColor="white"
 *           contentContainerStyle={containerStyle}
 *         >
 *           <Text>Example Modal.  Click outside this area to dismiss.</Text>
 *         </Modal>
 *       </Portal>
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
  overlayAccessibilityLabel = 'Close modal',
  'aria-label': ariaLabel,
  onDismiss = () => {},
  children,
  contentContainerStyle,
  contentBackgroundColor = 'transparent',
  contentBorderRadius,
  contentElevation,
  style,
  theme: themeOverrides,
  testID = 'modal',
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

  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const onHardwareBackPress = () => {
      if (dismissable || dismissableBackButton) {
        onDismissCallback();
      }

      return true;
    };

    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      onHardwareBackPress
    );

    return () => subscription.remove();
  }, [dismissable, dismissableBackButton, onDismissCallback, visible]);

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
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      aria-modal
      aria-live="polite"
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
        testID={`${testID}-backdrop`}
      />
      <View
        style={[
          styles.wrapper,
          { marginTop: top, marginBottom: bottom },
          style,
        ]}
        pointerEvents="box-none"
        testID={`${testID}-wrapper`}
      >
        <Surface
          testID={`${testID}-surface`}
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
          aria-label={ariaLabel}
        >
          {children}
        </Surface>
      </View>
    </Animated.View>
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
