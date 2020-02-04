import * as React from 'react';
import { Animated, View, StyleSheet, I18nManager } from 'react-native';
import color from 'color';
import MaterialCommunityIcon from './MaterialCommunityIcon';
import TouchableRipple from './TouchableRipple';
import { withTheme } from '../core/theming';
import { Theme, $RemoveChildren } from '../types';

type Props = $RemoveChildren<typeof TouchableRipple> & {
  /**
   * Status of checkbox.
   */
  status: 'checked' | 'unchecked' | 'indeterminate';
  /**
   * Whether checkbox is disabled.
   */
  disabled?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: () => void;
  /**
   * Custom color for unchecked checkbox.
   */
  uncheckedColor?: string;
  /**
   * Custom color for checkbox.
   */
  color?: string;
  /**
   * @optional
   */
  theme: Theme;
};

type State = {
  scaleAnim: Animated.Value;
};

// From https://material.io/design/motion/speed.html#duration
const ANIMATION_DURATION = 100;

/**
 * Checkboxes allow the selection of multiple options from a set.
 * This component follows platform guidelines for Android.
 *
 * <div class="screenshots">
 *   <figure>
 *     <img src="screenshots/checkbox-enabled.android.png" />
 *     <figcaption>Enabled</figcaption>
 *   </figure>
 *   <figure>
 *     <img src="screenshots/checkbox-disabled.android.png" />
 *     <figcaption>Disabled</figcaption>
 *   </figure>
 * </div>
 */
class CheckboxAndroid extends React.Component<Props, State> {
  static displayName = 'Checkbox.Android';

  state = {
    scaleAnim: new Animated.Value(1),
  };

  componentDidUpdate(prevProps: Props) {
    if (prevProps.status === this.props.status) {
      return;
    }

    const checked = this.props.status === 'checked';
    const { animation } = this.props.theme;

    Animated.sequence([
      Animated.timing(this.state.scaleAnim, {
        toValue: 0.85,
        duration: checked ? ANIMATION_DURATION * animation.scale : 0,
      }),
      Animated.timing(this.state.scaleAnim, {
        toValue: 1,
        duration: checked
          ? ANIMATION_DURATION * animation.scale
          : ANIMATION_DURATION * animation.scale * 1.75,
      }),
    ]).start();
  }

  render() {
    const { status, disabled, onPress, theme, ...rest } = this.props;
    const checked = status === 'checked';
    const indeterminate = status === 'indeterminate';
    const checkedColor = this.props.color || theme.colors.accent;
    const uncheckedColor =
      this.props.uncheckedColor ||
      color(theme.colors.text)
        .alpha(theme.dark ? 0.7 : 0.54)
        .rgb()
        .string();

    let rippleColor, checkboxColor;

    if (disabled) {
      rippleColor = color(theme.colors.text)
        .alpha(0.16)
        .rgb()
        .string();
      checkboxColor = theme.colors.disabled;
    } else {
      rippleColor = color(checkedColor)
        .fade(0.32)
        .rgb()
        .string();
      checkboxColor = checked ? checkedColor : uncheckedColor;
    }

    const borderWidth = this.state.scaleAnim.interpolate({
      inputRange: [0.8, 1],
      outputRange: [7, 0],
    });

    const icon = indeterminate
      ? 'minus-box'
      : checked
      ? 'checkbox-marked'
      : 'checkbox-blank-outline';

    return (
      <TouchableRipple
        {...rest}
        borderless
        rippleColor={rippleColor}
        onPress={onPress}
        disabled={disabled}
        accessibilityTraits={disabled ? ['button', 'disabled'] : 'button'}
        accessibilityComponentType="button"
        accessibilityRole="button"
        accessibilityStates={disabled ? ['disabled'] : []}
        accessibilityLiveRegion="polite"
        style={styles.container}
      >
        <Animated.View style={{ transform: [{ scale: this.state.scaleAnim }] }}>
          <MaterialCommunityIcon
            allowFontScaling={false}
            name={icon}
            size={24}
            color={checkboxColor}
            direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
          />
          <View style={[StyleSheet.absoluteFill, styles.fillContainer]}>
            <Animated.View
              style={[
                styles.fill,
                { borderColor: checkboxColor },
                { borderWidth },
              ]}
            />
          </View>
        </Animated.View>
      </TouchableRipple>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    width: 36,
    height: 36,
    padding: 6,
  },
  fillContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fill: {
    height: 14,
    width: 14,
  },
});

export default withTheme(CheckboxAndroid);

// @component-docs ignore-next-line
export { CheckboxAndroid };
