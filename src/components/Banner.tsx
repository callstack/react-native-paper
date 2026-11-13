import * as React from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import type {
  LayoutChangeEvent,
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import Animated, {
  Easing,
  interpolate,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import useLatestCallback from 'use-latest-callback';

import Button from './Button/Button';
import type { Props as ButtonProps } from './Button/Button';
import Icon from './Icon';
import type { IconSource } from './Icon';
import Surface from './Surface';
import type { SurfaceStyle } from './Surface';
import Text from './Typography/Text';
import { useInternalTheme } from '../core/theming';
import { useMotionDuration } from '../theme/accessibility/ReduceMotionContext';
import type { Elevation, ThemeProp } from '../theme/types';

const DEFAULT_MAX_WIDTH = 960;
// banners carry at most two actions per the material spec
const MAX_ACTIONS = 2;

type AnimationFinishedCallback = (result: { finished: boolean }) => void;

export type Props = Omit<ViewProps, 'style'> & {
  /**
   * Whether banner is currently visible.
   */
  visible: boolean;
  /**
   * Content that will be displayed inside banner.
   */
  children: React.ReactNode;
  /**
   * Icon to display for the `Banner`. Can be an image.
   */
  icon?: IconSource;
  /**
   * Action items to shown in the banner.
   * An action item should contain the following properties:
   *
   * - `label`: label of the action button (required)
   * - `onPress`: callback that is called when button is pressed (required)
   *
   * To customize button you can pass other props that button component takes.
   *
   * A maximum of 2 actions is supported, per the Material spec. Any further
   * actions are ignored, with a warning in development.
   */
  actions?: Array<
    {
      label: string;
    } & Omit<React.PropsWithoutRef<ButtonProps>, 'children'>
  >;
  /**
   * Style of banner's inner content.
   * Use this prop to apply custom width for wide layouts.
   */
  contentStyle?: StyleProp<ViewStyle>;
  /**
   * @supported Available in v5.x with theme version 3
   * Changes Banner shadow and background on iOS and Android.
   */
  elevation?: Elevation;
  /**
   * Whether the message should interrupt whatever the screen reader is saying
   * instead of waiting for it to finish. Use it for messages that need
   * immediate attention, such as errors.
   */
  urgent?: boolean;
  /**
   * Specifies the largest possible scale a text font can reach.
   */
  maxFontSizeMultiplier?: number;
  style?: StyleProp<SurfaceStyle>;
  ref?: React.Ref<React.ComponentRef<typeof View>>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * @optional
   * Optional callback that will be called after the opening animation finished running normally
   */
  onShowAnimationFinished?: AnimationFinishedCallback;
  /**
   * @optional
   * Optional callback that will be called after the closing animation finished running normally
   */
  onHideAnimationFinished?: AnimationFinishedCallback;
};

/**
 * Banner displays a prominent message and related actions.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { Image } from 'react-native';
 * import { Banner } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(true);
 *
 *   return (
 *     <Banner
 *       visible={visible}
 *       actions={[
 *         {
 *           label: 'Fix it',
 *           onPress: () => setVisible(false),
 *         },
 *         {
 *           label: 'Learn more',
 *           onPress: () => setVisible(false),
 *         },
 *       ]}
 *       icon={({size}) => (
 *         <Image
 *           source={{
 *             uri: 'https://avatars3.githubusercontent.com/u/17571969?s=400&v=4',
 *           }}
 *           style={{
 *             width: size,
 *             height: size,
 *           }}
 *         />
 *       )}>
 *       There was a problem processing a transaction on your credit card.
 *     </Banner>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const Banner = ({
  visible,
  icon,
  children,
  actions = [],
  contentStyle,
  elevation = 1,
  style,
  theme: themeOverrides,
  onShowAnimationFinished = () => {},
  onHideAnimationFinished = () => {},
  maxFontSizeMultiplier,
  urgent = false,
  testID,
  ...rest
}: Props) => {
  const theme = useInternalTheme(themeOverrides);
  const { colors } = theme;

  const position = useSharedValue(visible ? 1 : 0);

  const [layout, setLayout] = React.useState<{
    height: number;
    measured: boolean;
  }>({
    height: 0,
    measured: false,
  });
  // content is dropped from the tree once it's fully hidden, so it can't be
  // read, focused or pressed. the spacer stays behind to keep the layout
  const [exited, setExited] = React.useState(false);

  const showCallback = useLatestCallback(onShowAnimationFinished);
  const hideCallback = useLatestCallback(onHideAnimationFinished);

  const getDuration = useMotionDuration();

  const prevVisible = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    // only animate for transitions that actually happened, so the callbacks
    // don't fire on mount or when unrelated deps (e.g. scale) change
    if (prevVisible.current === visible) {
      return;
    }

    const isFirstRender = prevVisible.current === null;
    prevVisible.current = visible;

    // position is already initialised to the matching end state
    if (isFirstRender) {
      return;
    }

    if (visible) {
      // the content has to be back in the tree before it can slide in
      setExited(false);
    }

    const callback = visible ? showCallback : hideCallback;

    position.value = withTiming(
      visible ? 1 : 0,
      {
        duration: getDuration(visible ? 250 : 200),
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        const result = { finished: finished ?? false };
        // the content only leaves the tree once the hide animation is over
        if (!visible && result.finished) {
          setExited(true);
        }
        scheduleOnRN(callback, result);
      }
    );
  }, [getDuration, hideCallback, position, showCallback, visible]);

  const surfaceStyle = useAnimatedStyle(() => ({
    opacity: interpolate(position.value, [0, 0.1, 1], [0, 1, 1]),
  }));

  const spacerStyle = useAnimatedStyle(() => ({
    height: position.value * layout.height,
  }));

  const contentAnimationStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (position.value - 1) * layout.height }],
  }));

  const visibleActions = actions.slice(0, MAX_ACTIONS);
  const actionCount = visibleActions.length;
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && actions.length > MAX_ACTIONS) {
      console.warn(
        `Banner supports a maximum of ${MAX_ACTIONS} actions, received ${actions.length}. The extra actions are ignored.`
      );
    }
  }, [actions.length]);

  const liveRegion = urgent ? 'assertive' : 'polite';
  const message = React.Children.toArray(children)
    .filter((child) => typeof child === 'string' || typeof child === 'number')
    .join('');

  // aria-live only reaches a real live region on android and web. ios has no
  // equivalent, so announce there by hand whenever the message becomes
  // available. doing it everywhere would double up with the live region
  React.useEffect(() => {
    if (Platform.OS !== 'ios' || !visible || !message) {
      return;
    }

    AccessibilityInfo.announceForAccessibilityWithOptions(message, {
      queue: !urgent,
    });
  }, [visible, message, urgent]);

  // one stable ref per action slot; the cap is what bounds the array
  const actionRefs = React.useRef<Array<React.RefObject<View>>>([]);
  for (let i = 0; i < MAX_ACTIONS; i++) {
    // Button types touchableRef as non-nullable, but a ref always starts null
    actionRefs.current[i] ??= React.createRef<View>() as React.RefObject<View>;
  }
  const messageRef = React.useRef<View>(null);
  const focusedAction = React.useRef<number | null>(null);

  const focusNode = (node: View | null) => {
    if (!node) {
      return;
    }

    const handle = findNodeHandle(node);
    if (handle !== null) {
      AccessibilityInfo.setAccessibilityFocus(handle);
    }

    // rnw resolves the ref to the dom node, which takes focus directly
    (node as unknown as { focus?: () => void }).focus?.();
  };

  // a removed action would otherwise strand focus at the top of the document
  React.useEffect(() => {
    const focused = focusedAction.current;

    if (focused === null || focused < actionCount) {
      return;
    }

    if (!visible) {
      focusedAction.current = null;
      return;
    }

    const next = actionCount - 1;
    focusedAction.current = next < 0 ? null : next;
    focusNode(next < 0 ? messageRef.current : actionRefs.current[next].current);
  }, [actionCount, visible]);

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { height } = nativeEvent.layout;
    const isFirstMeasure = !layout.measured;

    setLayout({ height, measured: true });

    // mounted hidden: we only render to measure the spacer height, so drop the
    // content again right after. later measurements happen mid-transition
    if (isFirstMeasure && !visible) {
      setExited(true);
    }
  };

  // The banner animation has 2 parts:
  // 1. Blank spacer element which animates its height to move the content
  // 2. Actual banner which animates its translateY
  // In initial render, we position everything normally and measure the height of the banner
  // Once we have the height, we apply the height to the spacer and switch the banner to position: absolute
  // We need this because we need to move the content below as if banner's height was being animated
  // However we can't animated banner's height directly as it'll also resize the content inside
  // rnw forwards `inert` to the dom, which drops the subtree from the a11y
  // tree and the tab order. native ignores the unknown prop
  const inertProps = visible ? null : ({ inert: true } as object);

  return (
    <Surface
      {...rest}
      testID={testID}
      style={[surfaceStyle, style]}
      theme={theme}
      elevation={elevation}
    >
      <View style={[styles.wrapper, contentStyle]}>
        <Animated.View style={spacerStyle} />
        {exited ? null : (
          <Animated.View
            testID={`${testID ?? 'banner'}-content`}
            onLayout={handleLayout}
            aria-hidden={!visible}
            pointerEvents={visible ? 'auto' : 'none'}
            {...inertProps}
            style={[
              layout.measured || !visible
                ? // If we have measured banner's height or it's invisible,
                  // Position it absolutely, the layout will be taken care of the spacer
                  [styles.absolute, contentAnimationStyle]
                : // Otherwise position it normally
                  null,
              !layout.measured && !visible
                ? // If we haven't measured banner's height yet and it's invisible,
                  // hide it with opacity: 0 so user doesn't see it
                  styles.transparent
                : null,
            ]}
          >
            <View style={styles.content}>
              {/* icon and message travel together as one flex item, so only
                  the actions can be wrapped onto the next line */}
              <View style={styles.body}>
                {icon ? (
                  <View style={styles.icon}>
                    <Icon source={icon} size={40} />
                  </View>
                ) : null}
                {/* the region is scoped to the message: status/alert imply
                    aria-atomic, so keeping the actions out of it stops their
                    labels from re-announcing the whole banner */}
                <View
                  ref={messageRef}
                  testID={`${testID ?? 'banner'}-message`}
                  style={styles.message}
                  role={urgent ? 'alert' : 'status'}
                  aria-live={visible ? liveRegion : 'off'}
                >
                  <Text
                    variant="bodyMedium"
                    style={{ color: colors.onSurface }}
                    maxFontSizeMultiplier={maxFontSizeMultiplier}
                  >
                    {children}
                  </Text>
                </View>
              </View>
              {/* same wrapping row as the message, so the actions sit inline
                  when they fit and drop to their own line when they don't */}
              {visibleActions.length ? (
                <View style={styles.actions}>
                  {visibleActions.map(({ label, ...others }, i) => (
                    <Button
                      key={i}
                      mode="text"
                      style={styles.button}
                      textColor={colors.primary}
                      theme={theme}
                      {...others}
                      touchableRef={actionRefs.current[i]}
                      onFocus={(e) => {
                        focusedAction.current = i;
                        others.onFocus?.(e);
                      }}
                      onBlur={(e) => {
                        if (focusedAction.current === i) {
                          focusedAction.current = null;
                        }
                        others.onBlur?.(e);
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </View>
              ) : null}
            </View>
          </Animated.View>
        )}
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
    maxWidth: DEFAULT_MAX_WIDTH,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 0,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
  },
  icon: {
    margin: 8,
  },
  message: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 'auto',
    margin: 8,
  },
  actions: {
    flexDirection: 'row',
    flexShrink: 0,
    justifyContent: 'flex-end',
    margin: 4,
  },
  button: {
    margin: 4,
  },
  transparent: {
    opacity: 0,
  },
});

export default Banner;
