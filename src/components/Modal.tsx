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
   * Style for the wrapper of the modal.
   * Use this prop to change the default wrapper style or to override safe area insets with marginTop and marginBottom.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: ReactNativePaper.Theme;
};

type State = {
  opacity: Animated.Value;
  rendered: boolean;
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
class Modal extends React.Component<Props, State> {
  static defaultProps = {
    dismissable: true,
    visible: false,
    overlayAccessibilityLabel: 'Close modal',
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.visible && !prevState.rendered) {
      return {
        rendered: true,
      };
    }

    return null;
  }

  state = {
    opacity: new Animated.Value(this.props.visible ? 1 : 0),
    rendered: this.props.visible,
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible !== this.props.visible) {
      if (this.props.visible) {
        this.showModal();
      } else {
        this.hideModal();
      }
    }
  }

  private handleBack = () => {
    if (this.props.dismissable) {
      this.hideModal();
    }
    return true;
  };

  private showModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);

    const { opacity } = this.state;
    const { scale } = this.props.theme.animation;

    Animated.timing(opacity, {
      toValue: 1,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  private hideModal = () => {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);

    const { opacity } = this.state;
    const { scale } = this.props.theme.animation;

    Animated.timing(opacity, {
      toValue: 0,
      duration: scale * DEFAULT_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) {
        return;
      }

      if (this.props.visible && this.props.onDismiss) {
        this.props.onDismiss();
      }

      if (this.props.visible) {
        this.showModal();
      } else {
        this.setState({
          rendered: false,
        });
      }
    });
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  render() {
    const { rendered, opacity } = this.state;

    if (!rendered) return null;

    const {
      children,
      dismissable,
      style,
      theme,
      contentContainerStyle,
      overlayAccessibilityLabel,
    } = this.props;
    const { colors } = theme;
    return (
      <Animated.View
        pointerEvents={this.props.visible ? 'auto' : 'none'}
        accessibilityViewIsModal
        accessibilityLiveRegion="polite"
        style={StyleSheet.absoluteFill}
        onAccessibilityEscape={this.hideModal}
      >
        <TouchableWithoutFeedback
          accessibilityLabel={overlayAccessibilityLabel}
          accessibilityRole="button"
          disabled={!dismissable}
          onPress={dismissable ? this.hideModal : undefined}
          importantForAccessibility="no"
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
  }
}

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
