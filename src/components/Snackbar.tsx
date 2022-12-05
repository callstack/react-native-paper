import * as React from 'react';
import {
  Animated,
  Easing,
  I18nManager,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { withInternalTheme } from '../core/theming';
import type { InternalTheme } from '../types';
import Button from './Button/Button';
import type { IconSource } from './Icon';
import IconButton from './IconButton/IconButton';
import MaterialCommunityIcon from './MaterialCommunityIcon';
import Surface from './Surface';
import Text from './Typography/Text';

export type Props = React.ComponentProps<typeof Surface> & {
  /**
   * Whether the Snackbar is currently visible.
   */
  visible: boolean;
  /**
   * Label and press callback for the action button. It should contain the following properties:
   * - `label` - Label of the action button
   * - `onPress` - Callback that is called when action button is pressed.
   */
  action?: Omit<React.ComponentProps<typeof Button>, 'children'> & {
    label: string;
  };
  /**
   * @supported Available in v5.x with theme version 3
   * Icon to display when `onIconPress` is defined. Default will be `close` icon.
   */
  icon?: IconSource;
  /**
   * @supported Available in v5.x with theme version 3
   * Function to execute on icon button press. The icon button appears only when this prop is specified.
   */
  onIconPress?: () => void;
  /**
   * @supported Available in v5.x with theme version 3
   * Accessibility label for the icon button. This is read by the screen reader when the user taps the button.
   */
  iconAccessibilityLabel?: string;
  /**
   * The duration for which the Snackbar is shown.
   */
  duration?: number;
  /**
   * Callback called when Snackbar is dismissed. The `visible` prop needs to be updated when this is called.
   */
  onDismiss: () => void;
  /**
   * Text content of the Snackbar.
   */
  children: React.ReactNode;
  /**
   * Style for the wrapper of the snackbar
   */
  /**
   * @supported Available in v5.x with theme version 3
   * Changes Snackbar shadow and background on iOS and Android.
   */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
  wrapperStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  ref?: React.RefObject<View>;
  /**
   * @optional
   */
  theme: InternalTheme;
};

const DURATION_SHORT = 4000;
const DURATION_MEDIUM = 7000;
const DURATION_LONG = 10000;

/**
 * Snackbars provide brief feedback about an operation through a message at the bottom of the screen.
 * Snackbar by default uses `onSurface` color from theme.
 * <div class="screenshots">
 *   <img class="small" src="screenshots/snackbar.gif" />
 * </div>
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
 *         action={{
 *           label: 'Undo',
 *           onPress: () => {
 *             // Do something
 *           },
 *         }}>
 *         Hey there! I'm a Snackbar.
 *       </Snackbar>
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
  action,
  icon,
  onIconPress,
  iconAccessibilityLabel = 'Close icon',
  duration = DURATION_MEDIUM,
  onDismiss,
  children,
  elevation = 2,
  wrapperStyle,
  style,
  theme,
  ...rest
}: Props) => {
  const { bottom, right, left } = useSafeAreaInsets();

  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(0.0)
  );
  const hideTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

  const [hidden, setHidden] = React.useState(!visible);

  const { scale } = theme.animation;

  React.useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  React.useLayoutEffect(() => {
    if (visible) {
      // show
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
      setHidden(false);
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200 * scale,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          const isInfinity =
            duration === Number.POSITIVE_INFINITY ||
            duration === Number.NEGATIVE_INFINITY;

          if (!isInfinity) {
            hideTimeout.current = setTimeout(
              onDismiss,
              duration
            ) as unknown as NodeJS.Timeout;
          }
        }
      });
    } else {
      // hide
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }

      Animated.timing(opacity, {
        toValue: 0,
        duration: 100 * scale,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setHidden(true);
        }
      });
    }
  }, [visible, duration, opacity, scale, onDismiss]);

  const { colors, roundness, isV3 } = theme;

  if (hidden) {
    return null;
  }

  const {
    style: actionStyle,
    label: actionLabel,
    onPress: onPressAction,
    ...actionProps
  } = action || {};

  const buttonTextColor = isV3 ? colors.inversePrimary : colors.accent;
  const textColor = isV3 ? colors.inverseOnSurface : colors?.surface;
  const backgroundColor = isV3 ? colors.inverseSurface : colors?.onSurface;

  const isIconButton = isV3 && onIconPress;

  const marginLeft = action ? -12 : -16;

  const wrapperPaddings = {
    paddingBottom: bottom,
    paddingHorizontal: Math.max(left, right),
  };

  const renderChildrenWithWrapper = () => {
    if (typeof children === 'string') {
      return (
        <Text
          variant="bodyMedium"
          style={[styles.content, { color: textColor }]}
        >
          {children}
        </Text>
      );
    }

    return (
      <View style={styles.content}>
        {/* View is added to allow multiple lines support for Text component as children */}
        <View>{children}</View>
      </View>
    );
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.wrapper, wrapperPaddings, wrapperStyle]}
    >
      <Surface
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={
          [
            !isV3 && styles.elevation,
            styles.container,
            {
              backgroundColor,
              borderRadius: roundness,
              opacity: opacity,
              transform: [
                {
                  scale: visible
                    ? opacity.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      })
                    : 1,
                },
              ],
            },
            style,
          ] as StyleProp<ViewStyle>
        }
        {...(isV3 && { elevation })}
        {...rest}
      >
        {renderChildrenWithWrapper()}
        {(action || isIconButton) && (
          <View style={[styles.actionsContainer, { marginLeft }]}>
            {action ? (
              <Button
                onPress={(event) => {
                  onPressAction?.(event);
                  onDismiss();
                }}
                style={[styles.button, actionStyle]}
                textColor={buttonTextColor}
                compact={!isV3}
                mode="text"
                {...actionProps}
              >
                {actionLabel}
              </Button>
            ) : null}
            {isIconButton ? (
              <IconButton
                accessibilityRole="button"
                borderless
                onPress={onIconPress}
                iconColor={theme.colors.inverseOnSurface}
                icon={
                  icon ||
                  (({ size, color }) => {
                    return (
                      <MaterialCommunityIcon
                        name="close"
                        color={color}
                        size={size}
                        direction={
                          I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'
                        }
                      />
                    );
                  })
                }
                accessibilityLabel={iconAccessibilityLabel}
                style={styles.icon}
              />
            ) : null}
          </View>
        )}
      </Surface>
    </View>
  );
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
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 8,
    borderRadius: 4,
    minHeight: 48,
  },
  content: {
    marginHorizontal: 16,
    marginVertical: 14,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minHeight: 48,
  },
  button: {
    marginRight: 8,
    marginLeft: 4,
  },
  elevation: {
    elevation: 6,
  },
  icon: {
    width: 40,
    height: 40,
    margin: 0,
  },
});

export default withInternalTheme(Snackbar);
