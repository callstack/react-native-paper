import * as React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import type {
  Animated,
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import Reanimated, {
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import type { AnimatedStyle } from 'react-native-reanimated';

import { SearchbarTokens } from './tokens';
import { getSearchbarColors, getSearchbarInputFont } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import { toRawSpring } from '../../theme/tokens/sys/motion';
import { resolveCornerRadius } from '../../theme/utils/shape';
import type { ThemeProp } from '../../types';
import { splitStyles } from '../../utils/splitStyles';
import ActivityIndicator from '../ActivityIndicator';
import Divider from '../Divider';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';

interface Style {
  marginRight: number;
}

const OUTER_LAYOUT_STYLE_KEYS: (keyof ViewStyle)[] = [
  'position',
  'alignSelf',
  'top',
  'right',
  'bottom',
  'left',
  'start',
  'end',
  'flex',
  'flexBasis',
  'flexShrink',
  'flexGrow',
  'width',
  'minWidth',
  'maxWidth',
  'height',
  'minHeight',
  'maxHeight',
  'aspectRatio',
  'transform',
  'opacity',
  'zIndex',
  'display',
];

const VERTICAL_FILL_STYLE_KEYS: (keyof ViewStyle)[] = [
  'height',
  'minHeight',
  'maxHeight',
  'flex',
  'flexGrow',
  'flexBasis',
];

const HORIZONTAL_MARGIN_KEYS = [
  'margin',
  'marginHorizontal',
  'marginLeft',
  'marginRight',
  'marginStart',
  'marginEnd',
  'marginInline',
  'marginInlineStart',
  'marginInlineEnd',
] as const;

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
   * Search layout mode, the default value is "contained".
   * - `contained` - the recommended M3 Expressive style: a rounded, elevated
   *   bar whose horizontal margins animate from 24dp down to 12dp on focus
   *   (grow-wider effect). Providing any horizontal margin via `style`
   *   replaces the built-in margin and disables the focus transition.
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
   * Icon name for the right trailering icon button.
   * Works only when `mode` is set to "contained". It won't be displayed if `loading` is set to `true`.
   */
  traileringIcon?: IconSource;
  /**
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
   * Callback which returns a React element to display on the right side.
   * Works only when `mode` is set to "contained".
   */
  right?: (props: {
    color: ColorValue;
    style: Style;
    testID: string;
  }) => React.ReactNode;
  /**
   * Whether to show `Divider` at the bottom of the search.
   * Works only when `mode` is set to "divided". True by default.
   */
  showDivider?: boolean;
  /**
   * Changes Searchbar shadow and background on iOS and Android.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  /**
   * Set style of the TextInput component inside the searchbar
   */
  inputStyle?: StyleProp<TextStyle>;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
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
    containerColor,
    inputColor,
    placeholderColor,
    leadingIconColor,
    trailingIconColor,
    cursorColor,
    dividerColor,
  } = React.useMemo(() => getSearchbarColors(theme), [theme]);
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

  const reanimatedReduceMotion = reduceMotion
    ? ReduceMotion.Always
    : ReduceMotion.Never;

  // M3 Expressive focus transition: the contained bar grows wider on focus as
  // its horizontal margin shrinks from `marginUnfocused` to `marginFocused`.
  const focusMargin = useSharedValue<number>(SearchbarTokens.marginUnfocused);

  const growSpring = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.fast.spatial),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion.spring.fast.spatial, reanimatedReduceMotion]
  );
  const shrinkSpring = React.useMemo(
    () => ({
      ...toRawSpring(theme.motion.spring.default.spatial),
      reduceMotion: reanimatedReduceMotion,
    }),
    [theme.motion.spring.default.spatial, reanimatedReduceMotion]
  );

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    focusMargin.value = withSpring(SearchbarTokens.marginFocused, growSpring);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    focusMargin.value = withSpring(
      SearchbarTokens.marginUnfocused,
      shrinkSpring
    );
    onBlur?.(e);
  };

  // Long-form margins on purpose: reanimated's web updater bypasses
  // react-native-web's preprocessing, which is the only place the
  // `marginHorizontal` shorthand gets expanded — as a raw DOM style
  // it would be silently ignored.
  const containedMarginStyle = useAnimatedStyle(() => ({
    marginLeft: focusMargin.value,
    marginRight: focusMargin.value,
  }));

  // A consumer-provided horizontal margin wins over the built-in one and
  // disables the focus transition.
  const flatStyle = StyleSheet.flatten<ViewStyle>(style);
  const hasCustomHorizontalMargin = HORIZONTAL_MARGIN_KEYS.some(
    (key) => flatStyle?.[key] !== undefined
  );
  const applyFocusMargin = isContained && !hasCustomHorizontalMargin;
  const [surfaceStyle, wrapperStyle] = splitStyles(
    flatStyle || {},
    (key) => OUTER_LAYOUT_STYLE_KEYS.includes(key) || key.startsWith('margin')
  );
  const shouldFillWrapper = VERTICAL_FILL_STYLE_KEYS.some(
    (key) => flatStyle?.[key] !== undefined
  );
  const hasWrapperStyle = Object.keys(wrapperStyle).length > 0;

  return (
    <Reanimated.View
      style={hasWrapperStyle ? wrapperStyle : null}
      testID={`${testID}-wrapper`}
    >
      <Reanimated.View
        style={applyFocusMargin ? containedMarginStyle : null}
        testID={`${testID}-focus-wrapper`}
      >
        <Surface
          style={[
            styles.container,
            shouldFillWrapper && styles.fillWrapper,
            { backgroundColor: containerColor, borderRadius },
            surfaceStyle,
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
                iconColor={value ? trailingIconColor : 'rgba(255, 255, 255, 0)'}
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
              theme={theme}
              testID={`${testID}-trailering-icon`}
            />
          ) : null}
          {isContained &&
            right?.({
              color: trailingIconColor,
              style: styles.rightStyle,
              testID,
            })}
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
      </Reanimated.View>
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fillWrapper: {
    flex: 1,
  },
  input: {
    flex: 1,
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
