import * as React from 'react';
import { Platform, StyleSheet, TextInput, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
  TextInputProps,
  TextStyle,
  ViewStyle,
} from 'react-native';

import { cubicBezier, type CSSStyle } from 'react-native-reanimated';

import { SearchbarTokens } from './tokens';
import { getSearchbarColors, getSearchbarInputFont } from './utils';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useReduceMotion } from '../../theme/accessibility/ReduceMotionContext';
import type { Elevation, ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import ActivityIndicator from '../ActivityIndicator';
import Divider from '../Divider';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';

interface Style {
  marginRight: number;
}

/**
 * The properties `Surface` transitions by default. A `transitionProperty` set
 * through `style` replaces the one `Surface` applies, so the useful ones are
 * repeated here next to the animated focus margin below. The list mirrors
 * `Surface` and differs per platform because shadow properties do.
 */
type SurfaceTransitionProperty = keyof ViewStyle;

const SURFACE_TRANSITION_PROPERTIES: SurfaceTransitionProperty[] =
  Platform.select({
    web: ['backgroundColor', 'boxShadow'],
    android: ['backgroundColor', 'elevation'],
    default: [
      'backgroundColor',
      'shadowOpacity',
      'shadowOffset',
      'shadowRadius',
    ],
  });

/**
 * Whether the blur event below moves focus to one of the bar's own buttons.
 * react-native-web forwards the DOM blur event, whose `relatedTarget` names
 * the element taking focus next, and the bar's DOM node is the only way to
 * tell that it stayed inside. Native taps never blur the input, and the event
 * can be missing altogether, so anything that is not a web event is a "no".
 */
function isFocusInsideBar(blurEvent: unknown, node: Element | null): boolean {
  if (
    Platform.OS !== 'web' ||
    typeof blurEvent !== 'object' ||
    blurEvent === null
  ) {
    return false;
  }

  const relatedTarget =
    'relatedTarget' in blurEvent ? blurEvent.relatedTarget : undefined;

  return (
    relatedTarget instanceof Node && (node?.contains(relatedTarget) ?? false)
  );
}

export type Props = Omit<TextInputProps, 'style'> & {
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
   * - `contained` - the recommended M3 Expressive style: a rounded bar
   *   whose horizontal margins animate from 24dp down to 12dp on focus
   *   (grow-wider effect). A `marginHorizontal`, `marginStart`, `marginEnd`,
   *   `marginLeft` or `marginRight` set through `style` replaces the animated
   *   margin on that side, so the bar keeps it. The `margin` shorthand does
   *   not, since a per-axis margin takes precedence over it.
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
   * testID for the left icon button (see `onIconPress`).
   */
  searchTestID?: string;
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
   * testID for the clear button.
   */
  clearTestID?: string;
  /**
   * Icon name for the right trailing icon button.
   * Works only when `mode` is set to "contained". It won't be displayed if `loading` is set to `true`.
   */
  trailingIcon?: IconSource;
  /**
   * Custom color for the right trailing icon, default will be derived from theme
   */
  trailingIconColor?: ColorValue;
  /**
   * Callback to execute on the right trailing icon button press.
   */
  onTrailingIconPress?: (e: GestureResponderEvent) => void;
  /**
   * Accessibility label for the right trailing icon button. This is read by the screen reader when the user taps the button.
   */
  trailingIconAccessibilityLabel?: string;
  /**
   * testID for the right trailing icon button.
   */
  trailingTestID?: string;
  /**
   * Callback which returns a React element to display on the right side.
   * Works only when `mode` is set to "contained".
   */
  right?: (props: {
    color: ColorValue;
    style: Style;
    testID?: string;
  }) => React.ReactNode;
  /**
   * Whether to show `Divider` at the bottom of the search.
   * Works only when `mode` is set to "divided". True by default.
   */
  showDivider?: boolean;
  /**
   * Changes Searchbar shadow and background on iOS and Android.
   */
  elevation?: Elevation;
  /**
   * Set style of the TextInput component inside the searchbar
   */
  inputStyle?: StyleProp<TextStyle>;
  /**
   * Style of the Searchbar.
   *
   * Applied to the `Surface` that draws the bar, along with any Reanimated
   * style. Background color and border radius should be set through the
   * `theme` instead.
   */
  style?: StyleProp<SurfaceStyle>;
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
  searchTestID,
  clearIcon,
  clearAccessibilityLabel = 'clear',
  clearTestID,
  onClearIconPress,
  trailingIcon,
  trailingIconColor: customTrailingIconColor,
  trailingIconAccessibilityLabel,
  trailingTestID,
  onTrailingIconPress,
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
  testID,
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
  const shouldRenderTrailingIcon =
    isContained && trailingIcon && !loading && (!value || right !== undefined);

  const borderRadius = resolveCornerRadius(
    theme,
    isContained ? SearchbarTokens.contained : SearchbarTokens.divided
  );

  // A two-state transition, so a Reanimated CSS transition on a plain style
  // placed before `style`, which lets the consumer override the margin.
  const [focused, setFocused] = React.useState(false);
  // Pressing one of the bar's own buttons blurs the input on web, and
  // collapsing then moves the button out from under the pointer. The bar stays
  // expanded until focus leaves it entirely.
  const [focusHeldInside, setFocusHeldInside] = React.useState(false);
  // An object ref would reach `Surface` as a `forwardedRef` prop. Typed as an
  // `HTMLElement` so `focusout` resolves to a typed `FocusEvent` listener.
  const barNodeRef = React.useRef<HTMLElement | null>(null);
  const expanded = focused || focusHeldInside;

  const handleBarRef = React.useCallback((instance: View | null) => {
    // On web react-native-web resolves a view ref to the DOM node it rendered.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
    barNodeRef.current = instance as unknown as HTMLElement | null;
  }, []);

  React.useEffect(() => {
    if (!focusHeldInside || Platform.OS !== 'web') {
      return;
    }

    const node = barNodeRef.current;

    const handleFocusOut = (event: FocusEvent) => {
      const staysInside =
        event.relatedTarget instanceof Node &&
        !!node?.contains(event.relatedTarget);
      if (!staysInside) {
        setFocusHeldInside(false);
      }
    };

    node?.addEventListener('focusout', handleFocusOut);
    return () => node?.removeEventListener('focusout', handleFocusOut);
  }, [focusHeldInside]);

  const handleFocus: NonNullable<TextInputProps['onFocus']> = (e) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: NonNullable<TextInputProps['onBlur']> = (e) => {
    setFocused(false);
    setFocusHeldInside(isFocusInsideBar(e, barNodeRef.current));
    onBlur?.(e);
  };

  const focusTransitionStyle: CSSStyle<ViewStyle> = {
    marginHorizontal: expanded
      ? SearchbarTokens.marginFocused
      : SearchbarTokens.marginUnfocused,
    transitionProperty: [
      // RNW writes this out as CSS `margin-inline`, which web has to name.
      'marginHorizontal',
      ...(Platform.OS === 'web'
        ? (['marginInline'] as SurfaceTransitionProperty[])
        : []),
      ...SURFACE_TRANSITION_PROPERTIES,
    ],
    transitionTimingFunction: cubicBezier(...theme.motion.easing.standard),
  };

  return (
    <Surface
      ref={handleBarRef}
      backgroundColor={containerColor}
      borderRadius={borderRadius}
      style={[
        styles.container,
        isContained ? focusTransitionStyle : null,
        style,
      ]}
      // `Surface` applies its own duration after `style`, hence the prop.
      transitionDuration={
        reduceMotion ? 0 : theme.motion.duration.medium2 * theme.animation.scale
      }
      elevation={elevation}
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
        testID={searchTestID}
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
        <ActivityIndicator style={styles.v3Loader} />
      ) : (
        // Clear icon should be always rendered within Searchbar – it's transparent,
        // without touch events, when there is no value. It's done to avoid issues
        // with the abruptly stopping ripple effect and changing bar width on web,
        // when clearing the value.
        <View
          pointerEvents={value ? 'auto' : 'none'}
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
            testID={clearTestID}
            role="button"
            theme={theme}
          />
        </View>
      )}
      {shouldRenderTrailingIcon ? (
        <IconButton
          role="button"
          borderless
          onPress={onTrailingIconPress}
          iconColor={customTrailingIconColor || trailingIconColor}
          icon={trailingIcon}
          aria-label={trailingIconAccessibilityLabel}
          theme={theme}
          testID={trailingTestID}
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
        />
      )}
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
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
