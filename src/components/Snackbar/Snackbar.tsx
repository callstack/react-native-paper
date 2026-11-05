import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import type {
  ColorValue,
  GestureResponderEvent,
  StyleProp,
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
import type { Elevation, Theme, ThemeProp } from '../../theme/types';
import { resolveCornerRadius } from '../../theme/utils/shape';
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
   * a part of the screen.
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
  ref?: React.RefObject<View>;
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
  messageInlineBasis,
  actionSpacing,
  iconSize,
  containerColor,
  messageColor,
  actionColor,
  iconColor,
} = SnackbarTokens;

type ActionButtonProps = {
  action: SnackbarAction;
  color: ColorValue;
  theme: Theme;
  onDismiss: () => void;
};

const ActionButton = ({
  action,
  color,
  theme,
  onDismiss,
}: ActionButtonProps) => (
  <Button
    aria-label={action.accessibilityLabel ?? action.label}
    mode="text"
    onPress={(event) => {
      action.onPress?.(event);
      onDismiss();
    }}
    style={action.style}
    testID={action.testID}
    theme={theme}
    textColor={color}
  >
    {action.label}
  </Button>
);

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
  elevation = 2,
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
    animation: { scale },
    motion: { duration: motionDuration, easing },
  } = theme;

  React.useEffect(() => {
    clearHideTimeout();

    if (!visible) {
      opacity.value = withTiming(
        0,
        {
          duration: motionDuration.short4 * scale,
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

    setMounted(true);

    opacity.value = withTiming(
      1,
      {
        duration: motionDuration.medium2 * scale,
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
    handleShown,
    motionDuration.medium2,
    motionDuration.short4,
    opacity,
    scale,
    visible,
  ]);

  React.useEffect(() => clearHideTimeout, [clearHideTimeout]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: interpolate(opacity.value, [0, 1], [0.9, 1]) }],
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

  if (!mounted) {
    return null;
  }

  const { colors } = theme;
  const isIconButton = Boolean(onIconPress);

  const snackbar = (
    <View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          paddingBottom: bottom,
          paddingHorizontal: Math.max(left, right),
        },
        wrapperStyle,
      ]}
    >
      <Surface
        aria-live="polite"
        theme={theme}
        backgroundColor={colors[containerColor]}
        borderRadius={resolveCornerRadius(theme, containerShape)}
        style={[styles.container, animatedStyle, style]}
        testID={testID}
        elevation={elevation}
        {...rest}
      >
        <Text
          variant="bodyMedium"
          style={[
            styles.message,
            { color: colors[messageColor] },
            messageStyle,
          ]}
          maxFontSizeMultiplier={maxFontSizeMultiplier}
        >
          {message}
        </Text>
        {action || isIconButton ? (
          <View style={styles.actions}>
            {action ? (
              <ActionButton
                action={action}
                color={colors[actionColor]}
                theme={theme}
                onDismiss={onDismiss}
              />
            ) : null}
            {isIconButton ? (
              <IconButton
                role="button"
                borderless
                size={iconSize}
                onPress={onIconPress}
                iconColor={colors[iconColor]}
                theme={theme}
                icon={icon ?? closeIcon}
                aria-label={iconAccessibilityLabel}
                style={styles.icon}
                testID={iconTestID}
              />
            ) : null}
          </View>
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    // Lines are trailing-aligned, so an action wrapped onto its own line sits
    // at the trailing edge below the message.
    justifyContent: 'flex-end',
    margin: screenMargin,
    minHeight,
    pointerEvents: 'box-none',
  },
  message: {
    // The message takes the space the action doesn't need, and claims only
    // `messageInlineBasis` up front, so an action which doesn't fit next to it
    // wraps onto its own line.
    flexBasis: messageInlineBasis,
    flexGrow: 1,
    marginStart: messageSpacing,
    marginEnd: messageTrailingSpacing,
    marginVertical: messageVerticalSpacing,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    // The actions are shorter than the message line they share, and than the
    // message itself once they wrap onto their own line, so they stay centered
    // against it either way.
    alignSelf: 'center',
    marginEnd: actionSpacing,
  },
  icon: {
    margin: 0,
  },
});

export default Snackbar;
