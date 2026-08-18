import * as React from 'react';
import {
  AccessibilityInfo,
  Animated,
  findNodeHandle,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';

import useLatestCallback from 'use-latest-callback';

import Button from './Button/Button';
import Icon from './Icon';
import type { IconSource } from './Icon';
import Surface from './Surface';
import Text from './Typography/Text';
import { useInternalTheme } from '../core/theming';
import type { $Omit, $RemoveChildren, Theme, ThemeProp } from '../types';

const DEFAULT_MAX_WIDTH = 960;
// banners carry at most two actions per the material spec
const MAX_ACTIONS = 2;

export type Props = $Omit<$RemoveChildren<typeof Surface>, 'mode'> & {
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
    } & $RemoveChildren<typeof Button>
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
  elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
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
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.RefObject<View>;
  /**
   * @optional
   */
  theme?: ThemeProp;
  /**
   * @optional
   * Optional callback that will be called after the opening animation finished running normally
   */
  onShowAnimationFinished?: Animated.EndCallback;
  /**
   * @optional
   * Optional callback that will be called after the closing animation finished running normally
   */
  onHideAnimationFinished?: Animated.EndCallback;
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
  const { colors } = theme as Theme;
  const { current: position } = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0)
  );
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

  const { scale } = theme.animation;

  const opacity = position.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });

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
      // show
      setExited(false);
      Animated.timing(position, {
        duration: 250 * scale,
        toValue: 1,
        useNativeDriver: false,
      }).start(showCallback);
    } else {
      // hide
      Animated.timing(position, {
        duration: 200 * scale,
        toValue: 0,
        useNativeDriver: false,
      }).start((result) => {
        if (result.finished) {
          setExited(true);
        }
        hideCallback(result);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, position, scale]);

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
  const height = Animated.multiply(position, layout.height);

  const translateY = Animated.multiply(
    Animated.add(position, -1),
    layout.height
  );
  // rnw forwards `inert` to the dom, which drops the subtree from the a11y
  // tree and the tab order. native ignores the unknown prop
  const inertProps = visible ? null : ({ inert: true } as object);

  return (
    <Surface
      {...rest}
      testID={testID}
      style={[{ opacity }, style]}
      theme={theme}
      container
      elevation={elevation}
    >
      <View style={[styles.wrapper, contentStyle]}>
        <Animated.View style={{ height }} />
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
                  [styles.absolute, { transform: [{ translateY }] }]
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
                      compact
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
