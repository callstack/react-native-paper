import * as React from 'react';
import { AccessibilityInfo, Platform, StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleProp,
  TextLayoutEvent,
  TextStyle,
  ViewProps,
  ViewStyle,
} from 'react-native';

import {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';

import { SnackbarTokens } from './tokens';
import { useLocale } from '../../core/locale';
import { useInternalTheme } from '../../core/theming';
import { useMotionDuration } from '../../theme/accessibility/ReduceMotionContext';
import type { Elevation, ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
import { FocusRingColorContext } from '../../utils/useFocusRing';
import Button from '../Button/Button';
import type { IconSource } from '../Icon';
import IconButton from '../IconButton/IconButton';
import MaterialCommunityIcon from '../MaterialCommunityIcon';
import Portal from '../Portal/Portal';
import Surface from '../Surface';
import type { SurfaceStyle } from '../Surface';
import Text from '../Typography/Text';

/**
 * Action rendered by the `Snackbar` next to its message.
 */
export type SnackbarAction = {
  /**
   * Label of the action.
   */
  label: string;
  /**
   * Callback which fires when the action is pressed. The Snackbar dismisses
   * itself right after, so there's no need to call `onDismiss` from here.
   */
  onPress?: (event: GestureResponderEvent) => void;
  /**
   * Accessibility label of the action, read by the screen reader when the user
   * focuses it. Defaults to `label`.
   */
  accessibilityLabel?: string;
  /**
   * testID for the action.
   */
  testID?: string;
  /**
   * Style for the action.
   */
  style?: StyleProp<ViewStyle>;
};

export type Props = Omit<ViewProps, 'children' | 'style'> & {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean;
  /**
   * Message shown by the Snackbar. It's meant for a short single line of text
   * and wraps onto a second line when it doesn't fit.
   */
  message: string;
  /**
   * Action displayed next to the message. The spec allows one action at most.
   */
  action?: SnackbarAction;
  /**
   * Icon to display when `onIconPress` is defined. Defaults to the `close` icon.
   */
  icon?: IconSource;
  /**
   * Function to execute on icon button press. The icon button appears only when this prop is specified.
   */
  onIconPress?: () => void;
  /**
   * Accessibility label for the icon button. This is read by the screen reader when the user taps the button.
   */
  iconAccessibilityLabel?: string;
  /**
   * testID for the icon button.
   */
  iconTestID?: string;
  /**
   * The duration in milliseconds for which the Snackbar is shown.
   * Pass `Infinity` to keep it on screen until it's dismissed manually.
   */
  duration?: number;
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
  /**
   * Changes Snackbar shadow and background on iOS and Android.
   */
  elevation?: Elevation;
  /**
   * Whether the Snackbar is rendered in a `Portal`, so that it overlays all
   * other content no matter where it sits in the tree. Set it to `false` to
   * render it within the parent, for example when it should be constrained to
   * a part of the screen or shown above a React Native `Modal`.
   */
  portal?: boolean;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  /**
   * Style for the wrapper of the Snackbar, the layer which pins it to the
   * bottom of the screen.
   */
  wrapperStyle?: StyleProp<ViewStyle>;
  /**
   * Style for the message of the Snackbar.
   */
  messageStyle?: StyleProp<TextStyle>;
  /**
   * Style for the container of the Snackbar.
   */
  style?: StyleProp<SurfaceStyle>;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

const {
  containerShape,
  minHeight,
  screenMargin,
  containerMaxWidth,
  messageSpacing,
  messageTrailingSpacing,
  messageVerticalSpacing,
  messageActionGap,
  maxInlineActionWidth,
  messageMaxLines,
  actionSpacing,
  actionBottomSpacing,
  iconSize,
  containerColor,
  messageColor,
  actionColor,
  iconColor,
} = SnackbarTokens;

/**
 * Snackbars provide brief feedback about an operation through a message at the
 * bottom of the screen. They are rendered in a `Portal` by default, so that
 * they overlay all other content.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { View, StyleSheet } from 'react-native';
 * import { Button, Snackbar } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(false);
 *
 *   const onToggleSnackBar = () => setVisible(!visible);
 *
 *   const onDismissSnackBar = () => setVisible(false);
 *
 *   return (
 *     <View style={styles.container}>
 *       <Button onPress={onToggleSnackBar}>{visible ? 'Hide' : 'Show'}</Button>
 *       <Snackbar
 *         visible={visible}
 *         onDismiss={onDismissSnackBar}
 *         message="Changes saved"
 *         action={{
 *           label: 'Undo',
 *           onPress: () => {
 *             // Do something
 *           },
 *         }}
 *       />
 *     </View>
 *   );
 * };
 *
 * const styles = StyleSheet.create({
 *   container: {
 *     flex: 1,
 *     justifyContent: 'space-between',
 *   },
 * });
 *
 * export default MyComponent;
 * ```
 */
const Snackbar = ({
  visible,
  message,
  action,
  icon,
  onIconPress,
  iconAccessibilityLabel = 'Close icon',
  iconTestID,
  duration = DURATION_MEDIUM,
  onDismiss,
  elevation = 3,
  portal = true,
  maxFontSizeMultiplier,
  wrapperStyle,
  messageStyle,
  style,
  theme: themeOverrides,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { direction } = useLocale();
  const { bottom, right, left } = useSafeAreaInsets();

  const opacity = useSharedValue(0);

  const hideTimeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const [mounted, setMounted] = React.useState(visible);
  const [isMultiline, setIsMultiline] = React.useState(false);
  const [actionWidth, setActionWidth] = React.useState(0);

  if (visible && !mounted) {
    setMounted(true);
  }

  const clearHideTimeout = React.useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = undefined;
    }
  }, []);

  // The auto-dismiss timer starts once the enter animation has settled, so the
  // message stays on screen for the whole `duration`.
  const handleShown = useLatestCallback(() => {
    clearHideTimeout();

    if (duration !== Number.POSITIVE_INFINITY) {
      hideTimeout.current = setTimeout(onDismiss, duration);
    }
  });

  const {
    motion: { duration: motionDuration, easing },
  } = theme;
  const getDuration = useMotionDuration();

  React.useEffect(() => {
    clearHideTimeout();

    if (!visible) {
      opacity.value = withTiming(
        0,
        {
          duration: getDuration(motionDuration.short4),
          easing: Easing.bezier(...easing.emphasizedAccelerate),
          reduceMotion: ReduceMotion.Never,
        },
        (finished) => {
          if (finished) {
            scheduleOnRN(setMounted, false);
          }
        }
      );

      return;
    }

    opacity.value = withTiming(
      1,
      {
        duration: getDuration(motionDuration.medium2),
        easing: Easing.bezier(...easing.emphasizedDecelerate),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        if (finished) {
          scheduleOnRN(handleShown);
        }
      }
    );
  }, [
    clearHideTimeout,
    easing.emphasizedAccelerate,
    easing.emphasizedDecelerate,
    getDuration,
    handleShown,
    motionDuration.medium2,
    motionDuration.short4,
    opacity,
    visible,
  ]);

  // `aria-live` only reaches Android and web; VoiceOver needs an explicit
  // announcement when the Snackbar appears.
  React.useEffect(() => {
    if (visible && Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility?.(message);
    }
  }, [message, visible]);

  React.useEffect(() => clearHideTimeout, [clearHideTimeout]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    // Scale only on enter. Material Components Android fades out without
    // shrinking the bar.
    transform: [
      {
        scale: visible ? interpolate(opacity.value, [0, 1], [0.9, 1]) : 1,
      },
    ],
  }));

  // Kept stable across renders, so that the icon isn't remounted on every update.
  const closeIcon = React.useMemo(
    () =>
      ({ size, color }: { size: number; color: ColorValue }) => (
        <MaterialCommunityIcon
          name="close"
          color={color}
          size={size}
          direction={direction}
        />
      ),
    [direction]
  );

  const handleMessageTextLayout = React.useCallback(
    (event: TextLayoutEvent) => {
      setIsMultiline(event.nativeEvent.lines.length > 1);
    },
    []
  );

  const handleActionsLayout = React.useCallback((event: LayoutChangeEvent) => {
    setActionWidth(event.nativeEvent.layout.width);
  }, []);

  const isIconButton = Boolean(onIconPress);
  const hasActions = Boolean(action) || isIconButton;
  // Match Material Components Android: stack the action only when the message
  // already wraps and the action is wider than the inline limit.
  const stacked =
    Boolean(action) && isMultiline && actionWidth > maxInlineActionWidth;

  const handleActionPress = (event: GestureResponderEvent) => {
    if (!visible) {
      return;
    }

    action?.onPress?.(event);
    onDismiss();
  };

  const handleIconPress = () => {
    if (!visible) {
      return;
    }

    onIconPress?.();
  };

  if (!mounted) {
    return null;
  }

  const { colors } = theme;

  const snackbar = (
    <View
      style={[
        styles.wrapper,
        {
          paddingBottom: bottom,
          // Screen-edge margin lives on the wrapper so `width: '100%'` on the
          // container cannot push the 8dp gap outside the viewport.
          paddingHorizontal: Math.max(left, right) + screenMargin,
        },
        wrapperStyle,
      ]}
    >
      <Surface
        aria-live="polite"
        theme={theme}
        backgroundColor={colors[containerColor]}
        borderRadius={resolveCornerRadius(theme, containerShape)}
        style={[
          styles.container,
          stacked ? styles.containerStacked : styles.containerInline,
          animatedStyle,
          style,
        ]}
        testID={testID}
        elevation={elevation}
        {...rest}
      >
        <Text
          variant="bodyMedium"
          style={[
            styles.message,
            stacked ? styles.messageStacked : styles.messageInline,
            !hasActions && styles.messageAlone,
            // Figma puts a 4dp gap only between the message and an action; a
            // close icon alone sits flush against the trailing edge.
            !stacked && action ? styles.messageWithAction : null,
            { color: colors[messageColor] },
            messageStyle,
          ]}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
          numberOfLines={messageMaxLines}
          onTextLayout={handleMessageTextLayout}
        >
          {message}
        </Text>
        {hasActions ? (
          // `secondary` barely shows on `inverseSurface`, so the action and
          // close button ring in `inversePrimary`, the action label's color.
          <FocusRingColorContext.Provider value={colors[actionColor]}>
            <View
              style={[
                styles.actions,
                stacked && styles.actionsStacked,
                // The close affordance is itself 48dp wide and owns the trailing
                // edge; without it the action keeps an 8dp trailing inset.
                isIconButton
                  ? styles.actionsWithClose
                  : stacked
                    ? styles.actionsStackedTrailing
                    : styles.actionsTrailing,
              ]}
              onLayout={handleActionsLayout}
              testID={testID ? `${testID}-actions` : undefined}
            >
              {action ? (
                <Button
                  aria-label={action.accessibilityLabel ?? action.label}
                  mode="text"
                  onPress={handleActionPress}
                  style={action.style}
                  testID={action.testID}
                  theme={theme}
                  textColor={colors[actionColor]}
                >
                  {action.label}
                </Button>
              ) : null}
              {isIconButton ? (
                <IconButton
                  role="button"
                  iconSize={iconSize}
                  onPress={handleIconPress}
                  iconColor={colors[iconColor]}
                  theme={theme}
                  icon={icon ?? closeIcon}
                  aria-label={iconAccessibilityLabel}
                  style={styles.icon}
                  testID={iconTestID}
                />
              ) : null}
            </View>
          </FocusRingColorContext.Provider>
        ) : null}
      </Surface>
    </View>
  );

  return portal ? <Portal theme={theme}>{snackbar}</Portal> : snackbar;
};

