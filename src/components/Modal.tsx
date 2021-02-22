import * as React from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  View,
} from 'react-native';
import {
  getStatusBarHeight,
  getBottomSpace,
} from 'react-native-iphone-x-helper';
import Surface from './Surface';
import { useTheme } from '../core/theming';

type Props = {
  /**
   * Determines whether clicking outside the modal dismiss it.
   */
  dismissable?: boolean;
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
  contentContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the wrapper of the modal.
   * Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
   */
  style?: StyleProp<ViewStyle>;
};

const DEFAULT_DURATION = 220;
const TOP_INSET = getStatusBarHeight(true);
const BOTTOM_INSET = getBottomSpace();

/**
 * The Modal component is a simple way to present content above an enclosing view.
 * To render the `Modal` above other components, you'll need to wrap it with the [`Portal`](portal.html) component.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img class="medium" src="screenshots/modal.gif" />
 *   </figure>
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Modal, Portal, Text, Button, Provider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const showModal = () => setVisible(true);
 *   const hideModal = () => setVisible(false);
 *   const containerStyle = {backgroundColor: 'white', padding: 20};
 *
 *   return (
 *     <Provider>
 *       <Portal>
 *         <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
 *           <Text>Example Modal.  Click outside this area to dismiss.</Text>
 *         </Modal>
 *       </Portal>
 *       <Button style={{marginTop: 30}} onPress={showModal}>
 *         Show
 *       </Button>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Modal: React.FC<Props> = ({
  dismissable = true,
  visible = false,
  overlayAccessibilityLabel = 'Close modal',
  onDismiss,
  children,
  contentContainerStyle,
  style,
}) => {
  const visibleRef = React.useRef(visible);

  visibleRef.current = visible;

  const { colors, animation } = useTheme();

  const [opacity] = React.useState(new Animated.Value(visible ? 1 : 0));

  const [rendered, setRendered] = React.useState(visible);

  React.useLayoutEffect(() => {
    if (visible && !rendered) {
      setRendered(true);
    }
  }, [visible, rendered]);

  // Must be done like this in order to handle cyclical function reference
  // Must be () => () => due to functional API
  const [handleBack, setHandleBack] = React.useState<() => boolean>(() => () =>
    false
  );

  const showModal = React.useCallback(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBack);

    const { scale } = animation;

    Animated.timing(opacity, {
      toValue: 1,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    };
  }, [animation, handleBack, opacity]);

  // Cyclical dep requires me to lazily initialize/call this otherwise we get stuck
  // in infinite loop
  const hideModalRef = React.useRef<() => void>(() => () => {});

  const hideModal = React.useCallback(() => {
    BackHandler.removeEventListener('hardwareBackPress', handleBack);

    const { scale } = animation;

    Animated.timing(opacity, {
      toValue: 0,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      if (visible && onDismiss) {
        onDismiss();
      }

      if (visibleRef.current) {
        showModal();
      } else {
        setRendered(false);
      }
    });
  }, [animation, visible, handleBack, onDismiss, opacity, showModal]);

  hideModalRef.current = hideModal;

  // Handle before initial render to avoid re-rendering issues
  React.useLayoutEffect(() => {
    // Must be () => () => due to functional API
    setHandleBack(() => () => {
      if (dismissable) {
        hideModalRef.current();
      }
      return true;
    });
  }, [dismissable, hideModalRef]);

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
  }, [prevVisible, visible, showModal, hideModal]);

  if (!rendered) return null;

  return (
    <Animated.View
      pointerEvents={visible ? 'auto' : 'none'}
      accessibilityViewIsModal
      accessibilityLiveRegion="polite"
      style={StyleSheet.absoluteFill}
      onAccessibilityEscape={hideModal}
    >
      <TouchableWithoutFeedback
        accessibilityLabel={overlayAccessibilityLabel}
        accessibilityRole="button"
        disabled={!dismissable}
        onPress={dismissable ? hideModal : undefined}
      >
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.backdrop, opacity },
          ]}
        />
      </TouchableWithoutFeedback>
      <View
        style={[
          styles.wrapper,
          { marginTop: TOP_INSET, marginBottom: BOTTOM_INSET },
          style,
        ]}
        pointerEvents="box-none"
      >
        <Surface
          style={
            [{ opacity }, styles.content, contentContainerStyle] as StyleProp<
              ViewStyle
            >
          }
        >
          {children}
        </Surface>
      </View>
    </Animated.View>
  );
};

export default Modal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
  },
  content: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
});
