import * as React from 'react';
import {
  Animated,
  ColorValue,
  GestureResponderEvent,
  I18nManager,
  Platform,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';

import color from 'color';

import ActivityIndicator from './ActivityIndicator';
import Divider from './Divider';
import type { IconSource } from './Icon';
import IconButton from './IconButton/IconButton';
import MaterialCommunityIcon from './MaterialCommunityIcon';
import Surface from './Surface';
import { useInternalTheme } from '../core/theming';
import type { ThemeProp } from '../types';
import { forwardRef } from '../utils/forwardRef';

interface Style {
  marginRight: number;
}

export type Props = React.ComponentPropsWithRef<typeof TextInput> & {
  /**
   * Hint text shown when the input is empty.
   */
  placeholder?: string;
  /**
   * The value of the text input.
   */
  value: string;
  /**
   * Callback that is called when the text input's text changes.
   */
  onChangeText?: (query: string) => void;
  /**
   * @supported Available in v5.x with theme version 3
   * Search layout mode, the default value is "bar".
   */
  mode?: 'bar' | 'view';
  /**
   * Icon name for the left icon button (see `onIconPress`).
   */
  icon?: IconSource;
  /**
   * Custom color for icon, default will be derived from theme
   */
  iconColor?: string;
  /**
   * Color of the ripple effect.
   */
  rippleColor?: ColorValue;
  /**
   * Callback to execute if we want the left icon to act as button.
   */
  onIconPress?: (e: GestureResponderEvent) => void;

  /**
   * Callback to execute if we want to add custom behaviour to close icon button.
   */
  onClearIconPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  searchAccessibilityLabel?: string;
  /**
   * Custom icon for clear button, default will be icon close. It's visible when `loading` is set to `false`.
   * In v5.x with theme version 3, `clearIcon` is visible only `right` prop is not defined.
   */
  clearIcon?: IconSource;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  clearAccessibilityLabel?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Icon name for the right trailering icon button.
   * Works only when `mode` is set to "bar". It won't be displayed if `loading` is set to `true`.
   */
  traileringIcon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for the right trailering icon, default will be derived from theme
   */
  traileringIconColor?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Color of the trailering icon ripple effect.
   */
  traileringRippleColor?: ColorValue;
  /**
   * @supported Available in v5.x with theme version 3
   * Callback to execute on the right trailering icon button press.
   */
  onTraileringIconPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label for the right trailering icon button. This is read by the screen reader when the user taps the button.
   */
  traileringIconAccessibilityLabel?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Callback which returns a React element to display on the right side.
   * Works only when `mode` is set to "bar".
   */
  right?: (props: {
    color: string;
    style: Style;
    testID: string;
  }) => React.ReactNode;
  /**
   * @supported Available in v5.x with theme version 3
   * Whether to show `Divider` at the bottom of the search.
   * Works only when `mode` is set to "view". True by default.
   */
  showDivider?: boolean;
  /**
   * @supported Available in v5.x with theme version 3
   * Changes Searchbar shadow and background on iOS and Android.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  /**
   * Set style of the TextInput component inside the searchbar
   */
  inputStyle?: StyleProp<TextStyle>;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * Custom flag for replacing clear button with activity indicator.
   */
  loading?: Boolean;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * @optional
   */
  theme?: ThemeProp;
};

type TextInputHandles = Pick<
  TextInput,
  'setNativeProps' | 'isFocused' | 'clear' | 'blur' | 'focus'
>;

/**
 * Searchbar is a simple input box where users can type search queries.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Searchbar } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [searchQuery, setSearchQuery] = React.useState('');
 *
 *   return (
 *     <Searchbar
 *       placeholder="Search"
 *       onChangeText={setSearchQuery}
 *       value={searchQuery}
 *     />
 *   );
 * };
 *
 * export default MyComponent;

 * ```
 */
const Searchbar = forwardRef<TextInputHandles, Props>(
  (
    {
      icon,
      iconColor: customIconColor,
      rippleColor: customRippleColor,
      onIconPress,
      searchAccessibilityLabel = 'search',
      clearIcon,
      clearAccessibilityLabel = 'clear',
      onClearIconPress,
      traileringIcon,
      traileringIconColor,
      traileringIconAccessibilityLabel,
      traileringRippleColor: customTraileringRippleColor,
      onTraileringIconPress,
      right,
      mode = 'bar',
      showDivider = true,
      inputStyle,
      placeholder,
      elevation = 0,
      style,
      theme: themeOverrides,
      value,
      loading = false,
      testID = 'search-bar',
      ...rest
    }: Props,
    ref
  ) => {
    const theme = useInternalTheme(themeOverrides);
    const root = React.useRef<TextInput>(null);

    React.useImperativeHandle(ref, () => {
      const input = root.current;

      if (input) {
        return {
          focus: () => input.focus(),
          clear: () => input.clear(),
          setNativeProps: (args: TextInputProps) => input.setNativeProps(args),
          isFocused: () => input.isFocused(),
          blur: () => input.blur(),
        };
      }

      const noop = () => {
        throw new Error('TextInput is not available');
      };

      return {
        focus: noop,
        clear: noop,
        setNativeProps: noop,
        isFocused: noop,
        blur: noop,
      };
    });

    const handleClearPress = (e: any) => {
      root.current?.clear();
      rest.onChangeText?.('');
      onClearIconPress?.(e);
    };

    const { roundness, dark, isV3, fonts } = theme;

    const placeholderTextColor = isV3
      ? theme.colors.onSurface
      : theme.colors?.placeholder;
    const textColor = isV3 ? theme.colors.onSurfaceVariant : theme.colors.text;
    const md2IconColor = dark
      ? textColor
      : color(textColor).alpha(0.54).rgb().string();
    const iconColor =
      customIconColor || (isV3 ? theme.colors.onSurfaceVariant : md2IconColor);
    const rippleColor =
      customRippleColor || color(textColor).alpha(0.32).rgb().string();
    const traileringRippleColor =
      customTraileringRippleColor ||
      color(textColor).alpha(0.32).rgb().string();

    const font = isV3
      ? {
          ...fonts.bodyLarge,
          lineHeight: Platform.select({
            ios: 0,
            default: fonts.bodyLarge.lineHeight,
          }),
        }
      : theme.fonts.regular;

    const isBarMode = isV3 && mode === 'bar';
    const shouldRenderTraileringIcon =
      isBarMode &&
      traileringIcon &&
      !loading &&
      (!value || right !== undefined);

    return (
      <Surface
        style={[
          { borderRadius: roundness },
          !isV3 && styles.elevation,
          isV3 && {
            backgroundColor: theme.colors.elevation.level3,
            borderRadius: roundness * (isBarMode ? 7 : 0),
          },
          styles.container,
          style,
        ]}
        testID={`${testID}-container`}
        {...(theme.isV3 && { elevation })}
        theme={theme}
      >
        <IconButton
          accessibilityRole="button"
          borderless
          rippleColor={rippleColor}
          onPress={onIconPress}
          iconColor={iconColor}
          icon={
            icon ||
            (({ size, color }) => (
              <MaterialCommunityIcon
                name="magnify"
                color={color}
                size={size}
                direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
              />
            ))
          }
          theme={theme}
          accessibilityLabel={searchAccessibilityLabel}
          testID={`${testID}-icon`}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: textColor,
              ...font,
              ...Platform.select({ web: { outline: 'none' } }),
            },
            isV3 && (isBarMode ? styles.barModeInput : styles.viewModeInput),
            inputStyle,
          ]}
          placeholder={placeholder || ''}
          placeholderTextColor={placeholderTextColor}
          selectionColor={theme.colors?.primary}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          keyboardAppearance={dark ? 'dark' : 'light'}
          accessibilityRole="search"
          ref={root}
          value={value}
          testID={testID}
          {...rest}
        />
        {loading ? (
          <ActivityIndicator
            testID="activity-indicator"
            style={isV3 ? styles.v3Loader : styles.loader}
          />
        ) : (
          // Clear icon should be always rendered within Searchbar – it's transparent,
          // without touch events, when there is no value. It's done to avoid issues
          // with the abruptly stopping ripple effect and changing bar width on web,
          // when clearing the value.
          <View
            pointerEvents={value ? 'auto' : 'none'}
            testID={`${testID}-icon-wrapper`}
            style={[
              isV3 && !value && styles.v3ClearIcon,
              isV3 && right !== undefined && styles.v3ClearIconHidden,
            ]}
          >
            <IconButton
              borderless
              accessibilityLabel={clearAccessibilityLabel}
              iconColor={value ? iconColor : 'rgba(255, 255, 255, 0)'}
              rippleColor={rippleColor}
              onPress={handleClearPress}
              icon={
                clearIcon ||
                (({ size, color }) => (
                  <MaterialCommunityIcon
                    name={isV3 ? 'close' : 'close-circle-outline'}
                    color={color}
                    size={size}
                    direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
                  />
                ))
              }
              testID={`${testID}-clear-icon`}
              accessibilityRole="button"
              theme={theme}
            />
          </View>
        )}
        {shouldRenderTraileringIcon ? (
          <IconButton
            accessibilityRole="button"
            borderless
            onPress={onTraileringIconPress}
            iconColor={traileringIconColor || theme.colors.onSurfaceVariant}
            rippleColor={traileringRippleColor}
            icon={traileringIcon}
            accessibilityLabel={traileringIconAccessibilityLabel}
            testID={`${testID}-trailering-icon`}
          />
        ) : null}
        {isBarMode &&
          right?.({ color: textColor, style: styles.rightStyle, testID })}
        {isV3 && !isBarMode && showDivider && (
          <Divider
            bold
            style={[
              styles.divider,
              {
                backgroundColor: theme.colors.outline,
              },
            ]}
            testID={`${testID}-divider`}
          />
        )}
      </Surface>
    );
  }
);

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
    textAlign: I18nManager.getConstants().isRTL ? 'right' : 'left',
    minWidth: 0,
  },
  barModeInput: {
    paddingLeft: 0,
    minHeight: 56,
  },
  viewModeInput: {
    paddingLeft: 0,
    minHeight: 72,
  },
  elevation: {
    elevation: 4,
  },
  loader: {
    margin: 10,
  },
  v3Loader: {
    marginHorizontal: 16,
  },
  rightStyle: {
    marginRight: 16,
  },
  v3ClearIcon: {
    position: 'absolute',
    right: 0,
    marginLeft: 16,
  },
  v3ClearIconHidden: {
    display: 'none',
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default Searchbar;