/**
 * Show the Snackbar for a short duration.
 */
Snackbar.DURATION_SHORT = DURATION_SHORT;

/**
 * Show the Snackbar for a medium duration.
 */
Snackbar.DURATION_MEDIUM = DURATION_MEDIUM;

/**
 * Show the Snackbar for a long duration.
 */
Snackbar.DURATION_LONG = DURATION_LONG;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    width: '100%',
    maxWidth: containerMaxWidth,
    marginVertical: screenMargin,
    minHeight,
    pointerEvents: 'box-none',
  },
  containerInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerStacked: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  message: {
    marginStart: messageSpacing,
    marginVertical: messageVerticalSpacing,
  },
  messageInline: {
    flexGrow: 1,
    flexShrink: 1,
  },
  messageWithAction: {
    marginEnd: messageActionGap,
  },
  messageStacked: {
    alignSelf: 'stretch',
    marginEnd: messageSpacing,
    // The Figma longer-action layout puts the vertical gap between the message
    // block and the action row, not under the message itself.
    marginBottom: 0,
  },
  messageAlone: {
    marginEnd: messageTrailingSpacing,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  actionsTrailing: {
    marginEnd: actionSpacing,
  },
  actionsWithClose: {
    marginEnd: 0,
  },
  actionsStacked: {
    paddingStart: actionSpacing,
  },
  actionsStackedTrailing: {
    paddingEnd: actionSpacing,
    paddingBottom: actionBottomSpacing,
  },
  icon: {
    margin: 0,
  },
});

export default Snackbar;
