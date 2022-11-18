import * as React from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  NativeEventSubscription,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { InternalTheme } from 'src/types';

import { withInternalTheme } from '../core/theming';
import { addEventListener } from '../utils/addEventListener';
import useAnimatedValue from '../utils/useAnimatedValue';
import Surface from './Surface';

export type Props = {
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
  /**
   * @optional
   */
  theme: InternalTheme;
  /**
   * testID to be used on tests.
   */
  testID?: string;
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
function Modal({
  dismissable = true,
  visible = false,
  overlayAccessibilityLabel = 'Close modal',
  onDismiss,
  children,
  contentContainerStyle,
  style,
  theme,
  testID = 'modal',
}: Props) {
  const visibleRef = React.useRef(visible);

  React.useEffect(() => {
    visibleRef.current = visible;
  });

  const { scale } = theme.animation;

  const { top, bottom } = useSafeAreaInsets();

  const opacity = useAnimatedValue(visible ? 1 : 0);

  const [rendered, setRendered] = React.useState(visible);

  if (visible && !rendered) {
    setRendered(true);
  }

  const handleBack = () => {
    if (dismissable) {
      hideModal();
    }
    return true;
  };

  const subscription = React.useRef<NativeEventSubscription | undefined>(
    undefined
  );

  const showModal = () => {
    subscription.current?.remove();
    subscription.current = addEventListener(
      BackHandler,
      'hardwareBackPress',
      handleBack
    );

    Animated.timing(opacity, {
      toValue: 1,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const removeListeners = () => {
    if (subscription.current?.remove) {
      subscription.current?.remove();
    } else {
      BackHandler.removeEventListener('hardwareBackPress', handleBack);
    }
  };

  const hideModal = () => {
    removeListeners();

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
  };

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

  React.useEffect(() => {
    return removeListeners;
  }, []);

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
      <TouchableWithoutFeedback
        accessibilityLabel={overlayAccessibilityLabel}
        accessibilityRole="button"
        disabled={!dismissable}
        onPress={dismissable ? hideModal : undefined}
        importantForAccessibility="no"
      >
        <Animated.View
          testID={`${testID}-backdrop`}
          style={[
            styles.backdrop,
            {
              backgroundColor: theme.colors?.backdrop,
              opacity,
            },
          ]}
        />
      </TouchableWithoutFeedback>
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
          style={
            [
              { opacity },
              styles.content,
              contentContainerStyle,
            ] as StyleProp<ViewStyle>
          }
        >
          {children}
        </Surface>
      </View>
    </Animated.View>
  );
}

export default withInternalTheme(Modal);

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
