import * as React from 'react';
import {
  Animated,
  Easing,
  StyleProp,
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useLatestCallback from 'use-latest-callback';

import Surface from './Surface';
import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';
import { addEventListener } from '../utils/addEventListener';
import { BackHandler } from '../utils/BackHandler/BackHandler';
import useAnimatedValue from '../utils/useAnimatedValue';

export type Props = {
  /**
   * Determines whether clicking outside the modal dismiss it.
   */
  dismissable?: boolean;
  /**
   * Determines whether clicking Android hardware back button dismiss dialog.
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
   * Determines Whether the modal is visible.
   */
  visible: boolean;
  /**
   * Content of the `Modal`.
   */
  children: React.ReactNode;
  /**
   * Style for the content of the modal
   */
  contentContainerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
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
 *   const containerStyle = {backgroundColor: 'white', padding: 20};
 *
 *   return (
 *     <PaperProvider>
 *       <Portal>
 *         <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
 *           <Text>Example Modal.  Click outside this area to dismiss.</Text>
 *         </Modal>
 *       </Portal>
 *       <Button style={{marginTop: 30}} onPress={showModal}>
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
  onDismiss = () => {},
  children,
  contentContainerStyle,
  style,
  theme: themeOverrides,
  testID = 'modal',
}: Props) {
  const theme = useInternalTheme(themeOverrides);
  const visibleRef = React.useRef(visible);

  React.useEffect(() => {
    visibleRef.current = visible;
  });

  const onDismissCallback = useLatestCallback(onDismiss);

  const { scale } = theme.animation;

  const { top, bottom } = useSafeAreaInsets();

  const opacity = useAnimatedValue(visible ? 1 : 0);

  const [rendered, setRendered] = React.useState(visible);

  if (visible && !rendered) {
    setRendered(true);
  }

  const showModal = React.useCallback(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [opacity, scale]);

  const hideModal = React.useCallback(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      if (visible) {
        onDismissCallback();
      }

      if (visibleRef.current) {
        showModal();
      } else {
        setRendered(false);
      }
    });
  }, [onDismissCallback, opacity, scale, showModal, visible]);

  React.useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const onHardwareBackPress = () => {
      if (dismissable || dismissableBackButton) {
        hideModal();
      }

      return true;
    };

    const subscription = addEventListener(
      BackHandler,
      'hardwareBackPress',
      onHardwareBackPress
    );
    return () => subscription.remove();
  }, [dismissable, dismissableBackButton, hideModal, visible]);

  const prevVisible = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    if (prevVisible.current !== visible) {
      if (visible) {
        showModal();
      } else {
        hideModal();
      }
    }
    prevVisible.current = visible;
  });

  if (!rendered) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
      style={StyleSheet.absoluteFill}
      onAccessibilityEscape={hideModal}
      testID={testID}
    >
      <AnimatedPressable
        accessibilityLabel={overlayAccessibilityLabel}
        accessibilityRole="button"
        disabled={!dismissable}
        onPress={dismissable ? hideModal : undefined}
        importantForAccessibility="no"
        style={[
          styles.backdrop,
          {
            backgroundColor: theme.colors?.backdrop,
            opacity,
          },
        ]}
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
          style={[{ opacity }, styles.content, contentContainerStyle]}
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
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  content: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});
