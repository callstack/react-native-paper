import * as React from 'react';
import {
  Animated,
  Easing,
  SafeAreaView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { withInternalTheme } from '../core/theming';
import type { InternalTheme } from '../types';
import Button from './Button/Button';
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
  duration = DURATION_MEDIUM,
  onDismiss,
  children,
  elevation = 2,
  wrapperStyle,
  style,
  theme,
  ...rest
}: Props) => {
  const { current: opacity } = React.useRef<Animated.Value>(
    new Animated.Value(0.0)
  );
  const [hidden, setHidden] = React.useState<boolean>(!visible);

  const hideTimeout = React.useRef<NodeJS.Timeout | undefined>(undefined);

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

          if (finished && !isInfinity) {
            hideTimeout.current = setTimeout(
              onDismiss,
              duration
            ) as unknown as NodeJS.Timeout;
          }
        }
      });
    } else {
      // hide
      if (hideTimeout.current) clearTimeout(hideTimeout.current);

      Animated.timing(opacity, {
        toValue: 0,
        duration: 100 * scale,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setHidden(true);
      });
    }
  }, [visible, duration, opacity, scale, onDismiss]);

  const { colors, roundness, isV3 } = theme;

  if (hidden) return null;

  const {
    style: actionStyle,
    label: actionLabel,
    onPress: onPressAction,
    ...actionProps
  } = action || {};

  const marginRight = action ? 0 : 16;
  const textColor = theme.isV3
    ? theme.colors.inversePrimary
    : theme.colors.accent;

  const renderChildrenWithWrapper = () => {
    const viewStyles = [
      styles.content,
      { marginRight, color: colors?.surface },
    ];

    if (typeof children === 'string') {
      return <Text style={viewStyles}>{children}</Text>;
    }

    return (
      <View style={viewStyles}>
        {/* View is added to allow multiple lines support for Text component as children */}
        <View>{children}</View>
      </View>
    );
  };

  return (
    <SafeAreaView
      pointerEvents="box-none"
      style={[styles.wrapper, wrapperStyle]}
    >
      <Surface
        pointerEvents="box-none"
        accessibilityLiveRegion="polite"
        style={
          [
            !isV3 && styles.elevation,
            styles.container,
            {
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
            { backgroundColor: colors?.onSurface },
            style,
          ] as StyleProp<ViewStyle>
        }
        {...(isV3 && { elevation })}
        {...rest}
      >
        {renderChildrenWithWrapper()}
        {action ? (
          <Button
            onPress={() => {
              onPressAction?.();
              onDismiss();
            }}
            style={[styles.button, actionStyle]}
            textColor={textColor}
            compact
            mode="text"
            {...actionProps}
          >
            {actionLabel}
          </Button>
        ) : null}
      </Surface>
    </SafeAreaView>
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
    alignItems: 'center',
    margin: 8,
    borderRadius: 4,
  },
  content: {
    marginLeft: 16,
    marginVertical: 14,
    flex: 1,
  },
  button: {
    marginHorizontal: 8,
    marginVertical: 6,
  },
  elevation: {
    elevation: 6,
  },
});

export default withInternalTheme(Snackbar);
