import * as React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useInternalTheme } from '../../core/theming';
import type { ThemeProp } from '../../types';
import Card from '../Card/Card';
import type { IconSource } from '../Icon';
import Text from '../Typography/Text';
import FAB from './FAB';
import { getFABGroupColors } from './utils';

export type Props = {
  /**
   * Action items to display in the form of a speed dial.
   * An action item should contain the following properties:
   * - `icon`: icon to display (required)
   * - `label`: optional label text
   * - `color`: custom icon color of the action item
   * - `labelTextColor`: custom label text color of the action item
   * - `accessibilityLabel`: accessibility label for the action, uses label by default if specified
   * - `accessibilityHint`: accessibility hint for the action
   * - `style`: pass additional styles for the fab item, for example, `backgroundColor`
   * - `containerStyle`: pass additional styles for the fab item label container, for example, `backgroundColor` @supported Available in 5.x
   * - `labelStyle`: pass additional styles for the fab item label, for example, `fontSize`
   * - `onPress`: callback that is called when `FAB` is pressed (required)
   * - `size`: size of action item. Defaults to `small`. @supported Available in v5.x
   * - `testID`: testID to be used on tests
   */
  actions: Array<{
    icon: IconSource;
    label?: string;
    color?: string;
    labelTextColor?: string;
    accessibilityLabel?: string;
    accessibilityHint?: string;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    containerStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    labelStyle?: StyleProp<TextStyle>;
    onPress: (e: GestureResponderEvent) => void;
    size?: 'small' | 'medium';
    testID?: string;
  }>;
  /**
   * Icon to display for the `FAB`.
   * You can toggle it based on whether the speed dial is open to display a different icon.
   */
  icon: IconSource;
  /**
   * Accessibility label for the FAB. This is read by the screen reader when the user taps the FAB.
   */
  accessibilityLabel?: string;
  /**
   * Custom color for the `FAB`.
   */
  color?: string;
  /**
   * Custom backdrop color for opened speed dial background.
   */
  backdropColor?: string;
  /**
   * Function to execute on pressing the `FAB`.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Whether the speed dial is open.
   */
  open: boolean;
  /**
   * Callback which is called on opening and closing the speed dial.
   * The open state needs to be updated when it's called, otherwise the change is dropped.
   */
  onStateChange: (state: { open: boolean }) => void;
  /**
   * Whether `FAB` is currently visible.
   */
  visible: boolean;
  /**
   * Style for the group. You can use it to pass additional styles if you need.
   * For example, you can set an additional padding if you have a tab bar at the bottom.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style for the FAB. It allows to pass the FAB button styles, such as backgroundColor.
   */
  fabStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  /**
   * @supported Available in v5.x with theme version 3
   *
   * Color mappings variant for combinations of container and icon colors.
   */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'surface';
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * Optional label for `FAB`.
   */
  label?: string;
  /**
   * Pass down testID from Group props to FAB.
   */
  testID?: string;
};

