import color from 'color';
import * as React from 'react';
import { Animated, View, ViewStyle, StyleSheet, StyleProp } from 'react-native';
import ActivityIndicator from '../ActivityIndicator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import FABGroup, { FABGroup as _FABGroup } from './FABGroup';
import Surface from '../Surface';
import CrossFadeIcon from '../CrossFadeIcon';
import Text from '../Typography/Text';
import TouchableRipple from '../TouchableRipple';
import { black, white } from '../../styles/colors';
import { withTheme } from '../../core/theming';
import { Theme, $RemoveChildren } from '../../types';
import { IconSource } from './../Icon';

type Props = $RemoveChildren<typeof Surface> & {
  /**
   * Icon to display for the `FAB`.
   */
  icon: IconSource;
  /**
   * Optional label for extended `FAB`.
   */
  label?: string;
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   * Uses `label` by default if specified.
   */
  accessibilityLabel?: string;
  /**
   *  Whether FAB is mini-sized, used to create visual continuity with other elements. This has no effect if `label` is specified.
   */
  small?: boolean;
  /**
   * Custom color for the icon and label of the `FAB`.
   */
  color?: string;
  /**
   * Whether `FAB` is disabled. A disabled button is greyed out and `onPress` is not called on touch.
   */
  disabled?: boolean;
  /**
   * Whether `FAB` is currently visible.
   */
  visible?: boolean;
  /**
   * Whether to show a loading indicator.
   */
  loading?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  /**
   * @optional
   */
  theme: Theme;
  testID?: string;
};

type State = {
  visibility: Animated.Value;
};

/**
 * A floating action button represents the primary action in an application.
 *
 * <div class="screenshots">
 *   <img src="screenshots/fab-1.png" />
 *   <img src="screenshots/fab-2.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { StyleSheet } from 'react-native';
 * import { FAB } from 'react-native-paper';
 *
 * const MyComponent = () => (
 *   <FAB
 *     style={styles.fab}
 *     small
 *     icon="plus"
 *     onPress={() => console.log('Pressed')}
 *   />
 * );
 *
 * const styles = StyleSheet.create({
 *   fab: {
 *     position: 'absolute',
 *     margin: 16,
 *     right: 0,
 *     bottom: 0,
 *   },
 * })
 *
 * export default MyComponent;
 * ```
 */
class FAB extends React.Component<Props, State> {
  // @component ./FABGroup.tsx
  static Group = FABGroup;

  static defaultProps = {
    visible: true,
  };

  state = {
    visibility: new Animated.Value(this.props.visible ? 1 : 0),
  };

  componentDidUpdate(prevProps: Props) {
    const { scale } = this.props.theme.animation;
    if (this.props.visible === prevProps.visible) {
      return;
    }

    if (this.props.visible) {
      Animated.timing(this.state.visibility, {
        toValue: 1,
        duration: 200 * scale,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(this.state.visibility, {
        toValue: 0,
        duration: 150 * scale,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const {
      small,
      icon,
      label,
      accessibilityLabel = label,
      color: customColor,
      disabled,
      onPress,
      theme,
      style,
      visible,
      loading,
      testID,
      ...rest
    } = this.props;
    const { visibility } = this.state;

    const disabledColor = color(theme.dark ? white : black)
      .alpha(0.12)
      .rgb()
      .string();

    const { backgroundColor = disabled ? disabledColor : theme.colors.accent } =
      StyleSheet.flatten(style) || {};

    let foregroundColor;

    if (typeof customColor !== 'undefined') {
      foregroundColor = customColor;
    } else if (disabled) {
      foregroundColor = color(theme.dark ? white : black)
        .alpha(0.32)
        .rgb()
        .string();
    } else {
      foregroundColor = !color(backgroundColor).isLight()
        ? white
        : 'rgba(0, 0, 0, .54)';
    }

    const rippleColor = color(foregroundColor)
      .alpha(0.32)
      .rgb()
      .string();

    return (
      <Surface
        {...rest}
        style={
          [
            {
              backgroundColor,
              opacity: visibility,
              transform: [
                {
                  scale: visibility,
                },
              ],
            },
            styles.container,
            disabled && styles.disabled,
            style,
          ] as StyleProp<ViewStyle>
        }
        pointerEvents={visible ? 'auto' : 'none'}
      >
        <TouchableRipple
          borderless
          onPress={onPress}
          rippleColor={rippleColor}
          disabled={disabled}
          accessibilityLabel={accessibilityLabel}
          accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
          accessibilityComponentType="button"
          accessibilityRole="button"
          accessibilityStates={disabled ? ['disabled'] : []}
          style={styles.touchable}
          testID={testID}
        >
          <View
            style={[
              styles.content,
              label ? styles.extended : small ? styles.small : styles.standard,
            ]}
            pointerEvents="none"
          >
            {icon && loading !== true ? (
              <CrossFadeIcon source={icon} size={24} color={foregroundColor} />
            ) : null}
            {loading ? (
              <ActivityIndicator size={18} color={foregroundColor} />
            ) : null}
            {label ? (
              <Text
                style={[
                  styles.label,
                  { color: foregroundColor, ...theme.fonts.medium },
                ]}
              >
                {label.toUpperCase()}
              </Text>
            ) : null}
          </View>
        </TouchableRipple>
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 28,
    elevation: 6,
  },
  touchable: {
    borderRadius: 28,
  },
  standard: {
    height: 56,
    width: 56,
  },
  small: {
    height: 40,
    width: 40,
  },
  extended: {
    height: 48,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginHorizontal: 8,
  },
  disabled: {
    elevation: 0,
  },
});

export default withTheme(FAB);
