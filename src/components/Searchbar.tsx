import * as React from 'react';
import {
  StyleSheet,
  StyleProp,
  TextInput,
  I18nManager,
  ViewStyle,
  TextStyle,
} from 'react-native';

import color from 'color';
import IconButton from './IconButton';
import Surface from './Surface';
import { withTheme } from '../core/theming';
import { Theme } from '../types';
import { IconSource } from './Icon';
import MaterialCommunityIcon from './MaterialCommunityIcon';

type Icon = {
  icon?: IconSource;
  iconColor?: string;
  onIconPress?: () => void;
};

type Props = React.ComponentPropsWithRef<typeof TextInput> & {
  /**
   * Icon options for the left icon button.
   */
  iconLeft?: Icon;
  /**
   * Icon options for the right icon button.
   */
  iconRight?: Icon;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  clearAccessibilityLabel?: string;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  searchAccessibilityLabel?: string;
  /**
   * Hint text shown when the input is empty.
   */
  placeholder?: string;
  /**
   * The value of the text input.
   */
  value: string;
  /**
   * @deprecated
   * Icon name for the left icon button (see `onIconPress`).
   */
  icon?: IconSource;
  /**
   * @deprecated
   * Callback that is called when the text input's text changes.
   */
  onChangeText?: (query: string) => void;
  /**
   * Callback to execute if we want the left icon to act as button.
   */
  onIconPress?: () => void;
  /**
   * Set style of the TextInput component inside the searchbar
   */
  inputStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;

  /**
   * @optional
   */
  theme: Theme;
  /**
   * @deprecated
   * Custom color for icon, default will be derived from theme
   */
  iconColor?: string;
  /**
   * @deprecated
   * Custom icon for clear button, default will be icon close
   */
  clearIcon?: IconSource;
};

/**
 * Searchbar is a simple input box where users can type search queries.
 *
 * <div class="screenshots">
 *   <img class="medium" src="screenshots/searchbar.png" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Searchbar } from 'react-native-paper';
 *
 * export default class MyComponent extends React.Component {
 *   state = {
 *     searchQuery: '',
 *   };
 *
 *   _onChangeSearch = query => this.setState({ searchQuery: query });
 *
 *   render() {
 *     const { searchQuery } = this.state;
 *     return (
 *       <Searchbar
 *         placeholder="Search"
 *         onChangeText={this._onChangeSearch}
 *         value={searchQuery}
 *       />
 *     );
 *   }
 * }
 * ```
 */
class Searchbar extends React.Component<Props> {
  static defaultProps = {
    searchAccessibilityLabel: 'search',
    clearAccessibilityLabel: 'clear',
  };
  private handleClearPress = () => {
    this.clear();
    this.props.onChangeText && this.props.onChangeText('');
  };

  private root: TextInput | undefined | null;

  /**
   * @internal
   */ setNativeProps(args: Object) {
    return this.root && this.root.setNativeProps(args);
  }

  /**
   * Returns `true` if the input is currently focused, `false` otherwise.
   */
  isFocused() {
    return this.root && this.root.isFocused();
  }

  /**
   * Removes all text from the TextInput.
   */
  clear() {
    return this.root && this.root.clear();
  }

  /**
   * Focuses the input.
   */
  focus() {
    return this.root && this.root.focus();
  }

  /**
   * Removes focus from the input.
   */
  blur() {
    return this.root && this.root.blur();
  }

  render() {
    const defaultIcon = {
      iconColor: undefined,
      icon: undefined,
      onIconPress: () => {},
    };

    const {
      iconLeft = defaultIcon,
      iconRight = defaultIcon,
      clearAccessibilityLabel,
      clearIcon,
      icon,
      iconColor: customIconColor,
      inputStyle,
      onIconPress,
      placeholder,
      searchAccessibilityLabel,
      style,
      theme,
      value,
      ...rest
    } = this.props;

    if (onIconPress) {
      console.warn(
        'onIconPress prop has been deprecated since version v3.7.0. Use iconLeft.onIconPress instead.'
      );
    }

    if (icon) {
      console.warn(
        'icon prop has been deprecated since version v3.7.0. Use iconLeft.icon instead.'
      );
    }

    if (customIconColor) {
      console.warn(
        'iconColor prop has been deprecated since version v3.7.0. Use iconLeft.iconColor instead.'
      );
    }

    if (clearIcon) {
      console.warn(
        'clearIcon prop has been deprecated since version v3.7.0. Use iconRight instead.'
      );
    }

    const { colors, roundness, dark, fonts } = theme;
    const textColor = colors.text;
    const font = fonts.regular;
    const iconColor =
      customIconColor ||
      (dark
        ? textColor
        : color(textColor)
            .alpha(0.54)
            .rgb()
            .string());
    const rippleColor = color(textColor)
      .alpha(0.32)
      .rgb()
      .string();

    const customIconColorLeft =
      iconLeft?.iconColor ||
      (dark
        ? textColor
        : color(textColor)
            .alpha(0.54)
            .rgb()
            .string());

    const customIconColorRight =
      iconRight?.iconColor ||
      (dark
        ? textColor
        : color(textColor)
            .alpha(0.54)
            .rgb()
            .string());

    return (
      <Surface
        style={[
          { borderRadius: roundness, elevation: 4 },
          styles.container,
          style,
        ]}
      >
        <IconButton
          accessibilityTraits="button"
          accessibilityComponentType="button"
          accessibilityRole="button"
          borderless
          rippleColor={rippleColor}
          onPress={onIconPress || iconLeft.onIconPress}
          color={iconColor || customIconColorLeft}
          icon={
            icon ||
            iconLeft.icon ||
            (({ size, color }) => (
              <MaterialCommunityIcon
                name="magnify"
                color={color}
                size={size}
                direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
              />
            ))
          }
          accessibilityLabel={searchAccessibilityLabel}
        />
        <TextInput
          style={[styles.input, { color: textColor, ...font }, inputStyle]}
          placeholder={placeholder || ''}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.primary}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          keyboardAppearance={dark ? 'dark' : 'light'}
          accessibilityTraits="search"
          accessibilityRole="search"
          ref={c => {
            this.root = c;
          }}
          value={value}
          {...rest}
        />
        {clearIcon || !iconRight.icon ? (
          <IconButton
            borderless
            disabled={!value}
            accessibilityLabel={clearAccessibilityLabel}
            color={value ? iconColor : 'rgba(255, 255, 255, 0)'}
            rippleColor={rippleColor}
            onPress={this.handleClearPress}
            icon={
              clearIcon ||
              (({ size, color }) => (
                <MaterialCommunityIcon
                  name="close"
                  color={color}
                  size={size}
                  direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
                />
              ))
            }
            accessibilityTraits="button"
            accessibilityComponentType="button"
            accessibilityRole="button"
          />
        ) : (
          <IconButton
            borderless
            rippleColor={rippleColor}
            onPress={iconRight.onIconPress}
            color={customIconColorRight}
            icon={
              iconRight.icon ||
              (({ size, color }) => (
                <MaterialCommunityIcon
                  name="close"
                  color={color}
                  size={size}
                  direction={I18nManager.isRTL ? 'rtl' : 'ltr'}
                />
              ))
            }
          />
        )}
      </Surface>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: 8,
    alignSelf: 'stretch',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    minWidth: 0,
  },
});

export default withTheme(Searchbar);