/**
 * A component to display a stack of FABs with related actions in a speed dial.
 * To render the group above other components, you'll need to wrap it with the [`Portal`](portal.html) component.
 *
 * <div class="screenshots">
 *   <img class="small" src="screenshots/fab-group.gif" />
 * </div>
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { FAB, Portal, Provider } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [state, setState] = React.useState({ open: false });
 *
 *   const onStateChange = ({ open }) => setState({ open });
 *
 *   const { open } = state;
 *
 *   return (
 *     <Provider>
 *       <Portal>
 *         <FAB.Group
 *           open={open}
 *           visible
 *           icon={open ? 'calendar-today' : 'plus'}
 *           actions={[
 *             { icon: 'plus', onPress: () => console.log('Pressed add') },
 *             {
 *               icon: 'star',
 *               label: 'Star',
 *               onPress: () => console.log('Pressed star'),
 *             },
 *             {
 *               icon: 'email',
 *               label: 'Email',
 *               onPress: () => console.log('Pressed email'),
 *             },
 *             {
 *               icon: 'bell',
 *               label: 'Remind',
 *               onPress: () => console.log('Pressed notifications'),
 *             },
 *           ]}
 *           onStateChange={onStateChange}
 *           onPress={() => {
 *             if (open) {
 *               // do something if the speed dial is open
 *             }
 *           }}
 *         />
 *       </Portal>
 *     </Provider>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const FABGroup = ({
  actions,
  icon,
  open,
  onPress,
  accessibilityLabel,
  theme: themeOverrides,
  style,
  fabStyle,
  visible,
  label,
  testID,
  onStateChange,
  color: colorProp,
  variant = 'primary',
  backdropColor: customBackdropColor,
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { current: backdrop } = React.useRef<Animated.Value>(
    new Animated.Value(0)
  );
  const animations = React.useRef<Animated.Value[]>(
    actions.map(() => new Animated.Value(open ? 1 : 0))
  );

  const [prevActions, setPrevActions] = React.useState<
    | {
        icon: IconSource;
        label?: string;
        color?: string;
        accessibilityLabel?: string;
        style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
        onPress: (e: GestureResponderEvent) => void;
        testID?: string;
      }[]
    | null
  >(null);

  const { scale } = theme.animation;
  const { isV3 } = theme;

  React.useEffect(() => {
    if (open) {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 1,
          duration: 250 * scale,
          useNativeDriver: true,
        }),
        Animated.stagger(
          isV3 ? 15 : 50 * scale,
          animations.current
            .map((animation) =>
              Animated.timing(animation, {
                toValue: 1,
                duration: 150 * scale,
                useNativeDriver: true,
              })
            )
            .reverse()
        ),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdrop, {
          toValue: 0,
          duration: 200 * scale,
          useNativeDriver: true,
        }),
        ...animations.current.map((animation) =>
          Animated.timing(animation, {
            toValue: 0,
            duration: 150 * scale,
            useNativeDriver: true,
          })
        ),
      ]).start();
    }
  }, [open, actions, backdrop, scale, isV3]);

  const close = () => onStateChange({ open: false });

  const toggle = () => onStateChange({ open: !open });

  const { labelColor, backdropColor, stackedFABBackgroundColor } =
    getFABGroupColors({ theme, customBackdropColor });

  const backdropOpacity = open
    ? backdrop.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 1],
      })
    : backdrop;

  const opacities = animations.current;
  const scales = opacities.map((opacity) =>
    open
      ? opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        })
      : 1
  );

  const translations = opacities.map((opacity) =>
    open
      ? opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [24, -8],
        })
      : -8
  );
  const labelTranslations = opacities.map((opacity) =>
    open
      ? opacity.interpolate({
          inputRange: [0, 1],
          outputRange: [8, -8],
        })
      : -8
  );

  const { top, bottom, right, left } = useSafeAreaInsets();
  const containerPaddings = {
    paddingBottom: bottom,
    paddingRight: right,
    paddingLeft: left,
    paddingTop: top,
  };

  if (actions.length !== prevActions?.length) {
    animations.current = actions.map(
      (_, i) => animations.current[i] || new Animated.Value(open ? 1 : 0)
    );
    setPrevActions(actions);
  }

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, containerPaddings, style]}
    >
      <TouchableWithoutFeedback accessibilityRole="button" onPress={close}>
        <Animated.View
          pointerEvents={open ? 'auto' : 'none'}
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
              backgroundColor: backdropColor,
            },
          ]}
        />
      </TouchableWithoutFeedback>
      <View pointerEvents="box-none" style={styles.safeArea}>
        <View pointerEvents={open ? 'box-none' : 'none'}>
          {actions.map((it, i) => {
            const labelTextStyle = {
              color: it.labelTextColor ?? labelColor,
              ...(isV3 ? theme.fonts.titleMedium : {}),
            };
            const marginHorizontal =
              typeof it.size === 'undefined' || it.size === 'small' ? 24 : 16;
            const accessibilityLabel =
              typeof it.accessibilityLabel !== 'undefined'
                ? it.accessibilityLabel
                : it.label;
            const size = typeof it.size !== 'undefined' ? it.size : 'small';

            return (
              <View
                key={i} // eslint-disable-line react/no-array-index-key
                style={[
                  styles.item,
                  {
                    marginHorizontal,
                  },
                ]}
                pointerEvents={open ? 'box-none' : 'none'}
              >
                {it.label && (
                  <View>
                    <Card
                      mode={isV3 ? 'contained' : 'elevated'}
                      onPress={(e) => {
                        it.onPress(e);
                        close();
                      }}
                      accessibilityHint={it.accessibilityHint}
                      accessibilityLabel={accessibilityLabel}
                      accessibilityRole="button"
                      style={[
                        styles.containerStyle,
                        {
                          transform: [
                            isV3
                              ? { translateY: labelTranslations[i] }
                              : { scale: scales[i] },
                          ],
                          opacity: opacities[i],
                        },
                        isV3 && styles.v3ContainerStyle,
                        it.containerStyle,
                      ]}
                    >
                      <Text
                        variant="titleMedium"
                        style={[labelTextStyle, it.labelStyle]}
                      >
                        {it.label}
                      </Text>
                    </Card>
                  </View>
                )}
                <FAB
                  size={size}
                  icon={it.icon}
                  color={it.color}
                  style={[
                    {
                      transform: [{ scale: scales[i] }],
                      opacity: opacities[i],
                      backgroundColor: stackedFABBackgroundColor,
                    },
                    isV3 && { transform: [{ translateY: translations[i] }] },
                    it.style,
                  ]}
                  onPress={(e) => {
                    it.onPress(e);
                    close();
                  }}
                  accessibilityLabel={accessibilityLabel}
                  accessibilityRole="button"
                  testID={it.testID}
                  visible={open}
                />
              </View>
            );
          })}
        </View>
        <FAB
          onPress={(e) => {
            onPress?.(e);
            toggle();
          }}
          icon={icon}
          color={colorProp}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          style={[styles.fab, fabStyle]}
          visible={visible}
          label={label}
          testID={testID}
          variant={variant}
        />
      </View>
    </View>
  );
};

FABGroup.displayName = 'FAB.Group';

export default FABGroup;

// @component-docs ignore-next-line
export { FABGroup };

const styles = StyleSheet.create({
  safeArea: {
    alignItems: 'flex-end',
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  fab: {
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 0,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  containerStyle: {
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 2,
  },
  item: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  v3ContainerStyle: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
});
