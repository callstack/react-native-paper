import * as React from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import Surface from './Surface';
import { withTheme } from '../core/theming';

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
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

const DEFAULT_DURATION = 220;

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

const Modal = ({
  children,
  dismissable = true,
  theme,
  contentContainerStyle,
  overlayAccessibilityLabel = 'Close modal',
  visible = false,
  onDismiss,
}: Props) => {
  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
  const [rendered, setRendered] = React.useState<boolean>(visible);

  const {
    animation: { scale },
    colors,
  } = theme;

  React.useEffect(() => {
    if (visible) {
      showModal();
    } else {
      hideModal();
    }

    if (visible && !rendered) {
      setRendered(true);
    }
  }, [visible, rendered]);

  const handleBack = () => {
    if (dismissable) {
      hideModal();
    }
    return true;
  };

  const showModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', handleBack);
    BackHandler.addEventListener('hardwareBackPress', handleBack);

    Animated.timing(opacity, {
      toValue: 1,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', handleBack);

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

      if (visible) {
        showModal();
      } else {
        setRendered(false);
      }
    });
  };

  React.useEffect(() => {
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
  }, []);

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
      <SafeAreaView style={styles.wrapper} pointerEvents="box-none">
        <Surface
          style={
            [{ opacity }, styles.content, contentContainerStyle] as StyleProp<
              ViewStyle
            >
          }
        >
          {children}
        </Surface>
      </SafeAreaView>
    </Animated.View>
  );
};

export default withTheme(Modal);

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
