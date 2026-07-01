import * as React from 'react';
import {
  Animated,
  Easing,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { SearchbarTokens } from './tokens';
import { getSearchbarColors, getSearchbarInputFont } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { Theme, ThemeProp } from '../../types';
import ActivityIndicator from '../ActivityIndicator';
import Divider from '../Divider';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';

interface Style {
  marginRight: number;
}

export type Props = TextInputProps & {
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
   * Search layout mode, the default value is "contained".
   * - `contained` - the recommended M3 Expressive style: a rounded, elevated
   *   bar whose horizontal margins shrink on focus (grow-wider effect).
   * - `divided` - a full-bleed search view with square corners and a bottom
   *   `Divider`. Deprecated in M3 Expressive in favor of `contained`.
   */
  mode?: 'contained' | 'divided';
  /**
   * Icon name for the left icon button (see `onIconPress`).
   */
  icon?: IconSource;
  /**
   * Custom color for icon, default will be derived from theme
   */
  iconColor?: ColorValue;
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
   * In v5.x with theme version 3, `clearIcon` is visible only if `right` prop is not defined.
   */
  clearIcon?: IconSource;
  /**
   * Accessibility label for the button. This is read by the screen reader when the user taps the button.
   */
  clearAccessibilityLabel?: string;
  /**
   * @supported Available in v5.x with theme version 3
   * Icon name for the right trailering icon button.
   * Works only when `mode` is set to "contained". It won't be displayed if `loading` is set to `true`.
   */
  traileringIcon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Custom color for the right trailering icon, default will be derived from theme
   */
  traileringIconColor?: ColorValue;
  /**
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
   * Works only when `mode` is set to "contained".
   */
  right?: (props: {
    color: ColorValue;
    style: Style;
    testID: string;
  }) => React.ReactNode;
  /**
   * @supported Available in v5.x with theme version 3
   * Whether to show `Divider` at the bottom of the search.
   * Works only when `mode` is set to "divided". True by default.
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
  ref?: React.Ref<TextInputHandles>;
};

type TextInputHandles = Pick<
  TextInput,
  'setNativeProps' | 'isFocused' | 'clear' | 'blur' | 'focus' | 'setSelection'
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
const Searchbar = ({
  icon,
  iconColor: customIconColor,
  onIconPress,
  searchAccessibilityLabel = 'search',
  clearIcon,
  clearAccessibilityLabel = 'clear',
  onClearIconPress,
  traileringIcon,
  traileringIconColor,
  traileringIconAccessibilityLabel,
  onTraileringIconPress,
  right,
  mode = 'contained',
  showDivider = true,
  inputStyle,
  placeholder,
  elevation = 0,
  style,
  theme: themeOverrides,
  value,
  loading = false,
  testID = 'search-bar',
  onFocus,
  onBlur,
  ref,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const reduceMotion = useReduceMotion();
  const { colors } = theme as Theme;
  const root = React.useRef<TextInput>(null);

  React.useImperativeHandle(ref, () => ({
    focus: () => root.current?.focus(),
    clear: () => root.current?.clear(),
    setNativeProps: (args: TextInputProps) =>
      root.current?.setNativeProps(args),
    isFocused: () => root.current?.isFocused() || false,
    blur: () => root.current?.blur(),
    setSelection: (start: number, end: number) =>
      root.current?.setSelection(start, end),
  }));

  const handleClearPress = (e: any) => {
    root.current?.clear();
    rest.onChangeText?.('');
    onClearIconPress?.(e);
  };

  const { dark } = theme;

  const {
    inputColor,
    placeholderColor,
    leadingIconColor,
    trailingIconColor,
    cursorColor,
    dividerColor,
  } = getSearchbarColors(theme);
  const iconColor = customIconColor || leadingIconColor;

  const font = getSearchbarInputFont(theme);

  const isContained = mode === 'contained';
  const inputTextAlign = direction === 'rtl' ? 'right' : 'left';
  const shouldRenderTraileringIcon =
    isContained &&
    traileringIcon &&
    !loading &&
    (!value || right !== undefined);

  const borderRadius = resolveCornerRadius(
    theme,
    isContained ? SearchbarTokens.contained : SearchbarTokens.divided
  );

  // M3 Expressive focus transition: the contained bar grows wider on focus as
  // its horizontal margin shrinks from `marginUnfocused` to `marginFocused`.
  // `marginHorizontal` is a layout prop, so it must be animated on the JS
  // driver (`useNativeDriver: false`) for the relayout to actually happen.
  const marginAnim = React.useRef(
    new Animated.Value(SearchbarTokens.marginUnfocused)
  ).current;

  const animateMargin = (toValue: number) => {
    if (reduceMotion) {
      marginAnim.setValue(toValue);
      return;
    }
    Animated.timing(marginAnim, {
      toValue,
      duration: theme.motion.duration.short4,
      easing: Easing.bezier(...theme.motion.easing.standard),
      useNativeDriver: false,
    }).start();
  };

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    if (isContained) {
      animateMargin(SearchbarTokens.marginFocused);
    }
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    if (isContained) {
      animateMargin(SearchbarTokens.marginUnfocused);
    }
    onBlur?.(e);
  };

  return (
    <Animated.View
      style={isContained ? { marginHorizontal: marginAnim } : undefined}
      testID={`${testID}-container-wrapper`}
    >
      <Surface
        style={[
          styles.container,
          { backgroundColor: colors.surfaceContainerHigh, borderRadius },
          style,
        ]}
        testID={`${testID}-container`}
        elevation={elevation}
        container
        theme={theme}
      >
        <IconButton
          role="button"
          borderless
          onPress={onIconPress}
          iconColor={iconColor}
          icon={
            icon ||
            (({ size, color }) => (
              <MaterialCommunityIcon
                name="magnify"
                color={color}
                size={size}
                direction={direction}
              />
            ))
          }
          theme={theme}
          aria-label={searchAccessibilityLabel}
          testID={`${testID}-icon`}
        />
        <TextInput
          style={[
            styles.input,
            {
              color: inputColor,
              ...font,
              ...Platform.select({ web: { outline: 'none' } }),
              textAlign: inputTextAlign,
            },
            isContained ? styles.containedInput : styles.dividedInput,
            inputStyle,
          ]}
          placeholder={placeholder || ''}
          placeholderTextColor={placeholderColor}
          selectionColor={cursorColor}
          underlineColorAndroid="transparent"
          returnKeyType="search"
          keyboardAppearance={dark ? 'dark' : 'light'}
          role="searchbox"
          ref={root}
          value={value}
          testID={testID}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...rest}
        />
        {loading ? (
          <ActivityIndicator
            testID="activity-indicator"
            style={styles.v3Loader}
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
              !value && styles.v3ClearIcon,
              right !== undefined && styles.v3ClearIconHidden,
            ]}
          >
            <IconButton
              borderless
              aria-label={clearAccessibilityLabel}
              iconColor={value ? iconColor : 'rgba(255, 255, 255, 0)'}
              onPress={handleClearPress}
              icon={
                clearIcon ||
                (({ size, color }) => (
                  <MaterialCommunityIcon
                    name="close"
                    color={color}
                    size={size}
                    direction={direction}
                  />
                ))
              }
              testID={`${testID}-clear-icon`}
              role="button"
              theme={theme}
            />
          </View>
        )}
        {shouldRenderTraileringIcon ? (
          <IconButton
            role="button"
            borderless
            onPress={onTraileringIconPress}
            iconColor={traileringIconColor || trailingIconColor}
            icon={traileringIcon}
            aria-label={traileringIconAccessibilityLabel}
            testID={`${testID}-trailering-icon`}
          />
        ) : null}
        {isContained &&
          right?.({ color: inputColor, style: styles.rightStyle, testID })}
        {!isContained && showDivider && (
          <Divider
            bold
            style={[
              styles.divider,
              {
                backgroundColor: dividerColor,
              },
            ]}
            testID={`${testID}-divider`}
          />
        )}
      </Surface>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 18,
    paddingLeft: SearchbarTokens.inputPaddingHorizontal,
    alignSelf: 'stretch',
    minWidth: 0,
  },
  containedInput: {
    paddingLeft: 0,
    minHeight: SearchbarTokens.minHeight,
  },
  dividedInput: {
    paddingLeft: 0,
    minHeight: SearchbarTokens.dividedMinHeight,
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
