import * as React from 'react';
import {
  AccessibilityInfo,
  Platform,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import type {
  HostInstance,
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
import AnimatedText from './Typography/AnimatedText';
import Text from './Typography/Text';
import { useInternalTheme } from '../core/theming';
import { useMotionDuration } from '../theme/accessibility/ReduceMotionContext';
import type { Elevation, ThemeProp } from '../theme/types';
import { addEventListener } from '../utils/addEventListener';
import { mergeRefs } from '../utils/mergeRefs';

const DEFAULT_MAX_WIDTH = 960;
// banners carry at most two actions per the material spec
const MAX_ACTIONS = 2;
// md3's compact window size class. md3 has no banner spec, so this is a choice
const COMPACT_BREAKPOINT = 600;
// too short and the set and clear batch into one a11y update, too long and a
// talkback swipe hears the message twice
const ANNOUNCE_CLEAR_DELAY = 3000;
// how long after an action's onPress a removal of that action still counts as
// something the user did, and so is worth rescuing focus from
const PRESS_RESCUE_WINDOW_MS = 1000;

// only android and web have a real live region. everywhere else announces by hand
const hasLiveRegion = () => Platform.OS === 'android' || Platform.OS === 'web';

// a nested <Text> would otherwise be dropped from the announcement
const extractText = (node: React.ReactNode): string =>
  React.Children.toArray(node)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') {
        return String(child);
      }
      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return extractText(child.props.children);
      }
      return '';
    })
    .join('');

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
   * Accessibility label for the icon. Leave it out when the icon is decorative
   * and the message already says everything - the icon is then hidden from
   * screen readers instead of being read out as an unlabelled image.
   */
  iconAccessibilityLabel?: string;
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
  iconAccessibilityLabel,
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
  // hidden content leaves the tree so it can't be read, focused or pressed.
  // the spacer stays behind to keep the layout
  const [exited, setExited] = React.useState(false);

  // only a finished animation is a transition the consumer asked to be told
  // about, so an interrupted one leaves the callbacks alone
  const showCallback = useLatestCallback((result: { finished: boolean }) => {
    if (result.finished) {
      onShowAnimationFinished(result);
    }
  });

  const hideCallback = useLatestCallback((result: { finished: boolean }) => {
    if (!result.finished) {
      return;
    }

    // the content can only leave the tree once the hide animation is over, and
    // that has to happen on the react thread
    setExited(true);
    onHideAnimationFinished(result);
  });

  const getDuration = useMotionDuration();

  const prevVisible = React.useRef<boolean | null>(null);

  React.useEffect(() => {
    // don't fire the callbacks on mount or when the effect runs again without
    // a change of visible, such as strict mode running it twice
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

    position.value = withTiming(
      visible ? 1 : 0,
      {
        duration: getDuration(visible ? 250 : 200),
        easing: Easing.inOut(Easing.ease),
        reduceMotion: ReduceMotion.Never,
      },
      (finished) => {
        const result = { finished: finished ?? false };
        if (visible) {
          scheduleOnRN(showCallback, result);
        } else {
          scheduleOnRN(hideCallback, result);
        }
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

  const region: Pick<ViewProps, 'role' | 'aria-live'> = urgent
    ? { role: 'alert', 'aria-live': 'assertive' }
    : { role: 'status', 'aria-live': 'polite' };
  const message = extractText(children);

  // a region only fires when its text changes while already in the tree, and
  // the banner unmounts when hidden, so the message can never be that change
  const [announcement, setAnnouncement] = React.useState('');

  // reads the latest message and urgency, so neither is a reason to announce
  const announce = useLatestCallback(() => {
    if (!message) {
      return undefined;
    }

    if (!hasLiveRegion()) {
      AccessibilityInfo.announceForAccessibilityWithOptions(message, {
        queue: !urgent,
      });
      return undefined;
    }

    // re-setting the same string is not a render, so empty it first
    setAnnouncement('');
    const fill = setTimeout(() => setAnnouncement(message), 0);
    const clear = setTimeout(() => setAnnouncement(''), ANNOUNCE_CLEAR_DELAY);
    return () => {
      clearTimeout(fill);
      clearTimeout(clear);
    };
  });

  // announced only when the banner appears after mount: one that mounts
  // visible is part of the page, not news, and a re-render while visible (a
  // new message, a flipped `urgent`) is not a new appearance
  const wasVisible = React.useRef(visible);
  React.useEffect(() => {
    const appeared = visible && !wasVisible.current;
    wasVisible.current = visible;

    if (!visible) {
      setAnnouncement('');
      return undefined;
    }

    return appeared ? announce() : undefined;
  }, [announce, visible]);

  // labels are the natural key, but two actions can carry the same one
  const actionKeys = visibleActions.map(({ label }, i) =>
    visibleActions.some((action, j) => j !== i && action.label === label)
      ? `${label}-${i}`
      : label
  );

  // each rendered action's host, by key. a ref per slot would go stale: the
  // animated touchable reads its ref once, on mount, so an action that moves
  // up a slot when the one before it goes would keep feeding the old slot
  const actionNodes = React.useRef(new Map<string, HostInstance>());
  // one callback per key, rebuilt only when the consumer's touchableRef
  // changes: a new callback each render would hand that ref null each commit
  const actionRefs = React.useRef(
    new Map<
      string,
      {
        touchableRef: ButtonProps['touchableRef'];
        ref: React.RefCallback<HostInstance>;
      }
    >()
  );
  const actionRef = (
    key: string,
    touchableRef: ButtonProps['touchableRef']
  ) => {
    const cached = actionRefs.current.get(key);
    if (cached && cached.touchableRef === touchableRef) {
      return cached.ref;
    }

    const ref = mergeRefs<HostInstance>((node) => {
      if (node) {
        actionNodes.current.set(key, node);
      } else {
        actionNodes.current.delete(key);
      }
    }, touchableRef);
    actionRefs.current.set(key, { touchableRef, ref });
    return ref;
  };

  const wrapperRef = React.useRef<HostInstance>(null);
  const messageRef = React.useRef<HostInstance>(null);
  // both tracked by key, not slot: when a sibling goes, the survivor moves up.
  // web only: the action with keyboard focus. native onFocus does not follow
  // the screen reader cursor, so it is not used there
  const focusedKey = React.useRef<string | null>(null);
  // native only: the action a screen reader double tap just ran onPress on
  const pressed = React.useRef<{ key: string; at: number } | null>(null);
  const screenReaderEnabled = React.useRef(false);
  // web only: the element that had focus at the moment the banner showed,
  // given back on hide. it is not where focus was right before it entered
  // the banner, which can be a different element minutes later
  const focusBeforeShow = React.useRef<HTMLElement | null>(null);
  // the keys of the previous commit, to find where a removed action was
  const renderedKeys = React.useRef(actionKeys);

  React.useEffect(() => {
    // rnw reports a screen reader whether or not one runs, and web does not
    // need one: it follows dom focus
    if (Platform.OS === 'web') {
      return undefined;
    }

    // a change event is newer than whatever the initial query resolves to
    let changed = false;

    const init = async () => {
      const enabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (!changed) {
        screenReaderEnabled.current = enabled;
      }
    };
    void init();

    const subscription = addEventListener(
      AccessibilityInfo,
      'screenReaderChanged',
      (enabled: boolean) => {
        changed = true;
        screenReaderEnabled.current = enabled;
      }
    );

    return () => subscription.remove();
  }, []);

  // web only. the hidden content goes inert, which drops focus still inside
  // it on the body, so a hide gives it back. inside is read from the dom, not
  // from the trackers: focus can also sit on the message after a rescue
  React.useLayoutEffect(() => {
    if (Platform.OS !== 'web' || !('document' in global)) {
      return;
    }

    const { activeElement } = document;
    const wrapper = wrapperRef.current;
    const focusInside =
      activeElement instanceof HTMLElement &&
      wrapper instanceof HTMLElement &&
      wrapper.contains(activeElement);

    if (visible) {
      // focus still inside means a re-show mid-hide: keep the first one
      if (activeElement instanceof HTMLElement && !focusInside) {
        focusBeforeShow.current = activeElement;
      }
      return;
    }

    const previous = focusBeforeShow.current;
    focusBeforeShow.current = null;
    if (focusInside && previous?.isConnected) {
      previous.focus();
    }
  }, [visible]);

  // an action removed under focus would otherwise strand it: at the top of
  // the document on web, wherever the screen reader likes on native.
  // no deps, so it sees every commit that can change the rendered actions
  React.useLayoutEffect(() => {
    const previousKeys = renderedKeys.current;
    renderedKeys.current = actionKeys;
    for (const key of actionRefs.current.keys()) {
      if (!actionKeys.includes(key)) {
        actionRefs.current.delete(key);
      }
    }

    const isWeb = Platform.OS === 'web';
    const press = pressed.current;
    const recentPress =
      press && performance.now() - press.at <= PRESS_RESCUE_WINDOW_MS
        ? press.key
        : null;
    const tracked = isWeb ? focusedKey.current : recentPress;

    if (tracked === null || (visible && actionKeys.includes(tracked))) {
      return;
    }

    focusedKey.current = null;
    pressed.current = null;

    // the hide itself is handled above on web. native has no element to go
    // back to yet, so it is left alone
    if (!visible) {
      return;
    }

    if (!isWeb && !screenReaderEnabled.current) {
      return;
    }

    // the action now in the removed one's place, else the one before it,
    // else the message
    const slot = Math.min(previousKeys.indexOf(tracked), actionCount - 1);
    const target =
      slot >= 0
        ? (actionNodes.current.get(actionKeys[slot]) ?? null)
        : messageRef.current;

    if (!target) {
      return;
    }

    if (isWeb) {
      target.focus();
    } else {
      AccessibilityInfo.sendAccessibilityEvent(target, 'focus');
    }
  });

  const handleLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const { height } = nativeEvent.layout;
    const isFirstMeasure = !layout.measured;

    setLayout({ height, measured: true });

    // mounted hidden: we rendered only to measure the spacer, so drop it again
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

  const { width } = useWindowDimensions();
  // the compact breakpoint is defined on the window width, not the banner's
  // own width, so a banner squeezed into a side panel still lays out inline
  const stacked = width < COMPACT_BREAKPOINT;

  return (
    <Surface
      {...rest}
      style={[surfaceStyle, style]}
      theme={theme}
      elevation={elevation}
    >
      <View ref={wrapperRef} style={[styles.wrapper, contentStyle]}>
        <Animated.View style={spacerStyle} />
        {exited ? null : (
          <Animated.View
            onLayout={handleLayout}
            aria-hidden={!visible || undefined}
            // @ts-expect-error: `ViewProps` doesn't expose the web-specific `inert` prop.
            inert={Platform.OS === 'web' ? !visible || undefined : undefined}
            pointerEvents={visible ? 'auto' : 'none'}
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
            <View
              style={[
                styles.content,
                // without the actions row the message's own 8px is all that is
                // left, so the banner would end 8 instead of 16 below the text
                actionCount === 0 ? styles.contentWithoutActions : null,
                stacked ? styles.contentStacked : null,
              ]}
            >
              <View style={[styles.body, stacked ? null : styles.bodyInline]}>
                {/* rnw renders this View as a plain div, which cannot take a
                    name, and gives the inner icon role="img" with none */}
                {icon ? (
                  <View
                    style={styles.icon}
                    aria-hidden={!iconAccessibilityLabel}
                    accessible={iconAccessibilityLabel ? true : undefined}
                    aria-label={iconAccessibilityLabel}
                    role={iconAccessibilityLabel ? 'img' : undefined}
                  >
                    <Icon source={icon} size={40} />
                  </View>
                ) : null}
                <View style={styles.message}>
                  {/* the focus rescue's last resort. AnimatedText, because
                      its ref is the host text. tabIndex -1 takes
                      programmatic focus on web without being a tab stop;
                      native needs nothing, the text already is an element */}
                  <AnimatedText
                    ref={messageRef}
                    variant="bodyMedium"
                    style={{ color: colors.onSurface }}
                    maxFontSizeMultiplier={maxFontSizeMultiplier}
                    // @ts-expect-error: `TextProps` doesn't expose the web-specific `tabIndex` prop.
                    tabIndex={Platform.OS === 'web' ? -1 : undefined}
                  >
                    {children}
                  </AnimatedText>
                </View>
              </View>
              {visibleActions.length ? (
                <View style={styles.actions}>
                  {visibleActions.map(({ label, ...others }, i) => (
                    <Button
                      key={actionKeys[i]}
                      mode="text"
                      style={styles.button}
                      textColor={colors.primary}
                      theme={theme}
                      {...others}
                      touchableRef={actionRef(
                        actionKeys[i],
                        others.touchableRef
                      )}
                      // only wrapped when given: a Button without onPress
                      // behaves differently from one with
                      onPress={
                        others.onPress
                          ? (e) => {
                              pressed.current = {
                                key: actionKeys[i],
                                at: performance.now(),
                              };
                              others.onPress?.(e);
                            }
                          : undefined
                      }
                      onFocus={(e) => {
                        focusedKey.current = actionKeys[i];
                        others.onFocus?.(e);
                      }}
                      onBlur={(e) => {
                        if (focusedKey.current === actionKeys[i]) {
                          focusedKey.current = null;
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
        {/* last, so a screen reader reaches the real message first. the
            region lives on the Text whose content changes: a native View
            would need accessible to be one, which makes it a keyboard tab
            stop on android */}
        {hasLiveRegion() ? (
          <View style={styles.announcer}>
            <Text {...region}>{announcement}</Text>
          </View>
        ) : null}
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
    alignItems: 'center',
    marginHorizontal: 8,
    marginTop: 16,
    marginBottom: 0,
  },
  contentWithoutActions: {
    // the actions row used to add 4 + 4 of margin, so without it the banner
    // would end 8 below the message instead of main's 16
    marginBottom: 8,
  },
  contentStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  body: {
    flexDirection: 'row',
    // the icon sits at the top of a multi-line message, like before the
    // actions row moved out of the content row
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  bodyInline: {
    flexGrow: 1,
    flexBasis: 0,
  },
  icon: {
    margin: 8,
  },
  message: {
    flex: 1,
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
  announcer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: 1,
    overflow: 'hidden',
  },
});

export default Banner;
